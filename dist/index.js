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
var message = {
  hostname: location.hostname
};

var responseCallback = function responseCallback(_a) {
  var _b;

  var style = _a.style;

  if (style === '') {
    return;
  }

  (_b = document.querySelector('body')) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML('beforeend', "<style data-usercss>".concat(style, "</style>"));
};

window.chrome.runtime.sendMessage(message, responseCallback);
})();

/******/ })()
;