var commonParams = getCookie('commonParams');
commonParams = eval("(" + commonParams + ")");
var uniqueDeviceId = getDeviceId();
var device = '';
/**
for(var key in commonParams) {
    if (key == 'deviceId') {
        uniqueDeviceId = commonParams[key];
    }
    if (key == 'device') {
        device = commonParams[key];
    }
}
var agentArr = navigator.userAgent.split('/');
if (agentArr.length > 0) {
    uniqueDeviceId = agentArr[agentArr.length -1];
}*/
function getDeviceId() {
    var deviceId = '';
    var agentArr = navigator.userAgent.split('/');
    var isIos = /iPhone/g.test(navigator.userAgent);
    var isAndroid = /Android/g.test(navigator.userAgent);
    if (agentArr.length > 0) {
        if (isIos) {
            deviceId = agentArr[agentArr.length - 6];
        } else if (isAndroid) {
            deviceId = agentArr[agentArr.length - 7];
        } else {
            deviceId = agentArr[agentArr.length -1];
        }
    }
    return deviceId;
}
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    return null;

}
function getUrlInfoWithDeviceID(url) {
    var urlInfo = url.split('?');
    var urlParams = getKeyValue(url);
    urlParams['deviceId'] = uniqueDeviceId;
    return urlInfo[0] + '?' + urlEncode(urlParams).slice(1);
}
function urlEncode(param, key, encode) {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}
function getKeyValue(url) {
    var result = {};
    var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
    var arr = reg.exec(url);
    while (arr) {
        result[arr[2]] = arr[3];
        arr = reg.exec(url);
    }
    return result;
}

function getDistrictIdByUrl(url) {
    var urlParam = getKeyValue(decodeURIComponent(url));
    var cityJson = urlParam.cityjson ? JSON.parse(urlParam.cityjson) : {};
    return cityJson.districtId ? cityJson.districtId : '';
}

function isNewAppVersion() {
    var reg = /\/\d{2}\//g;
    var appVerMatch = navigator.userAgent.match(reg);
    if (appVerMatch != null && appVerMatch.length === 1) {
        var appVersion = appVerMatch[0];
        appVersion = appVersion.slice(1, appVersion.length - 1);
        return appVersion >= 35;
    }
    return false;
};