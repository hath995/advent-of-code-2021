import assert from "assert";
import {part1, hex2binary, versionParser, literalParser, packetParser, sumVersions, evaluate} from "./problem";
import * as Parser from 'parsinator';

describe("part1", () => {

	it("should turn this hex input into binary", () => {
		assert(hex2binary("D2FE28")==="110100101111111000101000","sample should match")
		assert(hex2binary("1A8002F4")==="00011010100000000000001011110100","leading zeroes should be displayed");
	})

	it("should parse versions", () => {
		assert(Parser.run(versionParser,"110") === 6, "packet version 6");
	})

	it("should parse literals", () => {
		// assert(Parser.run(literalParser,"101111111000101") === "011111100101", "parse Literal ");
		assert(Parser.run(literalParser,"101111111000101") === 2021, "parse Literal ");
	})

	it("should parse literal Packets", () => {
		// assert(Parser.run(literalParser,"101111111000101") === "011111100101", "parse Literal ");
		console.log(Parser.run(packetParser,"110100101111111000101000"))
		assert.deepEqual(Parser.run(packetParser,"110100101111111000101000"),{kind: "l", version: 6, id: 4, value: 2021}, "parse Literal Packet ");
	})

	it("should parse operator packets", () => {
		assert.deepEqual(Parser.run(packetParser,"00111000000000000110111101000101001010010001001000000000"), {
			kind: "p",
			version: 1,
			id: 6,
			subpackets: [
			  { kind: "l", version: 6, id: 4, value: 10 },
			  { kind: "l", version: 2, id: 4, value: 20 }
			],
			subpacketsLength: 27
		  }, "parse operator packets")
	})


	it("should sum versions", () => {
		let samples = [
			"38006F45291200",
			"EE00D40C823060",
			"8A004A801A8002F478",
			"620080001611562C8802118E34",
			"C0015000016115A2E0802F182340",
			"A0016C880162017C3686B18A3D4780"
		]
		let sums = [9,14,16,12,23,31]
		samples.forEach((sample, index) => {
			let packet = Parser.run(packetParser, hex2binary(sample));
			let sum = sumVersions(packet)
			console.log(sum)
			console.log(JSON.stringify(packet, null, 2))
			assert(sum === sums[index], "packet sums");

		})
	})

	it("should evaluate packets", () => {
		let samples = [
			"C200B40A82",
			"04005AC33890",
			"880086C3E88112",
			"CE00C43D881120",
			"D8005AC2A8F0",
			"F600BC2D8F",
			"9C005AC2F8F0",
			"9C0141080250320F1802104A08"
		]
		let results = [3,54,7,9,1,0,0,1]
		samples.forEach((sample, index) => {
			let packet = Parser.run(packetParser, hex2binary(sample));
			let res = evaluate(packet)
			console.log(res)
			// console.log(JSON.stringify(packet, null, 2))
			assert(res === results[index], "packet evaluations");

		})
	})
})