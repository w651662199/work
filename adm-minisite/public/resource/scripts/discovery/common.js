$(function() {
	var utils = {
		isGome: /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent),
		isMMBoard: /GomeMMBoard/ig.test(navigator.userAgent),
		isWeiXin: /MicroMessenger/ig.test(navigator.userAgent),
		isQQ: /QQ/ig.test(navigator.userAgent),
		isWeibo: /Weibo/ig.test(navigator.userAgent),
		isIos: /iPhone/ig.test(navigator.userAgent),
		isAndroid: /Android/ig.test(navigator.userAgent),
		isMobile: /Android|iPhone|iPod|iPad/ig.test(navigator.userAgent),
		userId: '',
		guestId: '',
		appUrl: 'http://sj.qq.com/myapp/detail.htm?apkName=com.gome.mx.MMBoard',
		mmbUrl: 'http://meimeibang.gome.com.cn/mindex.html',
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
			var url = window.location;
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
		isEmptyObj: function(obj) {
			for (var name in obj) {
				if (obj.hasOwnProperty(name)) {
					return false;
				}
			}
			return true;
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
		isNewAppVersion: function() {
			var reg = /\/\d{2,}\//g;
			var appVerMatch = navigator.userAgent.match(reg);
			if (appVerMatch != null && appVerMatch.length === 1) {
				var appVersion = appVerMatch[0];
				appVersion = appVersion.slice(1, appVersion.length - 1);
				return appVersion >= 35;
			}
			return false;
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
		formatCurrency: function(currency) {
			var result = parseInt(currency, 10) * 0.01;
			return result.toFixed(2);
		},
		encrypt: function(word) {
			var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
			var srcs = CryptoJS.enc.Utf8.parse(word);
			var encrypted = CryptoJS.AES.encrypt(srcs, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		decrypt: function(word) {
			var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
			var decrypt = CryptoJS.AES.decrypt(decodeURIComponent(word), key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return CryptoJS.enc.Utf8.stringify(decrypt).toString();
		},
		getCookie: function(key) {
			var cookie = document.cookie;
			if (cookie.length > 0) {
				startIndex = cookie.indexOf(key + "=");
				if (startIndex != -1) {
					startIndex = startIndex + key.length + 1;
					endIndex = cookie.indexOf(";", startIndex);
					if (endIndex == -1) {
						endIndex = cookie.length;
					}
					return unescape(cookie.substring(startIndex, endIndex));
				}
			}
			return "";
		},
		getRandomInt: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		},
		getHeaderA: function() {
			var time = new Date().getTime() + '';
			return time.substr(0, 4) + utils.userId + '_' + time.substr(4);
		}
	};
	var commonHandler = {
		getUserId: function() {
			if (utils.isGome) {
				if (utils.getAppVersion() < 90) {
					AppInterface.call('/common/getLoginStatus', function(data) {
						if (data.success) {
							utils.userId = data.data.userId;
							// 曝光时因为需要拼接userId
							commonShare.doShareImpressionAction();
						}
						commonRebate.init();
					});
				} else {
					GomeJSBridge.ready(function() {
						GomeJSBridge.getUserInfo(function(data) {
							if (data.isLogined == true || data.isLogined == 'Y') {
								utils.userId = data.profileId;
								// 曝光时因为需要拼接userId
								commonShare.doShareImpressionAction();
							}
							commonRebate.init();
						});
					});
				}
			} else if (utils.isMMBoard) {
				utils.userId = dsBridge.call('getUID');
				utils.guestId = dsBridge.call('getGID');
				utils.token = dsBridge.call('getToken');
				var cookieIsCheckPass = +utils.getCookie('isCheckPass');
				if (utils.isIos) {
					if (cookieIsCheckPass == 1) {
						commonRebate.init();
					}
				} else {
					commonRebate.init();
				}
			} else {
				// $('.m-downapp').show();
				$('.detail-title').css('margin-bottom', '0.1rem');
				$('.detail_footer p').css('padding-bottom', '0');
				commonHandler.getWapUserId();
				commonRebate.init();
				if (!utils.isWeiXin) {
					commonShare.doShareImpressionAction();
				}
			}
		},
		getWapUserId: function() {
			$.ajax({
				url: '/api/mm/userId',
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if (result.code == 200) {
						var data = result['data'];
						utils.userId = data['userId'];
					}
				}
			});
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
		showCommonCover: function(text) {
			$('body').css('overflow', 'hidden');
			$('.cover-common .cover-text').text(text);
			$('.cover-common .share').show();
			$('.cover-common').show();
		}
	};
	var commonShare = {
		shareOptions: {
			title: $CONFIG['cardTitle'].replace(/[<>@# {}\[\]^`\\%~|]/g, ''),
			desc: $CONFIG['cardDescription'].replace(/[<>@# {}\[\]^`\\%~|]/g, ''),
			imgUrl: /.jpg$|.png$/g.test($CONFIG['cardImage']) ? window.btoa($CONFIG['cardImage']) : window.btoa($CONFIG['cardImage'] + '.jpg'),
			link: '',
			type: 'default',
			btnType: '2,10,11,12'
		},
		shareBtn: $(".toolsItem[data-type='share']"),
		questionBtn: $(".toolsItem[data-type='question']"),
		init: function() {
			//分享曝光 移动到获取userId成功后
			// commonShare.doShareImpressionAction();
			commonShare.shareBtn.on('click', function() {
				if (utils.isGome) {
					if (utils.isNewAppVersion()) {
						commonShare.shareInGome('default');
					} else {
						$('.common-share-tips').show(200);
						$('.share-container').addClass('slide-in');
					}
				} else if (utils.isMMBoard) {
					//美媒榜app
					commonShare.shareInMMBoard();
				} else {
					commonShare.shareInWarp();
				}
			});
			$('.common-share-tips, .share-cancel').on('click', function() {
				$('.common-share-tips').hide();
				$('.share-container').removeClass('slide-in');
			});
			$('.share-item').on('click', function() {
				var shareType = $(this).attr('data-type');
				commonShare.shareInGome(shareType);
			});
		},
		shareInGome: function(type) {
			if (utils.userId !== '') {
				commonShare.doShareAction(type);
			} else {
				if (utils.getAppVersion() < 90) {
					AppInterface.call('/common/logout', function(data) {
						if (data.success) {
							AppInterface.call('/common/login', function(data) {
								if (data.success) {
									utils.userId = data.data.userId;
									commonShare.doShareAction(type);
								}
							});
						}
					});
				} else {
					GomeJSBridge.isLogin(function(data) {
						if (data.isLogined == 'Y') {
							GomeJSBridge.getUserInfo(function(data) {
								utils.userId = data.profileId;
								commonShare.doShareAction(type);
							});
						} else {
							GomeJSBridge.login(function(data) {
								if (data.isLogined == 'Y') {
									GomeJSBridge.getUserInfo(function(data) {
										utils.userId = data.profileId;
										commonShare.doShareAction(type);
									});
								}
							}, null, {
								refresh: false
							});
						}
					}, function(data) {
						console.log('error')
					});
				}
			}
		},
		shareInMMBoard: function() {
			var params = utils.commonParams();
			var paramData = {
				shareUrl: (window.location.href).split('?')[0],
				q: params['q'],
				title: commonShare.shareOptions.title,
				desc: commonShare.shareOptions.desc,
				imageUrl: /.jpg$|.png$/g.test($CONFIG['cardImage']) ? $CONFIG['cardImage'] : $CONFIG['cardImage'] + '.jpg',
				rebateMoney: commonRebate.shareRebateBid
			};
			if (params['p']) {//老版本兼容
				var uncryParams = commonHandler.getUncryptParams();
				paramData['p'] = params['p'];
				paramData['adId'] = uncryParams['adId'];
			}
			if (paramData.shareUrl.indexOf('olink') > -1) {
				var olink = $('.js-iframe').attr('src');
				if (olink.indexOf('mevent.meixincdn.com/static/html/hRebate.html') > -1) {
					paramData.shareUrl = $CONFIG['mdomain'] + 'hrebate';
					paramData.title = '[有人@你]轻松赚钱谁不爱？';
					paramData.desc = '最高领取880元红包可提现';
					paramData.imageUrl = $CONFIG['mdomain'] + 'resource/images/highRebateShare.jpg';
					// paramData.q = paramData.q + '&chl=33';
				}
			}
			dsBridge.call('openShare', paramData);
		},
		doShareAction: function(type) {
			var landPage = (window.location.href).split('?')[0];
			var urlParams = utils.commonParams();
			var ajaxParams = {};
			var appShareParams = commonShare.shareOptions;
			var timestamp = new Date().getTime();
			appShareParams.type = type;

			ajaxParams.p = 1;
			ajaxParams.q = urlParams.q;

			commonShare.share(ajaxParams);
			if (urlParams.s) {
				ajaxParams.s = urlParams.s;
			}
			ajaxParams.url = landPage;
			commonShare.getShareUrl(ajaxParams, appShareParams);
		},
		share: function(params) {
			var reqData = {
				url: '/api/mm/sr',
				type: 'get',
				data: params
			};
			if (utils.isGome) {
				reqData.headers = {
					a: utils.getHeaderA()
				}
			}
			$.ajax(reqData);
		},
		shareInWarp: function() {
			if (utils.isWeiXin) {
				if (!utils.userId) {
					$('body').css('overflow', 'hidden');
					$('.cover-share').show();
				} else {
					$('body').css('overflow', 'hidden');
					$('.share-guide').show();
					// commonShare.showWrapShareMessage('请点击右上角使用自带分享功能分享');
				}
			} else {
				commonHandler.showCommonCover('发起分享');
			}
		},
		showWrapShareMessage: function(msg) {
			var $div = $('<div class="alert_second" id="alertSecond"></div>');
			$div.text(msg);
			$("body").append($div);
			setTimeout(function() {
				$div.remove();
			}, 1500);
		},
		doShareImpressionAction: function() {
			var urlParams = utils.commonParams();
			if (urlParams['p']) {//老版本兼容
				var params = commonHandler.getUncryptParams();
				if (params['shareId'] !== undefined) {
					params['flag'] = utils.isGome ? 1 : 0;
					if (utils.isGome) {
						var relationIdArr = decodeURIComponent(params['relationId']).split(',');
						var level = Number(relationIdArr[relationIdArr.length - 1]);
						if (relationIdArr.length === 3) {
							params['relationId'] = relationIdArr[0] + ',' + relationIdArr[1] + ',' + utils.userId + ',' + level;
						} else {
							params['relationId'] = relationIdArr[0] + ',' + utils.userId + ',' + level;
						}
					}
					var paramQ = utils.encrypt('logParam=' + params['logParam']);
					delete params['logParam'];
					var shareRebateParams = {
						p: utils.encrypt(utils.urlEncode(params).slice(1)),
						q: paramQ
					};
					$.ajax({
						url: $CONFIG['shareRebateUrl'] + '?p=' + shareRebateParams.p + '&q=' + shareRebateParams.q,
						type: 'get',
						dataType: 'jsonp',
						success: function(result) {}
					});
				}
			} else {
				if (!urlParams.s) return;
				var ajaxParams = {};
				if (utils.isWeiXin) {
					ajaxParams.o = weixin.openId;
					ajaxParams.ot = 0;
				}
				ajaxParams.s = urlParams.s;
				ajaxParams.q = urlParams.q;
				var reqData = {
					url: '/api/mm/shareRebate',
					data: ajaxParams,
					type: 'get'
				};
				if (utils.isGome) {
					reqData.headers = {
						a: utils.getHeaderA()
					}
				}
				$.ajax(reqData);
			}
		},
		getShareUrl: function(params, appShareOptions, wxConfig) {
			var reqData = {
				url: '/api/mm/gs',
				type: 'get',
				data: params,
				success: function(res) {
					if (utils.isGome) {
						if (utils.getAppVersion() < 90) {
							appShareOptions.link = window.btoa(res.data.url);
							AppInterface.call('/common/share', appShareOptions);
						} else {
							var param = {
								title: appShareOptions.title,
								shareDesc: appShareOptions.desc,
								shareImageUrl: /.jpg$|.png$/g.test($CONFIG['cardImage']) ? $CONFIG['cardImage'] : $CONFIG['cardImage'] + '.jpg',
								shareUrl: res.data.url,
								channel: 'link',
								platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'CopyLink']
							};
							GomeJSBridge.callShareComp(null, null, param);
						}
					} else if (utils.isWeiXin) {
						weixin.shareUrl = res.data.url;
						weixin.initWeixin(wxConfig);
					}
				}
			};
			if (utils.isGome) {
				reqData.headers = {
					a: utils.getHeaderA()
				};
			}

			$.ajax(reqData);
		}
	};
	var middlePage = {
		init: function() {
			var urlParams = utils.commonParams();
			if (urlParams['p']) {
				var params = commonHandler.getUncryptParams();
				if (!params['slotType']) {
					params['slotType'] = 1;
				}
				if (!!params['shareId']) {
					params['sourceType'] = 2;
				} else {
					params['sourceType'] = 1;
				}
				params['slotId'] = !!params['slotId'] ? params['slotId'] : (utils.isGome ? $CONFIG['slotId'] : $CONFIG['wapSlotId']);
				$.ajax({
					url: $CONFIG['middlePageImpressionUrl'],
					type: 'get',
					dataType: 'jsonp',
					data: params,
					success: function() {}
				});
			} else {
				$.ajax({
					url: $CONFIG['shareServerDomain'] + '/mp',
					data: {
						q: urlParams.q,
						sourceType: urlParams.s ? 2: 1
					},
					type: 'get',
					dataType: 'jsonp',
					success: function() {}
				});
			}
			if (!utils.isGome && !utils.isMMBoard) {
				// $('.m-downapp').show();
				$('.detail-title').css('margin-bottom', '0.1rem');
				$('.detail_footer p').css('padding-bottom', '0');
			}
		}
	};
	var commonRebate = {
		isWatchRebate: false,
		shareRebateBid: '',
		init: function() {
			var urlParams = utils.commonParams();
			if (urlParams['p']) {
				commonRebate.oldRebate();
			} else {
				var reqData = {
					url: '/api/mm/rebateStatus?q=' + urlParams.q,
					method: 'get',
					success: commonRebate.handleRebate
				};
				if (utils.isGome) {
					reqData.headers = {
						a: utils.getHeaderA()
					};
				} else if (utils.isMMBoard) {
					reqData.headers = {
						Authorization: utils.token
					};
				}

				$.ajax(reqData);
			}
		},
		handleRebate: function(data) {
			if (data.code == 200 && data.data.rebateStatus == 1) {
				var rebate = data.data;
				if (rebate.shareRebateBid > 0 || rebate.watchRebateBid > 0 || rebate.researchRebateBid > 0) {
					$(".share_tips").show();
					$('.share_tips .rebate-btn').on('click', function() {
						if (utils.isMMBoard) {
							dsBridge.call('openNewPage', 'https://mevent.meixincdn.com/mm/rebate-rule.html');
						} else {
							$('.common-share-tips').css('display', 'block');
							$('.rebate-rule').css('opacity', 1).addClass('slide-in');
							$('body').css('overflow', 'hidden');
						}
					});
					$('.common-share-tips').on('click', function() {
						$('.common-share-tips').css('display', 'none');
						$('.rebate-rule').removeClass('slide-in').css('opacity', 0);
						$('body').css('overflow', 'auto');
					});
				}
				if (rebate.shareRebateBid > 0) {
					commonRebate.shareRebateBid = rebate.shareRebateBid;
					$("#J_shareRebat").text("分享赚" + rebate.shareRebateBid);
					$('.rebate-rule .share-rebate').show();
					if (rebate.shareRebateGotFlg == 1) {
						$("#J_shareRebat").addClass('actived');
					}
				} else {
					$("#J_shareRebat").hide();
					$('.rebate-rule .share-rebate').hide();
				}
				if (rebate.watchRebateBid > 0) {
					commonRebate.isWatchRebate = true;
					if (rebate.watchRebateGotFlg == 1) {
						$("#J_watchRebate").addClass('actived');
					}
					$("#J_watchRebate").text("视频赚" + rebate.watchRebateBid);
					$('.rebate-rule .video-rebate').show();
				} else {
					commonRebate.isWatchRebate = false;
					$("#J_watchRebate").hide();
					$('.rebate-rule .video-rebate').hide();
				}
				if (rebate.researchRebateBid > 0) {
					commonQuestion.questionId = rebate.questionId;
					if (rebate.researchAppearFlg == 1) {
						$(".toolsItem[data-type='question']").show();
						$(".toolsItem[data-type='share'] span").addClass('toolsItem_span');
					} else {
						$(".toolsItem[data-type='question']").hide();
						$(".toolsItem[data-type='share'] span").removeClass('toolsItem_span');
					}
					if (rebate.researchRebateGotFlg == 1) {
						$("#J_researchRebate").addClass('actived');
					}
					$("#J_researchRebate").text("调研赚" + rebate.researchRebateBid);
					$('.rebate-rule .survey-rebate').show();
				} else {
					$("#J_researchRebate").hide();
					$('.rebate-rule .survey-rebate').hide();
				}
			}
		},
		oldRebate: function() {
			var param = commonHandler.getUncryptParams();

			if (param['relationId'] && !utils.isMMBoard) {
				var relation = decodeURIComponent(param['relationId']).split(',');
				var level = Number(relation[relation.length - 1]);
				if (level >= 1) {
					return;
				}
				if (relation.length == 2 && relation[0] == utils.userId) {
					return;
				}
			}

			var flightJobId = param['flightJobId'];
			param['slotId'] = $CONFIG['slotId'];
			param['userId'] = utils.userId;
			if (utils.isMMBoard) {
				param['guestId'] = utils.guestId;
			}
			$.ajax({
				url: $CONFIG['rebateBudgetUrl'],
				data: param,
				type: 'GET',
				dataType: 'jsonp',
				success: function(result) {
					var status = result['data']['status'];
					if (status != 1) {
						return;
					}
					// 分享返利价格
					var shareRebateBid = parseInt(result['data']['rebatePrice']['shareRebateBid']);
					var shareRebateFlag = parseInt(result['data']['rebatePrice']['shareRebateGotFlg']);
					// 调研问卷返利价格
					var researchRebateBid = parseInt(result['data']['rebatePrice']['researchRebateBid']);
					var researchRebateFlag = parseInt(result['data']['rebatePrice']['researchRebateGotFlg']);
					var videoRebateFlag = parseInt(result['data']['rebatePrice']['watchRebateGotFlg']);
					var researchAppearFlag = result['data']['rebatePrice']['researchAppearFlg'];
					// 视频返利价格
					var watchRebateBid = parseInt(result['data']['rebatePrice']['watchRebateBid']);
					// 有返利时显示返利标签
					if (shareRebateBid > 0 || researchRebateBid > 0 || watchRebateBid > 0) {
						$(".share_tips").show();
						$('.share_tips .rebate-btn').on('click', function() {
							if (utils.isMMBoard) {
								dsBridge.call('openNewPage', 'https://mevent.meixincdn.com/mm/rebate-rule.html');
							} else {
								$('.common-share-tips').css('display', 'block');
								$('.rebate-rule').css('opacity', 1).addClass('slide-in');
								$('body').css('overflow', 'hidden');
							}
						});
						$('.common-share-tips').on('click', function() {
							$('.common-share-tips').css('display', 'none');
							$('.rebate-rule').removeClass('slide-in').css('opacity', 0);
							$('body').css('overflow', 'auto');
						});
					}
					if (shareRebateBid > 0) {
						commonRebate.shareRebateBid = utils.formatCurrency(shareRebateBid);
						if (shareRebateFlag == 1) {
							$("#J_shareRebat").addClass('actived');
						}
						$("#J_shareRebat").text("分享赚" + utils.formatCurrency(shareRebateBid));
						$('.rebate-rule .share-rebate').show();
					} else {
						$("#J_shareRebat").hide();
						$('.rebate-rule .share-rebate').hide();
					}
					if (researchRebateBid > 0) {
						if (utils.isMMBoard) {
							commonQuestion.questionId = result['data']['rebatePrice']['questionId'];
							if (researchAppearFlag == 0) {
								$(".toolsItem[data-type='question']").css('display', 'none');
							}
						} else {
							commonQuestion.init();
						}
						if (researchRebateFlag == 1) {
							$("#J_researchRebate").addClass('actived');
						}
						$("#J_researchRebate").text("调研赚" + utils.formatCurrency(researchRebateBid));
						$('.rebate-rule .survey-rebate').show();
					} else {
						$("#J_researchRebate").hide();
						$('.rebate-rule .survey-rebate').hide();
					}
					if (watchRebateBid > 0) {
						commonRebate.isWatchRebate = true;
						if (videoRebateFlag == 1) {
							$("#J_watchRebate").addClass('actived');
						}
						$("#J_watchRebate").text("视频赚" + utils.formatCurrency(watchRebateBid));
						$('.rebate-rule .video-rebate').show();
					} else {
						commonRebate.isWatchRebate = false;
						$("#J_watchRebate").hide();
						$('.rebate-rule .video-rebate').hide();
					}
				}
			});
		}
	};

	var commonPrice = {
		productIdList: [],
		districtId: '',
		getAreaCode: function() {
			commonPrice.districtId = utils.getDistrictIdByUrl(window.location);
		},
		initProductConList: function() {
			var items = $('.item-price');
			items.forEach(function(item, index, array) {
				var itemDataId = item.getAttribute('data-id');
				commonPrice.productIdList.push(itemDataId);
			});
		},
		getProductsPrice: function() {
			if (commonPrice.productIdList.length == 0) {
				return;
			}
			var priceUrl = "/api/prices" + '?ids=' + commonPrice.productIdList.join(',') + '&areaCode=' + commonPrice.districtId;
			$.ajax({
				url: priceUrl,
				type: 'GET',
				dataType: 'jsonp',
				success: function(result) {
					var priceArr = result['data'];
					if (priceArr == null) {
						return;
					}
					priceArr.forEach(function(item, index, array) {
						$(".price_" + item.skuId).html('<span>￥' + item.price + '</span>');
					});
				}
			});
		},
		init: function() {
			commonPrice.getAreaCode();
			commonPrice.initProductConList();
			commonPrice.getProductsPrice();
		}
	};

	var commonShop = {
		init: function() {
			var shopId = $CONFIG['shopId'];
			if (shopId == undefined) {
				return;
			}
			var shopUrl = "/api/shop" + '?id=' + shopId;
			$.ajax({
				url: shopUrl,
				type: 'GET',
				dataType: 'jsonp',
				success: function(result) {
					var data = result['data'];
					$("#J_shopCollection_" + shopId).text(data['collectionQuantity']);
				}
			});
		}
	};
	var commonQuestion = {
		userId: 0,
		appearFlag: 0,
		isAnswer: 0,
		hasGetIsAnswer: false,
		questionId: 0,
		init: function() {
			commonQuestion.questionHandler('init');
		},
		questionHandler: function(type) {
			var params = commonHandler.getUncryptParams();
			var questionData;
			if (type === 'init') {
				questionData = {
					logParam: params['logParam'],
					flightJobId: params['flightJobId'],
					slotId: $CONFIG['slotId']
				};
				commonQuestion.getQuestionInfo('init', questionData);
			} else if (type === 'click') {
				questionData = {
					userId: utils.userId,
					logParam: params['logParam'],
					flightJobId: params['flightJobId'],
					slotId: $CONFIG['slotId']
				};
				commonQuestion.getQuestionInfo('click', questionData);
			}
		},
		openSurvey: function() {
			var urlParams = utils.commonParams();
			var surveyUrl = $CONFIG['mdomain'] + 'survey/' + commonQuestion.questionId + '.html?q=' + urlParams.q;
			window.location.href = surveyUrl;
		},
		tap: function() {
			if (utils.isGome) {
				if (utils.userId !== '') {
					commonQuestion.openSurvey();
				} else {
					if (utils.getAppVersion() < 90) {
						AppInterface.call('/common/logout', function(data) {
							if (data.success) {
								AppInterface.call('/common/login', function(data) {
									if (data.success) {
										utils.userId = data.data.userId;
										commonQuestion.openSurvey();
									}
								});
							}
						});
					} else {
						GomeJSBridge.isLogin(function(data) {
							if (data.isLogined == 'Y') {
								GomeJSBridge.getUserInfo(function(data) {
									utils.userId = data.profileId;
									commonQuestion.openSurvey();
								});
							} else {
								GomeJSBridge.login(function(data) {
									if (data.isLogined == 'Y') {
										GomeJSBridge.getUserInfo(function(data) {
											utils.userId = data.profileId;
											commonQuestion.openSurvey();
										});
									}
								}, null, {
									refresh: false
								});
							}
						}, function(data) {
							console.log('error')
						});
					}
				}
			} else if (utils.isMMBoard) {
				var surveyUrl, params = utils.commonParams();
				if (params['p']) {
					surveyUrl = $CONFIG['mdomain'] + 'survey/' + commonQuestion.questionId + '.html?' + utils.urlEncode(params).slice(1);
				} else {
					surveyUrl = $CONFIG['mdomain'] + 'survey/' + commonQuestion.questionId + '.html?q=' + params.q;
				}
				dsBridge.call('openInvestPage', surveyUrl);
			} else {
				//浏览器或微信中点击
				// commonHandler.showCommonCover('参与调研问卷');
				$('body').css('overflow', 'hidden');
				$('.cover-common .question').text('在美媒榜App内参与问卷调研，贡献您的绝佳想法。').show();
				$('.cover-common').show();
			}
		}

	};
	var video = {
		isPlayed: false,
		init: function() {
			// 非视频页面不执行播放逻辑
			// @todo
			if ($CONFIG['videoId'] == undefined) {
				return;
			}
			if (!utils.isGome) {
				$('.video-poster').show();
				$('.video-icon').show();
				$('.video-box').on('click', function() {
					commonHandler.showCommonCover('观看视频');
				});
			} else {
				var v = new MeixinPlayer();
				var config = {
					autoSize: 1,
					env: $CONFIG['env'],
					poster: $CONFIG['videoImage'],
				}

				v.init($CONFIG['videoId'], 'videoContainer', config);
				// 开始播放时调用视频计数接口
				v.on('videoPlayed', function() {
					$.ajax({
						url: $CONFIG['setVideoCountUrl'] + $CONFIG['videoId'],
						type: 'GET',
						dataType: 'jsonp',
					});
				}, null);
				v.on('playStop', function() {
					// 多次播放只上报一次
					if (!video.isPlayed) {
						var urlParams = utils.commonParams();
						var reqData = {
							url: '/api/mm/vp?q=' + urlParams.q,
							method: 'get',
						};
						if (utils.isGome) {
							reqData.headers = {
								a: utils.getHeaderA()
							};
						}
						$.ajax(reqData);
						video.isPlayed = true;
					}
				}, null);
			}

		}
	};
	var weixin = {
		openId: '',
		weixinConfig: [],
		weixinSDKUrl: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
		url: '/api/weixin',
		shareUrl: window.location.href,
		init: function() {
			var script = document.createElement('script');
			var parentNode = document.getElementsByTagName('head')[0] || document.body;
			script.async = true;
			script.src = weixin.weixinSDKUrl;
			script.onload = weixin.getWeixinConfigInfor;
			parentNode.appendChild(script);
		},
		getWeixinConfigInfor: function() {
			var params = utils.commonParams();
			var data = {
				shareUrl: encodeURIComponent(window.location.href.split('#')[0])
			};
			if (params['code']) {
				data['code'] = params['code'];
			}
			$.ajax({
				url: weixin.url,
				type: 'GET',
				data: data,
				dataType: 'jsonp',
				success: function(result) {
					var data = result['data'];
					weixin.openId = data['openId'] ? data['openId'] : '';
					commonShare.doShareImpressionAction();
					var ajaxParams = {
						url: window.location.href.split('?')[0],
						q: params.q,
						o: weixin.openId,
						ot: 0,
						p: 2
					};
					if (params.s) {
						ajaxParams.s = params.s;
					}
					commonShare.getShareUrl(ajaxParams, null, data);
					// weixin.initWeixin(data);
				}
			});
		},
		initWeixin: function(result) {
			wx.config({
				debug: false,
				appId: result['wx_appid'],
				timestamp: result['wx_timestamp'],
				nonceStr: result['wx_noncestr'],
				signature: result['wx_signature'],
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareQZone'
				]
			});
			wx.ready(function() {
				wx.onMenuShareTimeline({
					title: commonShare.shareOptions.title,
					link: weixin.shareUrl,
					imgUrl: window.atob(commonShare.shareOptions.imgUrl),
					success: function () {
						var params = utils.commonParams();
						var ajaxParams = {
							q: params.q,
							o: weixin.openId,
							ot: 0,
							p: 2
						};
						commonShare.share(ajaxParams);
					}
				});
				wx.onMenuShareAppMessage({
					title: commonShare.shareOptions.title,
					desc: commonShare.shareOptions.desc,
					link: weixin.shareUrl,
					imgUrl: window.atob(commonShare.shareOptions.imgUrl),
					success: function () {
						var params = utils.commonParams();
						var ajaxParams = {
							q: params.q,
							o: weixin.openId,
							ot: 0,
							p: 2
						};
						commonShare.share(ajaxParams);
					}
				});
				wx.onMenuShareQQ({
					title: commonShare.shareOptions.title,
					desc: commonShare.shareOptions.desc,
					link: weixin.shareUrl,
					imgUrl: window.atob(commonShare.shareOptions.imgUrl),
				});
				wx.onMenuShareQZone({
					title: commonShare.shareOptions.title,
					desc: commonShare.shareOptions.desc,
					link: weixin.shareUrl,
					imgUrl: window.atob(commonShare.shareOptions.imgUrl),
				});
			});
		}
	};

	var Barrage = {
		userDataUrl: '/resource/scripts/discovery/userData.js',
		barrageIndex: 0,
		init: function() {
			var script = document.createElement('script');
			var parentNode = document.getElementsByTagName('head')[0] || document.body;
			script.async = true;
			script.src = Barrage.userDataUrl;
			script.onload = Barrage.setBarrage;
			parentNode.appendChild(script);
		},
		setBarrage: function() {
			Barrage.barrageIndex = setInterval(function() {
				var nameIndex = utils.getRandomInt(0, UserData.names.length);
				var typeIndex = utils.getRandomInt(0, UserData.type.length);
				var amount = Math.random() * 2 + 3;
				var barrageMsg = UserData.names[nameIndex] + ' 通过' + UserData.type[typeIndex] + '获得' + amount.toFixed(2) + '元返利';
				$('.msg-bar span').text(barrageMsg);
				$('.msg-bar').show();
			}, 3000);
		}
	}

	if (!utils.isEmptyObj(utils.commonParams())) {
		$(".toolsItem[data-type='question']").bind("tap", commonQuestion.tap);
		if (utils.isMMBoard) {
			dsBridge.register('refreshRebateStatus', function() {
				commonHandler.getUserId();
				// commonRebate.init();
			});
			if (/topic|story/g.test(location.href)) {
				$('.block-a').on('click', function(e) {
					e.preventDefault();
                    return false;
				});
			}
		}
		commonHandler.getUserId();
		commonShare.init();
		middlePage.init();
	} else {
		$('.bottom_tools').hide();
	}
	video.init();
	commonShop.init();
	commonPrice.init();
	//只有站外打开才显示弹幕
	if (!utils.isGome && !utils.isMMBoard) {
		$('.active-bar').show();
		$('section').addClass('mid-padding');
		// Barrage.init();
		var downUrl = utils.isWeiXin ? utils.appUrl : utils.mmbUrl;

		$('.down-load-link').attr('href', downUrl);
		var loginUrl = 'https://login.m.gome.com.cn/login.html?return_url=' + window.btoa(window.location.href);
		$('.login-link').attr('href', loginUrl);
		//微信中未登录点击分享按钮，弹出登录按钮
		$('.cover-share .msg').on('click', function() {
			$('.cover-share').hide();
			$('.share-guide').show();
		});
		//其他情况弹出的下载提示
		$('.cover-common .cancel').on('click', function() {
			$('.cover-common').hide();
			$('.cover-common .share, .cover-common .question').hide();
			$('body').css('overflow', 'auto');
		});

		$('.share-guide').on('click', function() {
			$('body').css('overflow', 'auto');
			$('.share-guide').hide();
		});
		if (utils.isWeiXin) {
			weixin.init();
		}
	}

});