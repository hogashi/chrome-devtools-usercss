/******/ (() => { // webpackBootstrap
var message = {
  hostname: location.hostname
};

var responseCallback = function responseCallback(response) {
  var _document$querySelect;

  console.log(response);
  var style = response.style;

  if (style === null) {
    return;
  }

  (_document$querySelect = document.querySelector('body')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.insertAdjacentHTML('beforeend', "<style data-usercss>".concat(style, "</style>"));
};

console.log('loaded');
window.chrome.runtime.sendMessage(message, responseCallback);
/******/ })()
;