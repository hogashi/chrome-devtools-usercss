import { getHostnameSet, getLocalStorageItem } from './lib/utils';

export interface GetStyleMessage {
  hostname: string;
}

export type SendGetStyleResponse = (response: { style: string }) => void;

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

  // ドメインを消しても(hostnameSetから消すだけで)localStorageからは消さないので
  // hostnameSetにあるときだけ返す
  getHostnameSet().then(hostnameSet => {
    if (!hostnameSet[hostname]) {
      sendResponse({ style: '' });
    }
    getLocalStorageItem(hostname).then(style => sendResponse({ style }));
  });

  return true;
};

window.chrome.runtime.onMessage.addListener(getStyle);
