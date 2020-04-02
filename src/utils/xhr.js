import conf from '../config';

export default function XHR() {
  if (!(this instanceof XHR)) {
    return new XHR();
  }
  this._xhr = new XMLHttpRequest();
  this.timeout = 5000;
  this.upload = this._xhr.upload || {};
  this._successCallback = () => {};
  this._failCallback = () => {};
  this._onTimeout = () => {};
  this._xhr.onreadystatechange = () => {
    this.readyState = this._xhr.readyState;
    if (this._xhr.readyState === 4 && this._xhr.status === 200) {
      this.responseText = this._xhr.responseText;
      this._successCallback(this.responseText);
    } else {
      this._failCallback(this.responseText);
    }
  };
  this._xhr.withCredentials = conf.withCredentials;
  this._xhr.ontimeout = () => {
    this._onTimeout();
  };
}

XHR.prototype = {
  constructor: XHR,
  open (method, url) {
    this._xhr.open(method, url);
  },
  onSuccess (callback) {
    this._successCallback = callback;
  },
  onFail (callback) {
    this._failCallback = callback;
  },
  onload () {
  
  },
  onTimeout (callback) {
    this._onTimeout = callback;
  },
  setRequestHeader () {
  
  },
  send (data) {
    this._xhr.send(data);
  },
  abort () {
  
  },
  getResponseHeader () {
  
  }
};
