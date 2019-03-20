export const keeyDecimal = (num, n = 2) => {
  let res = parseFloat(num);
  if (!res) return 0;
  res = Math.round(num * 10**n) / 10**n;
  let x = res.toString();
  let pos = x.indexOf('.');
  if (pos < 0) {
    pos = x.length;
    x += '.';
  }
  while (x.length <= pos + n) {
    x += '0';
  }
  return x;
}
export const toMoney = num => {
  const numArr = String(num).split('');
  const pos = numArr.findIndex(v => v === '.');
  const after = pos >= 0 ? numArr.slice(pos, numArr.length) : [];
  const arr = pos >= 0 ? numArr.slice(0, pos) : numArr;
  let res = [];
  let count = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    count ++;
    res.unshift(arr[i]);
    if (count % 3 === 0 && i !== 0) res.unshift(',');
  }
  return res.concat(after).join('');
}