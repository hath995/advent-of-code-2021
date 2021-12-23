import fs from "fs";
import Bag from "./bag";

const dataString = fs.readFileSync("./input.txt", { encoding: "utf8" });
const [start, rulesStrings] = dataString.split("\n\n");
const rules = rulesStrings.split("\n").map((ps):[string, string] => ps.split(" -> ") as [string, string] )
rules.pop();
const ruleLookup = new Map(rules);
console.log(start)
console.log(ruleLookup)

function grow(input: string) {
	let polymer = input;
	let result = "";
	for(let i=0; i < polymer.length-1; i++) {
		const slice = polymer.slice(i,i+2);
		const newpiece = ruleLookup.get(slice);
		result += polymer[i];
		if(newpiece) {
			result += newpiece;
		}
	}
	result += polymer[polymer.length-1];
	return result;
}

function problem1(input: string, steps: number) {
	let polymer = input;
	for(let i = 0; i < steps; i++) {
		polymer = grow(polymer);
	}
	// console.log(polymer);
	let chems = new Bag(...polymer);
	const things = Array.from(chems.entries())
	things.sort((a,b) => a[1]-b[1]);
	let least = things[0][1];
	let most = things[things.length-1][1];
	console.log(most-least)
}

function growBigram(bigram: string, count: number) {
	const left = bigram[0] + ruleLookup.get(bigram);
	const right = ruleLookup.get(bigram) + bigram[1];
	const result = new Bag<string>();
	result.set(left, count);
	result.set(right, count);
	return result;
}

// problem1(start, 10);
function problem2(input: string, steps: number) {
	let bigramInput: string[] = [];
	for(let i=0; i< input.length-1; i++) {
		bigramInput.push(input.slice(i,i+2));
	}
	let bigramBag = new Bag(...bigramInput);
	for(let i = 0; i < steps; i++) {
		// console.log(bigramBag)
		let nextBag = new Bag<string>()
		for(let [bigram, count] of bigramBag.entries()) {
			let wat = growBigram(bigram, count);
			// console.log("BIGRAM", bigram, count, wat);
			nextBag = nextBag.sum(wat)
		}
		bigramBag = nextBag;
	}
	// console.log(bigramBag);
	let elementBag = new Bag<string>();
	for(let [bigram, count] of bigramBag.entries()) {
		for(let letter of bigram) {
			elementBag.add(letter, count);
		}
	}
	console.log(elementBag);
	let elements = Array.from(elementBag.entries());
	elements.sort((a,b) => a[1]-b[1]);
	let highest = elements.pop()![1];
	let lowest = elements[0][1];
	console.log(Math.round(highest/2-lowest/2))
}

problem2(start, 40);