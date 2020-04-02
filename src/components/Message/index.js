import inherits from "../../utils/inherits";
import Component from "../Component";

export default function Message(type, content, editor) {
  this.template = `<div class="bdfint-editor-message"></div>`;
  Component.call(this, editor);
  this._el[0].addEventListener('animationend', () => {
    this._el.remove();
  });
}

Message.prototype = {
  constructor: Message,
  show (content) {
    this._el.html(content);
  },
  
  warn (content) {
    this.show(content);
    this._el.addClass('bdfint-editor-message--warn');
  },
  warning () {
    this.warn();
  },
  info (content) {
    this.show(content);
    this._el.addClass('bdfint-editor-message--info');
  },
  error (content) {
    this.show(content);
    this._el.addClass('bdfint-editor-message--error');
  },
  success (content) {
    this.show(content);
    this._el.addClass('bdfint-editor-message--success');
  }
};

inherits(Message, Component);