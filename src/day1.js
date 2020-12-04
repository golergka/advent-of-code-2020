const fs = require('fs')

const input = fs
    .readFileSync('input/day1input.txt', { encoding: 'utf-8'})
    .split('\n')
    .map(s => Number.parseInt(s))
    .sort()

let lowIndex = 0
let highIndex = input.length - 1
let moveLow = true

for (;
    lowIndex < highIndex;
    moveLow ? lowIndex++ : highIndex--
) {
    const low = input[lowIndex]
    const high = input[highIndex]
    const delta = low + high - 2020
    if (delta === 0) {
        console.log(`Answer to first part of the puzzle is ${low*high}`)
        break
    } else {
        moveLow = delta < 0
    }
}

// I don't really care about complexity now, though

triLoop:
for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
        for (let k = j + 1; k < input.length; k++) {
            const ith = input[i]
            const jth = input[j]
            const kth = input[k]

            if (ith + jth + kth === 2020) {
                console.log(`Answer to the secont part of the puzzle is ${ith*kth*jth}`)
                break triLoop
            }
        }
    }
}