import fs from 'fs';
import QuickUnion from './quickunion';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").map(x => x.split("").map(y => parseInt(y)))
data.pop();

function isLowPoint(data: number[][], x: number, y: number) {
	//north
	if(data[y-1] != undefined && data[y-1][x] != undefined && data[y][x] >= data[y-1][x]) {
		return false;
	}
	//west
	if(data[y] != undefined && data[y][x-1] != undefined && data[y][x] >= data[y][x-1]) {
		return false;
	}
	//east
	if(data[y] != undefined && data[y][x+1] != undefined && data[y][x] >= data[y][x+1]) {
		return false;
	}

	//south
	if(data[y+1] != undefined && data[y+1][x] != undefined && data[y][x] >= data[y+1][x]) {
		return false;
	}
	return true;
}

function problem1(data: number[][]) {
	let risk = 0;
	for(let y = 0; y < data.length; y++) {
		for(let x = 0; x < data[y].length; x++) {
			if(isLowPoint(data,x,y)) {
				console.log(`${x},${y} : ${data[y][x]}`)
				risk += data[y][x]+1;
			}
		}
	}
	console.log(risk);
	return risk;
}

function isBasin(data: number[][], union: QuickUnion, x: number, y: number) {
	function toI(x: number,y:number) {
		return y*data[0].length+x;
	}
	//north
	if(data[y-1] != undefined && data[y-1][x] != undefined && data[y][x] < 9 && data[y-1][x] < 9) {
		union.join(toI(x,y),toI(x,y-1))
	}
	//west
	if(data[y] != undefined && data[y][x-1] != undefined && data[y][x] < 9 && data[y][x-1] < 9) {
		union.join(toI(x,y),toI(x-1,y))
	}
	//east
	if(data[y] != undefined && data[y][x+1] != undefined && data[y][x] < 9 && data[y][x+1] < 9) {
		union.join(toI(x,y),toI(x+1,y))
	}

	//south
	if(data[y+1] != undefined && data[y+1][x] != undefined && data[y][x] < 9 &&  data[y+1][x] < 9) {
		union.join(toI(x,y),toI(x,y+1))
	}
}

function problem2(data: number[][]) {
	let union = new QuickUnion(data.length*data[0].length);

	for(let y = 0; y < data.length; y++) {
		for(let x = 0; x < data[y].length; x++) {
			isBasin(data,union, x,y)
			// console.log(`${x},${y} : ${data[y][x]}`)
		}
	}
	for(let i=0; i < union.length; i++) {
		union.find(i);
	}
	let sizes = union.size.slice()
	sizes.sort((a,b) => a-b);
	let one = sizes.pop()!;	
	let two = sizes.pop()!;	
	let three = sizes.pop()!;	
	console.log(one*two*three);
}

problem2(data);
