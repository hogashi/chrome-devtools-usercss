export interface GetStyleMessage {
  hostname: string;
}

export type SendGetStyleResponse = (response: {
  style: string | null;
}) => void;

const getStyle = (message: GetStyleMessage, _: unknown, sendResponse: SendGetStyleResponse): void => {
  const hostname = message.hostname;
  if (hostname.length === 0) {
    sendResponse({ style: null });
    return;
  }

  const style = localStorage.getItem(hostname);
  sendResponse({ style });
};

window.chrome.runtime.onMessage.addListener(getStyle);
