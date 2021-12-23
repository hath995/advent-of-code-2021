import fs from 'fs';


const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n").map(x => parseInt(x)).filter(x => !isNaN(x));
console.log(data.reduce((mem, val, index, arr) => {
	return index > 0 && arr[index] > arr[index-1] ? mem+1 : mem
}, 0))
