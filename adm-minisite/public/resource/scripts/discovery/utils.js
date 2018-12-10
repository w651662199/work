	var utils = {
		isGome: /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent),
		isMMBoard: /GomeMMBoard/ig.test(navigator.userAgent),
		isWeiXin: /MicroMessenger/g.test(navigator.userAgent),
		isQQ: /QQ/g.test(navigator.userAgent),
		isWeibo: /Weibo/g.test(navigator.userAgent),
		isIos: /iPhone/g.test(navigator.userAgent),
		isAndroid: /Android/g.test(navigator.userAgent),
		userId: '',
		token: '',
		getDeviceIdFromAgent: function() {
			var deviceId = '';
			var agentArr = navigator.userAgent.split('/');
			if (agentArr.length > 0) {
				if (utils.isIos) {
					deviceId = agentArr[agentArr.length - 6];
				} else if (utils.isAndroid) {
					deviceId = agentArr[agentArr.length - 7];
				} else {
					deviceId = agentArr[agentArr.length - 1];
				}
			}
			return deviceId;
		},
		commonParams: function() {
			var url = window.location.href;
			var result = {};
			var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
			var arr = reg.exec(url);
			while (arr) {
				result[arr[2]] = arr[3];
				arr = reg.exec(url);
			}
			return result;
		},
		getKeyValue: function(url) {
			var result = {};
			var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
			var arr = reg.exec(url);
			while (arr) {
				result[arr[2]] = arr[3];
				arr = reg.exec(url);
			}
			return result;
		},
		getDistrictIdByUrl: function(url) {
			var urlParam = this.getKeyValue(decodeURIComponent(url));
			var cityJson = urlParam.cityjson ? JSON.parse(urlParam.cityjson) : {};
			return cityJson.districtId ? cityJson.districtId : '';
		},
		urlEncode: function(param, key, encode) {
			if (param == null) return '';
			var paramStr = '';
			var t = typeof(param);
			if (t == 'string' || t == 'number' || t == 'boolean') {
				paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
			} else {
				for (var i in param) {
					var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
					paramStr += utils.urlEncode(param[i], k, encode);
				}
			}
			return paramStr;
		},
		getAppVersion: function() {
			var reg = /\/\d{2,}\//g;
			var appVerMatch = navigator.userAgent.match(reg);
			if (appVerMatch != null && appVerMatch.length === 1) {
				var appVersion = appVerMatch[0];
				appVersion = appVersion.slice(1, appVersion.length - 1);
				return appVersion;
			}
			return 0;
		},
		getUserId: function() {
			if (utils.isGome) {
				if (utils.getAppVersion() < 90) {
					AppInterface.call('/common/getLoginStatus', function(data) {
						if (data.success) {
							utils.userId = data.data.userId;
						}
					});
				} else {
					GomeJSBridge.ready(function() {
						GomeJSBridge.getUserInfo(function(data) {
							if (data.isLogined == true || data.isLogined == 'Y') {
								utils.userId = data.profileId;
							}
						});
					});
				}
			} else {
				utils.token = dsBridge.call('getToken');
			}
		},
		formatCurrency: function(currency) {
			var result = parseInt(currency, 10) * 0.01;
			return result.toFixed(2);
		},
		encrypt: function(word) {
			var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
			var srcs = CryptoJS.enc.Utf8.parse(word);
			var encrypted = CryptoJS.AES.encrypt(srcs, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		decrypt: function(word) {
			var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
			var decrypt = CryptoJS.AES.decrypt(word, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return CryptoJS.enc.Utf8.stringify(decrypt).toString();
		},
		getUncryptParams: function() {
			var params = utils.commonParams();
			var paramS = {};
			// 新版本参数拆成p,q,s
			if (params['s']) {
				var decryptS = utils.decrypt(params['s']);
				paramS = utils.getKeyValue('?' + decryptS);
			}
			if (params['p'] && params['q']) {
				var decryptP = utils.decrypt(params['p']);
				var decryptQ = utils.decrypt(params['q']);
				var paramsP = utils.getKeyValue('?' + decryptP);
				var paramsQ = decryptQ.split('=')[1];
				params = paramsP;
				params['logParam'] = paramsQ;
			}
			if (paramS) {
				for (var k in paramS) {
					params[k] = paramS[k];
				}
			}

			return params;
		},
		getHeaderA: function() {
			var time = new Date().getTime() + '';
			return time.substr(0, 4) + utils.userId + '_' + time.substr(4);
		}
	}