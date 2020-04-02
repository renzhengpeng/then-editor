import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Button(option, editor) {
  this.template = `<button class="bdfint-editor-button-component"><span>${ option.text }</span></button>`;
  Component.call(this, editor);
  this.on('click', (e) => {
    option.onClick && option.onClick.call(this, e);
  });
}

inherits(Button, Component);
