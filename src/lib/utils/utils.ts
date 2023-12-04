export function splitStringIntoArrayOfLines(str: string): string[] {
  return str.split(/\n/);
}
export function sumArrayOfNumbers(array: number[]): number {
  let sum = 0;
  for (const num of array) {
    sum += num;
  }
  return sum;
}

export function doubleValueXTimes(value: number, times: number) {
  let newValue = value;
  for (let i = 0; i < times; i++) {
    newValue *= 2;
  }
  return newValue;
}

export function findOverlappingNumbersInArrays(array1: string[], array2: string[]) {
  return array1.filter((number) => array2.includes(number));
}