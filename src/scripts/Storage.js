import { wrapAPI, wrapErrorAPI } from "./API";

export default class Storage {
  constructor() {
    throw new Error("Construct this object is not allowed!");
  }

  static initDB() {
    const defaultConfig = {
      playerInfo: {
        name: "Player",
        score: 0,
      },
      botInfo: {
        name: "Computer",
        score: 0,
      },
    };
    Object.entries(defaultConfig).forEach(([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    });
  }

  static get(queryKey) {
    const _storageContent = JSON.parse(window.localStorage.getItem(queryKey));
    if (_storageContent === null || Object.keys(_storageContent).length === 0) {
      return Promise.reject(new Error(`Error: ${400}`));
    }
    return Promise.resolve(wrapAPI(_storageContent));
  }

  static set(queryKey, object) {
    const _storageContent = JSON.parse(window.localStorage.getItem(queryKey));
    for (const key of Object.keys(object)) {
      if (
        Object.keys(_storageContent).findIndex((elem) => elem === key) === -1
      ) {
        return Promise.reject(new Error(`Error: ${400}`));
      }
    }
    Object.assign(_storageContent, object);
    window.localStorage.setItem(queryKey, JSON.stringify(_storageContent));
    return Promise.resolve(wrapAPI({ message: "Update DB successfully!" }));
  }
}
