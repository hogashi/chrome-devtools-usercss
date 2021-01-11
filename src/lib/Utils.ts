import { HostnameSet, HOSTNAME_SET, LAST_SELECTED_HOST_NAME } from '../popup';

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

export const downloadDataAsJson = (): void => {
  const hostnameSet: HostnameSet = JSON.parse(
    localStorage.getItem(HOSTNAME_SET) || '{}'
  );
  const lastSelectedHostname =
    localStorage.getItem(LAST_SELECTED_HOST_NAME) || '';

  const styleSet: { [hostname: string]: string } = {};
  Object.keys(hostnameSet).forEach(hostname => {
    styleSet[hostname] = localStorage.getItem(hostname) || '';
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
