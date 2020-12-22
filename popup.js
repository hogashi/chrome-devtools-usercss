const hostnameInput = document.querySelector('#hostname-input');
const hostnameSelector = document.querySelector('#hostname-selector');
const defaultHostnameOption = document.querySelector('#default-option');
const loadButton = document.querySelector('#load-button');
const textarea = document.querySelector('#textarea');
const saveButton = document.querySelector('#save-button');
let loadButtonTimer;
let saveButtonTimer;

const hostnames = JSON.parse(localStorage['hostnames'] || '{}');
Object.keys(hostnames).forEach(hostname => {
  const option = document.createElement('option');
  option.value = hostname;
  option.innerText = hostname;
  hostnameSelector.appendChild(option);
});

loadButton.addEventListener('click', e => {
  const selectedOption = hostnameSelector.selectedOptions[0];
  const hostname = selectedOption.value;
  localStorage['lastSelectedHostname'] = hostname;
  if (hostname.length === 0) {
    loadButton.innerText = 'select hostname';
    clearTimeout(loadButtonTimer);
    loadButtonTimer = setTimeout(() => {
      loadButton.innerText = 'load';
    }, 1500);
    return;
  }
  hostnameInput.value = hostname;
  const style = localStorage[hostname];
  textarea.value = style;
});

saveButton.addEventListener('click', () => {
  let hostname = hostnameInput.value;
  if (hostname.length === 0) {
    saveButton.innerText = 'input hostname';
    clearTimeout(saveButtonTimer);
    saveButtonTimer = setTimeout(() => {
      saveButton.innerText = 'save';
    }, 1500);
    return;
  }
  hostname = hostnameInput.value;
  hostnames[hostname] = true;
  localStorage['hostnames'] = JSON.stringify(hostnames);

  const newStyle = textarea.value;
  localStorage[hostname] = newStyle;
});

const lastSelectedHostname = localStorage['lastSelectedHostname'];
if (hostnames[lastSelectedHostname]) {
  document.querySelector(`option[value="${lastSelectedHostname}"]`).selected = true;
  loadButton.click();
}
