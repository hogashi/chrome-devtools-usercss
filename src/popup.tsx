import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';

const PLACEHOLDER = `body {
  color: magenta;
}`;

const SAVE_BUTTON_INIT_VALUE = '保存';
const SAVE_BUTTON_SAVED_VALUE = 'しました';

const initHostnameSet: HostnameSet = JSON.parse(
  localStorage.getItem(HOSTNAME_SET) || '{}'
);
const lastSelectedHostname = (() => {
  const lastSelected = localStorage.getItem(LAST_SELECTED_HOST_NAME) || '';
  return initHostnameSet[lastSelected] ? lastSelected : '';
})();
const setLastSelectedHostname = (hostname: string): void =>
  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);

const App: React.FC = () => {
  const [hostname, setHostname] = useState(lastSelectedHostname);
  const [hostnameSet, setHostnameSet] = useState(initHostnameSet);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [saveButtonValue, setSaveButtonValue] = useState(
    SAVE_BUTTON_INIT_VALUE
  );
  const [saveButtonTimer, setSaveButtonTimer] = useState<number>();

  // hostnameたちの更新
  useEffect(() => {
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
  }, [hostnameSet]);

  // hostnameのUserCSSをtextareaにセットする
  useEffect(() => {
    // hostnameを「前に最後に見てたhostname」として登録する
    setLastSelectedHostname(hostname);

    // hostnameをhostnameのinputにセットする
    setInputValue(hostname);

    if (hostname.length === 0) {
      setTextAreaValue('');
      return;
    }

    const style = localStorage.getItem(hostname) || '';
    setTextAreaValue(style);
  }, [hostname]);

  // EventListenerたち

  // hostnameたちのselectタグで選択したとき
  const onSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      // 選択したoptionタグの値を取ってhostnameとする
      const selectedOption = event.target.selectedOptions[0];
      const newHostname = selectedOption.value;
      setHostname(newHostname);
    },
    []
  );

  // UserCSSのtextarea入力したとき(UserCSSの値を更新する)
  const onTextAreaChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
      setTextAreaValue(event.target.value);
    },
    []
  );

  // hostnameのinputを入力したとき(hostnameのinputの値を更新する)
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(event.target.value);
    },
    []
  );

  // 保存ボタンを押したとき
  const onSaveButtonClick = useCallback((): void => {
    const newHostname = inputValue;
    if (!hostnameSet[newHostname]) {
      // hostnameまだないときhostnameたちに新しく登録する
      const newHostnameSet = { ...hostnameSet };
      newHostnameSet[newHostname] = true;
      setHostnameSet(newHostnameSet);
    }

    localStorage.setItem(newHostname, textAreaValue);

    // 保存ボタンで保存した旨出す
    setSaveButtonValue(SAVE_BUTTON_SAVED_VALUE);
    // ちょっとしたら保存ボタン戻す
    clearTimeout(saveButtonTimer);
    setSaveButtonTimer(
      window.setTimeout(() => {
        setSaveButtonValue(SAVE_BUTTON_INIT_VALUE);
      }, 1000)
    );

    // selectタグのoptionタグをhostnameにする
    setHostname(newHostname);
  }, [hostnameSet, inputValue, textAreaValue, saveButtonTimer]);

  // hostnameのoptionタグをつくる
  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hn => {
    return (
      <option key={hn} value={hn} selected={hn === hostname}>
        {hn}
      </option>
    );
  });

  return (
    <div>
      <div>
        <label>
          編集したい保存済みドメインを選ぶ
          <br />
          <select id='hostname-selector' onChange={onSelectChange}>
            <option value=''>選択...</option>
            {hostNamesOptions}
          </select>
        </label>
      </div>
      <div>
        <textarea
          id='textarea'
          placeholder={PLACEHOLDER}
          cols={50}
          rows={20}
          value={textAreaValue}
          onChange={onTextAreaChange}
        ></textarea>
      </div>
      <div>
        <label>
          このUserCSSを保存するドメイン
          <br />
          <input
            id='hostname-input'
            placeholder='google.com'
            type='text'
            size={35}
            value={inputValue}
            onChange={onInputChange}
          />
        </label>
      </div>
      <div>
        <button
          id='save-button'
          disabled={inputValue.length === 0}
          onClick={onSaveButtonClick}
        >
          {saveButtonValue}
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector<HTMLDivElement>('#root'));
