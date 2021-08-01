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
    return true;
  } // ドメインを消しても(hostnameSetから消すだけで)storageからは消さないので
  // hostnameSetにあるときだけ返す


  utils_1.getHostnameSet().then(function (hostnameSet) {
    if (!hostnameSet[hostname]) {
      sendResponse({
        style: ''
      });
    }

    utils_1.getStorageItem(hostname).then(function (style) {
      return sendResponse({
        style: style
      });
    });
  });
  return true;
};

chrome.runtime.onMessage.addListener(getStyle); // TODO: みなさまがlocalStorageから脱出できてそうなくらい経ったら消す

window.chrome.runtime.onInstalled.addListener(utils_1.migrateToStorage_FORMIGRATE);

/***/ }),

/***/ 4799:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.IS_ALREADY_MIGRATED_TO_STORAGE = exports.LAST_SELECTED_HOST_NAME = exports.HOSTNAME_SET = void 0;
exports.HOSTNAME_SET = 'hostnameSet';
exports.LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';
exports.IS_ALREADY_MIGRATED_TO_STORAGE = 'isAlreadyMigratedToStorage';

/***/ }),

/***/ 6844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.importDataToStorage = exports.downloadDataAsJson = exports.getHostnameSet = exports.getStorageItem = exports.setStorageItem = exports.downloadDataAsJsonFromLocalStorage_FORMIGRATE = exports.setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE = exports.migrateToStorage_FORMIGRATE = exports.getIsAlreadyMigratedToStorage_FORMIGRATE = exports.getHostnameSetFromLocalStorage_FORMIGRATE = exports.getLocalStorageItem_FORMIGRATE = void 0;

var constants_1 = __webpack_require__(4799);

var datetimeStr = function datetimeStr() {
  var date = new Date();
  return "" + date.getFullYear() + [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(function (n) {
    return ("0" + n).slice(-2);
  }).join('');
}; // _FORMIGRATEシリーズは移行用のメソッド
// TODO: みなさまがlocalStorageから脱出できてそうなくらい経ったら消す


var getLocalStorageItem_FORMIGRATE = function getLocalStorageItem_FORMIGRATE(key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = '';
  }

  return localStorage.getItem(key) || defaultValue;
};

exports.getLocalStorageItem_FORMIGRATE = getLocalStorageItem_FORMIGRATE;

var getHostnameSetFromLocalStorage_FORMIGRATE = function getHostnameSetFromLocalStorage_FORMIGRATE() {
  try {
    return JSON.parse(exports.getLocalStorageItem_FORMIGRATE(constants_1.HOSTNAME_SET, '{}'));
  } catch (_a) {
    return {};
  }
};

exports.getHostnameSetFromLocalStorage_FORMIGRATE = getHostnameSetFromLocalStorage_FORMIGRATE;

var getIsAlreadyMigratedToStorage_FORMIGRATE = function getIsAlreadyMigratedToStorage_FORMIGRATE() {
  return exports.getStorageItem(constants_1.IS_ALREADY_MIGRATED_TO_STORAGE).then(function (value) {
    if (value === '') {
      return false;
    }

    return JSON.parse(value);
  });
};

exports.getIsAlreadyMigratedToStorage_FORMIGRATE = getIsAlreadyMigratedToStorage_FORMIGRATE;

var migrateToStorage_FORMIGRATE = function migrateToStorage_FORMIGRATE() {
  exports.getIsAlreadyMigratedToStorage_FORMIGRATE().then(function (isAlreadyMigrated) {
    // 移行済みならなにもしない
    if (isAlreadyMigrated) {
      return;
    }

    var hostnameSet = exports.getHostnameSetFromLocalStorage_FORMIGRATE();
    var dataToMigrate = {
      hostnameSet: JSON.stringify(hostnameSet),
      lastSelectedHostname: exports.getLocalStorageItem_FORMIGRATE(constants_1.LAST_SELECTED_HOST_NAME)
    };
    Object.keys(hostnameSet).forEach(function (hostname) {
      dataToMigrate[hostname] = exports.getLocalStorageItem_FORMIGRATE(hostname);
    });
    exports.setStorageItem(dataToMigrate).then(function () {
      exports.setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE();
    });
  });
};

exports.migrateToStorage_FORMIGRATE = migrateToStorage_FORMIGRATE;

var setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE = function setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE() {
  var _a;

  return exports.setStorageItem((_a = {}, _a[constants_1.IS_ALREADY_MIGRATED_TO_STORAGE] = JSON.stringify(true), _a));
};

exports.setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE = setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE; // 何らかがおかしくて自動でmigrateToStorage_FORMIGRATEできなかった場合に,
// 人間の手で"localStorageからエクスポート→chrome.storageにインポート"をしたいことがある
// その"localStorageからのエクスポート"をするメソッド

var downloadDataAsJsonFromLocalStorage_FORMIGRATE = function downloadDataAsJsonFromLocalStorage_FORMIGRATE() {
  var hostnameSet = exports.getHostnameSetFromLocalStorage_FORMIGRATE();
  var lastSelectedHostname = exports.getLocalStorageItem_FORMIGRATE(constants_1.LAST_SELECTED_HOST_NAME);
  var styleSet = {};
  Object.keys(hostnameSet).forEach(function (hostname) {
    styleSet[hostname] = exports.getLocalStorageItem_FORMIGRATE(hostname);
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
  aTag.download = "chrome-usercss-hogashi-v020-" + datetimeStr() + ".json";
  aTag.click();
};

exports.downloadDataAsJsonFromLocalStorage_FORMIGRATE = downloadDataAsJsonFromLocalStorage_FORMIGRATE; // chrome.storage

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
  return exports.getStorageItem(constants_1.HOSTNAME_SET, '{}').then(function (str) {
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
      return exports.getStorageItem(hostname).then(function (css) {
        styleSet[hostname] = css;
      });
    })).then(function () {
      return exports.getStorageItem(constants_1.LAST_SELECTED_HOST_NAME).then(function (lastSelectedHostname) {
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
      aTag.download = "chrome-usercss-hogashi-" + datetimeStr() + ".json";
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
    return exports.setStorageItem(dataToSet, function () {
      // 手でインポートしたときは移行済みの扱いとする
      exports.setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE().then(function () {
        return resolve(true);
      });
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