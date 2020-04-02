import Menu from "../Menu";
import Component from '../Component';
import inherits from '../../utils/inherits';
import Payload from "../Payload";
import $ from '../../utils/dom';

export default function HeightLight(editor) {
  this.template = '<div class="bdfint-editor-height-light-component"></div>';
  Component.call(this, editor);
  
  // todo...待优化：用颜色值配置取代svg图
  let body = $(`<div class="bdfint-editor-heightLight-pen-container">
    <div class="bdfint-editor-heightLight-pen" _color="#ffff00"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen"></span></div>
    <div class="bdfint-editor-heightLight-pen" _color="#63f963"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen_1"></span></div>
    <div class="bdfint-editor-heightLight-pen" _color="#fc7999"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen_2"></span></div>
    <div class="bdfint-editor-heightLight-pen" _color="#72cdfd"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen_3"></span></div>
    <div class="bdfint-editor-heightLight-pen" _color="#e91313"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen_4"></span></div>
    <div class="bdfint-editor-heightLight-pen" _color="#118800"><span style="width: 30px;height: 20px;line-height: 20px;font-size: 16px;" class="bdfint-editor-icon-pen_5"></span></div>
  </div>`);
  body.find('div').on('click', (e) => {
    this.editor.cmd.exec('heightLight', e.currentTarget.getAttribute('_color'));
    setTimeout(() => {
      this.menu.hidePayload();
    }, 0);
  });
  let payload = new Payload({
    title: '高亮文字',
    body
  }, this.editor);
  this.menu = new Menu({
    activeTags: ['mark'],
    iconClass: 'bdfint-editor-icon-font-color',
    payload
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

HeightLight.prototype = {
  constructor: HeightLight,
  active () {
    this.menu.active();
  }
};

inherits(HeightLight, Component);

function handleClick() {
  // this.menu.toggleActive();
}
