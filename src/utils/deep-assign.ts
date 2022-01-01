import { isObject } from './util';

const { hasOwnProperty } = Object.prototype;

function assignKey(to: any, from: any, key: string) {
  const val = from[key];

  if (val === undefined || val === null) {
    return;
  }

  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    // eslint-disable-next-line
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

export function deepAssign(to: any, from: Object) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });

  return to;
}
