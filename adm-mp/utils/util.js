let CryptoJS = require('../resource/crypto-js.min.js');
export const formatTime = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (type == 3) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if (type == 2) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  } else if (type == 1) {
    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}

var formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const getThumbnails = (imgUrl, width, height) => {
  if (/^http:\/\/gfs|^https:\/\/gfs/g.test(imgUrl)) {
    let resultUrl = /.jpg$|.png$|.gif$/g.test(imgUrl) ? imgUrl.replace(/.jpg$|.png$|.gif$/g, '_' + width + '_' + height + '$&') : imgUrl + '_' + width + '_' + height + '.jpg';
    return resultUrl.replace(/^http:\/\//, 'https://');
  }
  return imgUrl.replace(/^http:\/\//, 'https://');
};

export const subLandingUrl = (url) => {
  let subReg = /(topic|story|shop|item|video|product|content)[^\/|\.]*\/([^\/|\.]+)/;
  let arr = url.match(subReg);
  return { type: arr[1], id: arr[2] };
};
export const copyObj = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
export const formatCount = (num) => {
  let n = num;
  if (num >= 10000) {
    n =  (num / 10000).toFixed(1) + "w";
  }
  return n;
}

const AESKEY = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");

export const encrypt = (word) => {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, AESKEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
export const decrypt = (word) => {
  let key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
  let decrypt = CryptoJS.AES.decrypt(decodeURIComponent(word), key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
export const getKeyValue = (url) => {
  let result = {};
  let reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
  let arr = reg.exec(url);
  while (arr) {
    result[arr[2]] = arr[3];
    arr = reg.exec(url);
  }
  return result;
}
export const urlEncode = (param, key, encode) => {
  let vm = this;
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
export const isEmptyObj = (obj) => {
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};
export const mixinSource = (source, target) => {
  for (var i in source) {
    if (source.hasOwnProperty(i) && target.hasOwnProperty(i)) {
      source[i] = target[i];
    }
  }
  return source;
};
export const mixin = (source, target) => {
  for (var i in target) {
    if (target.hasOwnProperty(i)) {
      source[i] = target[i];
    }
  }
  return source;
};
/**获取缩略图 */
export const getImage = (imgUrl, size) => {
  if (/^http:\/\/gfs|^https:\/\/gfs|^\/\//g.test(imgUrl)) {
    let resultUrl = /.jpg$|.png$|.gif$/g.test(imgUrl) ? imgUrl.replace(/.jpg$|.png$|.gif$/g, '_' + size + '_' + size + '$&') : imgUrl + '_' + size + '_' + size + '.jpg';
    return resultUrl.replace(/^http:\/\//, 'https://');
  }
  return imgUrl.replace(/^http:\/\//, 'https://');
}
/** 处理图片*/
export const handlerImg = (imgUrl) => {
  let url = '';
  if (imgUrl.indexOf('//') == 0) {
    url = 'http:' + imgUrl
  } else {
    url = imgUrl
  }
  return url
}
export const clearObj = (obj) => {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      obj[i] = '';
    }
  }
  return obj;
}
export const limitLen = (obj, limit) => {
  let val = String(obj);
  let len = val.length + (val.match(/[^\x00-\xff]/g) || "").length;
  if (len > limit) {
    return false;
  }
  return true;
};