import {
  HostnameSet,
  HOSTNAME_SET,
  LAST_SELECTED_HOST_NAME,
  IS_ALREADY_MIGRATED_TO_STORAGE,
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

// _FORMIGRATEシリーズは移行用のメソッド
// TODO: みなさまがlocalStorageから脱出できてそうなくらい経ったら消す

export const getLocalStorageItem_FORMIGRATE = (
  key: string,
  defaultValue = ''
): string => {
  return localStorage.getItem(key) || defaultValue;
};

export const getHostnameSetFromLocalStorage_FORMIGRATE = (): HostnameSet => {
  try {
    return JSON.parse(getLocalStorageItem_FORMIGRATE(HOSTNAME_SET, '{}'));
  } catch {
    return {};
  }
};

export const getIsAlreadyMigratedToStorage_FORMIGRATE = (): Promise<boolean> =>
  getStorageItem(IS_ALREADY_MIGRATED_TO_STORAGE).then(value => {
    if (value === '') {
      return false;
    }
    return JSON.parse(value);
  });

export const migrateToStorage_FORMIGRATE = (): void => {
  getIsAlreadyMigratedToStorage_FORMIGRATE().then(isAlreadyMigrated => {
    // 移行済みならなにもしない
    if (isAlreadyMigrated) {
      return;
    }

    const hostnameSet = getHostnameSetFromLocalStorage_FORMIGRATE();
    const dataToMigrate: {
      [key: string]: string;
    } = {
      hostnameSet: JSON.stringify(hostnameSet),
      lastSelectedHostname: getLocalStorageItem_FORMIGRATE(
        LAST_SELECTED_HOST_NAME
      ),
    };
    Object.keys(hostnameSet).forEach(hostname => {
      dataToMigrate[hostname] = getLocalStorageItem_FORMIGRATE(hostname);
    });
    setStorageItem(dataToMigrate).then(() => {
      setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE();
    });
  });
};

export const setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE = (): Promise<true> =>
  setStorageItem({
    [IS_ALREADY_MIGRATED_TO_STORAGE]: JSON.stringify(true),
  });

// 何らかがおかしくて自動でmigrateToStorage_FORMIGRATEできなかった場合に,
// 人間の手で"localStorageからエクスポート→chrome.storageにインポート"をしたいことがある
// その"localStorageからのエクスポート"をするメソッド
export const downloadDataAsJsonFromLocalStorage_FORMIGRATE = (): void => {
  const hostnameSet = getHostnameSetFromLocalStorage_FORMIGRATE();
  const lastSelectedHostname = getLocalStorageItem_FORMIGRATE(
    LAST_SELECTED_HOST_NAME
  );

  const styleSet: { [hostname: string]: string } = {};
  Object.keys(hostnameSet).forEach(hostname => {
    styleSet[hostname] = getLocalStorageItem_FORMIGRATE(hostname);
  });

  const data: Data = {
    hostnameSet,
    lastSelectedHostname,
    styleSet,
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const aTag = document.createElement('a');
  aTag.href = window.URL.createObjectURL(blob);
  aTag.download = `chrome-usercss-hogashi-v020-${datetimeStr()}.json`;
  aTag.click();
};

// chrome.storage

export const setStorageItem = (
  item: { [key: string]: string },
  callback?: () => void
): Promise<true> => {
  return new Promise(resolve => {
    if (callback) {
      chrome.storage.local.set(item, (...args) => {
        callback(...args);
        resolve(true);
      });
      return;
    }
    chrome.storage.local.set(item, () => resolve(true));
  });
};

export const getStorageItem = (
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

export const getHostnameSet = (): Promise<HostnameSet> => {
  return getStorageItem(HOSTNAME_SET, '{}')
    .then(str => JSON.parse(str))
    .catch(() => {
      return {};
    });
};

export const downloadDataAsJson = (): void => {
  getHostnameSet().then(hostnameSet => {
    const styleSet: { [hostname: string]: string } = {};
    Promise.all(
      Object.keys(hostnameSet).map(hostname =>
        getStorageItem(hostname).then(css => {
          styleSet[hostname] = css;
        })
      )
    )
      .then(() =>
        getStorageItem(LAST_SELECTED_HOST_NAME).then(lastSelectedHostname => ({
          hostnameSet,
          lastSelectedHostname,
        }))
      )
      .then(({ hostnameSet, lastSelectedHostname }) => {
        const data: Data = {
          hostnameSet,
          lastSelectedHostname,
          styleSet,
        };

        const blob = new Blob([JSON.stringify(data)], {
          type: 'application/json',
        });
        const aTag = document.createElement('a');
        aTag.href = window.URL.createObjectURL(blob);
        aTag.download = `chrome-usercss-hogashi-${datetimeStr()}.json`;
        aTag.click();
      });
  });
};

export const importDataToStorage = (str: string): Promise<boolean> => {
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
    setStorageItem(dataToSet, () => {
      // 手でインポートしたときは移行済みの扱いとする
      setIsAlreadyMigratedToStorageAsTrue_FORMIGRATE().then(() =>
        resolve(true)
      );
    })
  );
};
