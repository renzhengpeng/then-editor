import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";

export default function Undo(editor) {
  this.template = '<div class="bdfint-editor-undo-component" title="撤销"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: [],
    iconClass: 'bdfint-editor-icon-undo'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

inherits(Undo, Component);

function handleClick() {
  this.editor.cmd.exec('undo');
}