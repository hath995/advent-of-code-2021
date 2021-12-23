import fs from "fs";

const dataString = fs.readFileSync("./input.txt", { encoding: "utf8" });
const data = dataString.split("\n");
data.pop();

const syntaxValue: { [key: string]: number } = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

function isCorrupted(s: string): boolean | number {
  let stack = [];
  let matching: { [key: string]: string } = {
    ")": "(",
    "}": "{",
    "]": "[",
    ">": "<",
  };
  for (let i = 0; i < s.length; i++) {
    if (/[([{<]/.test(s[i])) {
      stack.push(s[i]);
    } else {
      if (stack[stack.length - 1] != matching[s[i]]) {
        return syntaxValue[s[i]];
      } else {
        stack.pop();
      }
    }
  }
  return stack.length == 0;
}

function problem1(data: string[]) {
  let total = 0;
  for (let line of data) {
    let result = isCorrupted(line);
    if (result !== true && result !== false) {
      total += result;
    }
  }
  console.log(total);
}
const acScore : { [key: string]: number }= {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

function isValid(s: string): boolean | number {
	let stack = [];
	let matching : { [key: string]: string }= {
	  ")":"(",
	  "}":"{",
	  "]":"[",
	  ">": "<",
	}
	for(let i = 0; i < s.length; i++) {
	 if(/[([{<]/.test(s[i])) {
	   stack.push(s[i]);
	 }else{
	   if(stack[stack.length-1] != matching[s[i]]) {
		 return false;
	   }else{
		 stack.pop();
	   }
	 }
	}
	let score = 0;
	while(stack.length > 0) {
		score = score * 5 + acScore[stack.pop()!];
	}
	return score;
  };
function problem2(data: string[]) {
  let scores: number[] = [];
  for (let line of data) {
    let result = isValid(line);
    if (result !== true && result !== false) {
      scores.push(result);
    }
  }
  scores.sort((a,b)=>a-b)
  console.log("Lenght:", scores.length)
  console.log(scores[Math.floor(scores.length/2)]);
}

problem2(data);