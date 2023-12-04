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