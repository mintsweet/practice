export function setLocal(key, token) {
  return sessionStorage.setItem(key, token);
}

export function getLocal(key) {
  return sessionStorage.getItem(key);
}

export function removeLocal(key) {
  return sessionStorage.removeItem(key);
}