import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n");
const crabs = data.shift()!.split(",").map(n => parseInt(n));
console.log(crabs);

function problem1(crabs: number[]) {
    let min = Math.min(...crabs);
    let max = Math.max(...crabs);
    let fuel = Infinity;
    for(let i = min; i <= max; i++) {
        fuel = Math.min(crabs.reduce((memo,cur) => memo + Math.abs(i-cur),0), fuel);
    }
    return fuel;
}

function fuelCost(distance: number): number {
    return distance*(distance+1)/2
}

function problem2(crabs: number[]) {
    let min = Math.min(...crabs);
    let max = Math.max(...crabs);
    let fuel = Infinity;
    for(let i = min; i <= max; i++) {
        fuel = Math.min(crabs.reduce((memo,cur) => memo + fuelCost(Math.abs(i-cur)),0), fuel);
    }
    return fuel;
}

console.log(problem2(crabs));
