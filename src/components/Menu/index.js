import Payload from "../Payload";
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Menu(option = {}, editor) {
  if (option.payload && !(option.payload instanceof Payload)) {
    throw new Error('new Menu()的参数必须是Payload类的实例.');
  }
  this.template = `<div class="bdfint-editor-menu">
    <span class="bdfint-editor-menu-icon ${ option.iconClass }">&#8203;</span>
  </div>`;
  
  Component.call(this, editor);
  this.childComponents = option.payload ? [option.payload] : [];
  this.payload = option.payload || null;
  this.payload && (this.payload.menu = this);
  this.activeTags = option.activeTags || [];
  if (option.payload) {
    // 绑定事件处理函数
    if (option.triggerEvent === 'hover') {
      this.on('mouseenter', () => {
        this.showPayload();
      });
      this.on('mouseleave', () => {
        this.hidePayload();
      });
    } else {
      this.on('click', (e) => {
        if (option.onClick) {
          option.onClick(e);
        }
        this.editor.toolbar.childComponents.forEach(component => {
          component.menu.hidePayload();
          component.menu.cancelActive();
        });
        this.active();
        this.showPayload();
      });
    }
  }
  this.on('dbclick', (e) => {
    e.preventDefault();
  });
}

Menu.prototype = {
  constructor: Menu,
  showPayload () {
    this.payload && this.payload.show();
  },
  hidePayload () {
    this.payload && this.payload.hide();
  },
  isActive () {
    return this._el[0].classList.contains('bdfint-editor-menu--active');
  },
  toggleActive () {
    if (this.isActive()) {
      this.cancelActive();
    } else {
      this.active();
    }
  },
  changeActive (tagName = '') {
    if (this.activeTags.indexOf(tagName.toLowerCase()) !== -1) this.active();
  },
  active () {
    this._el.addClass('bdfint-editor-menu--active');
  },
  cancelActive () {
    this._el.removeClass('bdfint-editor-menu--active');
  }
};

inherits(Menu, Component);
