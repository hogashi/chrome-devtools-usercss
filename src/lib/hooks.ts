import React, { useCallback, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { getLocalStorageItem } from './utils';

const WORD_WRAP = 'wordWrap';
const WORD_WRAP_ON = 'on';
const WORD_WRAP_OFF = 'off';

// 行の折返し(デフォルトでON)
const initwordWrapChecked: boolean =
  getLocalStorageItem(WORD_WRAP) !== WORD_WRAP_OFF;

// 行の折返しのcheckboxの扱い
export const useWordWrapChecked = (
  editor: monaco.editor.IStandaloneCodeEditor | null
): {
  wordWrapChecked: boolean;
  onWordWrapChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
} => {
  const [wordWrapChecked, setWordWrapChecked] = useState<boolean>(
    initwordWrapChecked
  );
  // 行の折返しのcheckboxを変えたとき
  const onWordWrapChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setWordWrapChecked(event.target.checked);
    },
    []
  );

  // 行の折返しの更新
  useEffect(() => {
    const wordWrap = wordWrapChecked ? WORD_WRAP_ON : WORD_WRAP_OFF;
    editor?.updateOptions({ wordWrap });
    localStorage.setItem(WORD_WRAP, wordWrap);
  }, [editor, wordWrapChecked]);

  return {
    wordWrapChecked,
    onWordWrapChanged,
  };
};
