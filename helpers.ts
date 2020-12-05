export function countTrueInArray(arr: boolean[]): number {
  return arr.reduce((acc: number, bool: boolean) => (bool ? acc + 1 : acc), 0);
}
