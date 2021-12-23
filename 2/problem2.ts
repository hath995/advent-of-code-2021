import fs from 'fs';


const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").reduce((curr, dirstring, index) => {
    let [direction, distance] = dirstring.split(" ");
    switch(direction) {
        case "forward": 
            curr.x += Number(distance);
            return curr;
            break;
        case "down":
            curr.y += Number(distance);
            return curr;
            break;
        case "up":
            curr.y -= Number(distance);
            return curr;
            break;
        default:
            return curr;
    }
}, {x:0,y:0});
console.log(data.x*data.y)
//console.log(data.reduce((mem, val, index, arr) => {
	//return index > 0 && arr[index] > arr[index-1] ? mem+1 : mem
//}, 0))
