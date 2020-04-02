import inherits from "../../utils/inherits";
import Component from "../Component";
import $ from "../../utils/dom";

document.addEventListener('click', () => {
  hideAllSelect();
});

function hideAllSelect () {
  $(document.querySelectorAll('.bdfint-editor-select-droplist')).each(item => { 
    $(item).removeClass('show'); 
    $(item).addClass('hide'); 
  });
}

function hideOtherSelectExcept (except) {
  $(document.querySelectorAll('.bdfint-editor-select-droplist')).each(item => { 
    if (item !== except) {
      $(item).removeClass('show'); 
      $(item).addClass('hide'); 
    }
  });
}

export default function Select(editor, label, options, onChange) {
  let optionsList = options.map(item => `<li data-value="${item.value}">${item.name}</li>`).join('');
  this.visible = false;
  this.onChange = onChange;
  this.template = `<div class="bdfint-editor-select">
    <div class="bdfint-editor-select-label">${label}</div>
    <div class="bdfint-editor-select-main">
      <div class="bdfint-editor-select-placeholder">请选择</div>
      <div class="bdfint-editor-select-selected-option"></div>
      <div class="bdfint-editor-select-arrow"></div>
      <ul class="bdfint-editor-select-droplist">${optionsList}</ul>
  </div>
  </div>`;
  Component.call(this, editor);
  const self = this;
  this._el.on('click', (e) => {
    e.stopPropagation();
    
    hideOtherSelectExcept(this._el.find('.bdfint-editor-select-droplist')[0]);
    if (!this.visible || this._el.find('.bdfint-editor-select-droplist').containsClass('hide')) {
      self.show();
    } else {
      self.hide();
    }
    if (e.target.tagName === 'LI') {
      let value = e.target.getAttribute('data-value');
      let name = e.target.innerHTML;
      this.select(name, value);
    }
    
    if (e.target.parentNode.tagName === 'LI') {
      let value = e.target.parentNode.getAttribute('data-value');
      let name = e.target.parentNode.innerHTML;
      this.select(name, value);
    }
  });
}

Select.prototype = {
  constructor: Select,
  show () {
    this.visible = true;
    this._el.find('ul').removeClass('hide');
    this._el.find('ul').addClass('show');
  },
  hide () {
    this.visible = false;
    this._el.find('ul').removeClass('show');
    this._el.find('ul').addClass('hide');
  },
  select (name, value) {
    this.onChange && this.onChange(value);
    this._el.find('.bdfint-editor-select-placeholder').hide();
    this._el.find('.bdfint-editor-select-selected-option').html(name).show().css({
      display: 'flex'
    });
  }
};  

inherits(Select, Component);