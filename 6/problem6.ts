import { group } from 'console';
import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n");
const lanternfish = data.shift()!.split(",").map(n => parseInt(n));
// lanternfish.sort((a,b) => a - b);
// console.log(lanternfish)

let groupings: number[] = new Array(9);
groupings.fill(0);

groupings = lanternfish.reduce((groups, index) => {
    groups[index]++;
    return groups;
}, groupings);

console.log(groupings);


function problem1(fish: number[], days = 80) {
    for(let day = 0; day < days; day++) {
        let length = fish.length;
        for(let i = 0; i < length; i++) {
            if(fish[i] == 0) {
                fish.push(8);
                fish[i] = 6;
            }else{
                fish[i]--;
            }
        }
    }
    console.log(fish.length);
}

//grouping algorithm
//the fishGroups spawn day contains the number of mature fish
//growing contains the number of immature fish which will give birth
//initially on the current spawn day. 
function problem2(fishGroups: number[], days = 80) {
    let growing: number[] = new Array(14);
    growing.fill(0);

    for(let day = 0; day < days; day++) {
        let spawnDay = day % 7;
        let newGen = 0 || growing[day % 14];
        fishGroups[spawnDay] += newGen;
        growing[day % 14] = 0;
        growing[(day+9) % 14] = (fishGroups[spawnDay]);
    }
    console.log(fishGroups, growing, fishGroups.concat(growing).reduce((a,b) => a + b));
}

// problem2(groupings.slice(), 18);
problem2(groupings.slice(), 256);
// problem1(lanternfish);
