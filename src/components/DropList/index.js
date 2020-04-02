import Component from '../Component';
import Payload from '../Payload';
import $ from '../../utils/dom';
import inherits from '../../utils/inherits';

export default function DropList(title, items, editor) {
  this.template = `<ul class="bdfint-editor-droplist">
    <p class="bdfint-editor-droplist__title">${title}</p>
  </ul>`;
  
  Component.call(this, editor);
  this.items = items;
  let self = this;
  this._el.append($(items.map(item => {
    let $li = $(`<li class="bdfint-editor-droplist-item">${item.text}</li>>`);
    $li.on('click', (e) => {
      item.onClick && item.onClick.call(this[0]);
      self.editor.cmd.exec(item.cmd, item.value);
      // 延迟隐藏droplist，否则会在IE中造成800a025e错误
      setTimeout(() => {
        self.hide();
      }, 0);
    });
    return $li[0];
  })));
  
  this.on('click', handleClick);
}

DropList.prototype = {
  constructor: DropList,
  hide () {
    this._el.removeClass('bdfint-editor-payload-show');
    this._el.addClass('bdfint-editor-payload-hide');
  },
  show () {
    this._el.removeClass('bdfint-editor-payload-hide');
    this._el.addClass('bdfint-editor-payload-show');
  }
};

inherits(DropList, Payload);

function handleClick(e) {

}