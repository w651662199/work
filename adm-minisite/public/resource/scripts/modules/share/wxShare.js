wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx9b797be85ded9dc8', // 必填，公众号的唯一标识
    timestamp: (new Date()).valueOf(), // 必填，生成签名的时间戳
    nonceStr: 'B8SqjjpLp5rF000j', // 必填，生成签名的随机串
    signature: '740c005676b487c446cb82d73e0a7424f9a06a2b',// 必填，签名，见附录1
    jsApiList: [  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
    ]
});
var obj_source = {
    timeline: 'source=w-pyq',app: 'source=w-weixin',
    qq: 'source=w-QQ',qzone: 'w-Qqzone',
    weibo: 'w-Qqzone'
};
shareWeixin({
    title: $('title').val(),
    link: location.href,
    imgUrl: 'https://i6.meixincdn.com/T1kHETB4YT1RXrhCrK.90x90cTz.jpg',
    desc: '分享'
});

function shareWeixin(defaults, options,isextend) {
    defaults["imgUrl"] = defaults["imgUrl"] ||  wapcsspath + '/images/default1.png'; //如果没有设置imgUrl,那就默认使用logo图片
    options = options || {};
    wx.ready(function() {
        wx.onMenuShareTimeline(extend(defaults, options.timeline,'timeline')); //朋友圈
        wx.onMenuShareAppMessage(extend(defaults, options.app,'app')); //微信
        wx.onMenuShareQQ(extend(defaults, options.qq,'qq')); // qq
        wx.onMenuShareWeibo(extend(defaults, options.weibo,'weibo')); // 微博
        wx.onMenuShareQZone(extend(defaults, options.qzone,'qzone')); // qq空间
    });
}

function extend(dict, option,type) {
    if (Object.prototype.toString.call(dict) != "[object Object]") {
        return dict;
    }
    var obj = {};
    for (var key in dict) { //为的是不污染defaults
        obj[key] = dict[key];
    }
    option = option || {};
    for (var key in option) {
        obj[key] = option[key];
    }
    var link = obj["link"];
    if(link.indexOf("?") > 0){
        link += '&' + obj_source[type];
    }else{
        link += '?' + obj_source[type];
    }
    obj["link"] = link;
    var imgUrl = obj['imgUrl'];
    if(imgUrl){
        if(imgUrl.indexOf('https') > -1){
            obj['imgUrl'] = imgUrl.replace(/^\s*https/,'http');
        }
    }else{
        obj['imgUrl'] = 'http://css.meixincdn.com/m/h5/dist/images/default1.png';
    }
    return obj;
}