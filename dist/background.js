/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 4428:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

var utils_1 = __webpack_require__(6844);

var getStyle = function getStyle(message, _, sendResponse) {
  var hostname = message.hostname;

  if (hostname.length === 0) {
    sendResponse({
      style: null
    });
    return;
  } // ドメインを消しても(hostnameSetから消すだけで)localStorageからは消さないので
  // hostnameSetにあるときだけ返す


  var hostnameSet = utils_1.getHostnameSet();

  if (!hostnameSet[hostname]) {
    return;
  }

  var style = localStorage.getItem(hostname);
  sendResponse({
    style: style
  });
};

window.chrome.runtime.onMessage.addListener(getStyle);

/***/ }),

/***/ 4799:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LAST_SELECTED_HOST_NAME = exports.HOSTNAME_SET = void 0;
exports.HOSTNAME_SET = 'hostnameSet';
exports.LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';

/***/ }),

/***/ 6844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.importDataToLocalStorage = exports.downloadDataAsJson = exports.getHostnameSet = exports.getLocalStorageItem = void 0;

var constants_1 = __webpack_require__(4799);

var datetimeStr = function datetimeStr() {
  var date = new Date();
  return "" + date.getFullYear() + [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(function (n) {
    return ("0" + n).slice(-2);
  }).join('');
};

var getLocalStorageItem = function getLocalStorageItem(key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = '';
  }

  return localStorage.getItem(key) || defaultValue;
};

exports.getLocalStorageItem = getLocalStorageItem;

var getHostnameSet = function getHostnameSet() {
  try {
    return JSON.parse(exports.getLocalStorageItem(constants_1.HOSTNAME_SET, '{}'));
  } catch (_a) {
    return {};
  }
};

exports.getHostnameSet = getHostnameSet;

var downloadDataAsJson = function downloadDataAsJson() {
  var hostnameSet = exports.getHostnameSet();
  var lastSelectedHostname = exports.getLocalStorageItem(constants_1.LAST_SELECTED_HOST_NAME);
  var styleSet = {};
  Object.keys(hostnameSet).forEach(function (hostname) {
    styleSet[hostname] = exports.getLocalStorageItem(hostname);
  });
  var data = {
    hostnameSet: hostnameSet,
    lastSelectedHostname: lastSelectedHostname,
    styleSet: styleSet
  };
  var blob = new Blob([JSON.stringify(data)], {
    type: 'application/json'
  });
  var aTag = document.createElement('a');
  aTag.href = window.URL.createObjectURL(blob);
  aTag.download = "chrome-usercss-hogashi-" + datetimeStr() + ".json";
  aTag.click();
};

exports.downloadDataAsJson = downloadDataAsJson;

var importDataToLocalStorage = function importDataToLocalStorage(str) {
  var data;

  try {
    data = JSON.parse(str);
  } catch (_a) {
    return false;
  }

  var hostnameSet = data.hostnameSet,
      lastSelectedHostname = data.lastSelectedHostname,
      styleSet = data.styleSet;
  localStorage.setItem(constants_1.HOSTNAME_SET, JSON.stringify(hostnameSet));
  localStorage.setItem(constants_1.LAST_SELECTED_HOST_NAME, lastSelectedHostname);
  Object.keys(hostnameSet).map(function (hostname) {
    localStorage.setItem(hostname, styleSet[hostname]);
  });
  return true;
};

exports.importDataToLocalStorage = importDataToLocalStorage;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(4428);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;