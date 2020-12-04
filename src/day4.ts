import { debug } from 'console'
import * as fs from 'fs'

const rawPassports = fs
    .readFileSync('input/day4input.txt', { encoding: 'utf-8'})
    .split('\n\n')

type PassportKeyRequired = 'byr'|'iyr'|'eyr'|'hgt'|'hcl'|'ecl'|'pid'

type PassportKey = PassportKeyRequired|'cid'

type Passport = { [key in PassportKey]?: string }

function parsePassport(entry: string): Passport {
    const kvpairs = entry.split(/\s/)
    const result: { [key: string]: string } = {}
    for (const kvpair of kvpairs) {
        const [key, value] = kvpair.split(':')
        result[key] = value
    }
    return result
}

const passports = rawPassports.map(e => parsePassport(e))

function checkPassportFields(passport: Passport): boolean {
    const requiredKeys: PassportKeyRequired[] = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
    return requiredKeys.every(key => passport[key])
}

const passportsValidFields = passports.filter(checkPassportFields)

console.log(`${passportsValidFields.length} passports with valid fields`)

type ValidationError = string

const validValues: { [key in PassportKey]: string[]} = {
    'byr': [],
    'cid': [],
    'ecl': [],
    'eyr': [],
    'hcl': [],
    'hgt': [],
    'iyr': [],
    'pid': []
}

const invalidValues: { [key in PassportKey]: { value: string, errors: ValidationError[] }[]} = {
    'byr': [],
    'cid': [],
    'ecl': [],
    'eyr': [],
    'hcl': [],
    'hgt': [],
    'iyr': [],
    'pid': []
}

function checkPassportData(passport: Passport): ValidationError[] {
    function checkDefined(input: string|undefined): input is string {
        return !!input
    }

    function checkInt({ input, min, max, padLength }: { input: string; min?: number; max?: number, padLength?: number }): ValidationError|null {
        const int = Number.parseInt(input)
        if (!/^[0-9]*$/.test(input)) {
            return `${input} is not a number`
        }
        if (!Number.isInteger(int)) {
            return `${input} is not a valid number`
        }
        const intString = padLength ? `${int}`.padStart(padLength, '0'): `${int}`
        if (input !== intString) {
            return `${input} is not a canonical form of integer ${intString}`
        }
        if (min && int < min) {
            return `${int} is less than ${min}`
        }
        if (max && int > max) {
            return `${int} is more than ${max}`
        }
        return null
    }

    function checkLength(input: string, length: number): ValidationError|null {
        if (input.length !== length) {
            return `${input} does not have ${length} digits`
        }
        return null
    }

    function checkHeight(input: string): ValidationError|null {
        const cmIndex = input.indexOf('cm')
        const inIndex = input.indexOf('in')
        if (cmIndex >= 0) {
            return checkInt({ input: input.slice(0, cmIndex), min: 150, max: 193 })
        } else if (inIndex >= 0) {
            return checkInt({ input: input.slice(0, inIndex), min: 59, max: 76 })
        } else {
            return `${input} does not have cm or in index`
        }
    }

    function checkHairColor(input: string): ValidationError|null {
        return /^#[0-9a-f]{6}$/.test(input) ? null : `${input} is not a valid color`
    }

    function checkEyeColor(input: string): ValidationError|null {
        const colors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
        return colors.includes(input) ? null : `${input} is not one of the colors: ${colors}`
    }

    function checkKey(key: PassportKey, checker: (value: string) => (ValidationError|null)[]): ValidationError[] {
        function checkError(e: ValidationError|null): e is ValidationError {
            return !!e
        }

        const value = passport[key]
        const errors = checkDefined(value) ?
            checker(value).filter(checkError).map(e => `${key}: ${e}`) : 
            [`key ${key} is absent`]
        if (value) {
            if (errors.length === 0) {
                validValues[key].push(value)
            } else {
                invalidValues[key].push({ value, errors })
            }
        }
        return errors
    }

    return [
        ...checkKey('byr', byr => [checkInt({ input: byr, min: 1920, max: 2002 }), checkLength(byr, 4)]),
        ...checkKey('iyr', iyr => [checkInt({ input: iyr, min: 2010, max: 2020 }), checkLength(iyr, 4)]),
        ...checkKey('eyr', iyr => [checkInt({ input: iyr, min: 2020, max: 2030 }), checkLength(iyr, 4)]),
        ...checkKey('hgt', hgt => [checkHeight(hgt)]),
        ...checkKey('hcl', hcl => [checkHairColor(hcl)]),
        ...checkKey('ecl', ecl => [checkEyeColor(ecl)]),
        ...checkKey('pid', pid => [checkInt({ input: pid, padLength: 9 }), checkLength(pid, 9)])
    ]
}

const passportsValidData = []

for (const p of passports) {
    const errors = checkPassportData(p)
    debug(`Checked passport:\n${JSON.stringify(p, null, 2)}\nErrors:\n${errors.map(e => `  ${e}`).join('\n')}`)
    if (errors.length === 0) {
        passportsValidData.push(p)
    }
}

debug(`Valid values:\n${JSON.stringify(validValues, null, 2)}`)
debug(`Invalid values:\n${JSON.stringify(invalidValues, null, 2)}`)

console.log(`${passportsValidData.length} passports with valid data`)