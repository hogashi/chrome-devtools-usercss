"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setStyle = function (message, sendResponse) {
    var hostname = message.hostname;
    localStorage[hostname] = message.style;
    var hostnames = JSON.parse(localStorage['hostnames'] || {});
    hostnames[hostname] = true;
    localStorage['hostnames'] = JSON.stringify(hostnames);
    sendResponse({ success: true });
};
var getStyle = function (message, sendResponse) {
    var hostname = message.hostname;
    if (!hostname) {
        sendResponse({ style: null });
        return;
    }
    var style = localStorage[hostname] || null;
    sendResponse({ style: style });
};
var messageListener = function (message, _, sendResponse) {
    console.log(message);
    switch (message.method) {
        case 'getStyle':
            getStyle(message, sendResponse);
            break;
        case 'setStyle':
            setStyle(message, sendResponse);
            break;
    }
};
window.chrome.runtime.onMessage.addListener(messageListener);
