import { getHostnameSet, getLocalStorageItem } from './lib/utils';

export interface GetStyleMessage {
  hostname: string;
}

export type SendGetStyleResponse = (response: { style: string }) => void;

const getStyle = (
  message: GetStyleMessage,
  _: unknown,
  sendResponse: SendGetStyleResponse
): void => {
  const hostname = message.hostname;
  if (hostname.length === 0) {
    sendResponse({ style: '' });
    return;
  }

  // ドメインを消しても(hostnameSetから消すだけで)localStorageからは消さないので
  // hostnameSetにあるときだけ返す
  const hostnameSet = getHostnameSet();
  if (!hostnameSet[hostname]) {
    return;
  }

  const style = getLocalStorageItem(hostname);
  sendResponse({ style });
};

window.chrome.runtime.onMessage.addListener(getStyle);
