"use strict";
var hostnameInput = document.querySelector('#hostname-input');
var hostnameSelector = document.querySelector('#hostname-selector');
var defaultHostnameOption = document.querySelector('#default-option');
var loadButton = document.querySelector('#load-button');
var textarea = document.querySelector('#textarea');
var saveButton = document.querySelector('#save-button');
var loadButtonTimer;
var saveButtonTimer;
var hostnames = JSON.parse(localStorage['hostnames'] || '{}');
Object.keys(hostnames).forEach(function (hostname) {
    var option = document.createElement('option');
    option.value = hostname;
    option.innerText = hostname;
    hostnameSelector.appendChild(option);
});
loadButton.addEventListener('click', function (e) {
    var selectedOption = hostnameSelector.selectedOptions[0];
    var hostname = selectedOption.value;
    localStorage['lastSelectedHostname'] = hostname;
    if (hostname.length === 0) {
        loadButton.innerText = 'select hostname';
        clearTimeout(loadButtonTimer);
        loadButtonTimer = setTimeout(function () {
            loadButton.innerText = 'load';
        }, 1500);
        return;
    }
    hostnameInput.value = hostname;
    var style = localStorage[hostname];
    textarea.value = style;
});
saveButton.addEventListener('click', function () {
    var hostname = hostnameInput.value;
    if (hostname.length === 0) {
        saveButton.innerText = 'input hostname';
        clearTimeout(saveButtonTimer);
        saveButtonTimer = setTimeout(function () {
            saveButton.innerText = 'save';
        }, 1500);
        return;
    }
    hostname = hostnameInput.value;
    hostnames[hostname] = true;
    localStorage['hostnames'] = JSON.stringify(hostnames);
    var newStyle = textarea.value;
    localStorage[hostname] = newStyle;
});
var lastSelectedHostname = localStorage['lastSelectedHostname'];
if (hostnames[lastSelectedHostname]) {
    document.querySelector("option[value=\"" + lastSelectedHostname + "\"]").selected = true;
    loadButton.click();
}
