import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from '../Menu';
import Payload from '../Payload';
import Button from "../Button";
import Select from "../Select";
import $ from '../../utils/dom';

export default function Graffiti(editor) {
  this.template = `<div class="bdfint-editor-graffiti-component"></div>`;
  this.mousedown = false;
  this.canvasCtx = null;
  Component.call(this, editor);
  const self = this;
  const fontWeightSelect = new Select(editor, '画笔粗细', [{
    name: '<div style="height: 2px;background-color: #555; width: 50%;"></div>',
    value: '2'
  }, {
    name: '<div style="height: 4px;background-color: #555; width: 50%;"></div>',
    value: '4'
  }, {
    name: '<div style="height: 6px;background-color: #555; width: 50%;"></div>',
    value: '6'
  }, {
    name: '<div style="height: 8px;background-color: #555; width: 50%;"></div>',
    value: '8'
  }, {
    name: '<div style="height: 10px;background-color: #555; width: 50%;"></div>',
    value: '10'
  }], handleFontWeightChange);
  
  const fontColorSelect = new Select(editor, '画笔颜色', [{
    name: '<div style="height: 10px;background-color: #000000; width: 50%;"></div>',
    value: '#000000'
  }, {
    name: '<div style="height: 10px;background-color: #c00000; width: 50%;"></div>',
    value: '#c00000'
  }, {
    name: '<div style="height: 10px;background-color: #ffff00; width: 50%;"></div>',
    value: '#ffff00'
  }, {
    name: '<div style="height: 10px;background-color: #ffc000; width: 50%;"></div>',
    value: '#ffc000'
  }, {
    name: '<div style="height: 10px;background-color: #00b050; width: 50%;"></div>',
    value: '#00b050'
  }, {
    name: '<div style="height: 10px;background-color: #0070c0; width: 50%;"></div>',
    value: '#0070c0'
  }, {
    name: '<div style="height: 10px;background-color: #7030a0; width: 50%;"></div>',
    value: '#7030a0'
  }, {
    name: '<div style="height: 10px;background-color: #9bbb59; width: 50%;"></div>',
    value: '#9bbb59'
  }], handleFontColorChange);

  function handleFontWeightChange (v) {
    self.canvasCtx.lineWidth = +v;
  }

  function handleFontColorChange (v) {
    self.canvasCtx.strokeStyle = v;
  }

  let body = $(`<div>
      <div class="bdfint-editor-graffiti-tool"></div>
      <div class="bdfint-editor-graffiti-canvas-wrapper"></div>
    </div>`);

  fontWeightSelect.mountTo(body.find('.bdfint-editor-graffiti-tool')[0]);
  fontColorSelect.mountTo(body.find('.bdfint-editor-graffiti-tool')[0]);
  // body.find('#bdfintEditorCtxLineWidth').on('change', (e) => {
  //   console.log(e.target.value);
  //   this.canvasCtx.lineWidth = +e.target.value;
  // });
  // body.find('#bdfintEditorCtxStrokeStyle').on('change', (e) => {
  //   console.log(e.target.value);
  //   this.canvasCtx.strokeStyle = e.target.value;
  // });
  document.addEventListener('mouseup', () => {
    this.mousedown = false;
  });
  let button = new Button({
    text: '插入',
    type: 'default',
    onClick (e) {
      let imgData = self.getImgData();
      e.stopPropagation();
      self.editor.cmd.exec('insertGraffiti', imgData);
      self.clear();
      self.menu.hidePayload();
      self.menu.cancelActive();
    }
  }, editor);
  let payload = new Payload({
    title: '插入涂鸦',
    body: body,
    foot: button.getElem()
  }, this.editor);
  this.menu = new Menu({
    activeTags: [],
    iconClass: 'bdfint-editor-icon-graffiti',
    triggerEvent: 'click',
    payload: payload,
    onClick (e) {
      self.initCanvas();
    }
  }, this.editor);
  this.childComponents = [this.menu];
}

Graffiti.prototype = {
  constructor: Graffiti,
  initCanvas () {
    let wrapper = this._el.find('.bdfint-editor-graffiti-canvas-wrapper');
    wrapper.html('<canvas width="360" height="300"></canvas>');
    this.canvasCtx = wrapper.find('canvas')[0].getContext('2d');
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = '#555555';
    this.canvasCtx.lineCap = 'round';
    this.canvasCtx.lineJoin = 'round';
    wrapper.on('mousedown', (e) => {
      this.mousedown = true;
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(e.offsetX, e.offsetY);
    });
    wrapper.on('mouseup', (e) => {
      this.mousedown = false;
    });
    wrapper.on('mousemove', (e) => {
      if (this.mousedown) {
        this.canvasCtx.lineTo(e.offsetX || 0, e.offsetY || 0);
        this.canvasCtx.stroke();
      }
    });
    wrapper.on('mouseenter', (e) => {
      if (this.mousedown) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(e.offsetX, e.offsetY);
      }
    });
    wrapper.on('mouseleave', (e) => {
      // this.canvasCtx.closePath();
    });
  },
  getImgData () {
    return this._el.find('.bdfint-editor-graffiti-canvas-wrapper').find('canvas')[0].toDataURL('image/png', 1);
  },
  clear () {
  
  }
};

inherits(Graffiti, Component);
