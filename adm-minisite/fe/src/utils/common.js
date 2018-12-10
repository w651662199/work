import CryptoJS from 'crypto-js';

export const mixin = (source, target) => {
	for (var i in target) {
		if (target.hasOwnProperty(i)) {
			source[i] = target[i];
		}
	}
	return source;
};

export const getHeaderA = (id) => {
	var time = new Date().getTime() + '';
	return time.substr(0, 4) + id + '_' + time.substr(4);
};

export const isNewAppVersion = () => {
	var reg = /\/\d{2,}\//g;
	var appVerMatch = navigator.userAgent.match(reg);
	if (appVerMatch != null && appVerMatch.length === 1) {
		var appVersion = appVerMatch[0];
		appVersion = appVersion.slice(1, appVersion.length - 1);
		return appVersion >= 35;
	}
	return false;
};

export const getQueryObject = (url) => {
	let search = url.substring(url.lastIndexOf("?") + 1);
	let obj = {};
	let reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, function(rs, $1, $2) {
		let name = decodeURIComponent($1);
		let val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
}

export const getAppVersion = () => {
	var reg = /\/\d{2,}\//g;
	var appVerMatch = navigator.userAgent.match(reg);
	if (appVerMatch != null && appVerMatch.length === 1) {
		var appVersion = appVerMatch[0];
		appVersion = appVersion.slice(1, appVersion.length - 1);
		return appVersion;
	}
	return 0;
};

export const getDeviceIdFromAgent = () => {
	var deviceId = '';
	var agentArr = navigator.userAgent.split('/');
	if (agentArr.length > 0) {
		if (/iPhone/g.test(navigator.userAgent)) {
			deviceId = agentArr[agentArr.length - 6];
		} else if (/Android/g.test(navigator.userAgent)) {
			deviceId = agentArr[agentArr.length - 7];
		} else {
			deviceId = agentArr[agentArr.length - 1];
		}
	}
	return deviceId;
};

export const getUrlInfoWithDeviceId = (url) => {
	var urlInfo = url.split('?');
	var urlParams = getKeyValueFromUrl(url);
	urlParams['deviceId'] = getDeviceIdFromAgent();
	return urlInfo[0] + '?' + urlEncode(urlParams).slice(1);
};

export const getKeyValueFromUrl = (url) => {
	var result = {};
	var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
	var arr = reg.exec(url);
	while (arr) {
		result[arr[2]] = arr[3];
		arr = reg.exec(url);
	}
	return result;
};

export const urlEncode = (param, key, encode) => {
	let vm = this;
	if (param == null) return '';
	var paramStr = '';
	var t = typeof(param);
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

var assign = function(target, varArgs) {
	// .length of function is 2
	if (target == null) {
		// TypeError if undefined or null
		throw new TypeError('Cannot convert undefined or null to object');
	}

	var to = Object(target);

	for (var index = 1; index < arguments.length; index++) {
		var nextSource = arguments[index];

		if (nextSource != null) {
			// Skip over if undefined or null
			for (var nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					to[nextKey] = nextSource[nextKey];
				}
			}
		}
	}
	return to;
};

export function setStyles(els, cssObj) {
	if ('transform' in cssObj) {
		cssObj['webkitTransform'] = cssObj['transform'];
	}
	if ('transition' in cssObj) {
		cssObj['webkitTransition'] = cssObj['transition'];
	}
	els.forEach(el => el && assign(el.style, cssObj));
};

export const getThumbnails = (imgUrl, width, height) => {
	if (/^http:\/\/gfs|^https:\/\/gfs/g.test(imgUrl)) {
		let resultUrl = /.jpg$|.png$|.gif$/g.test(imgUrl) ? imgUrl.replace(/.jpg$|.png$|.gif$/g, '_' + width + '_' + height + '$&') : imgUrl + '_' + width + '_' + height + '.jpg';
		return resultUrl.replace(/^http:\/\//, 'https://');
	}
	return imgUrl.replace(/^http:\/\//, 'https://');
};

const AESKEY = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");

export const encrypt = (word) => {
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, AESKEY, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
};

export const decrypt = (word) => {
	var decrypt = CryptoJS.AES.decrypt(word, AESKEY, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

export const getCookie = (name) => {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	}
	return null;
};

export const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};