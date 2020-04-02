import DropList from '../DropList';
import Menu from '../Menu';
import Component from '../Component';
import inherits from '../../utils/inherits';

export default function Head(editor) {
  this.template = `<div class="bdfint-editor-head-component"></div>`;
  Component.call(this, editor);
  let dropListItems = [{
    iconClass: '',
    text: '<h1>H1<h1>',
    cmd: 'formatBlock',
    value: '<h1>'
  }, {
    iconClass: '',
    text: '<h2>H2</h2>',
    cmd: 'formatBlock',
    value: '<h2>'
  }, {
    iconClass: '',
    text: '<h3>H3</h3>',
    cmd: 'formatBlock',
    value: '<h3>'
  }, {
    iconClass: '',
    text: '<h4>H4</h4>',
    cmd: 'formatBlock',
    value: '<h4>'
  }, {
    iconClass: '',
    text: '<h5>H5</h5>',
    cmd: 'formatBlock',
    value: '<h5>'
  }, {
    iconClass: '',
    text: '<p>正文</p>',
    cmd: 'formatBlock',
    value: '<p>'
  }];
  let dropList = new DropList('添加标题', dropListItems, this.editor);
  this.menu = new Menu({
    activeTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'],
    iconClass: 'bdfint-editor-icon-heading',
    triggerEvent: 'hover',
    payload: dropList
  }, this.editor);
  this.childComponents = [this.menu];
}

inherits(Head, Component);
