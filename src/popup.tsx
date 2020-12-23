import React, { useState } from 'react';
import ReactDOM from 'react-dom';

type HostnameSet = {
  [hostname: string]: true;
};

const getHostnameSet = (): HostnameSet => JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}');

const App: React.FC = () => {
  const [hostnameSet, setHostnameSet] = useState(getHostnameSet());
  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hostname => <option key={hostname} value={hostname}>{hostname}</option>);

  return (
    <div>
      <div>
        <select id="hostname-selector">
          <option id="default-option" value="">select existing hostname</option>
          { hostNamesOptions }
        </select>
        <button id="load-button">load</button>
      </div>
      <div>
        <textarea id="textarea" placeholder="body { color: magenta; }" cols={50} rows={20}></textarea>
      </div>
      <div>
        <label>saving hostname <input id="hostname-input" placeholder="google.com" type="text" size={35} /></label>
      </div>
      <div>input new hostname to save style for new hostname</div>
      <div>
        <button id="save-button">save</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector<HTMLDivElement>('#root'));

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';

const hostnameInput = document.querySelector<HTMLInputElement>('#hostname-input')!;
const hostnameSelector = document.querySelector<HTMLSelectElement>('#hostname-selector')!;
const defaultHostnameOption = document.querySelector<HTMLOptionElement>('#default-option')!;
const loadButton = document.querySelector<HTMLButtonElement>('#load-button')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#textarea')!;
const saveButton = document.querySelector<HTMLButtonElement>('#save-button')!;
let loadButtonTimer: ReturnType<typeof setTimeout>;
let saveButtonTimer: ReturnType<typeof setTimeout>;

const addHostname = (hostname: string, set: HostnameSet): void => {
  set[hostname] = true;
  localStorage.setItem(HOSTNAME_SET, JSON.stringify(set));
};
const getStyleByHostname = (hostname: string): string => localStorage.getItem(hostname) || '';
const addOrUpdateStyleAndHostname = (set: HostnameSet, hostname: string, style: string): void => {
  addHostname(hostname, set);
  localStorage.setItem(hostname, style);
};

const rememberLasSelectedHostname = (hostname: string) => localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);

// TODO: do onChangeSelector
const onLoadButtonClick = (): void => {
  const selectedOption = hostnameSelector.selectedOptions[0];
  const hostname = selectedOption.value;
  if (hostname.length === 0) {
    loadButton.innerText = 'select hostname';
    clearTimeout(loadButtonTimer);
    loadButtonTimer = setTimeout(() => {
      loadButton.innerText = 'load';
    }, 1500);
    return;
  }
  hostnameInput.value = hostname;
  const style = localStorage.getItem(hostname) || '';
  textarea.value = style;

  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};

const onSaveButtonClick = (): void => {
  const hostname = hostnameInput.value;
  if (hostname.length === 0) {
    saveButton.innerText = 'input hostname';
    clearTimeout(saveButtonTimer);
    saveButtonTimer = setTimeout(() => {
      saveButton.innerText = 'save';
    }, 1500);
    return;
  }
  hostnameSet[hostname] = true;
  localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));

  const newStyle = textarea.value;
  localStorage.setItem(hostname, newStyle);

  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};

loadButton.addEventListener('click', onLoadButtonClick);

saveButton.addEventListener('click', onSaveButtonClick);

const lastSelectedHostname = localStorage.getItem(LAST_SELECTED_HOST_NAME);
if (lastSelectedHostname && hostnameSet[lastSelectedHostname]) {
  document.querySelector<HTMLOptionElement>(`option[value="${lastSelectedHostname}"]`)!.selected = true;
  onLoadButtonClick();
}
