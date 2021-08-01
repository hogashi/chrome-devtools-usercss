import { RefObject, useCallback, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { getStorageItem, setStorageItem } from './utils';

const WORD_WRAP = 'wordWrap';
const WORD_WRAP_ON = 'on';
const WORD_WRAP_OFF = 'off';

// 行の折返しのcheckboxの扱い
export const useWordWrapChecked = (
  editor: monaco.editor.IStandaloneCodeEditor | null
): {
  wordWrapChecked: boolean;
  onWordWrapChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
} => {
  // 行の折返し(デフォルトでON)
  const [wordWrapChecked, setWordWrapChecked] = useState<boolean>(true);

  // 最初に行の折り返しの設定を思い出す
  useEffect(() => {
    getStorageItem(WORD_WRAP).then(wordWrap => {
      // デフォルトでONにするためにisnotで比較する
      setWordWrapChecked(wordWrap !== WORD_WRAP_OFF);
    });
  }, []);

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
    setStorageItem({ [WORD_WRAP]: wordWrap });
  }, [editor, wordWrapChecked]);

  return {
    wordWrapChecked,
    onWordWrapChanged,
  };
};

// C-sで保存する
export const useSaveOnCtrlS = (
  saveButtonRef: RefObject<HTMLButtonElement>
): void => {
  useEffect(() => {
    if (!saveButtonRef.current) {
      return;
    }
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        saveButtonRef.current?.click();
      }
    });
  }, [saveButtonRef]);
};
