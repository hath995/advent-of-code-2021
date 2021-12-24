import {readFileSync} from "fs";
const dataString = readFileSync("./input.txt", { encoding: "utf8" });

function* deterministicDice() {
	let x = 0;
	while(true) {
		x++;
		if(x > 100) {
			x=1;
		}
		yield x
	}
}

function part1(pos: [number, number] = [3,7]) {
	let scores = [0,0];
	let rolls = 0;
	let turn = 0;
	let diceRoll = deterministicDice();
	while(scores[0] < 1000 && scores[1] < 1000) {
		let steps = diceRoll.next().value! + diceRoll.next().value! + diceRoll.next().value!; 
		rolls +=3;
		pos[turn] = (pos[turn]+steps)%10
		scores[turn] += pos[turn]+1;
		turn = (turn+1)%2;
	}
	return Math.min(...scores)*rolls;
}

console.log(part1([9,3]));