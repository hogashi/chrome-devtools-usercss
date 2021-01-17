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

// 拡張機能のページはReactDevTools無力なのでeslint無視する
// eslint-disable-next-line react/display-name
export const Button = React.forwardRef<HTMLButtonElement, Props>(
  // React.forwardRefで型はついてるはずなのでeslint無視する
  // eslint-disable-next-line react/prop-types
  ({ id, disabledWhen, initValue, onClick }, ref) => {
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
    }, [onClick, timer]);

    const value = useMemo(() => {
      return isDone ? BUTTON_DONE_VALUE : initValue;
    }, [isDone]);

    return (
      <button
        id={id}
        disabled={disabledWhen || isDone}
        ref={ref}
        className={isDone ? BUTTON_DONE_CLASS_NAME : ''}
        onClick={onButtonClick}
      >
        {value}
      </button>
    );
  }
);
