import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { Button, BUTTON_DONE_CLASS_NAME } from './Button';

import {
  HostnameSet,
  HOSTNAME_SET,
  LAST_SELECTED_HOST_NAME,
} from './lib/constants';
import {
  getLocalStorageItem,
  getHostnameSet,
  importDataToLocalStorage,
  downloadDataAsJson,
} from './lib/utils';

// @ts-expect-error: MonacoEnvironment is undefined in window
self.MonacoEnvironment = {
  getWorkerUrl: function (_workerId: string, label: string) {
    // if (label === 'json') {
    // 	return './json.worker.bundle.js';
    // }
    if (label === 'css') {
      return './css.worker.js';
    }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    // 	return './html.worker.bundle.js';
    // }
    // if (label === 'typescript' || label === 'javascript') {
    // 	return './ts.worker.bundle.js';
    // }
    return './editor.worker.js';
  },
};

const WORD_WRAP = 'wordWrap';
const WORD_WRAP_ON = 'on';
const WORD_WRAP_OFF = 'off';

const PLACEHOLDER = `body {
  color: magenta;
}`;

const REMOVE_HOSTNAME_BUTTON_INIT_VALUE = '削除';
const SAVE_BUTTON_INIT_VALUE = '保存';
const IMPORT_BUTTON_INIT_VALUE = 'インポートする';
const IMPORT_BUTTON_DONE_VALUE = '開き直して更新';
const EXPORT_BUTTON_INIT_VALUE = 'エクスポートする';

const initHostnameSet = getHostnameSet();
const lastSelectedHostname = (() => {
  const lastSelected = getLocalStorageItem(LAST_SELECTED_HOST_NAME);
  return initHostnameSet[lastSelected] ? lastSelected : '';
})();
const setLastSelectedHostname = (hostname: string): void =>
  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
// 行の折返し(デフォルトでON)
const initwordWrapChecked: boolean =
  getLocalStorageItem(WORD_WRAP) !== WORD_WRAP_OFF;

const App: React.FC = () => {
  const [hostname, setHostname] = useState(lastSelectedHostname);
  const [hostnameSet, setHostnameSet] = useState(initHostnameSet);
  const [wordWrapChecked, setWordWrapChecked] = useState<boolean>(
    initwordWrapChecked
  );
  const [
    editor,
    setEditor,
  ] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [hostnameInputValue, setHostnameInputValue] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importButtonDisabled, setImportButtonDisabled] = useState(true);
  const [importButtonDone, setImportButtonDone] = useState(false);

  // エディタの初期化
  useEffect(() => {
    if (!editorDivRef.current) {
      return;
    }
    const newEditor = monaco.editor.create(editorDivRef.current, {
      value: PLACEHOLDER,
      contextmenu: false,
      language: 'css',
      lineDecorationsWidth: 1,
      lineNumbersMinChars: 3,
      minimap: {
        maxColumn: 40,
      },
    });
    setEditor(newEditor);
  }, []);

  // 行の折返しの更新
  useEffect(() => {
    const wordWrap = wordWrapChecked ? WORD_WRAP_ON : WORD_WRAP_OFF;
    editor?.updateOptions({ wordWrap });
    localStorage.setItem(WORD_WRAP, wordWrap);
  }, [editor, wordWrapChecked]);

  // hostnameたちの更新
  useEffect(() => {
    localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
  }, [hostnameSet]);

  // hostnameのUserCSSをエディタにセットする
  useEffect(() => {
    // hostnameを「前に最後に見てたhostname」として登録する
    setLastSelectedHostname(hostname);

    // hostnameをhostnameのinputにセットする
    setHostnameInputValue(hostname);

    if (hostname.length === 0) {
      // hostnameのselectタグのデフォルトのoptionタグのときエディタは空にする
      editor?.setValue('');
      return;
    }

    const style = getLocalStorageItem(hostname);
    editor?.setValue(style);
  }, [editor, hostname]);

  // EventListenerたち

  // hostnameたちのselectタグで選択したとき
  const onHostnameSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      // 選択したoptionタグの値を取ってhostnameとする
      const selectedOption = event.target.selectedOptions[0];
      const newHostname = selectedOption.value;
      setHostname(newHostname);
    },
    []
  );

  // hostnameのinputを入力したとき(hostnameのinputの値を更新する)
  const onHostnameInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setHostnameInputValue(event.target.value);
    },
    []
  );

  // 行の折返しのcheckboxを変えたとき
  const onWordWrapChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setWordWrapChecked(event.target.checked);
    },
    []
  );

  // hostname削除ボタンを押したとき
  const onRemoveHostnameButtonClick = useCallback((): void => {
    const newHostnameSet: HostnameSet = {};
    Object.keys(hostnameSet).forEach(h => {
      if (h === hostname) {
        return;
      }
      newHostnameSet[h] = hostnameSet[h];
    });
    setHostnameSet(newHostnameSet);
    // デフォルトの選択肢に戻す
    setHostname('');
  }, [hostnameSet, hostname]);

  // 保存ボタンを押したとき
  const onSaveButtonClick = useCallback((): void => {
    if (!editor) {
      // エディタあるはずだけどなかったらおかしいので何もせずに終わる
      console.log('editor not found');
      return;
    }

    const newHostname = hostnameInputValue;
    if (!hostnameSet[newHostname]) {
      // hostnameまだないときhostnameたちに新しく登録する
      const newHostnameSet = { ...hostnameSet };
      newHostnameSet[newHostname] = true;
      setHostnameSet(newHostnameSet);
    }

    // エディタに書かれてる文字列を取ってきてhostnameのUserCSSとして登録する
    const newValue = editor.getValue();
    localStorage.setItem(newHostname, newValue);

    // selectタグのoptionタグをhostnameにする
    setHostname(newHostname);
  }, [editor, hostnameSet, hostnameInputValue]);

  const onImportInputChange = useCallback(() => {
    // ファイルないとき押せない
    setImportButtonDisabled(!importInputRef.current?.files?.item(0));
  }, [importInputRef]);

  const onImportButtonClick = useCallback(() => {
    importInputRef.current?.files
      ?.item(0)
      ?.text()
      .then(str => {
        const isSuccess = importDataToLocalStorage(str);
        if (isSuccess) {
          // しました状態にする
          setImportButtonDone(true);
          setImportButtonDisabled(true);
        }
      });
  }, [importInputRef]);

  const onExportButtonClick = useCallback(() => {
    downloadDataAsJson();
  }, []);

  // hostnameのoptionタグをつくる
  const hostnames = Object.keys(hostnameSet);
  const hostNamesOptions = hostnames.map(hn => {
    return (
      <option key={hn} value={hn} selected={hn === hostname}>
        {hn}
      </option>
    );
  });

  // キー押したとき
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.stopPropagation();
      saveButtonRef.current?.click();
    }
  }, []);

  return (
    <>
      <div id='container'>
        <div id='hostname-selector-container'>
          <div>
            <label>
              ドメインを選んでUserCSSを読み込む
              <br />
              <select id='hostname-selector' onChange={onHostnameSelectChange}>
                <option value=''>選択...</option>
                {hostNamesOptions}
              </select>
            </label>
          </div>
          <div id='remove-hostname'>
            ドメインを
            <Button
              initValue={REMOVE_HOSTNAME_BUTTON_INIT_VALUE}
              onClick={onRemoveHostnameButtonClick}
            />
          </div>
        </div>
        <hr className='root-hr' />
        <div id='editor-label'>
          <span style={{ flex: '0 1 auto' }}>UserCSS</span>
          <label style={{ flex: '0 1 auto' }}>
            <input
              id='word-wrap'
              type='checkbox'
              checked={wordWrapChecked}
              onChange={onWordWrapChanged}
            />
            行の折り返し
          </label>
        </div>
        <div id='editor' ref={editorDivRef} onKeyDown={onKeyDown}></div>
        <div id='save-section'>
          <label id='save-label'>
            このUserCSSを保存するドメイン
            <br />
            <input
              id='hostname-input'
              placeholder='google.com'
              type='text'
              size={35}
              value={hostnameInputValue}
              onChange={onHostnameInputChange}
            />
          </label>
          <Button
            id='save-button'
            disabledWhen={hostnameInputValue.length === 0}
            ref={saveButtonRef}
            initValue={SAVE_BUTTON_INIT_VALUE}
            onClick={onSaveButtonClick}
          />
        </div>
      </div>
      <hr className='root-hr' />
      <details id='export-import-container'>
        <summary>JSONファイルでインポート/エクスポート</summary>
        <div>
          <label>
            <input
              type='file'
              ref={importInputRef}
              onChange={onImportInputChange}
            />
          </label>
          <button
            className={importButtonDone ? BUTTON_DONE_CLASS_NAME : ''}
            disabled={importButtonDisabled}
            onClick={onImportButtonClick}
          >
            {importButtonDone
              ? IMPORT_BUTTON_DONE_VALUE
              : IMPORT_BUTTON_INIT_VALUE}
          </button>
        </div>
        <hr />
        <div>
          <Button
            initValue={EXPORT_BUTTON_INIT_VALUE}
            onClick={onExportButtonClick}
          />
        </div>
      </details>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('div#root'));
