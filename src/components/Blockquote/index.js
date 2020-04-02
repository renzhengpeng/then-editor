import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from '../Menu';
import $ from '../../utils/dom';

export default function Blockquote(editor) {
  this.template = '<div class="bdfint-editor-blockquote-component" title="添加引用"></div>';
  Component.call(this, editor);
  this.menu = new Menu({
    activeTags: [],
    iconClass: 'bdfint-editor-icon-blockquote'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

inherits(Blockquote, Component);

function handleClick() {
  this.editor.cmd.exec('blockquote');
}