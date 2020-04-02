import DropList from '../DropList';
import Menu from '../Menu';
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Align(editor) {
  this.template = `<div class="bdfint-editor-align-component"></div>`;
  Component.call(this, editor);
  let dropListItems = [{
    iconClass: '',
    text: `<div class="bdfint-editor-payload-list-item"><span class="bdfint-editor-payload-icon bdfint-editor-icon-align-left"></span><span>靠左</span>`,
    cmd: 'justifyLeft',
    value: ''
  }, {
    iconClass: '',
    text: `<div class="bdfint-editor-payload-list-item"><span class="bdfint-editor-payload-icon bdfint-editor-icon-align-middle"></span><span>居中</span>`,
    cmd: 'justifyCenter',
    value: ''
  }, {
    iconClass: '',
    text: `<div class="bdfint-editor-payload-list-item"><span class="bdfint-editor-payload-icon bdfint-editor-icon-align-right"></span><span>靠右</span>`,
    cmd: 'justifyRight',
    value: ''
  }];
  let dropList = new DropList('对齐方式', dropListItems, this.editor);
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-align-left',
    triggerEvent: 'hover',
    payload: dropList
  }, this.editor);
  this.childComponents = [this.menu];
}

inherits(Align, Component);
