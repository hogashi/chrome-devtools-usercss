import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LOAD_BUTTON_INIT_VALUE = 'load';
const SAVE_BUTTON_INIT_VALUE = 'save';
const initHostnameSet: HostnameSet = JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}');

const App: React.FC = () => {
  const [hostname, setHostname] = useState('');
  const [hostnameSet, setHostnameSet] = useState(initHostnameSet);
  const [loadButtonValue, setLoadButtonValue] = useState(LOAD_BUTTON_INIT_VALUE);
  const [saveButtonValue, setSaveButtonValue] = useState(SAVE_BUTTON_INIT_VALUE);
  const [loadButtonTimer, setLoadButtonTimer] = useState<number>();
  const [saveButtonTimer, setSaveButtonTimer] = useState<number>();
  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hostname => <option key={hostname} value={hostname}>{hostname}</option>);

  const onSaveButtonClick = useCallback((): void => {
    if (hostname.length === 0) {
      saveButton.innerText = 'input hostname';
      clearTimeout(saveButtonTimer);
      setSaveButtonTimer(window.setTimeout(() => {
        saveButton.innerText = 'save';
      }, 1500));
      return;
    }
    hostnameSet[hostname] = true;
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));

    const newStyle = textarea.value;
    localStorage.setItem(hostname, newStyle);

    localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
  }, [hostnameSet]);

  // TODO: do onChangeSelector
  const onLoadButtonClick = useCallback((): void => {
    const selectedOption = hostnameSelector.selectedOptions[0];
    const hostname = selectedOption.value;
    if (hostname.length === 0) {
      loadButton.innerText = 'select hostname';
      clearTimeout(loadButtonTimer);
      setLoadButtonTimer(window.setTimeout(() => {
        loadButton.innerText = 'load';
      }, 1500));
      return;
    }
    hostnameInput.value = hostname;
    const style = localStorage.getItem(hostname) || '';
    textarea.value = style;

    localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
  }, []);

  return (
    <div>
      <div>
        <select id="hostname-selector">
          <option value="">select existing hostname</option>
          {hostNamesOptions}
        </select>
        <button id="load-button" onClick={onLoadButtonClick}>{loadButtonValue}</button>
      </div>
      <div>
        <textarea id="textarea" placeholder="body { color: magenta; }" cols={50} rows={20}></textarea>
      </div>
      <div>
        <label>saving hostname <input id="hostname-input" placeholder="google.com" type="text" size={35} value={hostname} /></label>
      </div>
      <div>input new hostname to save style for new hostname</div>
      <div>
        <button id="save-button" onClick={onSaveButtonClick}>{saveButtonValue}</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector<HTMLDivElement>('#root'));

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

const lastSelectedHostname = localStorage.getItem(LAST_SELECTED_HOST_NAME);
if (lastSelectedHostname && hostnameSet[lastSelectedHostname]) {
  document.querySelector<HTMLOptionElement>(`option[value="${lastSelectedHostname}"]`)!.selected = true;
  onLoadButtonClick();
}
