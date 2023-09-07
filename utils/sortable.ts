// https://github.com/MaxLeiter/sortablejs-vue3#use-with-a-store
export function moveItemInArray<T>(array: T[], from: number, to: number) {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);

  return array;
}
