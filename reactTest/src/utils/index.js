
export function urlEncode(obj, key, encode) {
  if (obj == null) return '';
  var paramStr = '';
  var t = typeof(obj);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(obj) : obj);
  } else {
    for (var i in obj) {
      var k = key == null ? i : key + (obj instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(obj[i], k, encode);
    }
  }
  return paramStr;
}