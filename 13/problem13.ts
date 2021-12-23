import fs from "fs";

const dataString = fs.readFileSync("./input.txt", { encoding: "utf8" });
const [pointsData, foldData] = dataString.split("\n\n");
const points = pointsData.split("\n").map((ps):[number, number] => ps.split(",").map(x => parseInt(x)) as [number, number]);
console.log(points);
const folds = foldData.split("\n").map((x): Fold | undefined => {
	let fd = /fold along (x|y)=(\d+)/.exec(x)
	if(fd) {
		return {
			//@ts-ignore
			kind: fd[1],
			[fd[1]]: fd[2]
		}
	}
}).filter(x => x !== undefined);
console.log(folds)

type Fold = {kind:"x", x: number} | {kind:"y", y: number}

function transformPoint(pt: [x:number, y: number], fold: Fold): [number, number] {
	if((fold.kind) == "x") {
		let newX = fold.x-(pt[0]-fold.x)
		return [newX, pt[1]];
	}else{
		let newY = fold.y-(pt[1]-fold.y)
		return [pt[0], newY];
	}
}

function print(points: [number,number][]) {
	let X = Math.max(...points.map(x => x[0]))+1;
	let Y = Math.max(...points.map(x => x[1]))+1;
	console.log("X<Y",X,Y)
	let result = new Array(Y);
	for(let i = 0; i < Y; i++) {
		result[i] = new Array(X);
		result[i].fill(".");
	}
	for(let pt of points) {
		console.log("#>#", pt[1], pt[0]);
		result[pt[1]][pt[0]] = "#";
	}
	console.log(result.map(row => row.join("")).join("\n"));
}

function problem1() {
	let foldedPoints = points;
	for(let fold of [folds[0]]) {
		let index = fold!.kind == "x" ? 0 : 1;
		//@ts-ignore
		let overTheFold = foldedPoints.filter((pt): boolean => pt[index] >= fold[fold!.kind])
		//@ts-ignore
		let belowTheFold = foldedPoints.filter((pt): boolean => pt[index] < fold[fold!.kind])
		foldedPoints = belowTheFold.concat(overTheFold.map(pt => transformPoint(pt,fold!)));
	}
	let result = new Set(foldedPoints.map(pt => pt.toString()));
	console.log(result);
	console.log(result.size);
	// print(foldedPoints);
}
function problem2() {
	let foldedPoints = points;
	for(let fold of folds) {
		let index = fold!.kind == "x" ? 0 : 1;
		//@ts-ignore
		let overTheFold = foldedPoints.filter((pt): boolean => pt[index] >= fold[fold!.kind])
		//@ts-ignore
		let belowTheFold = foldedPoints.filter((pt): boolean => pt[index] < fold[fold!.kind])
		foldedPoints = belowTheFold.concat(overTheFold.map(pt => transformPoint(pt,fold!)));
	}
	let result = new Set(foldedPoints.map(pt => pt.toString()));
	console.log(result);
	console.log(result.size);
	print(foldedPoints);
}
problem2();