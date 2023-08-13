import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { Button } from './Button';

import { useSaveOnCtrlS, useWordWrapChecked } from './lib/hooks';
import { setStorageItem, getStorageItem } from './lib/utils';

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

const PLACEHOLDER = `body {
  color: magenta;
}`;

const SAVE_BUTTON_INIT_VALUE = '保存';

const App: React.FC = () => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const { wordWrapChecked, onWordWrapChanged } = useWordWrapChecked(editor);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  useSaveOnCtrlS(saveButtonRef);

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

  // UserCSSをエディタにセットする
  useEffect(() => {
    getStorageItem('style').then(style => {
      editor?.setValue(style);
    });
  }, [editor]);

  // EventListenerたち

  // 保存ボタンを押したとき
  const onSaveButtonClick = useCallback((): void => {
    if (!editor) {
      // エディタあるはずだけどなかったらおかしいので何もせずに終わる
      console.log('editor not found');
      return;
    }

    // エディタに書かれてる文字列を取ってきてhostnameのUserCSSとして登録する
    const newValue = editor.getValue();
    setStorageItem({ style: newValue });
  }, [editor]);

  return (
    <>
      <div id='container'>
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
        <div id='editor' ref={editorDivRef}></div>
        <div id='save-section'>
          <Button
            id='save-button'
            ref={saveButtonRef}
            initValue={SAVE_BUTTON_INIT_VALUE}
            onClick={onSaveButtonClick}
          />
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('div#root'));
