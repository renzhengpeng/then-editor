import $ from "../../utils/dom";

/**
 * 抽象组件
 * @constructor
 */
function Component(editor) {
  // 不使用new 关键字调用则抛出错误
  if (!(this instanceof Component)) {
    this.template = undefined;
    throw new Error('组件构造函数必须使用new关键字调用');
  }
  this.editor = editor;
  // 初始化子组件
  this._components = [];
  // 每个组件的_el属性都保存着抽象dom
  this._el = $(this.template);
  // 每个组件只能有一个根元素
  if (this._el.length > 1) {
    throw new Error(this.constructor.name + '组件错误: 每个组件只能有一个根元素');
  }
  // 在dom上记录对应的组件对象
  // this._el[0].component = this;
}

/**
 * 安装子组件
 * @param components {Array}
 * @private
 */
Component.prototype._installChildComponents = function(components) {
  let _fragment = $.createFragment();
  let _components = components || this.childComponents || [];
  _components.forEach((component, i) => {
    let _dom = component._el;
    _fragment.appendChild(_dom[0]);
    // component.editor = this.editor || this;
    component._parent = this;
    this._components.push(component);
    component._installChildComponents();
  });
  
  this._el.append(_fragment);
};

/**
 * 监听事件
 * @param eventType
 * @param fn
 */
Component.prototype.on = function (eventType, fn) {
  this._el[0].addEventListener(eventType, (e) => {
    e = e || window.event;
    e.stopPropagation = e.stopPropagation || function () {
      e.cancelBubble = true;
    };
    fn.call(this, e);
  });
};

/**
 * 获取组件的真实dom
 * @returns {HTMLElement}
 */
Component.prototype.getElem = function () {
  return this._el[0];
};

/**
 * 挂载组件到指定的父节点内
 * @param parentNode
 */
Component.prototype.mountTo = function (parentNode) {
  if (!(parentNode instanceof HTMLElement))  throw new Error('mountTo的参数类型必须是HTMLElement');
  parentNode.appendChild(this.getElem());
};

export default Component;