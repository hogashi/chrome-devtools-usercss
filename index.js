// get style for current site from local storage

const styleString = 'body { border: 1px solid magenta; }';
document.querySelector('body').insertAdjacentHTML('beforeend', `<style>${styleString}</style>`);

const message = {
  method: 'getStyle',
  hostname: location.hostname,
};

const responseCallback = (response) => {
  console.log(response);

  const style = response.style;
  if (style === null) {
    return;
  }

  document.querySelector('body').insertAdjacentHTML('beforeend', `<style data-usercss>${style}</style>`);
};

console.log('loaded');
window.chrome.runtime.sendMessage(message, responseCallback)
