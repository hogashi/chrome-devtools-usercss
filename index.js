// get style for current site from local storage

const styleString = 'body { border: 1px solid magenta; }';
document.querySelector('head').insertAdjacentHTML('beforeend', `<style>${styleString}</style>`);

