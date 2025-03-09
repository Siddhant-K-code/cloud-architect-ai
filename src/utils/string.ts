export function replaceCaseInsensitive(
  str: string,
  find: string,
  replace: string
) {
  let result = "";
  const findLower = find.toLowerCase();
  let index = 0;

  while (index < str.length) {
    if (str.substring(index).toLowerCase().startsWith(findLower)) {
      result += replace;
      index += find.length;
    } else {
      result += str[index];
      index++;
    }
  }

  return result;
}
