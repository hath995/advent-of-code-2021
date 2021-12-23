import fs from 'fs';
const BingoIndices = [
    [0, 1, 2, 3, 4], //first row
    [5, 6, 7, 8, 9], //second row
    [10,11,12,13,14], //third row
    [15,16,17,18,19], //fourth row
    [20,21,22,23,24], //fifth row
    [0,5,10,15,20], //first column
    [1,6,11,16,21], //second column
    [2,7,12,17,22], //third column
    [3,8,13,18,23], //fourth column
    [4,9,14,19,24], //fifth column
]
class Board {
    items: boolean[];
    numbers: Map<number, number>;
    bingoed: boolean;

    constructor(board: string[][]) {
        //console.log("BBBB", board)
        this.bingoed = false;
        this.items = new Array(25);
        this.items.fill(false);
        this.numbers = new Map();
        let index = 0;
        for(let i=0; i < 5; i++) {
            if(board[i].length > 5) board[i].shift();
            for(let j = 0; j < 5; j++) {
                this.numbers.set(parseInt(board[i][j]), index);
                index++;
            }
        }
    }

    apply(num: number) {
        if(this.numbers.has(num)) {
            this.items[this.numbers.get(num)!] = true;
        }
    }

    hasBingo(): boolean {
        for(let i = 0; i < BingoIndices.length; i++) {
            if(BingoIndices[i].reduce((memo, val) => memo && this.items[val], true)) {
                this.bingoed = true;
                return true;
            }
        } 
        return false;
    }
    score(): number {
        return Array.from(this.numbers.keys()).reduce((memo, key) => {
            let called = this.items[this.numbers.get(key)!]
            return memo + (!called ? key : 0)
        }, 0)
    }
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = dataString.split("\n")
const calledNumbers = data.shift()!.split(",").map(n => parseInt(n));
data.shift();
//console.log(calledNumbers,data.length);
let boards: Board[] = [];
const n = data.length/6
for(let i=0; i < n; i++) {
    let board: string[][] = [];
    for(let k=0; k < 5; k++) {
        board.push(data[i*6+k].split(/\s+/))
    }
    boards[i] = new Board(board);
}

function part2() {
    let unbingoed = boards.slice();
    for(let num of calledNumbers) {
        unbingoed.forEach(board => board.apply(num));
        
        for(let board of unbingoed) {
            if(board.hasBingo() && unbingoed.length == 1) {
                console.log("Score", board.score()*num)
                return;
            }
        }
        unbingoed = unbingoed.filter(board => !board.bingoed);
    }
}

function part1() {
    bingo: for(let num of calledNumbers) {
        boards.forEach(board => board.apply(num));
        for(let i = 0; i < boards.length; i++) {
            if(boards[i].hasBingo()) {
                console.log(boards[i]);
                console.log("Score", boards[i].score()*num)
                break bingo;
            }
        }

    }
}
part2();
// console.log(boards);
