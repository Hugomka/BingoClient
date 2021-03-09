export interface BingoRow {
  id: string;
  numbers: string;
}

export function getNumber(numbers: string, index: number): string {
  const numbersArray = numbers.split(',');
  return numbersArray[index];
}
