import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").map(ns => ns.split(""));
data.pop();
const n = data[0].length;
let result: {m: number, l: number}[] = new Array(n);
for(let k = 0; k < n; k++) {
    let nums = [0,0]
    for(let i = 0; i < data.length; i++) {
        nums[data[i][k]]++;
    }
    result[k] = {m: nums[0] > nums[1] ? 0 : 1, l: nums[0] < nums[1] ? 0 : 1}
}
let gamma = parseInt(result.map(x => x.m).join(""), 2);
let epsilon = parseInt(result.map(x => x.l).join(""), 2);
console.log(result, gamma*epsilon);
