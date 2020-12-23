/******/ (() => { // webpackBootstrap
var getStyle = function getStyle(message, _, sendResponse) {
  var hostname = message.hostname;

  if (hostname.length === 0) {
    sendResponse({
      style: null
    });
    return;
  }

  var style = localStorage.getItem(hostname);
  sendResponse({
    style: style
  });
};

window.chrome.runtime.onMessage.addListener(getStyle);
/******/ })()
;