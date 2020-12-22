/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

var HOSTNAME_SET = 'hostnameSet';
var LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';
var hostnameInput = document.querySelector('#hostname-input');
var hostnameSelector = document.querySelector('#hostname-selector');
var defaultHostnameOption = document.querySelector('#default-option');
var loadButton = document.querySelector('#load-button');
var textarea = document.querySelector('#textarea');
var saveButton = document.querySelector('#save-button');
var loadButtonTimer;
var saveButtonTimer;
var getHostnameSet = function () { return JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}'); };
var addHostname = function (hostname, set) {
    set[hostname] = true;
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(set));
};
var getStyleByHostname = function (hostname) { return localStorage.getItem(hostname) || ''; };
var addOrUpdateStyleAndHostname = function (set, hostname, style) {
    addHostname(hostname, set);
    localStorage.setItem(hostname, style);
};
// TODO: in React
var hostnameSet = getHostnameSet();
Object.keys(hostnameSet).forEach(function (hostname) {
    var option = document.createElement('option');
    option.value = hostname;
    option.innerText = hostname;
    hostnameSelector.appendChild(option);
});
var rememberLasSelectedHostname = function (hostname) { return localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname); };
// TODO: do onChangeSelector
var onLoadButtonClick = function () {
    var selectedOption = hostnameSelector.selectedOptions[0];
    var hostname = selectedOption.value;
    if (hostname.length === 0) {
        loadButton.innerText = 'select hostname';
        clearTimeout(loadButtonTimer);
        loadButtonTimer = setTimeout(function () {
            loadButton.innerText = 'load';
        }, 1500);
        return;
    }
    hostnameInput.value = hostname;
    var style = localStorage.getItem(hostname) || '';
    textarea.value = style;
    localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};
var onSaveButtonClick = function () {
    var hostname = hostnameInput.value;
    if (hostname.length === 0) {
        saveButton.innerText = 'input hostname';
        clearTimeout(saveButtonTimer);
        saveButtonTimer = setTimeout(function () {
            saveButton.innerText = 'save';
        }, 1500);
        return;
    }
    hostnameSet[hostname] = true;
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
    var newStyle = textarea.value;
    localStorage.setItem(hostname, newStyle);
    localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};
loadButton.addEventListener('click', onLoadButtonClick);
saveButton.addEventListener('click', onSaveButtonClick);
var lastSelectedHostname = localStorage.getItem(LAST_SELECTED_HOST_NAME);
if (lastSelectedHostname && hostnameSet[lastSelectedHostname]) {
    document.querySelector("option[value=\"" + lastSelectedHostname + "\"]").selected = true;
    onLoadButtonClick();
}

/******/ })()
;