import {readFileSync} from "fs";
import * as Parser from 'parsinator';
import * as ParserHelpers from 'parsinator/dist/es5-commonjs/lib/ParserHelpers';

const dataString = readFileSync("./input.txt", { encoding: "utf8" });
const hexes: {[k: string]: string} = {
	"0":"0000",
	"1":"0001",
	"2":"0010",
	"3":"0011",
	"4":"0100",
	"5":"0101",
	"6":"0110",
	"7":"0111",
	"8":"1000",
	"9":"1001",
	"A":"1010",
	"B":"1011",
	"C":"1100",
	"D":"1101",
	"E":"1110",
	"F":"1111",
} 
export function hex2binary(input: string): string {
	let result = [];
	for(let i=0; i < input.length; i++) {
		result.push(hexes[input[i]]);
	}
	return result.join("");
}

export const versionParser: Parser.Parser<number> = Parser.map(Parser.regex(/[01]{3}/), (str) =>
  parseInt(str, 2)
);

export const packetTypeIdParser = versionParser;

export const literalParser = Parser.map(Parser.fromGenerator(function*() {
	let continuing = yield Parser.regex(/[01]/);
	let result: string="";
	while(continuing === "1") {
		result += yield Parser.regex(/[01]{4}/);
		continuing = yield Parser.regex(/[01]/);
	}
	result += yield Parser.regex(/[01]{4}/);
	return result;
}), (str) => parseInt(str, 2));

type Packet = {
	kind: "p";
	version: number;
	id: number;
	subpacketCount?: number;
	subpacketsLength?: number;
	subpackets: Packet[];
}

type PacketLiteral = {
	kind: "l"
	version: number;
	id: number
	value: number;
}

function subpacketsLength(bits: number): Parser.Parser<(Packet | PacketLiteral)[]> {
	return (state: Parser.ParseState): Parser.ParseResult<(Packet | PacketLiteral)[]> => {
		let subpacketString = state.input.substring(state.offset, state.offset+bits)
		console.log("SPS", bits, state.offset, state.input, state.input.length, subpacketString);
		try {
			let result = Parser.run(Parser.many(packetParser), subpacketString);
			return ParserHelpers.resultSuccess(result, state.input, state.offset+bits)
		} catch(err) {
			throw err;
			// throw ParserHelpers.resultFailure(`${bits} subpacket bits not found`, state, ParserHelpers.ParseErrorDetail);
		}
	}
}

export const packetParser: Parser.Parser<Packet | PacketLiteral> = Parser.fromGenerator<string, Packet | PacketLiteral>(function*() {
	let version = yield versionParser;
	let id = yield packetTypeIdParser;

	if(id === 4) {
		let value = yield literalParser;
		let result: PacketLiteral = {
			kind: "l",
			version,
			id,
			value
		}
		return result;
	}else{
		//is operator
		let subpackets: Packet[] = [];
		let lengthTypeId = yield Parser.regex(/[01]/);
		let result: Packet = {
			kind: "p",
			version,
			id,
			subpackets
		}
		if(lengthTypeId == 0) {
			result.subpacketsLength = yield Parser.map(Parser.regex(/[01]{15}/), (str) => (console.log(str),parseInt(str, 2)));
			console.log("SUBPACKET", lengthTypeId, result.subpacketsLength);
			result.subpackets = yield subpacketsLength(result.subpacketsLength!);
		}else{
			result.subpacketCount = yield Parser.map(Parser.regex(/[01]{11}/), (str) => parseInt(str, 2));
			result.subpackets = yield Parser.count(result.subpacketCount!, packetParser);
		}
		return result;
	}
})

export function sumVersions(packet: Packet | PacketLiteral): number {
	if(packet.kind =="l") {
		return packet.version;
	}else{
		return packet.version + packet.subpackets.reduce((memo, packet) => memo + sumVersions(packet),0 )
	}
}

export function evaluate(packet: Packet | PacketLiteral): number {
	switch(packet.kind) {
		case "l":
			return packet.value;
		case "p":
			switch(packet.id) {
				case 0: //sum
					return packet.subpackets.reduce((memo, subpacket) => memo + evaluate(subpacket),0)
				case 1: //product
					return packet.subpackets.reduce((memo, subpacket) => memo * evaluate(subpacket),1)
				case 2: //min
					return Math.min(...packet.subpackets.map(subpacket => evaluate(subpacket)));
				case 3: //max
					return Math.max(...packet.subpackets.map(subpacket => evaluate(subpacket)));
				case 5: //greater than
					return evaluate(packet.subpackets[0]) > evaluate(packet.subpackets[1]) ? 1 : 0;
				case 6: //less than
					return evaluate(packet.subpackets[0]) < evaluate(packet.subpackets[1]) ? 1 : 0;
				case 7: //equal to
					return evaluate(packet.subpackets[0]) === evaluate(packet.subpackets[1]) ? 1 : 0;
				default:
					throw new Error(`packet id ${packet.id} fallthrough`)
			}
		break;
	}
}

export function part1(input: string) {
	let result = Parser.run(packetParser, hex2binary(input))
	console.log(result)
	console.log(sumVersions(result))
}

export function part2(input: string) {
	let result = Parser.run(packetParser, hex2binary(input))
	// console.log(result)
	console.log(evaluate(result))
}
part2(dataString);