import { GetStyleMessage, SendGetStyleResponse } from './background';

const message: GetStyleMessage = {
  hostname: location.hostname,
};

const responseCallback: SendGetStyleResponse = ({ style }) => {
  if (style === '') {
    return;
  }

  document
    .querySelector('body')
    ?.insertAdjacentHTML('beforeend', `<style data-usercss>${style}</style>`);
};

window.chrome.runtime.sendMessage(message, responseCallback);
