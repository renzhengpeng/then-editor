import Component from '../Component';
import inherits from '../../utils/inherits';
import Menu from "../Menu";
import Payload from "../Payload";
import Button from "../Button";
import $ from "../../utils/dom";

export default function Table(editor) {
  this.template = '<div class="bdfint-editor-table-component"></div>';
  Component.call(this, editor);
  this.maxCols = this.maxRows = 14;
  this.currentCols = this.currentRows = 0;
  const self = this;
  let body = $(`<div class="bdfint-editor-table-body"></div>`);
  for (let i = 1; i < this.maxCols * this.maxRows + 1; i++) {
    let cell = $(`<div class="bdfint-editor-table-cell"></div>`);
    cell[0]._index = i;
    body.append(cell);
  }
  let foot = $(`<div style="text-align: center;line-height: 1;"></div>`);
  body.on('mouseover', (e) => {
    if (!e.target._index) {
      return;
    }
    let _index = e.target._index;
    let rowIndex = Math.ceil(_index / self.maxRows);
    let colIndex = _index - (rowIndex - 1) * self.maxRows;
    let allCells = body.children();
    for (let i = 0; i < allCells.length; i++) {
      let _rowIndex = Math.ceil(allCells[i]._index / self.maxRows);
      let _colIndex = allCells[i]._index - (_rowIndex - 1) * self.maxRows;
      if (_colIndex <= colIndex && _rowIndex <= rowIndex) {
        allCells[i].classList.add('bdfint-editor-selected-cell');
      } else {
        allCells[i].classList.remove('bdfint-editor-selected-cell');
      }
    }
    foot.html(rowIndex + '行' + colIndex + '列');
    self.currentCols = colIndex;
    self.currentRows = rowIndex;
  });
  body.on('click', (e) => {
    e.stopPropagation();
    this.editor.cmd.exec('insertTable', {
      cols:  self.currentCols,
      rows: self.currentRows
    });
    setTimeout(() => {
      this.menu.hidePayload();
      this.init();
    }, 17);
  });
  
  let payload = new Payload({
    title: '插入表格',
    body,
    foot
  }, this.editor);
  
  this.menu = new Menu({
    activeTags: ['table', 'th', 'td'],
    iconClass: 'bdfint-editor-icon-table',
    triggerEvent: 'hover',
    payload
  }, this.editor);
  
  // 申明子组件
  this.childComponents = [this.menu];
  
  // 绑定事件处理函数
  this.on('click', handleClick);
}

Table.prototype = {
  constructor: Table,
  active () {
    this.menu.active();
  },
  init () {
    this.currentCols = this.currentRows = 0;
    this._el.find('.bdfint-editor-selected-cell').each(item => item.classList.remove('bdfint-editor-selected-cell'));
  }
};

inherits(Table, Component);

function handleClick() {
  // todo
  // this.menu.toggleActive();
}