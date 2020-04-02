let id = 0;
export default function ColorPicker () {
  this.id = id++;
  this.container = null;
}

ColorPicker.prototype = {
  constructor: ColorPicker,
  init (container) {
    this.container = container instanceof HTMLElement ? container : document.querySelector(container)
    
  }
}
