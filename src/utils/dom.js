import getBrowserType from './getBrowserType';

let browserType = getBrowserType();

/**
 * 创建文档片段
 * @returns {DocumentFragment}
 */
function createFragment() {
  return document.createDocumentFragment();
}

/**
 * 创建dom元素
 * @param selector
 * @returns HTMLElement
 */
function createElement(selector) {
  if (/^\w$/.test(selector)) {
    return document.createElement(selector);
  } else if (/^</.test(selector)) {
    let dom = document.createElement('div');
    dom.innerHTML = selector;
    return dom.children;
  } else {
    return document.querySelectorAll(selector);
  }
}

/**
 * 抽象DOM类,封装底层DOM操作
 * @param selector
 * @returns {AbstractDom}
 * @constructor
 */
function AbstractDom(selector) {
  this.length = 0;
  if (!selector) {
    return;
  }
  if (selector instanceof AbstractDom) {
    return selector;
  }
  let result = [];
  if (typeof selector === 'string') {
    let _r = createElement(selector);
    if (_r instanceof NodeList || _r instanceof HTMLCollection) {
      result = _r;
    } else {
      result = [_r];
    }
  }
  if (selector instanceof HTMLElement || selector instanceof DocumentFragment) {
    result = [selector];
  }
  if (selector instanceof HTMLCollection || selector instanceof Array || selector instanceof NodeList) {
    result = selector;
  }
  [].slice.call(result, 0).forEach((item, i) => {
    this[i] = item;
    item.classList || (item.classList = new ClassList(item));
  });
  this.length = result.length;
}

/**
 * polyfill classList 在不支持classList的浏览器中使用自定义的classList，并实现对应的方法
 * @param dom
 * @constructor
 */
function ClassList(dom) {
  this._el = dom;
  this.items = this._el.className ? this._el.className.match(/\w+(?=\s+)/g) : [];
}

ClassList.prototype = {
  constructor: ClassList,
  setClass () {
    this._el.className = this.items.join(' ');
  },
  add (className) {
    this.items.push(className);
    this.setClass();
  },
  remove (className) {
    this.items.splice(this.items.indexOf(className), 1);
    this.setClass();
  },
  contains (className) {
    return this.items.indexOf(className) !== -1;
  },
  item (index) {
    return this.items[index];
  }
};

// 重写AbstractDom.prototype
AbstractDom.prototype = {
  constructor: AbstractDom,
  /**
   * 获取对应索引的dom元素
   * @param index {number} 索引
   * @returns {*}
   */
  get (index) {
    return $(this[index]);
  },
  attr (attr, value) {
    this.each((dom) => {
      dom.setAttribute(attr, value);
    });
  },
  /**
   * 设置/获取innerHTML
   * @param html
   * @returns {*|string}
   */
  html (html) {
    return html ? this.each(item => item.innerHTML = html) : this[0].innerHTML;
  },
  /**
   * 设置/获取innerText
   * @param text
   * @returns {*|string}
   */
  text (text) {
    return text ? this.each(item => item.innerText = text) : this[0].innerText;
  },
  /**
   * 设置获取value
   * @param v
   * @returns {*}
   */
  val (v) {
    return v === undefined ? this[0].value : this.each(item => item.value = v);
  },
  /**
   * 元素是否为空
   * @returns {Boolean}
   */
  isEmpty () {
    if (!(this[0].innerHTML)) {
      return true;
    }
    if (/^\s*<br>(<\/br>)?\s*?$/.test(this[0].innerHTML)) {
      return true;
    }
    if (!/\w/.test(this[0].innerHTML)) {
      return true;
    }
    if (this[0].childNodes.length === 1 && this[0].childNodes[0].nodeType === 1) {
      return $(this[0].childNodes[0]).isEmpty();
    }
    return false;
  },
  /**
   * 将光标放置在元素内部的开始或末尾
   * @param toStart
   */
  focus (toStart = false) {
    let sel = window.getSelection();
    // removeAllRanges在IE中执行时range对应的内容必须在文档中，否则会报错
    sel.removeAllRanges();
    sel.selectAllChildren(this[0]);
    toStart ? sel.collapseToStart() : sel.collapseToEnd();
    return this;
  },
  /**
   * 添加dom节点
   * @param dom {HTMLElement | AbstractDom | HTMLCollection | DocumentFragment}
   */
  append (dom) {
    if (dom instanceof AbstractDom) {
      this.each((parent, i, context) => {
        dom.each((child) => {
          parent.appendChild(child);
        });
      });
    } else if (dom instanceof HTMLElement || dom instanceof HTMLCollection || dom instanceof DocumentFragment) {
      this.each((parent, i, context) => {
        parent.appendChild(dom);
      });
    }
    return this;
  },
  /**
   * 移除dom节点
   * @param dom
   */
  remove (dom) {
    if (dom) {
      dom.parentNode.removeChild(dom);
    } else {
      this.each(item => {
        item.remove ? item.remove() : item.parentNode.removeChild(item);
      });
    }
    return this;
  },
  /**
   * 用给定的元素替换自身
   * @param selector
   */
  replaceBy (selector) {
    $(selector).insertBefore(this[0]);
    this.remove();
  },
  /**
   * 添加class
   * @param className {string}
   */
  addClass (className) {
    for (let i = 0; i < this.length; i++) {
      this[i].classList.add(className);
    }
    return this;
  },
  /**
   * 移除class
   * @param className {string}
   */
  removeClass (className) {
    for (let i = 0; i < this.length; i++) {
      this[i].classList.remove(className);
    }
    return this;
  },
  /**
   * 是否包含某个class
   * @param className {string}
   * @returns {boolean}
   */
  containsClass (className) {
    if (this.length === 0) {
      return false;
    }
    if (this.length === 1) {
      return this[0].classList.contains(className);
    }
    if (this.length > 1) {
      let result = true;
      for (let i = 0; i < this.length; i++) {
        if (!(this[i].classList.contains(className))) {
          result = false;
          break;
        }
      }
      return result;
    }
  },
  /**
   * 获取对应索引的class
   * @param index {number}
   * @returns {*}
   */
  classItem (index) {
    if (this.length === 0) {
      return null;
    }
    if (this.length === 1) {
      return this.classList.item(index);
    }
    if (this.length > 1) {
      let list = [];
      this.each((dom, i) => {
        list.push(dom.classList.item(index));
      });
      return list;
    }
  },
  /**
   * 查找后代元素
   * @param selector
   * @returns {AbstractDom}
   */
  find (selector) {
    const dom = this[0];
    return $(dom.querySelectorAll(selector));
  },
  /**
   * 展示
   */
  show () {
    this.each(item => {
      item.style.display = 'block';
    });
    return this;
  },
  /**
   * 隐藏
   */
  hide () {
    this.each(item => {
      item.style.display = 'none';
    });
    return this;
  },
  /**
   * 设置css
   */
  css (cssObj) {
    this.each(item => {
      Object.keys(cssObj).forEach(key => {
        item.style[key] = cssObj[key];
      });
    });
    return this;
  },
  /**
   * 获取父节点
   * @returns {HTMLElement}
   */
  parent (tagName) {
    return tagName === undefined ? this[0].parentNode : this[0].parentNode.tagName.toLowerCase() === tagName.toLowerCase() ? this[0].parentNode : $(this.parent()).parent(tagName);
  },
  /**
   * 获取子节点
   */
  children () {
    return this[0].children;
  },
  first () {
    return this.get(0);
  },
  firstChild () {
    return this[0].firstElementChild;
  },
  lastChild () {
    return this[0].lastElementChild;
  },
  last () {
    return this.get(this.length - 1);
  },
  on (event, fn, stopPropagation, preventDefault) {
    this.each((dom) => {
      dom.addEventListener(event, (e) => {
        e = e || window.event;
        e.stopPropagation = e.stopPropagation || function () {
          e.cancelBubble = true;
        };
        fn.call(this, e);
        stopPropagation && e.stopPropagation();
        if (preventDefault) {
          e.preventDefault && e.preventDefault();
          if (browserType === 'IE') {
            e.returnValue = false;
            return false;
          } else {
            e.preventDefault();
          }
        }
      });
    });
    return this;
  },
  off () {
    return this;
  },
  /**
   * 遍历每个元素
   * @param fn
   * @returns {AbstractDom}
   */
  each (fn) {
    if (this.length >= 1) {
      [].slice.call(this, 0).forEach((item, i) => {
        fn(this[i], i, this);
      });
    }
    return this;
  },
  /**
   * 将元素插入到指定的元素前面
   * @param selector
   */
  insertBefore (selector) {
    let _selector = $(selector);
    let parent = _selector.parent();
    parent.insertBefore(this[0], _selector[0]);
    return this;
  },
  /**
   * 将元素插入到指定的元素后面
   * @param selector
   */
  insertAfter (selector) {
    if (!selector) {
      return;
    }
    let parent = $(selector).parent();
    if (parent.lastElementChild === selector) {
      this.each(item => parent.appendChild(item));
    } else {
      this.each(item => selector.parentNode.insertBefore(item, selector.nextElementSibling));
    }

    return this;
  },
  /**
   * 元素是否包含在给定的标签内
   * @param tagName
   * @returns {*}
   */
  isInTag(tagName) {
    if (!this[0]) {
      return false;
    }
    let node = this[0];
    if (node.className.indexOf('bdfint-editor-content') !== -1) {
      return false;
    }
    if (node.tagName === tagName || node.parentNode.tagName === tagName) {
      return true;
    } else {
      return $(this.parent()).isInTag(tagName);
    }
  },
  listen (event, cb) {
    this.each(function (dom) {
      dom.addEventListener(event, cb);
    });
  }
};

function $(selector) {
  return new AbstractDom(selector);
}

$.createFragment = createFragment;
$.createElement = createElement;

export default $;
