import store from 'store';
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
		var context = this,
			args = arguments;
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
	ele.remove();
	return {
		width: width,
		height: height
	};
};

export const hasPrivilege = (permission) => {
	var privileges = store.state.accountInfo.privileges;
	return privileges.find((privilege) => {
		return privilege.permission === permission && privilege.isDisplay === 1;
	});
};

export const resetRouterWithPrivilege = (routes) => {
	let privileges = store.state.accountInfo.privileges;
	routes.forEach((route) => {
		let curRedirect = route.redirect;
		if (curRedirect) {
			let curPermission = route.meta.permission;
			let curPrivilege = privileges.find((privilege) => {
				return privilege.permission === curPermission;
			});
			let redirectPrivilege = privileges.find((privilege) => {
				return privilege.link === curRedirect;
			});
			if (curPrivilege && redirectPrivilege == undefined) {
				let curParentId = curPrivilege.privilegeId;
				let curPrivilegeChildern = privileges.find((privilege) => {
					return privilege.parentId === curParentId;
				});
				if (curPrivilegeChildern) {
					route.redirect = curPrivilegeChildern.link;
				}
			}
		}
		if (route.children) {
			resetRouterWithPrivilege(route.children);
		}
	});
};

export const isRouterChecked = (route, link) => {
	// console.log('----------------');
	// console.log(route);
	let path = route.path;
	return path.indexOf(link) > -1;
};
export const limitLen = (obj, limit) => {
	let val = String(obj);
	let len = val.length + (val.match(/[^\x00-\xff]/g) || "").length;
	if (len > limit) {
		return false;
	}
	return true;
};

export const getCNLength = (string) => {
	let val = String(string);
	let len = val.length + (val.match(/[^\x00-\xff]/g) || "").length;
	return len;
};


export const floatAdd = (arg1, arg2) => {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
};

export const floatSub = (arg1, arg2) => {
	return floatAdd(arg1, -arg2);
};

export const floatMul = (arg1, arg2) => {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};

export const isEmptyObj = (obj) => {
	for (let name in obj) {
		if (obj.hasOwnProperty(name)) {
			return false;
		}
	}
	return true;
};

//获取平均点击单价
export const getAcp = (report) => {
	if (report.clickCount > 0) {
		return (report.totalFee / report.clickCount).toFixed(2);
	}
	return '-';
};
//获取点击率
export const getCtr = (report) => {
	if (report.pv > 0) {
		return (report.clickCount / report.pv * 100).toFixed(2) + '%';
	}
	return '-';
};
//获取退量数
export const getReCount = (report) => {
	return report.requestCount - report.bidCount;
};
//获取实际退量比
export const getReRate = (report) => {
	if (report.requestCount > 0) {
		return (gerReCount(report) / report.requestCount * 100).toFixed(2) + '%';
	}
	return '-';
};
//获取竞价率
export const getBidRate = (report) => {
	if (report.requestCount > 0) {
		return (report.bidCount / report.requestCount * 100).toFixed(2) + '%';
	}
	return '-';
};
//获取获胜率
export const getWinRate = (report) => {
	if (report.bidCount > 0) {
		return (report.winCount / report.bidCount * 100).toFixed(2) + '%';
	}
	return '-';
};

export const urlEncode = (param, key, encode) => {
	if (param == null) return '';
	let paramStr = '';
	let t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (let i in param) {
			let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
			paramStr += urlEncode(param[i], k, encode);
		}
	}
	return paramStr;
};