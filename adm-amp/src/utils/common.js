export const mixin = (source, target) => {
	for (var i in target) {
		if (target.hasOwnProperty(i)) {
			source[i] = target[i];
		}
	}
	return source;
};

export const mixinSource = (source, target) => {
	for (var i in source) {
		if (source.hasOwnProperty(i) && target.hasOwnProperty(i)) {
			source[i] = target[i];
		}
	}
	return source;
};

export const copyObj = (obj) => {
	return JSON.parse(JSON.stringify(obj));
};

export const objType = (obj) => {
	return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
};

export const formatDate = (value, format) => {
	let curDate = new Date(value);
	const o = {
		'M+': curDate.getMonth() + 1, // 月份
		'd+': curDate.getDate(), // 日
		'h+': curDate.getHours(), // 小时
		'm+': curDate.getMinutes(), // 分
		's+': curDate.getSeconds(), // 秒
		'q+': Math.floor((curDate.getMonth() + 3) / 3), // 季度
		'S': curDate.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (curDate.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	}
	return format;
};

export const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// 时间间隔 unit {day: true ...}
export const formatTimeByUnit = (sMs, eMs, unit) => {
	let _result = {};
	let timeMsMap = {
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000
	};
	var hasGone = 0;
	if (unit.day) {
		_result.day = Math.floor((eMs - sMs - hasGone) / timeMsMap.day) + 1;
		hasGone += _result.day * timeMsMap.day;
	}
	if (unit.hour) {
		_result.hour = Math.floor((eMs - sMs - hasGone) / timeMsMap.hour);
		hasGone += _result.hour * timeMsMap.hour;
	}
	if (unit.minute) {
		_result.minute = Math.floor((eMs - sMs - hasGone) / timeMsMap.minute);
		hasGone += _result.minute * timeMsMap.minute;
	}
	if (unit.second) {
		_result.second = Math.floor((eMs - sMs - hasGone) / timeMsMap.second);
		hasGone += _result.second * timeMsMap.second;
	}
	return _result;
};

// 从 url 中获取图片尺寸
export const getImgSize = (url) => {
	let ele = document.createElement('img');
	ele.setAttribute('src', url);
	ele.style.opacity = 0;
	document.body.appendChild(ele);
	let width = ele.clientWidth;
	let height = ele.clientHeight;
	if (!!window.ActiveXObject || "ActiveXObject" in window) {
		ele.removeNode(true);
	} else {
		ele.remove();
	}
	return {
		width: width,
		height: height
	};
};

export const isEmptyObj = (obj) => {
	for (let name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
};

export const floatAdd = (arg1, arg2) => {
	var r1,r2,m;
    try {
    	r1 = arg1.toString().split(".")[1].length;
    } catch(e) {
    	r1 = 0;
    }
    try {
    	r2 = arg2.toString().split(".")[1].length;
    } catch(e) {
    	r2 = 0;
    }
    m  =Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
};

export const floatSub = (arg1, arg2) => {
	return floatAdd(arg1, -arg2);
};

export const floatMul = (arg1, arg2) => {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
    	m += s1.split(".")[1].length;
    } catch(e) {}
    try {
    	m += s2.split(".")[1].length;
    } catch(e) {}
    return Number(s1.replace(".", ""))*Number(s2.replace(".", ""))/Math.pow(10, m);
};

export const strTrim =  (str) => {
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
export const limitLen = (obj,limit) => {
	let val = String(obj);
	let len = val.length+(val.match(/[^\x00-\xff]/g) || "").length;
	if(len>limit) {
		return false;
	}
	return true;
};

export const subStringName = (name) => {
	// let typeRegMatch = name.match(/\.[^\.]+$/);
	// let fileType = '';
	// let fileName = '';
	// if (typeRegMatch.length > 0) {
	// 	fileType = typeRegMatch[0];
	// 	fileName = name.replace('/\.[^\.]+$/', '');
	// }
	let nameArr = name.split('.');
	let nameArrLen = nameArr.length;
	let fileType = nameArr[nameArr.length - 1];
	nameArr = nameArr.splice(0, nameArr.length - 1);
	let string = nameArr.join('.');
	let len = string.length + (string.match(/[^\x00-\xff]/g) || "").length;
	if (len <= 20) {
		return string + '.' + fileType;
	} else {
		let stringArr = string.split('');
		let stringLength = 0;
		let str = '';
		for (let i = 0; i < stringArr.length; i++) {
			if (stringLength >= 20) break;
			if (/[^\x00-\xff]/g.test(stringArr[i])) {
				stringLength += 2;
				str += stringArr[i];
			} else {
				stringLength += 1;
				str += stringArr[i];
			}
		}
		return str + '....' + fileType;
	}
}
