import * as fs from 'fs'

interface Line {
    password: string,
    letter: string,
    low: number,
    high: number
}

function parseLine(line: string): Line {
    const [policyPart, passwordPart] = line.split(':', 2)
    const password = passwordPart.trim()
    const [amountPart, letterPart] = policyPart.split(' ', 2)
    const letter = letterPart.trim()
    const [minString, maxString] = amountPart.split('-', 2)
    const low = Number.parseInt(minString)
    const high = Number.parseInt(maxString)
    return { password, letter, low, high }
}

function checkLineOld({ password, letter, low, high }: Line): boolean {
    let amount = 0
    for (let i = 0; i < password.length; i++) {
        const element = password[i]
        if (element === letter) {
            amount++
        }
    }

    return amount >= low && amount <= high
}

function checkLineNew({ password, letter, low, high }: Line): boolean {
    const containsLow = password[low - 1] === letter
    const containsHigh = password[high - 1] === letter
    return containsLow != containsHigh
}

const lines = fs
    .readFileSync('input/day2input.txt', { encoding: 'utf-8'})
    .split('\n')
    .map(l => parseLine(l))

const validOld = lines
    .filter(l => checkLineOld(l))
    .length

console.log(`There's ${validOld} valid passwords, according to the old policy`)

const validNew = lines
    .filter(l => checkLineNew(l))
    .length

console.log(`There's ${validNew} valid passwords, according to the new policy`)