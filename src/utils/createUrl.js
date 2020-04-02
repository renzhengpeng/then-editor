export default function createUrl(baseUrl, query) {
  if (!query || !baseUrl) {
    return baseUrl;
  }
  let arr = [];
  let queryString;
  Object.keys(query).forEach(key => {
    arr.push(key + '=' + query[key]);
  });
  queryString = arr.join('&');
  if (baseUrl.indexOf('?') !== -1) {
    return baseUrl + '&' + queryString;
  } else {
    return baseUrl + '?' + queryString;
  }
}