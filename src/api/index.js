import $ from "../utils/dom";
import conf from '../config';

/*============== constructor api ==================*/


/*=============== instance api ====================*/
/**
 * 编辑器配置
 */
function config(option) {
  this._config.server = option.server || location.host;
  this._config.uploadPath = option.uploadPath || this._config.server;
  // 配置菜单
  if (option.menus && option.menus.length >= 1) {
    this._config.menus = option.menus;
  }
  conf.uploadPath = option.uploadPath || '';
  conf.uploadQuery = option.uploadQuery || {};
  // 钩子函数
  this._config.onFocus = function () {
    // do something else
    option.onFocus instanceof Function && option.onFocus();
  };
  this._config.onBlur = function () {
    // do something else
    option.onBlur instanceof Function && option.onBlur();
  };
  this._config.onReady = function () {
    // do something else
    option.onReady instanceof Function && option.onReady();
  };
  option.onChange instanceof Function && (this._config.onChange = (mutationsList) => {
    option.onChange.call(this, mutationsList);
  });
}

/**
 * 创建编辑器
 */
function create() {
  // 初始化菜单
  this._initMenus();
  
  // 安装子组件
  this._installChildComponents();
  
  // 挂载editor到提供的容器
  this._mount();
  
  this.created = true;
  
  // 初始化选区，将光标定位到内容部分的最后一个元素
  this._initSelection();
  
  // 观察内容区
  this._watchContent();
  
  // 监听内容编辑区DOM事件
  this._listenContentDomEvent();
  
  // 准备就绪，调用就绪钩子函数
  this._config.onReady && this._config.onReady();
  
}

/**
 * 获取编辑区内容
 * @returns {string}
 */
function getContent() {
  return this._getEditAbleEl()[0].innerHTML.replace(/contenteditable/g, '_contenteditable');
}

/**
 * 设置编辑区内容
 */
function setContent(content = '') {
  this._getEditAbleEl().html(content.replace(/_contenteditable/g, 'contenteditable'));
}

/**
 * 禁用编辑器
 */
function disable() {
  this.contentContainer._disable();
}

/**
 * 编辑区是否为空（初始化状态也被认为是空）
 * @returns {boolean}
 */
function isEmpty() {
  let $content = this._getEditAbleEl();
  if ($content[0].childElementCount === 0) {
    return true;
  }
  if ($content[0].childElementCount === 1 && $content[0].children[0].tagName === 'BR') {
    return true;
  }
  if ($content[0].childElementCount === 1 && $content.firstChild().tagName === 'P' && $($content.firstChild()).isEmpty()) {
    return true;
  }
  return false;
}

/**
 * 清除编辑区内容
 */
function clearContent() {
  let content = this._getEditAbleEl();
  content.html('<p>&#8203;</p>');
  this._initSelection();
}

export default {
  config,
  setContent,
  getContent,
  create,
  disable,
  // destroy,
  isEmpty,
  clearContent
};
