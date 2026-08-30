export function comparePrimesAscending(first: bigint, second: bigint): number {
  if (first < second) return -1;
  if (first > second) return 1;

  return 0;
}
