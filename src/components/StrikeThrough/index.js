import Menu from "../Menu";
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function StrikeThrough(editor) {
  this.template = '<div class="bdfint-editor-strike-through-component" title="添加删除线"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: ['s', 'strike'],
    iconClass: 'bdfint-editor-icon-strikethrough'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

StrikeThrough.prototype = {
  constructor: StrikeThrough,
  active () {
    this.menu.active();
  }
};

inherits(StrikeThrough, Component);

function handleClick() {
  this.editor.cmd.exec('strikeThrough');
  // this.menu.toggleActive();
}
