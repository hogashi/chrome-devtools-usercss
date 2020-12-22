type Method = 'setStyle' | 'getStyle';
export type SetStyleMessage = {
  method: 'setStyle',
  hostname: string,
  style: string,
}
export type GetStyleMessage = {
  method: 'getStyle',
  hostname: string,
}
type Message<T extends Method> = {
  setStyle: SetStyleMessage,
  getStyle: GetStyleMessage,
}[T];

export type SendSetStyleResponse = (response: {
  success: boolean;
}) => void;
export type SendGetStyleResponse = (response: {
  style: string | null;
}) => void;
type SendResponse<T extends Method> = {
  setStyle: SendSetStyleResponse,
  getStyle: SendGetStyleResponse,
}[T];

type MessageListener<T extends Method> = {
  setStyle: (message: SetStyleMessage, _: unknown, sendResponse: SendSetStyleResponse) => void,
  getStyle: (message: GetStyleMessage, _: unknown, sendResponse: SendGetStyleResponse) => void,
}[T];

const setStyle = (message: SetStyleMessage, sendResponse: SendSetStyleResponse) => {
  const hostname = message.hostname;
  localStorage[hostname] = message.style;

  const hostnames = JSON.parse(localStorage['hostnames'] || {});
  hostnames[hostname] = true;
  localStorage['hostnames'] = JSON.stringify(hostnames);
  sendResponse({ success: true });
};

const getStyle = (message: GetStyleMessage, sendResponse: SendGetStyleResponse) => {
  const hostname = message.hostname;
  if (!hostname) {
    sendResponse({ style: null });
    return;
  }

  const style = localStorage[hostname] || null;
  sendResponse({ style });
};

const messageListener = (message: Message<Method>, _: unknown, sendResponse: SendResponse<Method>): void => {
  console.log(message);
  switch (message.method) {
    case 'getStyle':
      getStyle(message, sendResponse as SendResponse<(typeof message)['method']>);
      break;
    case 'setStyle':
      setStyle(message, sendResponse as SendResponse<(typeof message)['method']>);
      break;
  }
};

window.chrome.runtime.onMessage.addListener(messageListener);
