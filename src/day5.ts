import { debug } from 'console'
import * as fs from 'fs'

const rawPasses = fs
    .readFileSync('input/day5input.txt', { encoding: 'utf-8'})
    .split('\n')

interface Seat {
    row: number
    column: number
}

function parseBinary(input: string, zero: string, one: string): number {
    let result = 0
    for (let index = 0; index < input.length; index++) {
        const element = input[index]
        switch (element) {
            case zero:
                break;
            case one:
                result += Math.pow(2, input.length - index - 1);
                break;
            default:
                throw new Error(`unexpected character ${element} in ${input} at ${index}`)
        }
    }
    return result
}

function parseSeat(input: string): Seat {
    return {
        row: parseBinary(input.substr(0, 7), 'F', 'B'),
        column: parseBinary(input.substr(7), 'L', 'R')
    }
}

const passes = rawPasses.map(parseSeat)

debug(`Passes\n${passes.map(p => JSON.stringify(p, null, 2)).join('\n')}`)

function getID(pass: Seat) {
    return pass.row * 8 + pass.column
}

const ids = passes.map(getID)

debug(`Sorted IDs ${ids.sort((a, b) => a - b).join('\n')}`)

const limits = ids.reduce<{ min: number, max: number }>(
    (limits, id) => ({ 
        max: Math.max(limits.max, id), 
        min: Math.min(limits.min, id) 
    }), 
    { 
        min: Number.POSITIVE_INFINITY, 
        max: Number.NEGATIVE_INFINITY 
    })

console.log(`Max ID: ${limits.max}, min ID: ${limits.min}`)

const myID = (function findMyID() {
    for (let id = limits.min + 1; id < limits.max; id++) {
        if (ids.includes(id - 1) && 
            ids.includes(id + 1) && 
            !ids.includes(id)
        ) {
            return id
        }
    }
    throw new Error(`couldn't find my ID`)
})()

console.log(`My ID: ${myID}`)