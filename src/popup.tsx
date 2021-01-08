import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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

type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';
const WORD_WRAP = 'wordWrap';
const WORD_WRAP_ON = 'on';
const WORD_WRAP_OFF = 'off';

const PLACEHOLDER = `body {
  color: magenta;
}`;

const SAVE_BUTTON_INIT_VALUE = '保存';
const SAVE_BUTTON_SAVED_VALUE = 'しました';
const SAVE_BUTTON_SAVED_CLASS_NAME = 'saved';

const initHostnameSet: HostnameSet = JSON.parse(
  localStorage.getItem(HOSTNAME_SET) || '{}'
);
const lastSelectedHostname = (() => {
  const lastSelected = localStorage.getItem(LAST_SELECTED_HOST_NAME) || '';
  return initHostnameSet[lastSelected] ? lastSelected : '';
})();
const setLastSelectedHostname = (hostname: string): void =>
  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
// 行の折返し(デフォルトでON)
const initwordWrapChecked: boolean =
  localStorage.getItem(WORD_WRAP) !== WORD_WRAP_OFF;

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
  const [hostnameInputValue, setHostnameInputValue] = useState('');
  const [saveButtonSaved, setSaveButtonSaved] = useState(false);
  const [saveButtonTimer, setSaveButtonTimer] = useState<number>();

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

    const style = localStorage.getItem(hostname) || '';
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

    // 保存しました状態にする
    setSaveButtonSaved(true);
    // ちょっとしたら保存しました状態戻す
    clearTimeout(saveButtonTimer);
    setSaveButtonTimer(
      window.setTimeout(() => {
        setSaveButtonSaved(false);
      }, 1000)
    );

    // selectタグのoptionタグをhostnameにする
    setHostname(newHostname);
  }, [editor, hostnameSet, hostnameInputValue, saveButtonTimer]);

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
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onSaveButtonClick();
      }
    },
    [onSaveButtonClick]
  );

  return (
    <div id='container'>
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
        <button
          id='save-button'
          className={saveButtonSaved ? SAVE_BUTTON_SAVED_CLASS_NAME : ''}
          disabled={hostnameInputValue.length === 0}
          onClick={onSaveButtonClick}
        >
          {saveButtonSaved ? SAVE_BUTTON_SAVED_VALUE : SAVE_BUTTON_INIT_VALUE}
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('div#root'));
