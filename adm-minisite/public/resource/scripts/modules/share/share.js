var check = {
    ua:navigator.userAgent,
    isWeiXin: function () {
        return !!this.ua.match(/MicroMessenger/i);
    },
    isQQ: function () {
        return this.ua.match(/QQ\//i) == "QQ/";
    },
    isWeiBo:function(){
        return !!this.ua.match(/Weibo/i);
    }
};
$('.app-close').on('click', function(event) {
    $('.m-downapp').hide();
});
var div =  $('<div id="alertSecond" class="alert_second">请用浏览器自带分享功能分享</div>');
$('.share-item').on('click', function () {
    var type = $(this).attr('data-type');
    var options = {
        url: location.href,
        desc: $('.product-introduce').text(),
        pic: $('.product-img-info').attr('src'),
        title: $('.product-name').text()
    };
    var pic = type == 'weibo' ? 'pic' :'pics';
    var shareInfo = '?url=' + encodeURIComponent(options.url) + '&title=' + encodeURIComponent(options.title) + '&'+ pic + '=' + encodeURIComponent(options.pic) + '&desc=' + encodeURIComponent(options.desc);
    switch (type) {
        case 'weibo':
            if(check.isWeiXin() || check.isQQ()){
               showMessage('微信或QQ内暂不支持微博分享');
                console.log('微信或QQ内暂不支持微博分享');
                return false;
            }
            if(check.isWeiBo()){
                $('#usl_share').show();
                return false;
            }
            location.assign('http://service.weibo.com/share/mobile.php' + shareInfo + '&appkey=1343713053&searchPic=true');
            break;
        case 'qzone':
            if(check.isWeiXin() || check.isWeiBo() || check.isQQ()){
                $('#usl_share').show();
            }else{
                window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey' + shareInfo, "", "_blank");
            }
            break;
        case 'qq':
        case 'weixin':
        case 'friends':
            if(check.isWeiXin() || check.isQQ() || check.isWeiBo()){
                $('#usl_share').show();
            }else{
                showMessage('请用浏览器自带分享功能分享');
            }
            break;
    }
});
function showMessage(msg) {
    var div = $('<div id="alertSecond" class="alert_second">'+ msg +'</div>');
    $('body').append(div);
    setTimeout(function() {
        $('.alert_second').remove();
    }, 1500);
}
window.onload = function() {
    shareImpression();
    accessCount();
};
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
function shareImpression() {
    var param = getKeyValue(window.location);
    $.get(shareImpressionUrl, param);
}
function accessCount() {//页面访问统计
    var param = getKeyValue(window.location);
    if (!!param['shareId']) {
        param['sourceType'] = 2;
    } else {
        param['sourceType'] = 1;
    }
    $.ajax({url: middlePageImpression, data: param, dataType: 'jsonp'});
}
