import { GetStyleMessage, SendGetStyleResponse } from './background';

const message: GetStyleMessage = {
  hostname: location.hostname,
};

const responseCallback: SendGetStyleResponse = (response) => {
  const style = response.style;
  if (style === null) {
    return;
  }

  document.querySelector('body')?.insertAdjacentHTML('beforeend', `<style data-usercss>${style}</style>`);
};

window.chrome.runtime.sendMessage(message, responseCallback)
