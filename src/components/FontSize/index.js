import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from '../Menu';
import DropList from "../DropList";

export default function FontSize(editor) {
  this.template = `<div class="bdfint-editor-font-size-component"></div>>`;
  Component.call(this, editor);
  
  let self = this;
  let fontSizeList = [];
  for (let i = 12; i < 35; i++) {
    i % 2 === 0 && fontSizeList.push(i);
  }
  let dropListItems = fontSizeList.map(item => {
    return {
      iconClass: '',
      text: `<p style="font-size: ${item}px">${item}px</p>`,
      cmd: 'fontSize',
      value: `${item}px`
    };
  });
  
  let dropList = new DropList('设置字号', dropListItems, this.editor);
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-font-size',
    triggerEvent: 'hover',
    payload: dropList
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
}

inherits(FontSize, Component);
