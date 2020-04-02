import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import $ from "../../utils/dom";
import Button from "../Button";
import Payload from "../Payload";

export default function Video(editor) {
  this.template = '<div class="bdfint-editor-video-component" title="添加视频"></div>';
  Component.call(this, editor);
  let body = $(`<div class="bdfint-editor-img">
    <input class="bdfint-editor-video-input" type="text" maxlength="256" placeholder="输入视频链接">
  </div>`);
  let self = this;
  let button = new Button({
    text: '插入',
    type: 'default',
    onClick (e) {
      e.stopPropagation();
      let imgUrl = body.find('.bdfint-editor-video-input').val();
      self.menu.hidePayload();
      self.menu.cancelActive();
      if (!(/^\s*$/.test(imgUrl))) {
        self.editor.cmd.exec('insertVideo', imgUrl);
      }
      self.clear();
    }
  }, editor);
  let payload = new Payload({
    title: '添加视频',
    body: body,
    foot: button.getElem()
  }, this.editor);
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-video',
    payload
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Video.prototype = {
  constructor: Video,
  active () {
    this.menu.active();
  },
  clear () {
    this._el.find('.bdfint-editor-video-input').val('');
  },
  focusInput () {
    this._el.find('.bdfint-editor-video-input')[0].focus();
  }
};

inherits(Video, Component);

function handleClick() {
  this.focusInput();
  // this.menu.toggleActive();
}