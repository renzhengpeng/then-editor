import Menu from "../Menu";
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Underline(editor) {
  this.template = '<div class="bdfint-editor-underline-component" title="添加下划线"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: ['u'],
    iconClass: 'bdfint-editor-icon-underline'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Underline.prototype = {
  constructor: Underline,
  active () {
    this.menu.active();
  }
};

inherits(Underline, Component);

function handleClick() {
  this.editor.cmd.exec('underline');
  // this.menu.toggleActive();
}
