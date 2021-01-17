import React, { useCallback, useMemo, useState } from 'react';
// import ReactDOM from 'react-dom';

export const BUTTON_DONE_CLASS_NAME = 'done';
const BUTTON_DONE_VALUE = 'しました';
const DONE_CLEAR_TIME_MS = 1000; // 1s

interface Props {
  id?: string;
  disabledWhen?: boolean;
  initValue: string;
  onClick: () => void;
}

export const Button = ({
  id,
  disabledWhen,
  initValue,
  onClick,
}: Props): JSX.Element => {
  const [timer, setTimer] = useState<number>();
  const [isDone, setIsDone] = useState(false);

  const onButtonClick = useCallback(() => {
    onClick();

    // しました状態にする
    setIsDone(true);
    // ちょっとしたらしました状態戻す
    clearTimeout(timer);
    setTimer(
      window.setTimeout(() => {
        setIsDone(false);
      }, DONE_CLEAR_TIME_MS)
    );
  }, [timer]);

  const value = useMemo(() => {
    return isDone ? BUTTON_DONE_VALUE : initValue;
  }, [isDone]);

  return (
    <button
      id={id}
      disabled={disabledWhen || isDone}
      className={isDone ? BUTTON_DONE_CLASS_NAME : ''}
      onClick={onButtonClick}
    >
      {value}
    </button>
  );
};
