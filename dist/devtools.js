/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

var responseCallback = function responseCallback(_a) {
  var style = _a.style;

  if (style === '') {
    return;
  } // applyStyleSheet() は API にないし @types/chrome にもないので仕方なくanyにする
  // https://developer.chrome.com/docs/extensions/reference/devtools_panels/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


  window.chrome.devtools.panels.applyStyleSheet(style);
};

window.chrome.runtime.sendMessage('', responseCallback);
})();

/******/ })()
;