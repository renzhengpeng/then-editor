/**
 * 门面模式，封装原生Range，清除差异, 统一使用方式
 * @param selection
 * @constructor
 */
// todo
function RangeProxy(selection) {
  this.selection = selection;
  this._nativeRange = this.selection.getRange();
}

RangeProxy.prototype = {
  constructor: RangeProxy,
  cache (selection) {
    this._nativeSelection = selection;
    this._nativeRange = this._nativeSelection.rangeCount ? this._nativeSelection.getRangeAt(0) : null;
    for (let key in this._nativeRange) {
      if (this._nativeRange.hasOwnProperty(key)) {
        this[key] = this._nativeRange[key];
      }
    }
  },
  setStart () {
  
  },
  setEnd () {
  
  },
  deleteContents () {
  
  },
  selectNode () {
  
  },
  insertNode () {
  
  }
};

export default RangeProxy;
