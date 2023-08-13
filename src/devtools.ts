import { SendGetStyleResponse } from './background';

const responseCallback: SendGetStyleResponse = ({ style }) => {
  if (style === '') {
    return;
  }

  // applyStyleSheet() は API にないし @types/chrome にもないので仕方なくanyにする
  // https://developer.chrome.com/docs/extensions/reference/devtools_panels/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.chrome.devtools.panels as any).applyStyleSheet(style);
};
window.chrome.runtime.sendMessage('', responseCallback);
