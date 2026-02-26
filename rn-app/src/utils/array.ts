export function shuffle<T>(list: T[]): T[] {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function insertArray<T>(
  arr: T[],
  val: T,
  compare: (item: T) => boolean,
  maxLen?: number
) {
  const index = arr.findIndex(compare);
  if (index === 0) return;
  if (index > 0) arr.splice(index, 1);
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) arr.pop();
}

export function deleteFromArray<T>(arr: T[], compare: (item: T) => boolean) {
  const index = arr.findIndex(compare);
  if (index > -1) arr.splice(index, 1);
}
