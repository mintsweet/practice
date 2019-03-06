export function getStorage(key) {
  return localStorage.getItem(key);
}

export function setStorage(key, value) {
  return localStorage.setItem(key, value);
}

export function delStorage(key) {
  return localStorage.removeItem(key);
}
