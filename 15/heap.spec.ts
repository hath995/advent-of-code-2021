import Heap from './heap';
import * as fc from 'fast-check';

describe("Heap", () =>{

	it("should heapify", () => {
		fc.assert(
			fc.property(
			fc.array(fc.integer()),
			arr => {
				let test = new Heap(arr, (a,b) => a <= b);
				// console.log(test);
				for(let i = arr.length-1; i > 0; i--) {
					if(arr[i] < arr[test.parent(i+1)-1]) {
						return false;
					}
				}
				return true;
			}), {examples: [[[0,1,0]]]});
	})

	it("should insert", () => {
		fc.assert(
			fc.property(
			fc.array(fc.integer()),
			arr => {
				let test = new Heap<number>([], (a,b) => a <= b);
				// console.log(test);
				for(let elem of arr) {
					test.insert(elem);
				}
				for(let i = test.data.length-1; i > 0; i--) {
					if(test.data[i] < test.data[test.parent(i+1)-1]) {
						return false;
					}
				}
				return true;
			}), {examples: [[[0,1,0]]]});
	})

	it("should extractTop", () => {
		fc.assert(
			fc.property(
			fc.array(fc.integer()),
			arr => {
				let original = arr.slice();
				original.sort((a,b) => a-b);
				let test = new Heap(arr, (a,b) => a <= b);
				console.log(test)
				// console.log(test);
				let result: number[] = [];
				while(!test.empty()) {
					result.push(test.extractTop()!)
				}
				return JSON.stringify(original) === JSON.stringify(result);	
			}), {examples: [[[0,1,0]]]});
	})

	it("should alterKey", () => {
		fc.assert(
			fc.property(fc.array(fc.integer()), fc.nat(), fc.nat(), (arr, index, sub) => {
				fc.pre(arr.length > 0);
				const inputs = arr.map(x => ({key:x}));
				let test = new Heap(inputs, (a,b) => a.key <= b.key, (a, k) => ((a.key = k), a));
				let elem = inputs[index%arr.length];
				test.alterKey(elem.key-sub,elem);

				for(let i = test.data.length-1; i > 0; i--) {
					if(test.data[i] < test.data[test.parent(i+1)-1]) {
						return false;
					}
				}
				return true;
			})
			
		)
	})
})