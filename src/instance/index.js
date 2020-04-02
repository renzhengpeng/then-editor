import $ from '../utils/dom';
import Command from '../command';
import Selection from '../Selection';
import Component from '../components/Component';
import Toolbar from '../components/Toolbar';
import ContentContainer from '../components/ContentContainer';
import Message from '../components/Message';
import config from '../config';

import apis from '../api';

/**
 * 编辑器构造函数
 * @param option
 * @constructor
 */
function BdfintEditor(option) {
  if (!(this instanceof BdfintEditor)) {
    throw new Error('请通过new关键字来调用BdfintEditor');
  }
  if (!option) {
    throw new Error('BdfintEditor未传入任何参数');
  }
  this._styleWithCSS = option.styleWithCSS || false;
  this.id = `BdfintEditor-${id++}`; // id
  this._option = option;
  this._parent = null; // 父组件
  this.$container = $(option.el)[0]; // 父dom
  this.created = false; // 是否已创建编辑器
  this.template = `<div class="bdfint-editor" id="${this.id}"></div>`; // html片段
  this._el = $(this.template); // 封装的dom对象
  this._components = []; // 未安装子组件前为空
  this.cmd = new Command(this); // 封装的命令对象
  this.selection = new Selection(this); // 封装的选区对象
  // 菜单栏
  this.toolbar = new Toolbar(this);
  // 内容区容器
  this.contentContainer = new ContentContainer(this);
  // this.message = new Message();
  this.childComponents = [this.toolbar, this.contentContainer]; // 申明子组件,子组件会在调用create方法时进行安装
  // 需要特殊处理的标签
  this.specialTags = ['P', 'CODE', 'LI'];
  this._config = {};
  this.menu = {};
  // 消息组件
  this._messageComponent = new Message();
}

// BdfintEditor.config = config;

let id = 1; // 编辑器实例ID
BdfintEditor.prototype = {
  constructor: BdfintEditor,
  ...apis,
  /**
   * 初始化菜单
   * @private
   */
  _initMenus () {
    this.toolbar.childComponents = config.menus.filter(menu => {
      return this._config.menus && this._config.menus.length >= 1 ? this._config.menus.indexOf(menu.name) !== -1 : true;
    }).map(menu => {
        let Ctor = menu.component;
        let c = new Ctor(this);
        this.menu[menu.name] = c;
        return c;
    });
  },
  /**
   * 安装子组件
   * @param components
   * @private
   */
  _installChildComponents: Component.prototype._installChildComponents,
  /**
   * 挂载自身dom到提供的父元素
   * @param parentNode
   * @private
   */
  _mount (parentNode) {
    let container = parentNode || this.$container || $(this._option.el);
    $(container).append(this._el);
  },
  /**
   * 获取可编辑内容区域元素
   * @returns {*|AbstractDom|number|T}
   * @private
   */
  _getEditAbleEl () {
    return this._el.find('.bdfint-editor-content');
  },
  /**
   * 递归指定的元素父节点，找到该元素所在行的顶级元素
   * @param node
   * @returns {*}
   * @private
   */
  _findTopElemOfRow (node) {
    if (node.parentNode.className.indexOf('bdfint-editor-content') !== -1) {
      return node;
    } else {
      return this._findTopElemOfRow(node.parentNode);
    }
  },
  /**
   * 递归父节点找到特殊元素
   * @param node
   * @returns {*}
   * @private
   */
  _findSpecialElem (node) {
    if (!node || node.className.indexOf('bdfint-editor-content') !== -1) {
      return false;
    }
    if (this.specialTags.indexOf(node.tagName) >= 0) {
      return node;
    } else {
      return this._findSpecialElem(node.parentNode);
    }
  },
  /**
   * 初始化内容区域
   * @private
   */
  _initContent () {
    let $content = this._getEditAbleEl();
    if ($content.isEmpty()) {
      $content.html('<p></p>'); // p标签内没有br标签是因为IE会生成两个P标签
    }
  },
  /**
   * 初始化选区，定位光标到末尾
   * @private
   */
  _initSelection () {
    let $content = this._getEditAbleEl();
    let lastElem = $content.lastChild();
    this.selection.positionCaretIn(lastElem, false);
    this.selection.saveRange();
  },
  /**
   * 监听内容变化
   * @private
   */
  _watchContent () {
    if (this._config.onChange) {
      if (window.MutationObserver) {
        const callback = (mutationsList) => {
          this._config.onChange(mutationsList);
        };
        const observer = new MutationObserver(callback);
        const config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(this._getEditAbleEl()[0], config);
      } else {
        // todo
        console.warn('浏览器不支持MutationObserver');
      }
    }
  },
  _listenContentDomEvent () {
    let contentDom = this._getEditAbleEl();
    contentDom.listen('focus', () => {
      console.log('get focus');
      // ...
    });
    contentDom.listen('blur', () => {
      console.log('has blur');
      // ...
    });
  },
  /**
   * 在内容区域给出四种(info, success, warn, error)消息提示
   * @param type
   * @param content
   */
  message (type, content) {
    let msg = new Message();
    this._el.append(msg._el);
    msg[type] ? msg[type](content) : msg.info(content);
  }
};

export default BdfintEditor;
