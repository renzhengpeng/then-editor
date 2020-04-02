import $ from '../utils/dom';
import getBrowserType from '../utils/getBrowserType';

let browserType = getBrowserType();

function Command(editor) {
  this.editor = editor;
  if (this.editor._styleWithCSS) document.execCommand('styleWithCSS', null, true);
}

function getOutEl(focusNode) {
  if (focusNode.parentNode.classList.contains('bdfint-editor-content')) {
    return focusNode;
  } else {
    return getOutEl(focusNode.parentNode);
  }
}

Command.prototype = {
  constructor: Command,
  exec (cmd, param) {
    let range = this.editor.selection.getRange();
    let customCmd = this[cmd];
    if (!range) {
      return;
    }
    // 恢复选区
    this.editor.selection.resumeSelection();
    // 优先执行自定义指令
    if (this[cmd]) {
      customCmd.call(this, param);
    } else {
      document.execCommand(cmd, false, param);
    }
    // 需要保存一次range的原因是因为部分命令执行后会导致range的内容发生变化，
    // 比如执行bold命令后，text文本会被b或者strong包裹，这时候range会自动发生变化,
    // 必须将变化之后的range同步到_currentRange,
    // 如果不同步range，则会出现选区错误的问题
    this.editor.selection.saveRange();
    // 执行命令后再次恢复同步之后的选区
    // this.editor.selection.resumeSelection();
  },
  isSupport (cmd) {
      return document.queryCommandSupported(cmd);
  },
  insertHtml (html) {
    let range = this.editor.selection.getRange();
    if (range.insertNode) {
      range.deleteContents();
      range.insertNode($(html)[0]);
    }
  },
  
  /**
   * 加粗
   */
  // bold () {
  //   let range = this.editor.selection.getRange();
  //   let focusNode = this.editor.selection.getFocusNode();
  //   console.log(focusNode)
  //   let isCaret = this.editor.selection.isCaret();
  //   if (isCaret && focusNode.tagName !== 'STRONG' && focusNode.tagName !== 'B') { // 光标不在加粗的标签中
  //     if (getBrowserType() === 'IE') {
  //       document.execCommand('bold');
  //       this.editor.selection.saveRange();
  //       this.editor.selection.resumeSelection();
  //     } else {
  //       this.editor.selection.createEmptyElementRange('strong');
  //     }
  //   } else if (isCaret && (focusNode.tagName === 'STRONG' || focusNode.tagName === 'B')) { // 光标在加粗的标签中
  //     if (range.startOffset !== 0) {
  //       /*--------光标在加粗的字体中---------*/
  //       let leftText = focusNode.innerText.substr(0, range.startOffset);
  //       let rightText = focusNode.innerText.substr(range.startOffset, range.endOffset + 1);
  //       let wrapper = document.createElement('div');
  //       wrapper.innerHTML = range.startOffset === focusNode.innerText.length ? `<strong>${leftText}</strong>&#8203;` : `<strong>${leftText}</strong>&#8203;<strong>${rightText}</strong>`;
  //       range.selectNode(focusNode);
  //       range.deleteContents();
  //       let emptyTextNode = null;
  //       [].slice.call(wrapper.childNodes).forEach((child) => {
  //         child.nodeType === 3 && (emptyTextNode = child);
  //         range.insertNode(child);
  //         range.collapse(false);
  //       });
  //       range.selectNode(emptyTextNode);
  //       range.collapse(false);
  //     }
  //   } else {
  //     // 选区不为空
  //     document.execCommand('bold');
  //     this.editor.selection.saveRange();
  //     this.editor.selection.resumeSelection();
  //   }
  // },
  
  /**
   * 斜体
   */
  italic () {
    let range = this.editor.selection.getRange();
    let focusNode = this.editor.selection.getFocusNode();
    let isCaret = this.editor.selection.isCaret();
    if (isCaret && focusNode.tagName !== 'I' && focusNode.tagName !== 'EM') {
      if (browserType === 'IE') {
        document.execCommand('italic');
        this.editor.selection.saveRange();
        this.editor.selection.resumeSelection();
      } else {
        this.editor.selection.createEmptyElementRange('i');
      }
    } else if (isCaret && (focusNode.tagName === 'I' || focusNode.tagName === 'EM')) {
      if (range.startOffset !== 0) {
        /*--------光标在加粗的字体中---------*/
        let leftText = focusNode.innerText.substr(0, range.startOffset);
        let rightText = focusNode.innerText.substr(range.startOffset, range.endOffset + 1);
        let wrapper = document.createElement('div');
        wrapper.innerHTML = range.startOffset === focusNode.innerText.length ? `<i>${leftText}</i>&#8203;` : `<i>${leftText}</i>&#8203;<i>${rightText}</i>`;
        range.selectNode(focusNode);
        range.deleteContents();
        let emptyTextNode = null;
        [].slice.call(wrapper.childNodes).forEach((child) => {
          child.nodeType === 3 && (emptyTextNode = child);
          range.insertNode(child);
          range.collapse(false);
        });
        range.selectNode(emptyTextNode);
        range.collapse(false);
      }
    } else {
      // 选区不为空
      document.execCommand('italic');
      this.editor.selection.saveRange();
      this.editor.selection.resumeSelection();
    }
  },
  
  /**
   * 设置字体大小
   * @param size
   */
  fontSize (size) {
    let range = this.editor.selection.getRange();
    let focusNode = this.editor.selection.getFocusNode();
    let isCaret = this.editor.selection.isCaret();
    let $span = $(`<span style="font-size: ${size}">&#8203;</span>`);
    if (isCaret) {
      if (focusNode.parentNode.className.indexOf('bdfint-editor-content') === -1) {
        range.selectNode(focusNode);
        range.collapse(false);
      }
      range.insertNode($span[0]);
      $span.focus();
    } else {
      let text = range.toString();
      $span = $(`<span style="font-size: ${ size }">${ text }</span>`);
      range.deleteContents();
      range.insertNode($span[0]);
    }
  },
  
  /**
   * 设置字体
   * @param fontFamily
   */
  fontFamily (fontFamily) {
    let range = this.editor.selection.getRange();
    let focusNode = this.editor.selection.getFocusNode();
    let isCaret = this.editor.selection.isCaret();
    let $span = $(`<span style="font-family: ${ fontFamily }">&#8203;</span>`);
    if (isCaret) {
      if (focusNode.parentNode.className.indexOf('bdfint-editor-content') === -1) {
        range.selectNode(focusNode);
        range.collapse(false);
      }
      range.insertNode($span[0]);
      $span.focus();
    } else {
      let text = range.toString();
      $span = $(`<span style="font-family: ${ fontFamily }">${ text }</span>`);
      range.deleteContents();
      range.insertNode($span[0]);
    }
  },
  
  /**
   * 插入代码
   * @param code
   */
  insertCode (code) {
    let range = this.editor.selection.getRange();
    let isCaret = this.editor.selection.isCaret();
    let preElem = $(`<pre><code>${ code }</code></pre>`);
    let $p = $(`<p><br></p>`);
    let $focusNode = $(this.editor.selection.getFocusNode());
    if (isCaret) {
      if ($focusNode.isEmpty()) {
        preElem = $(`<pre><code></code></pre>`);
        preElem.find('code').text(code);
      } else {
        preElem = $(`<span class="inline-code"></span>`);
        preElem.text(code);
      }
      range.insertNode(preElem[0]);
      $focusNode.find('br')[0] && $focusNode.remove($focusNode.find('br')[0]);
      range.selectNode(preElem[0].parentNode);
      range.collapse(false);
      range.insertNode($p[0]);
      $p.focus();
    } else {
      // todo...
    }
  },
  
  /**
   * 高亮文字
   * @param color
   */
  heightLight (color) {
    let range = this.editor.selection.getRange();
    let focusNode = this.editor.selection.getFocusNode();
    let isCaret = this.editor.selection.isCaret();
    let $mark = $(`<mark style="background-color: ${ color }">&#8203;</mark>`);
    if (isCaret) {
      if (focusNode.tagName === 'MARK') {
        let startOffset = range.startOffset;
        range.selectNode(focusNode);
        let text = range.toString();
        let textElem = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(textElem);
        range.setStart(textElem, startOffset);
        range.setEnd(textElem, startOffset);
      } else {
        range.insertNode($mark[0]);
        $mark.focus();
      }
    } else {
      let fragment = range.extractContents();
      $mark.append(fragment);
      range.insertNode($mark[0]);
    }
  },
  
  /**
   * 插入有序/无序列表
   * @param ordered
   */
  insertList (ordered = false) {
    let tag = ordered ? 'ol' : 'ul';
    let range = this.editor.selection.getRange();
    let $focusNode = $(this.editor.selection.getFocusNode());
    let isCaret = this.editor.selection.isCaret();
    if (isCaret) {
      let $topElem = $(this.editor._findTopElemOfRow($focusNode[0]));
      if ($topElem.isEmpty()) {
        let $list = $(`<${tag}><li>&#8203;</li></${tag}>`);
        $topElem.replaceBy($list);
        $($list.lastChild()).focus();
      } else {
        let topElem = this.editor._findTopElemOfRow($focusNode[0]);
        let $list = $(`<${tag}><li>${ topElem.innerHTML }</li></${tag}>`);
        range.selectNode(topElem);
        range.deleteContents();
        range.insertNode($list[0]);
        // 被注释的这段代码在IE10中产生的效果不同
        // range.selectNodeContents($list[0].lastElementChild);
        // range.collapse(false);
        // 改用下面这种方式经验证可以在IE10,CHROME,FIREFOX工作
        $($list.lastChild()).focus();
      }
    } else {
      document.execCommand('insertOrderedList', false, null);
      let $focusNode = $(this.editor.selection.getFocusNode());
      let list = $focusNode[0].tagName === 'LI' ? $focusNode.parent() : $focusNode[0];
      if (list.parentNode.className.indexOf('bdfint-editor-content') !== -1) {
        return;
      }
      range.selectNode(list.parentNode);
      range.deleteContents();
      range.collapse(false);
      range.insertNode(list);
      $(list).last().focus();
    }
  },
  
  insertOrderedList () {
    this.insertList(true);
  },
  
  insertUnorderedList () {
    this.insertList(false);
  },
  
  /**
   * 创建链接
   * @param param
   */
  createLink (param) {
    let text = param.text || param.link;
    let link = param.link;
    let range = this.editor.selection.getRange();
    text = range.toString() || text;
  
    link = link.trim();
    if (!/^http:\/\//.test(link)) link = '//' + link;
    let $linkElem = $(`<a href="${ link }" target="_blank">${ text }</a>`);
    range.deleteContents();
    range.insertNode($linkElem[0]);
    range.selectNode($linkElem[0]);
    range.collapse(false);
  },
  
  /**
   * 添加&清除引用
   */
  blockquote () {
    let range = this.editor.selection.getRange();
    // let $focusNode = $(range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentNode);
    let $focusNode = $(this.editor.selection.getFocusNode());
    let isInBlockquote = $focusNode.isInTag('BLOCKQUOTE');
    if (isInBlockquote) { // 当光标处于blockquote标签内时
      let blockquote = $focusNode.parent('blockquote');
      let innerHTML = blockquote.innerHTML;
      let $newElem = $(innerHTML);
      range.selectNode(blockquote);
      range.deleteContents();
      range.collapse(false);
      $newElem.each((el, index) => {
        range.insertNode(el);
        range.selectNode(el);
        range.collapse(false);
        // 将光标置于最后一个元素内
        if ($newElem.length === index + 1) {
          $(el).focus();
        }
      });
    } else { // 当光标不在blockquote标签内时
      if ($focusNode.isEmpty()) { // 光标所在的元素为空时
        let $quote = $(`<blockquote></blockquote>`);
        let $p = $(`<p>&#8203;</p>`);
      
        $quote.append($p);
        range.selectNode($focusNode[0]);
        range.collapse(false);
        this.editor.selection.getRange().insertNode($quote[0]);
        this.editor.selection.positionCaretIn($p[0], true);
        $focusNode.remove();
      } else { // 光标所在的元素不为空时
        let $quote = $(`<blockquote></blockquote>`);
        let $outEl = $(getOutEl($focusNode[0]));
        let _range = document.createRange();
        _range.selectNode($outEl[0]);
        _range.surroundContents($quote[0]);
        $($quote.lastChild()).focus();
      }
    }
  },
  
  /**
   * 插入表格
   * @param param
   */
  insertTable (param) {
    let {cols, rows} = param;
    if (!cols || !rows) return;
    let $focusNode = $(this.editor.selection.getFocusNode());
    // 在table内部不能再插入table
    if ($focusNode.isInTag('TABLE')) return;
    
    let range = this.editor.selection.getRange();
    let th = `<th contenteditable="true">&#8203;</th>`;
    let td = `<td contenteditable="true">&#8203;</td>`;
    for (let i = 1; i < cols; i++) {
      td += `<td contenteditable="true">&#8203;</td>`;
      th += `<th contenteditable="true">&#8203;</th>`;
    }
    let tr = `<tr>${ th }</tr>`;
    for (let j = 1; j < rows; j++) {
      tr += `<tr>${ td }</tr>`;
    }
    let closeBtn = $(`<div class="bdfint-editor-table-delete-btn"></div>`);
    // 使用figure根据语义，并且可以使得tab键进入下一个单元格
    let $figure = $(`<figure contenteditable="${ browserType === 'IE' ? 'true' : 'false' }"><table><tbody>${ tr }</tbody></table></figure>`);
    let $p = $('<p>&#8203;</p>');
  
    // 绑定事件监听器
    $figure.on('mouseenter', (e) => {
      $figure.append(closeBtn);
    });
    $figure.on('mouseleave', (e) => {
      closeBtn.remove();
    });
    // 删除table
    closeBtn.on('click', () => {
      range.selectNode($figure[0]);
      range.deleteContents();
      range.insertNode($p[0]);
      $p.focus();
    });
    
    if ($focusNode.isEmpty()) { // 空行则用table替换该行元素
      range.selectNode($focusNode[0]);
    } else { // 不是空行则换行插入表格
      range.selectNode($focusNode[0]);
      range.collapse(false);
    }
    range.insertNode($figure[0]);
    // 默认聚焦第一个单元格
    $($figure.find('th')[0]).focus();
  },
  /**
   * 插入图片
   * @param url
   */
  insertImage (url) {
    let $focusNode = $(this.editor.selection.getFocusNode());
    let range = this.editor.selection.getRange();
    let $figure = $(`<figure contenteditable="false" style="text-align: center;position: relative;">
                       <img src="${ url }">
                       <figcaption contenteditable="true" style="padding: 5px;color: #555555;font-size: 12px;">&#8203;</figcaption>
                     </figure>`);
    let closeBtn = $(`<div class="bdfint-editor-table-delete-btn"></div>`);
    let $p = $('<p>&#8203;</p>');
    // 绑定事件监听器
    $figure.on('mouseenter', (e) => {
      $figure.append(closeBtn);
      $figure.addClass('bdfint-editor-figure-hover');
    });
    $figure.on('mouseleave', (e) => {
      closeBtn.remove();
      $figure.removeClass('bdfint-editor-figure-hover');
    });
    // 删除table
    closeBtn.on('click', () => {
      range.selectNode($figure[0]);
      range.deleteContents();
      range.insertNode($p[0]);
      $p.focus();
    });
    range.selectNode(this.editor._findTopElemOfRow($focusNode[0]));
    range.collapse(false);
    range.insertNode($figure[0]);
    range.collapse(false);
    range.selectNodeContents($figure.find('figcaption')[0]);
    $figure.find('figcaption').focus();
  },
  
  /**
   * 插入视频
   * @param url
   */
  insertVideo (url) {
    let $focusNode = $(this.editor.selection.getFocusNode());
    let range = this.editor.selection.getRange();
    let $iframe = $(`<iframe src="${url}"></iframe>`);
    let $newLine = $(`<p><br></p>`);
    range.insertNode($iframe[0]);
    range.collapse(false);
    range.selectNode(this.editor._findTopElemOfRow($focusNode[0]));
    range.collapse(false);
    range.insertNode($newLine[0]);
    $newLine.focus(true);
  },
  
  /**
   * 纯文本粘贴
   * @param text
   */
  paste (text) {
    let range = this.editor.selection.getRange();
    let textNode = document.createTextNode(text);
    // $newLine.text(text);
    // $newLine.append($('<br>'));
    range.deleteContents();
    range.insertNode(textNode);
    $(textNode.parentNode).focus();
  },
  
  /**
   *  插入涂鸦
   * @param data
   */
  insertGraffiti (data) {
    this.insertImage(data);
  }
};

export default Command;