import { getStorageItem } from './lib/utils';

export type SendGetStyleResponse = (response: { style: string }) => void;

/**
 * sendResponseを非同期で呼んでもconnectionを保ってもらうことをtrueを返すことで示す
 * ref: https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
 * >This function becomes invalid when the event listener returns, unless
 * >you return true from the event listener to indicate you wish to send a
 * >response asynchronously (this will keep the message channel open to the
 * >other end until sendResponse is called).
 */
const getStyle = (
  message: '',
  _: unknown,
  sendResponse: SendGetStyleResponse
): true => {
  getStorageItem('style').then(style => sendResponse({ style }));
  return true;
};

chrome.runtime.onMessage.addListener(getStyle);
