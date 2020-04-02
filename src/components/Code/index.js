import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from '../Menu';
import Payload from '../Payload';
import Button from "../Button";
import $ from '../../utils/dom';

export default function Code(editor) {
  this.template = `<div class="bdfint-editor-code-component" title="插入代码"></div>`;
  Component.call(this, editor);
  
  const self = this;
  let body = $(`<textarea class="bdfint-editor-code-textarea"></textarea>`);
  let button = new Button({
    text: '插入',
    type: 'default',
    onClick (e) {
      let codeText = self.getCode();
      e.stopPropagation();
      if (codeText && /[^\s]+/gm.test(codeText)) {
        self.editor.cmd.exec('insertCode', codeText);
      } else {
        self.editor.selection.resumeSelection();
      }
      self.clear();
      self.menu.hidePayload();
      self.menu.cancelActive();
    }
  }, editor);
  let payload = new Payload({
    title: '插入代码',
    body: body,
    foot: button.getElem()
  }, this.editor);
  this.menu = new Menu({
    activeTags: ['code', 'pre'],
    iconClass: 'bdfint-editor-icon-code',
    triggerEvent: 'click',
    payload: payload,
    onClick () {
      setTimeout(() => {
        body[0].focus();
      }, 0);
    }
  }, this.editor);
  this.childComponents = [this.menu];
}

Code.prototype = {
  constructor: Code,
  getCode () {
    return this._el.find('.bdfint-editor-code-textarea').val();
  },
  clear () {
    this._el.find('.bdfint-editor-code-textarea').val('');
  }
};

inherits(Code, Component);
