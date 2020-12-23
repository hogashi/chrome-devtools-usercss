import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';
const SAVE_BUTTON_INIT_VALUE = 'save';
const SAVE_BUTTON_SAVED_VALUE = '...saved';

const initHostnameSet: HostnameSet = JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}');
const lastSelectedHostname = (() => {
  const lastSelected = localStorage.getItem(LAST_SELECTED_HOST_NAME) || '';
  return initHostnameSet[lastSelected] ? lastSelected : '';
})();
const setLastSelectedHostname = (hostname: string): void => localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [hostname, setHostname] = useState(lastSelectedHostname);
  const [hostnameSet, setHostnameSet] = useState(initHostnameSet);
  const [saveButtonValue, setSaveButtonValue] = useState(SAVE_BUTTON_INIT_VALUE);
  const [saveButtonTimer, setSaveButtonTimer] = useState<number>();

  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hn => {
    return <option key={hn} value={hn} selected={hn === hostname}>{hn}</option>;
  });

  useEffect(() => {
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
  }, [hostnameSet]);

  useEffect(() => {
    setLastSelectedHostname(hostname);

    setInputValue(hostname);
    if (hostname.length === 0) {
      setTextAreaValue('');
      return;
    }
    const style = localStorage.getItem(hostname) || '';
    setTextAreaValue(style);
  }, [hostname]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.value);
    setInputValue(event.target.value);
  }, []);

  const onTextAreaChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextAreaValue(event.target.value);
  }, []);

  const onSaveButtonClick = useCallback((): void => {
    console.log({ inputValue, textAreaValue });
    const newHostname = inputValue;
    if (!hostnameSet[newHostname]) {
      const newHostnameSet = { ...hostnameSet };
      newHostnameSet[newHostname] = true;
      setHostnameSet(newHostnameSet);
    }

    localStorage.setItem(newHostname, textAreaValue);

    setSaveButtonValue(SAVE_BUTTON_SAVED_VALUE);
    clearTimeout(saveButtonTimer);
    setSaveButtonTimer(window.setTimeout(() => {
      setSaveButtonValue(SAVE_BUTTON_INIT_VALUE);
    }, 1000));

    setHostname(newHostname);
  }, [hostnameSet, inputValue, textAreaValue, saveButtonTimer]);

  const onSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedOption = event.target.selectedOptions[0];
    const newHostname = selectedOption.value;
    setHostname(newHostname);
  }, []);

  return (
    <div>
      <div>
        <select id="hostname-selector" onChange={onSelectChange}>
          <option value="">select existing hostname</option>
          {hostNamesOptions}
        </select>
      </div>
      <div>
        <textarea id="textarea" placeholder="body { color: magenta; }" cols={50} rows={20} value={textAreaValue} onChange={onTextAreaChange}></textarea>
      </div>
      <div>
        <label>saving hostname <input id="hostname-input" placeholder="google.com" type="text" size={35} value={inputValue} onChange={onInputChange} /></label>
      </div>
      <div>input new hostname to save style for new hostname</div>
      <div>
        <button id="save-button" disabled={inputValue.length === 0} onClick={onSaveButtonClick}>{saveButtonValue}</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector<HTMLDivElement>('#root'));
