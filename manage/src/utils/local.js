export function setLocal(key, token) {
  return localStorage.setItem(key, token);
}

export function getLocal(key) {
  return localStorage.getItem(key);
}

export function removeLocal(key) {
  return localStorage.removeItem(key);
}