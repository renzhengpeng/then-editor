import Component from '../Component';
import config from "../../config";
import inherits from '../../utils/inherits';
import getFunctionName from '../../utils/getFunctionName';

export default function Toolbar(editor) {
  this.template = `<div class="bdfint-editor-toolbar"></div>`;
  Component.call(this, editor);
  // // 申明子组件
  // this.childComponents = config.menus.map(item => {
  //   let Ctor = item.component;
  //   let c = new Ctor(this.editor);
  //   this[getFunctionName(item.component).toLowerCase()] = c;
  //   return c;
  // });
}

Toolbar.prototype = {
  constructor: Toolbar,
  /**
   * 遍历工具栏组件
   * @param fn
   */
  each (fn) {
    this.childComponents.forEach((item, i, arr) => {
      fn.call(this, item, i, arr);
    });
  },
  changeMenusActive () {
    let range = window.getSelection().getRangeAt(0);
    let c = range.commonAncestorContainer;
    let p = c.parentNode;
    let t = c.nodeType;
    let tagName = '';
   
    if (t === 3) {
      tagName = p.tagName;
    }
    if (t === 1) {
      tagName = c.tagName;
    }
    this.each((item) => {
      item.menu.cancelActive();
      item.menu.changeActive(tagName);
    });
  },
  /**
   * 激活某个工具菜单
   */
  activeItem (tool) {
    tool && tool.menu && tool.menu.active();
  }
};

inherits(Toolbar, Component);
