import RangeProxy from '../range';
import $ from "../utils/dom";

function Selection (editor) {
  this.editor = editor;
  this.ctrl = false;
  this._nativeSelection = window.getSelection();
  this._currentRange = this._nativeSelection.rangeCount ? this._nativeSelection.getRangeAt(0) : null;
  // 封装的range,todo
  this.range = new RangeProxy(this);
}

Selection.prototype = {
  constructor: Selection,
  
  // 暂不支持多个range,默认编辑器只会有一个range
  getRange () {
    return this._currentRange;
  },
  pressCtrl () {
    this.ctrl = true;
  },
  
  /**
   * 保存range
   * @param range
   */
  saveRange (range) {
    let _sel = window.getSelection();
    let _range = _sel.getRangeAt(0);
    this._currentRange = range || _range;
    this._nativeSelection = _sel;
  },
  
  /**
   * 恢复选区
   */
  resumeSelection () {
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(this._currentRange);
  },
  
  /**
   * 将光标定位到某个元素内
   * @param node
   * @param toStart
   */
  positionCaretIn (node, toStart) {
    if (!(node instanceof HTMLElement)) throw new Error('positionCaretIn的第一个参数必须是HTMLElement');
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.selectAllChildren(node);
    toStart ? sel.collapseToStart() : sel.collapseToEnd();
  },
  
  /**
   * 创建空元素并将光标定位到该空元素内
   * @param tag
   */
  createEmptyElementRange (tag) {
    if (!tag || typeof tag !== 'string') {
      throw new Error('createEmptyElementRange的参数必须是有效的标签，如"p"');
    }
    let range = this._currentRange;
    let b = $(`<${tag}>&#8203;</${tag}>`);
    range.insertNode(b[0]);
    range.selectNodeContents(b[0]);
    range.collapse(false);
  },
  
  /**
   * 获取当前selection的focusNode
   * @returns { HTMLElement }
   */
  getFocusNode () {
    let sel = window.getSelection();
    return sel.focusNode.nodeType === 1 ? sel.focusNode : sel.focusNode.parentNode;
    // return this._currentRange.commonAncestorContainer.nodeType === 1 ? this._currentRange.commonAncestorContainer : this._currentRange.commonAncestorContainer.parentNode;
  },
  selectAllContent () {
  
  },
  
  /**
   * 判断选区类型是否是range
   * @returns {boolean}
   */
  isRange () {
    return !this.isCaret();
  },
  
  /**
   * 判断选区类型是否是光标
   * @returns {boolean}
   */
  isCaret () {
    const range = this._currentRange;
    if (range && range.startContainer && range.endContainer) {
      if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
        return true
      }
    }
    return false;
  }
};

export default Selection;
