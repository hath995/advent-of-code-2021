import { readFileSync } from "fs";

class EastCucumber {
	kind: "EC"
	constructor(public x: number, public y: number ) {
		this.kind = "EC";
	}
	
	peek(board: Board, moved: Map<string, Cucumber>): boolean {
		return board[this.y][(this.x+1)%board[this.y].length] === null && !moved.has(`${(this.x+1)%board[this.y].length}_${this.y}`);
	}

	toString() {
		return ">";
	}

	move(board: Board, moved: Map<string, Cucumber>) {
		if(this.peek(board, moved)) {
			board[this.y][(this.x+1) % board[this.y].length]=this;
			board[this.y][this.x] = null;
			this.x = (this.x+1) % board[this.y].length;
			return 1;
		}
		return 0;
	}
}

class SouthCucumber {
	kind: "SC"
	constructor(public x: number, public y: number) {
		this.kind = "SC";
	}

	peek(board: Board, moved: Map<string, Cucumber>): boolean {
		return board[(this.y+1) % board.length][this.x] === null &&
		!moved.has(`${this.x}_${(this.y+1) % board.length}`);
	}

	toString() {
		return "v";
	}

	move(board: Board, moved: Map<string, Cucumber>) {
		if(this.peek(board, moved)) {
			board[ (this.y+1) % board.length][this.x]=this;
			board[this.y][this.x] = null;
			this.y = (this.y+1) % board.length;
			return 1;
		}
		return 0;
	}
}

type Cucumber = EastCucumber | SouthCucumber;
type Board = (Cucumber | null)[][];
function pop<T>(elems: T[]) {
	elems.pop();
	return elems
}

export function parseBoard(inputString: string): Board {
	return pop(inputString.split("\n")).map((row, y) => row.split("").map((elem, x) => {
		if(elem === "v") {
			return new SouthCucumber(x,y);
		}else if(elem === ">") {
			return new EastCucumber(x,y);
		}else{
			return null;
		}
	}))
}

export function printBoard(board: Board): string {
	let result: string[][] = [];
	for(let y = 0; y < board.length; y++) {
		let row: string[] = [];
		for(let x = 0; x < board[y].length; x++) {
			if(board[y][x]=== null) {
				row.push(".")
			}else{
				row.push(board[y][x]?.toString()!)
			}
		}
		result.push(row)
	}
	return result.map(row => row.join("")).join("\n");
}

export function stepBoard(board: Board): number {
	let stepped = 0;
	let moved: Set<Cucumber> = new Set();
	let eastBoundaries = new Map<string, Cucumber>();
	let southBoundaries = new Map<string, Cucumber>();
	for(let y=0; y<board.length; y++) {
		for(let x=0; x<board[y].length; x++) {
			let cuke = board[y][x];
			if(cuke && !moved.has(cuke) && cuke.kind == "EC"){
				const distance = cuke.move(board, eastBoundaries);
				if(distance == 1) {
					moved.add(cuke);
					eastBoundaries.set(`${x}_${y}`, cuke);
				}
				stepped += distance;
			}
		}
	}

	for(let y=0; y<board.length; y++) {
		for(let x=0; x<board[y].length; x++) {
			let cuke = board[y][x];
			if(cuke && !moved.has(cuke) && cuke.kind == "SC"){
				const distance = cuke.move(board, southBoundaries);
				if(distance == 1) {
					southBoundaries.set(`${x}_${y}`, cuke);
					moved.add(cuke);
				}
				stepped += distance;
			}
		}
	}
	return stepped;
}

export function part1(board: Board): number {
	let stepped = 0;
	let i = 0;
	do {
		stepped = stepBoard(board);
		i++
	} while(stepped !== 0);
	return i;
}

console.log(part1(parseBoard(readFileSync("./input.txt",{encoding:"utf8"}))));