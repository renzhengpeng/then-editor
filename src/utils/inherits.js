/**
 * 原型式继承
 * @param subCtor 子类
 * @param superCtor 父类
 */
export default function inherits(subCtor, superCtor) {
  if (!(subCtor instanceof Function) || !(superCtor instanceof Function)) {
    throw new Error('inherits的两个参数应该都为函数');
  }
  if (superCtor.prototype === undefined) {
    throw new Error('superCtor.prototype未定义');
  }
  Object.setPrototypeOf(subCtor.prototype, superCtor.prototype);
}
