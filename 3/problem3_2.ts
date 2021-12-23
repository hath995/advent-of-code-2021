import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").map(ns => ns.split(""));
// data.pop();
const n = data[0].length;

function findOne(data, high: boolean) {
    let datas = data.slice();
    let index = 0;
    let digits = new Array(data[0].length);
    while(datas.length > 1 && index < datas[0].length) {
        let nums = [0,0]
        for(let i = 0; i < datas.length; i++) {
            nums[datas[i][index]]++;
        }
        digits[index] = high ? (nums[0] > nums[1] ? 0 : 1) : (nums[0] <= nums[1] ? 0 : 1);

        // console.log("DATAS", datas, index, digits[index])
        datas = datas.filter(nums => nums[index] == digits[index]);
        index++;
    }
    // console.log("found", datas, index, digits[index])
    return datas[0];
}
let oxygen = findOne(data, true)
// console.log("OXYGEN", oxygen.join(""), parseInt(oxygen.join(""), 2))
console.log("OXYGEN",  parseInt(oxygen.join(""), 2))
let carbon = findOne(data, false)
console.log("CARBON", parseInt(carbon.join(""), 2))
console.log("result",  parseInt(oxygen.join(""), 2) * parseInt(carbon.join(""), 2))
// console.log(carbon.join(""), parseInt(carbon.join(""), 2))

// let gamma = parseInt(result.map(x => x.m).join(""), 2);
// let epsilon = parseInt(result.map(x => x.l).join(""), 2);
// console.log(result, gamma*epsilon);
