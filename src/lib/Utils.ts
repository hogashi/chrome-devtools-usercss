import {
  HostnameSet,
  HOSTNAME_SET,
  LAST_SELECTED_HOST_NAME,
} from './Constants';

const datetimeStr = (): string => {
  const date = new Date();
  return (
    `${date.getFullYear()}` +
    [
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ]
      .map(n => `0${n}`.slice(-2))
      .join('')
  );
};

export const getLocalStorageItem = (key: string, defaultValue = ''): string => {
  return localStorage.getItem(key) || defaultValue;
};
export const getHostnameSet = (): HostnameSet => {
  try {
    return JSON.parse(getLocalStorageItem(HOSTNAME_SET, '{}'));
  } catch {
    return {};
  }
};

export const downloadDataAsJson = (): void => {
  const hostnameSet = getHostnameSet();
  const lastSelectedHostname = getLocalStorageItem(LAST_SELECTED_HOST_NAME);

  const styleSet: { [hostname: string]: string } = {};
  Object.keys(hostnameSet).forEach(hostname => {
    styleSet[hostname] = getLocalStorageItem(hostname);
  });

  const data = {
    hostnameSet,
    lastSelectedHostname,
    styleSet,
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const aTag = document.createElement('a');
  aTag.href = window.URL.createObjectURL(blob);
  aTag.download = `chrome-usercss-hogashi-${datetimeStr()}.json`;
  aTag.click();
};

export const importDataToLocalStorage = (str: string): void => {
  const { hostnameSet, lastSelectedHostname, styleSet } = JSON.parse(str);
  localStorage.setItem(HOSTNAME_SET, JSON.stringify(hostnameSet));
  localStorage.setItem(LAST_SELECTED_HOST_NAME, lastSelectedHostname);
  Object.keys(hostnameSet).map(hostname => {
    localStorage.setItem(hostname, styleSet[hostname]);
  });
};
