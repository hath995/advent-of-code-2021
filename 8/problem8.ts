import { assert } from 'console';
import fs from 'fs';
import { isNonNullExpression } from 'typescript';

const segmentCountToNumber = {
    2: 1,
    3: 7,
    4: 4,
    5: [2,3,5],
    6: [0,6,9],
    7: 8,
}
/*
 dddd
e    a
e    a
 ffff
g    b
g    b
 cccc

a = 0
b = 1
c = 2
d = 3
e = 4
f = 5
g = 6
*/
//                   0         ,1,2,3,4,5,6,7,8,9
const segPositions = new Map([
    [0b1011111,0],
    [0b0000011,1],
    [0b1101101,2],
    [0b0101111,3],
    [0b0110011,4],
    [0b0111110,5],
    [0b1111110,6],
    [0b0001011,7],
    [0b1111111,8],
    [0b0111111,9],
]);

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").filter(x => x !== "");
type Input = {
    segs: string[];
    display: string[];
}[] 
const inputs: Input = data.map(input => {
    let [segments, display] = input.split("|");
    return {segs: segments.split(" "), display: display.split(" ")};
});
//console.log(inputs);

const known = [2,3,4,7];
function problem1(inputs: Input) {
    return inputs.reduce((memo, cur) => {
        return memo + cur.display.reduce((count, elem) => {
            return count + (known.includes(elem.length) ? 1 : 0);
        }, 0)
    },0);
}

type Positions = "a" | "b" | "c" | "d" | "e" | "f" | "g";
type SegPositions = {
    [pos in Positions]?: number
}
function deduceSegments(segments: string[]) {
    let sg: SegPositions = {};
    segments.sort((a,b) => a.length - b.length);
    let one = segments[1]
    assert(one.length == 2,"1 length not 2");
    for(let letter of one) {
        sg[letter as Positions] = 1 << 1;
    }
    let seven = segments[2];
    assert(seven.length == 3,"7 length not 3");
    for(let letter of seven) {
        if(!(letter in sg)) {
            sg[letter as Positions] = 1 << 3;
        }
    }
    let four = segments[3];
    assert(four.length === 4,"4 length not 4")
    for(let letter of four) {
        if(!(letter in sg)) {
            sg[letter as Positions] = (1 << 4) | (1 << 5);
        }
    }
    let fivers = segments.filter(x => x.length == 5);
    let two = fivers.find(elem => {
        let unseen = 0;
        for(let letter of elem) {
            if(!(letter in sg)) {
                unseen++;
            }
        }
        return unseen == 2;
    })
    // console.log(2,two);
    let twoletters = two.split("").filter(x => (x in sg) && sg[x] !== 1 << 3);
    // console.log(twoletters);
    let middle = twoletters.find(x => !one.split("").includes(x))
    let topright = twoletters.find(x => one.split("").includes(x))

    for(let letter of one) {
        if(letter == topright) {
            sg[letter] = 1;
        }else{
            sg[letter] = 2;
        }
    }

    for(let letter of four) {
        if(one.split("").includes(letter)) continue;
        if(letter == middle) {
            sg[letter] = 1 << 5;
        }else{
            sg[letter] = 1 << 4;
        }
    }
    // console.log("m t", middle, topright);
    let three = fivers.find(x => {
        return x !== two && !x.split("").some(l => sg[l] == 1 << 4);
    })
    // console.log("3",three);
    for(let letter of three) {
        if(!(letter in sg)) {
            sg[letter as Positions] = (1 << 2);
        }
    }

    for(let letter of two!) {
        if(!(letter in sg)) {
            sg[letter as Positions] = (1 << 6);
        }
    }

    return sg;
}


function problem2(inputs: Input) {
    let total = 0;
    for(let input of inputs) {
        let sg = deduceSegments(input.segs);
        input.display.reverse();
        input.display.pop();
        // console.log(input.display)
        let sum = 0;
        for(let i = 0; i < input.display.length; i++) {
            let letterhash=0;
            for(let letter of input.display[i]) {
                letterhash |= sg[letter];
            }
            let num = segPositions.get(letterhash);
            sum += Math.pow(10, i) * num;
        }
        total += sum;
        console.log(sum)
    }
    console.log(total)
}

console.log(problem2(inputs))