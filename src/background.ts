import {
  getHostnameSet,
  getStorageItem,
  migrateToStorage_FORMIGRATE,
} from './lib/utils';

export interface GetStyleMessage {
  hostname: string;
}

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
  message: GetStyleMessage,
  _: unknown,
  sendResponse: SendGetStyleResponse
): true => {
  const hostname = message.hostname;
  if (hostname.length === 0) {
    sendResponse({ style: '' });
    return true;
  }

  // ドメインを消しても(hostnameSetから消すだけで)storageからは消さないので
  // hostnameSetにあるときだけ返す
  getHostnameSet().then(hostnameSet => {
    if (!hostnameSet[hostname]) {
      sendResponse({ style: '' });
    }
    getStorageItem(hostname).then(style => sendResponse({ style }));
  });

  return true;
};

chrome.runtime.onMessage.addListener(getStyle);

// TODO: みなさまがlocalStorageから脱出できてそうなくらい経ったら消す
window.chrome.runtime.onInstalled.addListener(migrateToStorage_FORMIGRATE);
