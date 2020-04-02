import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import DropList from "../DropList";

export default function FontFamily(editor) {
  this.template = '<div class="bdfint-editor-font-family-component"></div>';
  Component.call(this, editor);
  let dropListItems = [{
    iconClass: '',
    text: '<p style="font-family: 宋体">宋体</p>',
    cmd: 'fontFamily',
    value: '宋体'
  }, {
    iconClass: '',
    text: '<p style="font-family: 微软雅黑">微软雅黑</p>',
    cmd: 'fontFamily',
    value: '微软雅黑'
  }, {
    iconClass: '',
    text: '<p style="font-family: Arial">Arial</p>',
    cmd: 'fontFamily',
    value: 'Arial'
  }, {
    iconClass: '',
    text: '<p style="font-family: Courier New">Courier New</p>',
    cmd: 'fontFamily',
    value: 'Courier New'
  }, {
    iconClass: '',
    text: '<p style="font-family: Georgia">Georgia</p>',
    cmd: 'fontFamily',
    value: 'Georgia'
  }, {
    iconClass: '',
    text: '<p style="font-family: Tahoma">Tahoma</p>',
    cmd: 'fontFamily',
    value: 'Tahoma'
  }, {
    iconClass: '',
    text: '<p style="font-family: Times New Roman">Times New Roman</p>',
    cmd: 'fontFamily',
    value: 'Times New Roman'
  }, {
    iconClass: '',
    text: '<p style="font-family: Verdana">Verdana</p>',
    cmd: 'fontFamily',
    value: 'Verdana'
  }, ];
  let dropList = new DropList('设置字体', dropListItems, this.editor);
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-font-family',
    triggerEvent: 'hover',
    payload: dropList
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

FontFamily.prototype = {
  constructor: FontFamily,
  active () {
    this.menu.active();
  }
};

inherits(FontFamily, Component);

function handleClick() {
  // todo
  // this.menu.toggleActive();
}