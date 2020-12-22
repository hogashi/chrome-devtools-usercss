// バックグラウンドで実行される

const setStyle = (message, sendResponse) => {
  const hostname = message.hostname;
  localStorage[hostname] = message.style;

  const hostnames = JSON.parse(localStorage['hostnames'] || {});
  hostnames[hostname] = true;
  localStorage['hostnames'] = JSON.stringify(hostnames);
  sendResponse({ success: true });
};

const getStyle = (message, sendResponse) => {
  const hostname = message.hostname;
  if (!hostname) {
    sendResponse({ style: null });
    return;
  }

  const style = localStorage[hostname] || null;
  sendResponse({ style });
};

window.chrome.runtime.onMessage.addListener(
  (message, _, sendResponse) => {
    console.log(message);
    switch (message.method) {
      case 'getStyle':
        getStyle(message, sendResponse);
        break;
      case 'setStyle':
        setStyle(message, sendResponse);
        break;
      default:
        sendResponse({ style: null });
        break;
    }
  }
);
