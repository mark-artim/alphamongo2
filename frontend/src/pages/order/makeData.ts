import { faker } from '@faker-js/faker'

export type Person = {
  quantity: number
  lastName: string
  cost: number
  markup: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    quantity: faker.datatype.number({ min: 1, max: 100}),
    lastName: faker.name.lastName(),
    cost: faker.datatype.number({ min: .05, max: 5000, precision: 0.01 }),
    markup: faker.datatype.number({ min: 1.05, max: 2.00, precision: 0.01 }),
    progress: faker.datatype.number(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
