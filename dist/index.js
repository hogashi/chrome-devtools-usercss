"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message = {
    method: 'getStyle',
    hostname: location.hostname,
};
var responseCallback = function (response) {
    var _a;
    console.log(response);
    var style = response.style;
    if (style === null) {
        return;
    }
    (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', "<style data-usercss>" + style + "</style>");
};
console.log('loaded');
window.chrome.runtime.sendMessage(message, responseCallback);
