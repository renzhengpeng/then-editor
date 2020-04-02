#bdfint-editor

> a lightweight web rich text editor

## steps for dev

1. install dependencies
```
yarn install
```

2. run dev
```
npm run dev
```

## run example
```
npm run example
```

## example
```javascript
import BdfintEditor from 'bdfint-editor';
// import the style file at appropriate place
import 'bdfint-editor/dist/css/BdfintEditor.min.css';

const editor = new BdfintEditor({
  el: '#app' // id ro class of the container element
});

// all config items below,
// you can config the editor according to your situation
editor.config({
  // watch mutations
  onChange: function(mutationList) {
    console.log(mutationList)
  },
  // handle focus event
  onFocus: function () {
    // ...
  },
  // handle blur event
  onBlur: function () {
    // ...
  },
  // handle when the editor instance is ready
  onReady: function () {
    editor.message('success', 'ready');
  },
  // path to upload files
  uploadPath: '',
  // custom query
  uploadQuery: {
    key: 'value'
    // ...
  }
});
// init and mount
editor.create();
```

## methods list
| name        | description   |  return |
| --------   | -----  | ---- |
| editor.create(); | mount editor instance to container | - |
| editor.config(configOption); | config editor | - |
| editor.getContent(); | get the content html string | HTML string |
| editor.setContent(html); | set the content html string | - |
| editor.message(type, text); | display a message in the top of content area. type should be one of success,fail,warn,info | - |


## configOption
| name        | description   |  type | injected parameters
| --------   | -----  | ---- | ---- |
| server | server host | String | - |
| uploadPath | path to upload files | String | - |
| menus | menus list. eg: ['bold', 'fontSize'] | Array | - |
| uploadQuery | custom query | Object | - |
| onFocus | callback of focus event | Function | - |
| onBlur | callback of blur event | Function | - |
| onReady | callback of ready event | Function | - |
| onChange | callback of change event | Function | mutationsList |

## menus
| name        | description   |
| --------   | -----  |
| head | h1-h6 |
| fontSize | - |
| fontFamily | - |
| bold | - |
| italic | - |
| underline | - |
| strikeThrough | - |
| heightLight | - |
| list | - |
| align | - |
| code | - |
| link | - |
| blockquote | - |
| img | - |
| table | - |
| video | - |
| undo | - |
| redo | - |

## support
IE10+

## todo menu items
- Video
- Audio
- Emoji