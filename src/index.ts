import { GetStyleMessage, SendGetStyleResponse } from './background';

const message: GetStyleMessage = {
  method: 'getStyle',
  hostname: location.hostname,
};

const responseCallback: SendGetStyleResponse = (response) => {
  console.log(response);

  const style = response.style;
  if (style === null) {
    return;
  }

  document.querySelector('body')?.insertAdjacentHTML('beforeend', `<style data-usercss>${style}</style>`);
};

console.log('loaded');
window.chrome.runtime.sendMessage(message, responseCallback)
