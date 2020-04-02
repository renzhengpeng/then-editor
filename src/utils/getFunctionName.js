export default function getFunctionName(fn) {
  if (fn.name) {
    return fn.name;
  } else {
    let fnStr = fn.toString();
    let result = /function\s+(\w*)\s*\(\w*\)/.exec(fnStr);
    return result && result[1];
  }
}