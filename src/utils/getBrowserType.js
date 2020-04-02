//判断浏览器类型
export default function getBrowserType() {
  if(!!window.ActiveXObject || "ActiveXObject" in window){
    return "IE";
  }
  if (navigator.userAgent.indexOf("Firefox") !== -1){
    return "Firefox";
  }
  if(navigator.userAgent.indexOf("Chrome") !== -1){
    return "Chrome";
  }
  if(navigator.userAgent.indexOf("Safari") !== -1){
    return "Safari";
  }
}