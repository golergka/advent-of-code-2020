import * as fs from 'fs'

function parseLine(line: string) {
    const result = []
    for (let i = 0; i < line.length; i++) {
        const symbol = line[i];
        result.push(symbol === '#')
    }
    return result
}

const rawLines = fs
    .readFileSync('input/day3input.txt', { encoding: 'utf-8'})
    .split('\n')

const lines = rawLines
    .map(l => parseLine(l))

function checkSlope(right: number, down: number) {
    const width = lines[0].length
    const height = lines.length
    let x = 0, y = 0
    let trees = 0

    while (true) {
        y += down
        x = (x + right) % width

        if (y >= height) {
            break
        }

        if (lines[y][x]) {
            trees++
        }
    }

    console.log(`Total trees at a slope right ${right}, down ${down}: ${trees}`)

    return trees
}

const slopes: [number, number][] = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
const slopeTrees = slopes.map(slope => checkSlope(...slope))
const multiple = slopeTrees.reduce<number>((accum, i) => accum * i, 1)
console.log(`All trees multiplied are ${multiple}`)