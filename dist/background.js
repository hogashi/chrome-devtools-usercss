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
      style: ''
    });
    return;
  } // ドメインを消しても(hostnameSetから消すだけで)localStorageからは消さないので
  // hostnameSetにあるときだけ返す


  utils_1.getHostnameSet().then(function (hostnameSet) {
    if (!hostnameSet[hostname]) {
      return;
    }

    utils_1.getLocalStorageItem(hostname).then(function (style) {
      return sendResponse({
        style: style
      });
    });
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
exports.importDataToLocalStorage = exports.downloadDataAsJson = exports.getHostnameSet = exports.getLocalStorageItem = exports.setLocalStorageItem = void 0;

var constants_1 = __webpack_require__(4799);

var datetimeStr = function datetimeStr() {
  var date = new Date();
  return "" + date.getFullYear() + [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(function (n) {
    return ("0" + n).slice(-2);
  }).join('');
};

var setLocalStorageItem = function setLocalStorageItem(item, callback) {
  if (callback) {
    chrome.storage.local.set(item, callback);
    return;
  }

  chrome.storage.local.set(item);
};

exports.setLocalStorageItem = setLocalStorageItem;

var getLocalStorageItem = function getLocalStorageItem(key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = '';
  }

  return new Promise(function (resolve) {
    chrome.storage.local.get([key], function (result) {
      resolve(result[key] || defaultValue);
    });
  });
};

exports.getLocalStorageItem = getLocalStorageItem;

var getHostnameSet = function getHostnameSet() {
  return exports.getLocalStorageItem(constants_1.HOSTNAME_SET, '{}').then(function (str) {
    return JSON.parse(str);
  })["catch"](function () {
    return {};
  });
};

exports.getHostnameSet = getHostnameSet;

var downloadDataAsJson = function downloadDataAsJson() {
  exports.getHostnameSet().then(function (hostnameSet) {
    var styleSet = {};
    Promise.all(Object.keys(hostnameSet).map(function (hostname) {
      return exports.getLocalStorageItem(hostname).then(function (css) {
        styleSet[hostname] = css;
      });
    })).then(function () {
      return exports.getLocalStorageItem(constants_1.LAST_SELECTED_HOST_NAME).then(function (lastSelectedHostname) {
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
      aTag.href = window.URL.createObjectURL(blob);
      aTag.download = "chrome-usercss-hogashi-" + datetimeStr() + ".json";
      aTag.click();
    });
  });
};

exports.downloadDataAsJson = downloadDataAsJson;

var importDataToLocalStorage = function importDataToLocalStorage(str) {
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
    return chrome.storage.local.set(dataToSet, function () {
      return resolve(true);
    });
  });
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