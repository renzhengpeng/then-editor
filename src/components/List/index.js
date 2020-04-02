import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import DropList from "../DropList";

export default function List(editor) {
  this.template = '<div class="bdfint-editor-list-component"></div>';
  Component.call(this, editor);
  let dropListItems = [{
    iconClass: '',
    text: `<div class="bdfint-editor-payload-list-item"><span class="bdfint-editor-payload-icon bdfint-editor-icon-list-ol"></span><span>有序列表</span>`,
    cmd: 'insertOrderedList',
    value: ''
  }, {
    iconClass: '',
    text: `<div class="bdfint-editor-payload-list-item"><span class="bdfint-editor-payload-icon bdfint-editor-icon-list-ul"></span><span>无序列表</span>`,
    cmd: 'insertUnorderedList',
    value: ''
  }];
  let dropList = new DropList('设置列表', dropListItems, this.editor);
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-list',
    payload: dropList,
    triggerEvent: 'hover'
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

List.prototype = {
  constructor: List,
  active () {
    this.menu.active();
  }
};

inherits(List, Component);

function handleClick() {
  // todo
  // this.menu.toggleActive();
}