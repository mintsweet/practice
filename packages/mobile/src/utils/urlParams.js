const urlHref = window.location.href;

export const getUrlParams = (url = urlHref) => {
  let tmpArr = [];
  const params = {};
  const urlArr = url.split('?');

  if (urlArr.length > 1) {
    tmpArr = urlArr[1].split('#')[0].split('&');
  }

  if (tmpArr.length > 0 && tmpArr[0] !== '') {
    tmpArr.forEach(item => {
      const tmp = item.split('=');
      params[tmp[0]] = tmp[1];
    });
  }

  return params;
};

