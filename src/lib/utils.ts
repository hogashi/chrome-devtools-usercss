import {
  HostnameSet,
  HOSTNAME_SET,
  LAST_SELECTED_HOST_NAME,
} from './constants';

type Data = {
  hostnameSet: HostnameSet;
  lastSelectedHostname: string;
  styleSet: { [hostname: string]: string };
};

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

export const getLocalStorageItem = (
  key: string,
  defaultValue = ''
): Promise<string> => {
  return new Promise(resolve => {
    chrome.storage.local.get(
      [key],
      (result: { [key: string]: string | undefined }) => {
        resolve(result[key] || defaultValue);
      }
    );
  });
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

  const data: Data = {
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

export const importDataToLocalStorage = (str: string): Promise<boolean> => {
  let data: Data;
  try {
    data = JSON.parse(str);
  } catch {
    return Promise.resolve(false);
  }
  const { hostnameSet, lastSelectedHostname, styleSet } = data;
  const dataToSet: { [hostname: string]: string } = {
    [HOSTNAME_SET]: JSON.stringify(hostnameSet),
    [LAST_SELECTED_HOST_NAME]: lastSelectedHostname,
  };
  Object.keys(hostnameSet).map(hostname => {
    dataToSet[hostname] = styleSet[hostname];
  });
  return new Promise(resolve =>
    chrome.storage.local.set(dataToSet, () => resolve(true))
  );
};
