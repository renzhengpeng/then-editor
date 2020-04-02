import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import Payload from "../Payload";
import Button from "../Button";
import $ from "../../utils/dom";

export default function Link(editor) {
  this.template = '<div class="bdfint-editor-link-component" title="添加链接"></div>';
  Component.call(this, editor);
  
  const self = this;
  let body = $(`<div>
    <input class="bdfint-editor-link-text-input" type="text" maxlength="64" title="输入链接文字" placeholder="输入链接文字">
  </div>
  <div>
    <input class="bdfint-editor-link-link-input" type="text" maxlength="256" title="输入链接,如: https://github.com/" placeholder="输入链接,如: https://github.com/">
  </div>`);
  let button = new Button({
    text: '插入',
    type: 'default',
    onClick (e) {
      e.stopPropagation();
      self.menu.cancelActive();
      self.createLink();
    }
  }, editor);
  let payload = new Payload({
    title: '添加链接',
    body: body,
    foot: button.getElem()
  }, this.editor);
  this.menu = new Menu({
    activeTags: ['a'],
    iconClass: 'bdfint-editor-icon-link',
    payload
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Link.prototype = {
  constructor: Link,
  active () {
    this.menu.active();
  },
  clear () {
    this._el.find('.bdfint-editor-link-text-input').val('');
    this._el.find('.bdfint-editor-link-link-input').val('');
  },
  createLink () {
    let text = this._el.find('.bdfint-editor-link-text-input').val();
    let link = this._el.find('.bdfint-editor-link-link-input').val();
    this.editor.cmd.exec('createLink', {
      text, link
    });
    this.clear();
    this.menu.hidePayload();
  }
};

inherits(Link, Component);

function handleClick() {
  let range = this.editor.selection.getRange();
  let text = range.toString();
  let textInput = this._el.find('.bdfint-editor-link-text-input');
  textInput.val(text);
  textInput[0].focus();
  // this.menu.toggleActive();
}