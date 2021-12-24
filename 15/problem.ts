import {readFileSync} from "fs";
import Heap from "./heap";
const dataString = readFileSync("./input.txt", { encoding: "utf8" });
const riskMapString = dataString.split("\n");
riskMapString.pop();

class Node {
	distance: number;
	predecessor?: Node;
	constructor(public x: number, public y: number, readonly risk: number) {
		this.distance = Infinity;
	}
}

const riskMap = riskMapString.map((line, y) => line.split("").map((risk,x) => new Node(x,y,parseInt(risk))));
// console.log(riskMap);

function relax(v: Node,u: Node, Q: Heap<Node>) {
	// console.log(`${v.x}, ${v.y}`, v.distance, u.distance + v.risk)
	if(v.distance > u.distance + v.risk) {
		v.distance = u.distance + v.risk;
		v.predecessor = u;
		Q.alterKey(u.distance + v.risk, v);
	}
}

// let visited = new Set<Node>([]);
// let heaped = new Set<Node>();
function Dijkstra(graph: Map<Node, Node[]>, start: Node) {
	start.distance = 0;
	let Q = new Heap<Node>(Array.from(graph.keys()), (a,b) => a.distance < b.distance, (a,k)=>a);
	while(!Q.empty()) {
		let u = Q.extractTop()!;
		// console.log("BEFORE", Q.data);
		for(let vertex of graph.get(u) || []) {
			// console.log(vertex, u)
			if(Q.has(vertex)) {
				relax(vertex, u, Q);
			} 
		}
		// break;
	}
	// console.log("AFTER", Q.data);
}



function problem1() {

	let start = riskMap[0][0];
	let goal = riskMap[riskMap.length-1][riskMap[0].length-1];
	console.log(start, goal);

	const directions = [[1,0],[0,1],[0,-1],[-1,0]];
	//only allow positive direction either down or right
	// const directions = [[1,0],[0,1]];
	let AdjList = new Map<Node, Node[]>();
	for(let y = 0; y < riskMap.length; y++) {
		for(let x = 0; x < riskMap[y].length; x++) {
			let neighbors: Node[] = [];
			for(let dir of directions) {
				if(riskMap[y+dir[0]] && riskMap[y+dir[0]][x+dir[1]]) {
					neighbors.push(riskMap[y+dir[0]][x+dir[1]]);
				}
			}
			AdjList.set(riskMap[y][x], neighbors);
		}
	}

	console.log("Starting");
	// console.log(AdjList);
	Dijkstra(AdjList, start);
	// console.log(AdjList);
	console.log(goal);
	console.log(goal.distance);
	reconstruct(goal);
}

function reconstruct(goal: Node) {
	let path = [goal];
	let current = goal;
	while(current.predecessor) {
		path.push(current.predecessor);
		current = current.predecessor;
	}
	path.reverse();
	for(let spot of path) {
		console.log(`[${spot.x},${spot.y}: ${spot.distance}, ${spot.risk}]`)
	}

}
// problem1();

function problem2() {
	const entireCave = 5;
	let blockIncrement: number[][] = [];
	blockIncrement.push(new Array(entireCave));
	for(let i = 0; i < entireCave; i++) { blockIncrement[0][i] = i;}
	for(let i = 1; i < entireCave; i++) { 
		let newRow = new Array(entireCave)
		blockIncrement.push(newRow)
		for(let k = 0; k < entireCave; k++) {
			blockIncrement[i][k] = blockIncrement[i-1][k]+1
		}
	}
	let riskMap: number[][] = riskMapString.map((line, y) => line.split("").map((risk,x) => parseInt(risk)))
	let mapOfMaps: Node[][][][] = blockIncrement.map(incrementRow => 
		incrementRow.map(increment => riskMap.map(row => row.map(y => new Node(0,y,(y-1+increment)%9+1)))
		)
	)
	let expandedMap: Node[][] = mapOfMaps.flatMap(rows => {
		let result: Node[][]=[]
		for(let i = 0; i < rows[0].length; i++) {
			let longerRow: Node[] = [];
			for(let k = 0; k < rows.length; k++) {
				longerRow = longerRow.concat(rows[k][i]);
			}
			result.push(longerRow);
		}
		return result;
	})

	const directions = [[1,0],[0,1],[0,-1],[-1,0]];
	// only allow positive direction either down or right
	// const directions = [[1,0],[0,1]];
	let AdjList = new Map<Node, Node[]>();
	for(let y = 0; y < expandedMap.length; y++) {
		for(let x = 0; x < expandedMap[y].length; x++) {
			let neighbors: Node[] = [];
			for(let dir of directions) {
				if(expandedMap[y+dir[0]] && expandedMap[y+dir[0]][x+dir[1]]) {
					neighbors.push(expandedMap[y+dir[0]][x+dir[1]]);
				}
			}
			expandedMap[y][x].x=x;
			expandedMap[y][x].y=y;
			AdjList.set(expandedMap[y][x], neighbors);
		}
	}
	
	let start = expandedMap[0][0];
	let goal = expandedMap[expandedMap.length-1][expandedMap[0].length-1];
	console.log(start, goal);

	Dijkstra(AdjList, start);
	console.log(goal);
	console.log(goal.distance);
	// console.log(expandedMap.map(row => row.join("")).join("\n"));



}
problem2();
/*
INITIALIZE-SINGLE-SOURCE(G;s)
	for each vertex v \in G.V
		v.d = Infinity
		v.predecessor = null;
	s.d = 0;

RELAX(u; v; w)
	if v.d > u.d + w(u,v)
		v.d = u.d + w(u,v)
		v.predecessor = u

DIJKSTRA(G; w; s)/
	INITIALIZE-SINGLE-SOURCE(G;s)
	s = emptySet; //s is visited
	Q = G.V //start node
	while Q not empty;
		u = EXTRACT-MI(Q)
		S = S union u
		for each vertex v \in G.Adj(u): //crucially only if v still in Q!
			RELAX(u,v,w);
*/