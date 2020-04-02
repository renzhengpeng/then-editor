import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";

export default function Redo(editor) {
  this.template = '<div class="bdfint-editor-redo-component" title="恢复撤销"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: [],
    iconClass: 'bdfint-editor-icon-redo'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

inherits(Redo, Component);

function handleClick() {
  this.editor.cmd.exec('redo');
}