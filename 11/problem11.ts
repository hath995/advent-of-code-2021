import fs from "fs";

const dataString = fs.readFileSync("./input.txt", { encoding: "utf8" });
const data = dataString.split("\n").map(octs => octs.split("").map(x => parseInt(x)))
data.pop();
// console.log(data)
const neighbors = [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];

function isValid(data: number[][]) {
	for(let y = 0; y < data.length; y++) {
		for(let x = 0; x < data[y].length; x++) {
			if(data[y][x] > 10) {
				print(data);
				throw new Error(`${y},${x} ${data[y][x]} value increased incorrectly`)
			}
		}
	}
}

function flashNeighbors(data: number[][], flashed: Set<string>, x: number, y: number): [number, number][] {
	const result: [number, number][] = [];
	data[y][x] = 0;
	for(let dir of neighbors) {
		const ny = y+dir[0], nx = x+dir[1];
		if(data[ny] !== undefined && data[ny][nx] !== undefined) {
			if(data[ny][nx] > 9) continue;
			if(data[ny][nx]!=0) {
				data[ny][nx]++;
				if(data[ny][nx] > 9 && !flashed.has([ny,nx].toString())) {
					data[ny][nx] = 0;
					flashed.add([ny, nx].toString());
					result.push([ny,nx]);
				}

			}
		}
	}	
	isValid(data);
	
	return result;
}

function step(data: number[][]): number {
	let flashes = 0;
	let flashStack: [number, number][] = [];
	for(let y = 0; y < data.length; y++) {
		for(let x = 0; x < data[y].length; x++) {
			data[y][x]+=1;
			if(data[y][x]>9) {
				flashStack.push([y,x]);
			}
		}
	}
	let flashed = new Set<string>(flashStack.map(xs => xs.toString()));
	while(flashStack.length > 0) {
		// console.log(flashStack);
		let [y,x] = flashStack.pop()!;
		try {
		flashStack = flashStack.concat(flashNeighbors(data, flashed, x, y));
		} catch(err) {
			console.log("ERR: ",x,y)
			console.error(err);
		}
		flashes++;
	}


	return flashes;
}

function print(data: number[][]) {
	let result = "";
	for(let i = 0; i<data.length; i++) {
		result+=data[i].join(" ")+"\n";
	}
	console.log(result);
}

function problem1(data: number[][], stepCount: number) {
	let totalFlashes = 0;
	for(let i = 0; i < stepCount; i++) {
		totalFlashes += step(data);
		print(data)
	}
	console.log(totalFlashes);
}

function allZeroes(data: number[][]): boolean {
	return data.reduce((mem: boolean, row: number[]): boolean => mem && row.reduce((emem: boolean, elem: number): boolean => emem && elem === 0, true), true)
}

function problem2(data: number[][]) {
	let totalSteps = 0;
	while(!allZeroes(data)) {
		step(data);
		totalSteps++;
		// print(data)
	}
	console.log(totalSteps);
}

problem2(data);