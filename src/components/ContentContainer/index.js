import Component from '../Component';
import $ from '../../utils/dom';
import upload from '../../utils/upload';
import inherits from '../../utils/inherits';

export default function ContentContainer(editor) {
  // html
  this.template = `<div class="bdfint-editor-container">
    <div class="bdfint-editor-content" contenteditable="true">
      <p>&#8203;</p>
    </div>
  </div>`;
  // 继承实例属性
  Component.call(this, editor);
  
  // 绑定事件处理
  this.on('keyup', handleKeyUp);
  this.on('keydown', handleKeyDown);
  this.on('mouseup', handleMouseUp);
  this.on('click', handleClick);
  this._handleDrop();
  this._handlePaste();
}

// 重写原型
ContentContainer.prototype = {
  constructor: ContentContainer,
  replaceDomByP($dom) {
    let $p = $('<p>&#8203;</p>');
    $dom.replaceBy($p);
    $p.focus(true);
  },
  _disable () {
    this._el.find('.bdfint-editor-content').attr('contenteditable', 'false');
  },
  _handleDrop () {
    this._el.find('.bdfint-editor-content').on('drop', (e) => {
      let files = e.dataTransfer.files;
      Array.prototype.slice.call(files, 0).forEach(file => {
        // 只处理图片文件
        if (!/^image\//.test(file.type)) {
          this.editor.message('warn', '只能上传图片');
          return;
        }
        
        upload(file, this.editor).then((res) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.editor.cmd.exec('insertImage', reader.result);
          };
        });
      });
      window.event && (window.event.returnValue = false);
      return false;
      // todo...
    }, true, true);
  },
  
  _handlePaste () {
    this._el.find('.bdfint-editor-content').on('paste', (e) => {
      e.preventDefault();
      let text = '';
      if (window.clipboardData && clipboardData.getData) {
        text = window.clipboardData.getData('text') || '';
      } else {
        text = (e.originalEvent || e).clipboardData.getData('text/plain') || '';
      }
      text && this.editor.cmd.exec('paste', text);
    });
  }
};

inherits(ContentContainer, Component);

/**
 * 处理点击事件
 * @param e
 */
function handleMouseUp(e) {
  // 编辑内容时要不断的保存最新的选区到缓存中，以便在失去选区之后能恢复选区
  setTimeout(() => {
    this.editor.selection.saveRange();
  
    // 改变工具栏菜单状态
    this.editor.toolbar.changeMenusActive();
  }, 0);
}

function handleClick(e) {

}

/**
 * 处理keyup事件
 * @param e
 */
function handleKeyUp(e) {
  // 处理enter
  if (e.keyCode === 13) {
    // 处理新产生的行
    handleNewLine.call(this, e);
  }
  if (e.keyCode === 8) {
    if (this.editor.isEmpty()) {
      this.editor._initContent();
      this.editor._initSelection();
    }
  }
  
  // 编辑内容时要不断的保存最新的选区到缓存中，以便在失去选区之后能恢复选区
  setTimeout(() => {
    this.editor.selection.saveRange();
    // 改变工具栏菜单状态
    this.editor.toolbar.changeMenusActive();
  }, 0);
}

/**
 * 处理keydown事件
 * @param e
 */
function handleKeyDown(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  // 当按下backspace时
  if (e.keyCode === 8) {
    // 如果内容区域为空，则不能继续删除
    if (this.editor.isEmpty()) {
      e.preventDefault();
    } else {
      handleDeleteInLi.call(this, e);
      // if ($focusNode.isEmpty() &&
      //   !($focusNode[0].previousElementSibling) &&
      //   $focusNode[0].nextElementSibling) { // 如果dom元素内容为空并且处于编辑区的第一个元素，再按下回退按钮则删除该元素
      //   $focusNode.remove();
      // } else if ($focusNode.isEmpty() &&
      //   !($focusNode[0].previousElementSibling) &&
      //   !($focusNode[0].nextElementSibling) &&
      //   $focusNode[0].tagName.toLowerCase() !== 'p') { // 如果非P的dom元素内容为空且编辑区只剩下该元素，则将该元素替换成P元素
      //   this.replaceDomByP($focusNode);
      //   e.preventDefault();
      // }
    }
  }
  // 当按下enter键时
  if (e.keyCode === 13) {
    // 当光标处于code标签中时
    handleEnterInCode.call(this, e);
    
    // 当光标处于quote标签中时
    handleEnterInQuote.call(this, e);
    
    // 当光标处于table标签中时
    // handleEnterInTable.call(this, e);
    
    // 当光标处于figcaption标签中时
    handleEnterInFigcaption.call(this, e);
  }
}

function handleDeleteInLi(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  if ($focusNode[0].tagName !== 'LI') return;
  if ($focusNode.isEmpty() && $focusNode[0].parentNode.childElementCount === 1) {
    this.replaceDomByP($($focusNode.parent()));
  }
}

/**
 * 处理光标在code标签中时按下回车事件
 * @param e
 */
function handleEnterInCode(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  // 光标不在code标签中或者code标签是行内元素，则忽略
  if ($focusNode[0].tagName !== 'CODE' || ($focusNode[0].tagName === 'CODE' && $focusNode[0].classList.contains('inline-code'))) {
    return;
  }
  
  let range = this.editor.selection.getRange();
  // 阻止浏览器默认的换行行为
  e.preventDefault();
  // 将光标所在的code元素内的字符串分为左右两个部分
  let leftText = $focusNode[0].innerHTML.substr(0, range.startOffset);
  let rightText = $focusNode[0].innerHTML.substr(range.startOffset, range.endOffset + 1);
  // 创建容器
  let $wrapper = $('<div></div>');
  // 创建左边代码字符串的code标签
  let $leftCodeEl = $(`<code>${leftText}</code>`);
  // 创建一个空的code元素
  let $newCodeEl = $(`<code>&#8203;</code>`);
  // 创建右边代码字符串的code标签，并且将右边代码字符串的换行符清除，不然会产生两个换行的效果
  let $rightCodeEl = $(`<code>${rightText.replace('\n', '')}</code>`);
  // 如果光标处在code元素的末尾，则只插入左边的code元素以及新建的空code元素
  if (range.startOffset === $focusNode[0].innerText.length) {
    $wrapper.append($leftCodeEl[0]);
    $wrapper.append($newCodeEl[0]);
  } else { // 否则将左边的code元素、新建的code元素、右边的code元素依次插入容器
    $wrapper.append($leftCodeEl[0]);
    $wrapper.append($newCodeEl[0]);
    $wrapper.append($rightCodeEl[0]);
  }
  // 删除光标所在的code元素
  range.selectNode($focusNode[0]);
  range.deleteContents();
  // 将容器内的子节点全部插入到光标所在位置
  [].slice.call($wrapper[0].childNodes).forEach((child) => {
    range.insertNode(child);
    range.collapse(false);
  });
  // 将光标定位新建的空code元素内
  $newCodeEl.focus();
}

/**
 * 处理在blockquote元素中按下enter的情况
 * @param e
 */
function handleEnterInQuote(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  // 光标不在quote标签中，则忽略
  if ($focusNode[0].tagName !== 'BLOCKQUOTE' && !$focusNode.isInTag('BLOCKQUOTE')) {
    return;
  }
  // 光标所在的元素为空并且是最后一个元素则跳出blockquote标签重新创建一行
  if ($focusNode.isEmpty() && !$focusNode[0].nextElementSibling) {
    e.preventDefault();
    if ($focusNode[0] === $($focusNode.parent()).firstChild()) {
      this.replaceDomByP($($focusNode.parent()));
      return;
    }
    let sel = window.getSelection();
    let range = sel.getRangeAt(0);
    let $p = $(`<p>&#8203;</p>`);
    range.selectNode(this.editor._findTopElemOfRow($focusNode[0]));
    range.collapse(false);
    range.insertNode($p[0]);
    this.editor.selection.positionCaretIn($p[0], true);
    $focusNode.remove();
  }
}

// function handleEnterInTable(e) {
//   let $focusNode = $(this.editor.selection.getFocusNode());
//   // 光标不在quote标签中，则忽略
//   if ($focusNode[0].tagName !== 'TABLE') {
//     return;
//   }
//   // console.log($focusNode[0]);
// }

/**
 * 处理光标处于caption标签中按下回车键的情况
 * @param e
 */
function handleEnterInFigcaption(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  // 光标不在quote标签中，则忽略
  if ($focusNode[0].tagName !== 'FIGCAPTION') {
    return;
  }
  let range = this.editor.selection.getRange();
  // 新建空的p标签
  let $p = $('<p>&#8203;</p>');
  e.preventDefault();
  
  // 将光标定位到caption父标签外的尾部
  range.selectNode($focusNode[0].parentNode);
  range.collapse(false);
  
  // 在光标的位置插入新的空p标签
  range.insertNode($p[0]);
  
  // 将光标定位到空p标签内
  $p.focus();
}

/**
 * 处理新的一行
 * @param e
 */
function handleNewLine(e) {
  let $focusNode = $(this.editor.selection.getFocusNode());
  // 如果新的一个空行为DIV，则将其替换成p
  if ($focusNode[0].tagName === 'DIV' && $focusNode.isEmpty()) {
    this.replaceDomByP($focusNode);
    return;
  }
  if (this.editor.specialTags.indexOf($focusNode[0].tagName) <= 0 && $focusNode.isEmpty()) {
    let $specialElem = $(this.editor._findSpecialElem($focusNode[0]));
    if ($specialElem[0]) {
      $specialElem.html('&#8203;');
      $specialElem.focus();
    } else {
      let $newLineElem = $(this._findTopElemOfRow($focusNode[0]));
      let $p = $(`<p>&#8203;</p>`);
      $newLineElem.replaceBy($p);
      $p.focus();
    }
  }
}

/**
 * 节点是否包含在给定的标签内
 * @param node
 * @param tagName
 * @returns {*}
 */
// function isNodeInTag(node, tagName) {
//   if (node.className.indexOf('bdfint-editor-content') !== -1) {
//     return false;
//   }
//   if (node.tagName === tagName || node.parentNode.tagName === tagName) {
//     return true;
//   } else {
//     return isNodeInTag(node.parentNode, tagName);
//   }
// }
