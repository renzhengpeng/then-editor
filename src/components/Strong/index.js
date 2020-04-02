import Menu from "../Menu";
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Strong(editor) {
  this.template = '<div class="bdfint-editor-strong-component" title="加粗"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: ['b', 'strong'],
    iconClass: 'bdfint-editor-icon-bold'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Strong.prototype = {
  constructor: Strong,
  active () {
    this.menu.active();
  }
};

inherits(Strong, Component);

function handleClick() {
  this.editor.cmd.exec('bold', null);
  // this.menu.toggleActive();
}
