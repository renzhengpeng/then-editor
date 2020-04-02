import Promise from 'promise-polyfill';

window.Promise = window.Promise || Promise;

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      let to = Object(target);
      
      for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index];
        
        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  let MiddleClass = function() {};
  MiddleClass.prototype = proto;
  let oldPrototype = obj.constructor.prototype;
  let newPrototype = new MiddleClass();
  for (let prop in oldPrototype) {
    if (oldPrototype.hasOwnProperty(prop)) {
      newPrototype[prop] = oldPrototype[prop];
    }
  }
  obj.constructor.prototype = newPrototype;
};

// 阻止浏览器默认打开文件的行为
document.addEventListener('drop', function (e) {
  e.preventDefault();
}, false);
document.addEventListener('dragover', function (e) {
  e.preventDefault();
}, false);