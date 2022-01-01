/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
exports.importDataToStorage = exports.downloadDataAsJson = exports.getHostnameSet = exports.getStorageItem = exports.setStorageItem = void 0;

var constants_1 = __webpack_require__(4799);

var datetimeStr = function datetimeStr() {
  var date = new Date();
  return "".concat(date.getFullYear()) + [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(function (n) {
    return "0".concat(n).slice(-2);
  }).join('');
}; // chrome.storage


var setStorageItem = function setStorageItem(item, callback) {
  return new Promise(function (resolve) {
    if (callback) {
      chrome.storage.local.set(item, function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        callback.apply(void 0, args);
        resolve(true);
      });
      return;
    }

    chrome.storage.local.set(item, function () {
      return resolve(true);
    });
  });
};

exports.setStorageItem = setStorageItem;

var getStorageItem = function getStorageItem(key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = '';
  }

  return new Promise(function (resolve) {
    chrome.storage.local.get([key], function (result) {
      resolve(result[key] || defaultValue);
    });
  });
};

exports.getStorageItem = getStorageItem;

var getHostnameSet = function getHostnameSet() {
  return (0, exports.getStorageItem)(constants_1.HOSTNAME_SET, '{}').then(function (str) {
    return JSON.parse(str);
  })["catch"](function () {
    return {};
  });
};

exports.getHostnameSet = getHostnameSet;

var downloadDataAsJson = function downloadDataAsJson() {
  (0, exports.getHostnameSet)().then(function (hostnameSet) {
    var styleSet = {};
    Promise.all(Object.keys(hostnameSet).map(function (hostname) {
      return (0, exports.getStorageItem)(hostname).then(function (css) {
        styleSet[hostname] = css;
      });
    })).then(function () {
      return (0, exports.getStorageItem)(constants_1.LAST_SELECTED_HOST_NAME).then(function (lastSelectedHostname) {
        return {
          hostnameSet: hostnameSet,
          lastSelectedHostname: lastSelectedHostname
        };
      });
    }).then(function (_a) {
      var hostnameSet = _a.hostnameSet,
          lastSelectedHostname = _a.lastSelectedHostname;
      var data = {
        hostnameSet: hostnameSet,
        lastSelectedHostname: lastSelectedHostname,
        styleSet: styleSet
      };
      var blob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
      });
      var aTag = document.createElement('a');
      aTag.href = URL.createObjectURL(blob);
      aTag.download = "chrome-usercss-hogashi-".concat(datetimeStr(), ".json");
      aTag.click();
    });
  });
};

exports.downloadDataAsJson = downloadDataAsJson;

var importDataToStorage = function importDataToStorage(str) {
  var _a;

  var data;

  try {
    data = JSON.parse(str);
  } catch (_b) {
    return Promise.resolve(false);
  }

  var hostnameSet = data.hostnameSet,
      lastSelectedHostname = data.lastSelectedHostname,
      styleSet = data.styleSet;
  var dataToSet = (_a = {}, _a[constants_1.HOSTNAME_SET] = JSON.stringify(hostnameSet), _a[constants_1.LAST_SELECTED_HOST_NAME] = lastSelectedHostname, _a);
  Object.keys(hostnameSet).map(function (hostname) {
    dataToSet[hostname] = styleSet[hostname];
  });
  return new Promise(function (resolve) {
    return (0, exports.setStorageItem)(dataToSet, function () {
      resolve(true);
    });
  });
};

exports.importDataToStorage = importDataToStorage;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

var utils_1 = __webpack_require__(6844);
/**
 * sendResponseを非同期で呼んでもconnectionを保ってもらうことをtrueを返すことで示す
 * ref: https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
 * >This function becomes invalid when the event listener returns, unless
 * >you return true from the event listener to indicate you wish to send a
 * >response asynchronously (this will keep the message channel open to the
 * >other end until sendResponse is called).
 */


var getStyle = function getStyle(message, _, sendResponse) {
  var hostname = message.hostname;

  if (hostname.length === 0) {
    sendResponse({
      style: ''
    });
    return true;
  } // ドメインを消しても(hostnameSetから消すだけで)storageからは消さないので
  // hostnameSetにあるときだけ返す


  (0, utils_1.getHostnameSet)().then(function (hostnameSet) {
    if (!hostnameSet[hostname]) {
      sendResponse({
        style: ''
      });
    }

    (0, utils_1.getStorageItem)(hostname).then(function (style) {
      return sendResponse({
        style: style
      });
    });
  });
  return true;
};

chrome.runtime.onMessage.addListener(getStyle);
})();

/******/ })()
;