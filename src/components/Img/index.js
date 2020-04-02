import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import Payload from "../Payload";
import Button from "../Button";
import $ from "../../utils/dom";
import upload from "../../utils/upload";

export default function Img(editor) {
  this.template = '<div class="bdfint-editor-img-component" title="添加图片"></div>';
  Component.call(this, editor);
  
  const self = this;
  let body = $(`<div class="bdfint-editor-img">
    <input class="bdfint-editor-img-input" type="text" maxlength="256" placeholder="输入图片链接">
  </div>`);
  let chooseBtn = $(`<button class="bdfint-editor-choose-file-btn">选择图片</button>`);
  let hiddenFileInput = $(`<input class="bdfint-editor-file-input-hidden" style="display: none;" type="file" accept="image/*">`);
  body.append(chooseBtn);
  body.append(hiddenFileInput);
  chooseBtn.on('click', (e) => {
    hiddenFileInput[0].click();
  });
  hiddenFileInput.on('change', () => {
    let file = hiddenFileInput[0].files[0];
    // 只处理图片文件
    if (!/^image\//.test(file.type)) {
      this.editor.message('warn', '只能上传图片');
      return;
    }
  
    upload(file, this.editor).then((res) => {
      let reader = new FileReader();
      self.menu.hidePayload();
      self.menu.cancelActive();
      self.clear();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editor.cmd.exec('insertImage', reader.result);
      };
    });
  });
  let button = new Button({
    text: '插入',
    type: 'default',
    onClick (e) {
      e.stopPropagation();
      let imgUrl = body.find('.bdfint-editor-img-input').val();
      let img = new Image();
      img.src = imgUrl;
      // 成功加载图片则插入图片
      img.onload = function () {
        self.menu.hidePayload();
        self.menu.cancelActive();
        self.editor.cmd.exec('insertImage', imgUrl);
        self.clear();
      };
      // 图片加载失败
      img.onerror = function () {
        self.menu.hidePayload();
        self.menu.cancelActive();
        self.clear();
        self.editor.message('error', '加载图片失败!');
      };
      self.menu.hidePayload();
      self.menu.cancelActive();
    }
  }, editor);
  let payload = new Payload({
    title: '添加图片',
    body: body,
    foot: button.getElem()
  }, this.editor);
  
  this.menu = new Menu({
    iconClass: 'bdfint-editor-icon-img',
    payload,
    onclick () {
      setTimeout(() => {
        self.focusInput();
      }, 10);
    }
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Img.prototype = {
  constructor: Img,
  active () {
    this.menu.active();
  },
  clear () {
    this._el.find('.bdfint-editor-img-input').val('');
  },
  focusInput () {
    this._el.find('.bdfint-editor-img-input')[0].focus();
  }
};

inherits(Img, Component);

function handleClick() {
  this.focusInput();
  // this.menu.toggleActive();
}