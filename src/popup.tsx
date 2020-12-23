import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';
const LOAD_BUTTON_INIT_VALUE = 'load';
const LOAD_BUTTON_SELECT_HOSTNAME = 'select hostname';
const SAVE_BUTTON_INIT_VALUE = 'save';
const SAVE_BUTTON_INPUT_HOSTNAME = 'input hostname';

const initHostnameSet: HostnameSet = JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}');
const lastSelectedHostname = localStorage.getItem(LAST_SELECTED_HOST_NAME);

const App: React.FC = () => {
  const [hostname, setHostname] = useState(lastSelectedHostname);
  const [hostnameSet, setHostnameSet] = useState(initHostnameSet);
  const [loadButtonValue, setLoadButtonValue] = useState(LOAD_BUTTON_INIT_VALUE);
  const [saveButtonValue, setSaveButtonValue] = useState(SAVE_BUTTON_INIT_VALUE);
  const [loadButtonTimer, setLoadButtonTimer] = useState<number>();
  const [saveButtonTimer, setSaveButtonTimer] = useState<number>();
  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hn => {
    return <option key={hn} value={hn} selected={hn === hostname}>{hn}</option>;
  });

  useEffect(() => {
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
  }, [hostnameSet]);

  const onSaveButtonClick = useCallback((): void => {
    if (hostname.length === 0) {
      saveButton.innerText = SAVE_BUTTON_INPUT_HOSTNAME;
      clearTimeout(saveButtonTimer);
      setSaveButtonTimer(window.setTimeout(() => {
        saveButton.innerText = SAVE_BUTTON_INIT_VALUE;
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
      loadButton.innerText = LOAD_BUTTON_SELECT_HOSTNAME;
      clearTimeout(loadButtonTimer);
      setLoadButtonTimer(window.setTimeout(() => {
        loadButton.innerText = LOAD_BUTTON_INIT_VALUE;
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
