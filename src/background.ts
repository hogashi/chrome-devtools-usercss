import {
  getHostnameSet,
  getStorageItem,
  migrateToStorage_FORMIGRATE,
} from './lib/utils';

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

window.chrome.runtime.onMessage.addListener(getStyle);

// TODO: みなさまがlocalStorageから脱出できてそうなくらい経ったら消す
window.chrome.runtime.onInstalled.addListener(migrateToStorage_FORMIGRATE);
