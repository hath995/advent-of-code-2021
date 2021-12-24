t = new Array(5);
t = []
t.push(new Array(5))
for(let i = 1; i < 5; i++) {  for(let k = 0; k < 5; k++){t[i][k] = t[i-1][k]+1 }}}
for(let i = 1; i < 5; i++) {  for(let k = 0; k < 5; k++){t[i][k] = t[i-1][k]+1 }}
t
const samples = `8 9 1 2 3
9 1 2 3 4
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7`
samples.split("\n").map(x => x.split(" ").map(y => parseInt(y))
)
let data = samples.split("\n").map(x => x.split(" ").map(y => parseInt(y)))
(8+2)%10
Math.max((8+2)%10,1)
Math.max((9+2)%10,1)
(8-1+2)%9+1