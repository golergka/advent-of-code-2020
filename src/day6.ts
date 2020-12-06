import { debug } from 'console'
import * as fs from 'fs'
import { intersection, union } from 'lodash'

// Array of groups, containing an array of persons, containing an array of answers
const answers = fs
    .readFileSync('input/day6input.txt', { encoding: 'utf-8'})
    .split('\n\n')
    .map(g => g.split('\n').map(p => p.split('')))

const uniqAnswers = answers.map(g => union(...g).sort())

debug(`Unique answers:\n${uniqAnswers.map(u => u.join('')).join('\n')}`)

const uniqAnswerCounts = uniqAnswers.map(u => u.length)
const uniqAnswerCountSum = uniqAnswerCounts.reduce<number>((sum, a) => sum + a, 0)

console.log(`Sum of unique answers: ${uniqAnswerCountSum}`)

const commonAnswers = answers.map(g => intersection(...g).sort())

debug(`Common answers:\n${commonAnswers.map(c => c.join('')).join('\n')}`)

const commonAnswerCounts = commonAnswers.map(u => u.length)
const commonAnswerCountSum = commonAnswerCounts.reduce<number>((sum, a) => sum + a, 0)

console.log(`Sum of common answers: ${commonAnswerCountSum}`)