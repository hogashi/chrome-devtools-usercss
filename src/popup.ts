type HostnameSet = {
  [hostname: string]: true;
};

const HOSTNAME_SET = 'hostnameSet';
const LAST_SELECTED_HOST_NAME = 'lastSelectedHostname';

const hostnameInput = document.querySelector<HTMLInputElement>('#hostname-input')!;
const hostnameSelector = document.querySelector<HTMLSelectElement>('#hostname-selector')!;
const defaultHostnameOption = document.querySelector<HTMLOptionElement>('#default-option')!;
const loadButton = document.querySelector<HTMLButtonElement>('#load-button')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#textarea')!;
const saveButton = document.querySelector<HTMLButtonElement>('#save-button')!;
let loadButtonTimer: ReturnType<typeof setTimeout>;
let saveButtonTimer: ReturnType<typeof setTimeout>;

const getHostnameSet = (): HostnameSet => JSON.parse(localStorage.getItem(HOSTNAME_SET) || '{}');
const addHostname = (hostname: string, set: HostnameSet): void => {
  set[hostname] = true;
  localStorage.setItem(HOSTNAME_SET, JSON.stringify(set));
};
const getStyleByHostname = (hostname: string): string => localStorage.getItem(hostname) || '';
const addOrUpdateStyleAndHostname = (set: HostnameSet, hostname: string, style: string): void => {
  addHostname(hostname, set);
  localStorage.setItem(hostname, style);
};

// TODO: in React
const hostnameSet = getHostnameSet();
Object.keys(hostnameSet).forEach(hostname => {
  const option = document.createElement('option');
  option.value = hostname;
  option.innerText = hostname;
  hostnameSelector.appendChild(option);
});

const rememberLasSelectedHostname = (hostname: string) => localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);

const onLoadButtonClick = (): void => {
  const selectedOption = hostnameSelector.selectedOptions[0];
  const hostname = selectedOption.value;
  if (hostname.length === 0) {
    loadButton.innerText = 'select hostname';
    clearTimeout(loadButtonTimer);
    loadButtonTimer = setTimeout(() => {
      loadButton.innerText = 'load';
    }, 1500);
    return;
  }
  hostnameInput.value = hostname;
  const style = localStorage.getItem(hostname) || '';
  textarea.value = style;

  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};

const onSaveButtonClick = (): void => {
  const hostname = hostnameInput.value;
  if (hostname.length === 0) {
    saveButton.innerText = 'input hostname';
    clearTimeout(saveButtonTimer);
    saveButtonTimer = setTimeout(() => {
      saveButton.innerText = 'save';
    }, 1500);
    return;
  }
  hostnameSet[hostname] = true;
  localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));

  const newStyle = textarea.value;
  localStorage.setItem(hostname, newStyle);

  localStorage.setItem(LAST_SELECTED_HOST_NAME, hostname);
};

loadButton.addEventListener('click', onLoadButtonClick);

saveButton.addEventListener('click', onSaveButtonClick);

const lastSelectedHostname = localStorage.getItem(LAST_SELECTED_HOST_NAME);
if (lastSelectedHostname && hostnameSet[lastSelectedHostname]) {
  document.querySelector<HTMLOptionElement>(`option[value="${lastSelectedHostname}"]`)!.selected = true;
  onLoadButtonClick();
}
