import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";

export default function Italic(editor) {
  this.template = '<div class="bdfint-editor-italic-component" title="斜体"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: ['i', 'em'],
    iconClass: 'bdfint-editor-icon-italic'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Italic.prototype = {
  constructor: Italic,
  active () {
    this.menu.active();
  }
};

inherits(Italic, Component);

function handleClick() {
  this.editor.cmd.exec('italic');
  // this.menu.toggleActive();
}