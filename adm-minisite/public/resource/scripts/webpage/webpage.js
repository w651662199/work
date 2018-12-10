(function(win, doc) {
    var Arr = Array.prototype;
    var utils = {
        isGome: /gomeplus/g.test(navigator.userAgent),
        isWeiXin: /MicroMessenger/g.test(navigator.userAgent),
        isQQ: /QQ/g.test(navigator.userAgent),
        isWeibo: /Weibo/g.test(navigator.userAgent),
        isIos: /iPhone/g.test(navigator.userAgent),
        isAndroid: /Android/g.test(navigator.userAgent),
        shareOptions: {
            title: '',
            desc: '',
            imgUrl: '',
            link: '',
            type: 'default',
            btnType: ''
        },
        getElementsWithArr: function(htmlCollection) {
            return Array.prototype.slice.call(htmlCollection);
        },
        hasClass: function(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function(obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        removeClass: function(obj, cls) {
            if (utils.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },
        getCookie: function(param) {
            var arr,reg=new RegExp("(^| )"+param+"=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }
            return null;
        },
        getDeviceIdFromAgent: function() {
            var deviceId = '';
            var agentArr = navigator.userAgent.split('/');
            if (agentArr.length > 0) {
                if (utils.isIos) {
                    deviceId = agentArr[agentArr.length - 6];
                } else if (utils.isAndroid) {
                    deviceId = agentArr[agentArr.length - 7];
                } else {
                    deviceId = agentArr[agentArr.length -1];
                }
            }
            return deviceId;
        },
        isNewAppVersion: function() {
            var reg = /\/\d{2}\//g;
            var appVerMatch = navigator.userAgent.match(reg);
            if (appVerMatch != null && appVerMatch.length === 1) {
                var appVersion = appVerMatch[0];
                appVersion = appVersion.slice(1, appVersion.length - 1);
                return appVersion >= 35;
            }
            return false;
        },
        getAppVersion: function() {
            var reg = /\/\d{2}\//g;
            var appVerMatch = navigator.userAgent.match(reg);
            if (appVerMatch != null && appVerMatch.length === 1) {
                var appVersion = appVerMatch[0];
                appVersion = appVersion.slice(1, appVersion.length - 1);
                return appVersion;
            }
            return 0;
        },
        getDeviceId: function() {
            var commonParams = utils.getCookie('commonParams');
            commonParams = eval("(" + commonParams + ")");
            var uniqueDeviceId = '';
            for(var key in commonParams) {
                if (key == 'deviceId') {
                    uniqueDeviceId = commonParams[key];
                    break;
                }
            }
            return uniqueDeviceId;
        },
        toggleClass: function(obj, cls) {
            if (utils.hasClass(obj, cls)) {
                utils.removeClass(obj, cls);
            } else {
                utils.addClass(obj, cls);
            }
        },
        requestJsonp: function (url, cb) {
            var fnName = 'activePage' + (new Date()).getTime();
            var script = doc.createElement('script');
            var parentNode = doc.getElementsByTagName('head')[0] || doc.body;
            script.async = true;
            if (url.indexOf('?') > 0) {
                script.src = url + '&callback=' + fnName;
            } else {
                script.src = url + '?callback=' + fnName;
            }
            win[fnName] = function (response) {
                try {
                    cb(response);
                    win[fnName] == null;
                    parentNode.removeChild(script);
                } catch (ex) {
                    if (console) {
                        console.log(ex);
                    }
                }
            };
            parentNode.appendChild(script);
        },
        obj2string: function (o) {
            var r = [];
            if (typeof o == "string") {
                return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            }
            if (typeof o == "object") {
                if (!o.sort) {
                    for (var i in o) {
                        r.push(i + ":" + this.obj2string(o[i]));
                    }
                    if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                        r.push("toString:" + o.toString.toString());
                    }
                    r = "{" + r.join() + "}";
                } else {
                    for (var i = 0; i < o.length; i++) {
                        r.push(this.obj2string(o[i]))
                    }
                    r = "[" + r.join() + "]";
                }
                return r;
            }
            return o.toString();
        },
        domCreator: function (ele, styles, attr) {
            var _element = document.createElement(ele);
            if (styles) _style = utils.obj2string(styles).replace('{', '').replace('}', '').replace(/,/g, ';').replace(/"/g, '');
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                _element.style.cssText = _style
            } else {
                _element.setAttribute("style", _style);
            }
            for (var key in attr) {
                _element.setAttribute(key, attr[key]);
            }
            _style = null; attr = null;
            return _element;
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
        urlEncode: function(param, key, encode) {
            if(param==null) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += utils.urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        },
        forEach: !!Arr.forEach ? function (arr, fn) {
            arr.forEach(fn);
        } : function (arr, fn) {
            for (var i = 0; i < arr.length; i++) {
                fn(arr[i], i, arr);
            }
        },
        getElementsByClassName: doc.getElementsByClassName ? function (cls, parentNode) {
            return Array.prototype.slice.call((parentNode || doc).getElementsByClassName(cls));
        } : function (cls, parentNode) {
            var elements, pattern, i, results = [];
            parentNode = parentNode || doc;
            if (parentNode.querySelectorAll) { // IE8
                return parentNode.querySelectorAll("." + cls);
            }
            if (doc.evaluate) { // IE6, IE7
                pattern = ".//*[contains(concat(' ', @class, ' '), ' " + cls + " ')]";
                elements = doc.evaluate(pattern, parentNode, null, 0, null);
                while ((i = elements.iterateNext())) {
                    results.push(i);
                }
            } else {
                elements = parentNode.getElementsByTagName("*");
                pattern = new RegExp("(^|\\s)" + cls + "(\\s|$)");
                utils.forEach(utils.domListToArray(elements), function (ele) {
                    if (pattern.test(ele.className)) {
                        results.push(ele);
                    }
                });
            }
            return results;
        },
        getHtmlParserString: function(str) {
            var parser = new DOMParser;
            var dom = parser.parseFromString(str, 'text/html');
            return dom.body.textContent;
        }
    };
	var share = {
		shareItemClassName: 'share-item',
		shareContainer: doc.getElementById('shareCon'),
		shareItems: function() {
			var itemList = utils.getElementsByClassName(share.shareItemClassName, share.shareContainer);
			utils.forEach(itemList, share.shareItemClick);
            var rebateRuleItem = utils.getElementsByClassName('rebate-rule')[0];
            if (doc.addEventListener) {
                rebateRuleItem.addEventListener('click', function() {
                    AppInterface.call('/common/localJump', { url: window.btoa(rebateUrl) });
                }, false);
            } else {
                rebateRuleItem.attachEvent('onclick', function() {
                    AppInterface.call('/common/localJump', { url: window.btoa(rebateUrl) });
                });
            }
		},
		shareItemClick: function(item) {
        	var shareType = item.getAttribute('data-type');
			if (doc.addEventListener) {
                item.addEventListener('click', function() {share.shareHandle(shareType)}, false);
            } else {
                item.attachEvent('onclick', function() {share.shareHandle(shareType)});
            }
		},
        rebateMessage: function() {
            if (!utils.isGome) {
                var rebateMsgList = utils.getElementsByClassName('rebateBudget');
                utils.forEach(rebateMsgList, function(item) {
                    item.style.display = 'none';
                });
                var rebateShareSpan =  utils.getElementsByClassName('isRebateMsg')[0];
                rebateShareSpan.innerText = '分享活动';
            } else {
                var urlParams = utils.getKeyValue(win.location.href);
                share.setRebatePrice(rebateBudgetUrl, urlParams);
                $('#downapp').hide();
            }
        },
        setRebatePrice: function(url, params) {
            $.ajax({
                url:url,
                data: {flightJobId:params.flightJobId, logParam: params.logParam, slotId: slotId},
                type: 'get',
                success: function (response) {
                    if (response.data.status == 1 && h5RebateBid > 0) {
                        var rebatePrice = doc.getElementById('rebateBudget');
                        rebatePrice.innerHTML = '成功得￥' + h5RebateBid;
                    } else {
                        var rebateMsgList = utils.getElementsByClassName('rebateBudget');
                        utils.forEach(rebateMsgList, function(item) {
                            item.style.display = 'none';
                        });
                        var rebateShareSpan =  utils.getElementsByClassName('isRebateMsg')[0];
                        rebateShareSpan.innerText = '分享活动';
                    }
                }
            });
        },
        shareHandle: function(type) {
            if (utils.isGome) {
                share.shareInApp(type);
            } else {
                share.shareInWarp(type);
            }
        },
		shareInApp: function(type) {
            AppInterface.call('/common/getLoginStatus',function(data) {
                if (data.success) {
                    share.doShare(data, type);
                } else {
                    AppInterface.call('/common/logout', function (data) {
                        if (data.success) {
                            AppInterface.call('/common/login', function (data) {
                                if (data.success) {
                                    share.doShare(data, type);
                                }
                            });
                        }
                    });
                }
            });
		},
        doShare: function(data, type) {
            utils.shareOptions.title = utils.getHtmlParserString(shareTitle);
            utils.shareOptions.desc = utils.getHtmlParserString(shareDesc);
            utils.shareOptions.link = win.location.href;
            utils.shareOptions.imgUrl = window.btoa(shareImg);
            var doShareOptions = utils.commonParams();
            var appShareOptions = utils.shareOptions;
            var date = new Date().getTime();
            appShareOptions.type = type;
            doShareOptions['slotId'] = slotId;
            doShareOptions['deviceId'] = utils.getDeviceIdFromAgent();
            doShareOptions['userId'] = data.data.userId;
            doShareOptions['shareId'] = md5(date + data.data.userId);
            doShareOptions['slotType'] = 1;
            var sUrl = appShareOptions.link + '&slotId=' + doShareOptions['slotId'] + '&deviceId=' + doShareOptions['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + doShareOptions['shareId'] + '&slotType=' + doShareOptions['slotType'];
            // appShareOptions.link = window.btoa(appShareOptions.link + '&slotId=' + doShareOptions['slotId'] + '&deviceId=' + doShareOptions['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + doShareOptions['shareId']);
            share.doShareAction(doShareOptions);
            $.ajax({
                url: 'https://re.gomeplus.com/short/get',
                type: 'post',
                dataType: 'text',
                data: sUrl,
                success: function(res) {
                    appShareOptions.link = window.btoa(res);
                    AppInterface.call('/common/share', appShareOptions);
                }
            });
            // AppInterface.call('/common/share', appShareOptions);
        },
        doShareAction: function(params) {
            var url = shareUrl + '?' + utils.urlEncode(params).slice(1);
            utils.requestJsonp(url);
        },
        doShareImpressionAction: function() {
            var params = utils.commonParams();
            if (params.shareId !== undefined) {
                var url = shareImpressionUrl + '?' + utils.urlEncode(params).slice(1);
                utils.requestJsonp(url);
            }
        },
		shareInWarp: function(type) {
            if (utils.isWeiXin || utils.isQQ || utils.isWeibo) {
                share.showWrapShareMessage('请点击右上角使用自带分享功能分享');
            } else {
                share.showWrapShareMessage('请用浏览器自带分享功能分享');
            }
		},
        showWrapShareMessage: function(msg) {
            var body = doc.getElementsByTagName('body')[0];
            var div = utils.domCreator('div', {}, { 'class': 'alert_second', 'id': 'alertSecond' });
            div.innerText = msg;
            body.appendChild(div);
            setTimeout(function() {
                body.removeChild(div);
            }, 1500);
        },
        shareButtonHandler: function() {
            var shareBtn = utils.getElementsByClassName('share-btn-fixed')[0];
            var shareTip = utils.getElementsByClassName('tip')[0];
            var shareCancel = utils.getElementsByClassName('share-cancel')[0]
            var shareActionSheet = utils.getElementsByClassName('share-container')[0];
            if (doc.addEventListener) {
                shareBtn.addEventListener('click', function() {
                    if (utils.isGome && utils.isNewAppVersion()) {
                        share.shareHandle('default');
                    } else {
                        share.showShareActionSheet();
                    }
                }, false);
                shareTip.addEventListener('click', function() {share.hideShareActionSheet()}, false);
                shareCancel.addEventListener('click', function() {share.hideShareActionSheet()}, false);
            } else {
                shareBtn.attachEvent('onclick', function() {
                    if (utils.isGome && utils.isNewAppVersion()) {
                        share.shareHandle('default');
                    } else {
                        share.showShareActionSheet();
                    }
                });
                shareTip.attachEvent('click', function() {share.hideShareActionSheet()});
                shareCancel.attachEvent('click', function() {share.hideShareActionSheet()});
            }
        },
        showShareActionSheet: function() {
            var shareActionSheet = utils.getElementsByClassName('share-container')[0];
            var shareTip = utils.getElementsByClassName('tip')[0];
            if (shareActionSheet.style.display === 'none') {
                shareActionSheet.style.display === 'block';
            }
            utils.toggleClass(shareActionSheet, 'slid-in');
            shareTip.style.display = utils.hasClass(shareActionSheet, 'slid-in') ? 'block' : 'none';
        },
        hideShareActionSheet: function() {
            var shareActionSheet = utils.getElementsByClassName('share-container')[0];
            if (utils.hasClass(shareActionSheet, 'slid-in')) {
                share.showShareActionSheet();
            }
            return false;
        },
        init: function() {
            share.shareItems(); //返利规则按钮事件
            share.rebateMessage();
            share.shareButtonHandler();
            utils.shareOptions.btnType = utils.getAppVersion() >= 39 ? '2,10,11,12' : '0,2,3,10,11,12';
        }
	};
    var weixin = {
        weixinConfig: [],
        weixinSDKUrl: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
        url: 'api/weixin',
        init: function() {
            var script = doc.createElement('script');
            var parentNode = doc.getElementsByTagName('head')[0] || doc.body;
            script.async = true;
            script.src = weixin.weixinSDKUrl;
            script.onload = weixin.getWeixinConfigInfor;
            parentNode.appendChild(script);
        },
        getWeixinConfigInfor: function() {
            var shareUrl = encodeURIComponent(window.location.href.split('#')[0]);
            var requestUrl = wapHost + weixin.url + '?shareUrl=' + shareUrl;
            utils.requestJsonp(requestUrl, weixin.initWeixin);
        },
        initWeixin: function(result) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: result['wx_appid'], // 必填，公众号的唯一标识
                timestamp: result['wx_timestamp'], // 必填，生成签名的时间戳
                nonceStr: result['wx_noncestr'], // 必填，生成签名的随机串
                signature: result['wx_signature'],// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: shareTitle, // 分享标题
                    link: win.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                });
                wx.onMenuShareAppMessage({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: win.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                });
                wx.onMenuShareQQ({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: win.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                });
                wx.onMenuShareQZone({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: win.location.href, // 分享链接
                    imgUrl: shareImg, // 分享图标
                });
            });
        }
    };
    var gome = {
        productIdList: [],
        productConList: [],
        priceUrl: 'api/prices',
        districtId: '',
        getAreaCode: function() {
            gome.districtId = utils.getDistrictIdByUrl(window.location);
        },
        initProductConList: function() {
            var list = utils.getElementsByClassName('item-content');
            utils.forEach(list, function(item) {
                var itemDataId = item.getAttribute('data-id');
                gome.productIdList.push(itemDataId);
                /**
                if (!utils.isGome) {
                    var aTag = utils.getElementsWithArr(item.getElementsByTagName('a'))[0];
                    var pUrl = productUrl + 'p-' + itemDataId + '.html';
                    aTag.setAttribute('href', pUrl);
                }*/
            });
            gome.productConList = list;
        },
        getProductsPrice: function() {
            var url = wapHost + gome.priceUrl + '?ids=' + gome.productIdList.join(',') + '&areaCode=' + gome.districtId;
            utils.requestJsonp(url, gome.replaceProductPrice);
        },
        replaceProductPrice: function(result) {
            var priceArr = result;
            utils.forEach(gome.productConList, function(item) {
                var itemIds = item.getAttribute('data-id').split('-');
                var priceConText = utils.getElementsByClassName('price', item)[0];
                var itemSkuId = itemIds[1];
                for (var i = 0; i < priceArr.length; i++) {
                    if (itemSkuId === priceArr[i].skuId) {
                        priceConText.innerHTML = '<span>￥</span>' + priceArr[i].price.toFixed(2);
                        break;
                    }
                }
            })
        },
        pageLoadHandler: function() {
            var params = utils.commonParams();
            params['slotType'] = 1;
            if (!!params['shareId']) {
                params['sourceType'] = 2;
            } else {
                params['sourceType'] = 1;
            }
            params['slotId'] = !!params['slotId'] ? params['slotId'] : slotId;
            var url = middlePageImpression + '?' + utils.urlEncode(params).slice(1);
            utils.requestJsonp(url);
        },
        init: function() {
            gome.getAreaCode();
            gome.initProductConList();
            gome.getProductsPrice();
        }
    }
	share.init();
    gome.init();
    if (utils.isWeiXin) {
        weixin.init();
    }
    win.onload = function() {
        gome.pageLoadHandler();
        share.doShareImpressionAction();
    }
})(window, document);