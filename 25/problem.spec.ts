import { printBoard, parseBoard, stepBoard, part1 } from "./problem";
import { readFileSync } from "fs";
import * as Assert from 'assert';

const ainput = readFileSync("./ainput.txt", {encoding:"utf8"})
const binput = readFileSync("./binput.txt", {encoding:"utf8"})
const cinput = readFileSync("./cinput.txt", {encoding:"utf8"})
const dinput = readFileSync("./dinput.txt", {encoding:"utf8"})
const binputnext =`..........
.>........
..v....v>.
..........`;

const cinput4stpes = `>......
..v....
..>.v..
.>.v...
...>...
.......
v......`;

describe("problem 25", () => {

	it("should parse and print", () => {
		Assert.equal(printBoard(parseBoard(ainput)), "...>>>>>...")
	})

	it("should move sea cucumbers to the right", () => {
		let board = parseBoard(ainput);
		stepBoard(board)
		Assert.equal(printBoard(board), "...>>>>.>..")
		stepBoard(board)
		Assert.equal(printBoard(board), "...>>>.>.>.")
	})

	it("should move sea cucumbers down", () => {
		let board = parseBoard(binput);
		stepBoard(board)
		Assert.equal(printBoard(board), binputnext);
	})

	it("should move sea cucumbers down and wrap around", () => {
		let board = parseBoard(cinput);
		stepBoard(board)
		stepBoard(board)
		stepBoard(board)
		stepBoard(board)
		Assert.equal(printBoard(board), cinput4stpes)
	})

	it("should handle boundaries that wrap ", () =>{
const start = `.v.
...
>.>
.v.
`;
const end = `...
.v.
.>>
.v.`;
		let board= parseBoard(start);
		stepBoard(board)
		Assert.equal(printBoard(board), end);

	})

it("should look like this after 1 step", () => {

let next = `....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v`;

		let board = parseBoard(dinput);
		stepBoard(board);
		Assert.equal(printBoard(board), next, "first step fails")
next = `>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.`;

		stepBoard(board);
		Assert.equal(printBoard(board), next, "second step fails")
})

	it("should stop at 58 steps with dinput", () => {
		let board = parseBoard(dinput);
		// console.log(printBoard(board))
		let steps = part1(board);
		// console.log(printBoard(board))
		Assert.equal(steps, 58);

	})
})