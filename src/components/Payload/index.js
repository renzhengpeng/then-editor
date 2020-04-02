import Component from '../Component';
import inherits from '../../utils/inherits';
import $ from '../../utils/dom';

function hideAllSelect () {
  $(document.querySelectorAll('.bdfint-editor-select-droplist')).each(item => { 
    $(item).removeClass('show'); 
    $(item).addClass('hide'); 
  });
}

export default function Payload(tabs = {}, editor) {
  this.template = tabs.toString() === '[object Object]' ? `<div class="bdfint-editor-payload">
    <div class="bdfint-editor-payload-head">
      <h4>${tabs.title}</h4>
      <div class="bdfint-editor-close close">×</div>
    </div>
    <div class="bdfint-editor-payload-body"></div>
    <div class="bdfint-editor-payload-foot"></div>
  </div>` : ``;
  Component.call(this, editor);
  this.on('click', (e) => {
    hideAllSelect();
    e.stopPropagation();
  });
  // let head = this._el.find('.bdfint-editor-payload-head');
  let body = this._el.find('.bdfint-editor-payload-body');
  let foot = this._el.find('.bdfint-editor-payload-foot');
  if (tabs.foot) {
    foot.append($(tabs.foot));
  } else {
    foot.hide();
  }
  if (tabs instanceof Array) {
    tabs.forEach(item => {
      // todo...
    });
  } else {
    body.append($(tabs.body));
  }
  // 点击close图标隐藏payload
  this._el.find('.close').on('click', (e) => {
    e.stopPropagation();
    this.menu.cancelActive();
    this.hide();
  });
}

Payload.prototype = {
  constructor: Payload,
  show () {
    if (!(this instanceof Payload)) {
      throw new Error('子类未实现父类(Payload)定义的show方法.');
    } else {
      this._el.removeClass('bdfint-editor-payload-hide');
      this._el.addClass('bdfint-editor-payload-show');
    }
  },
  hide () {
    if (!(this instanceof Payload)) {
      throw new Error('子类未实现父类(Payload)定义的hide方法.');
    } else {
      this._el.removeClass('bdfint-editor-payload-show');
      this._el.addClass('bdfint-editor-payload-hide');
    }
  }
};

inherits(Payload, Component);
