$(function(){
    var params = getKeyValue(window.location);
    params['slotId'] = slotId;
    params['slotType'] = 1;
    params['sourceType'] = 1;
    var shareBtn;
    if (isNewAppVersion()) {
        shareBtn = $('.action-share,.top-share-btn');
    } else {
        shareBtn = $('.share-item');
    }

    shareBtn.on('click', function () {
        var urlParams = urlEncode(params);
        var options = {
            link:wapHost + 'item/detail?' + urlParams.slice(1),
            title:encodeURIComponent($('.product-name').text()),
            desc: encodeURIComponent($('.product-introduce').text()),
            imgUrl: window.btoa($('.product-img-info').attr('src')),
            type: 'default',
            btnType: '0,2,3,10,11,12,13'
        };
        if (!isNewAppVersion()) {
            var type = $(this).attr('data-type');
            if(type == 'qzone'){
                options.type = 'qqzone'
            }else if(type == 'friends'){
                options.type = 'pengyouquan'
            }else if(type == 'weibo'){
                options.desc = encodeURIComponent('');
            }
        }
        params['deviceId'] = uniqueDeviceId;
        var date = new Date().getTime();
        AppInterface.call('/common/getLoginStatus',function(data) {
            if (data.success) {
                params['userId'] = data.data.userId;
                params['shareId'] = md5(date + data.data.userId);
                var sUrl = options.link + '&deviceId=' + params['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + params['shareId'] + '&slotType=' + params['slotType'];
                // options.link = window.btoa(options.link + '&deviceId=' + params['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + params['shareId']);
                share(params);
                $.ajax({
                    url: 'https://re.gomeplus.com/short/get',
                    type: 'post',
                    dataType: 'text',
                    data: sUrl,
                    success: function(res) {
                        options.link = window.btoa(res);
                        AppInterface.call('/common/share', options);
                    }
                });
                // AppInterface.call('/common/share', options);
            } else {
                AppInterface.call('/common/logout', function (data) {
                    if (data.success) {
                        AppInterface.call('/common/login', function (data) {
                            if (data.success) {
                                params['userId'] = data.data.userId;
                                params['shareId'] = md5(date + params['userId']);
                                var sUrl = options.link + '&deviceId=' + params['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + params['shareId'];
                                // options.link = window.btoa(options.link + '&deviceId=' + params['deviceId'] + '&userId=' + data.data.userId + '&shareId=' + params['shareId']);
                                share(params);
                                $.ajax({
                                    url: 'http://dsp.gome.com.cn/short/get',
                                    type: 'post',
                                    dataType: 'text',
                                    data: sUrl,
                                    success: function(res) {
                                        options.link = window.btoa(res);
                                        AppInterface.call('/common/share', options);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    //$('#itemDetail,.product-img-info').on('click',function () {
        //AppInterface.call('/product/detail', {productId: productId, skuId: skuId});
        // AppInterface.call('/product/detail', {productId:itemId,shopId:shopId});
    //});
    $('.rebate-rule').on('click', function() {
        AppInterface.call('/common/localJump',{url:window.btoa(rebateUrl)});
    });
    function share(param) {
        $.ajax({url:shareUrl,data:param,dataType:'jsonp'});
    }
    window.onload = function() {
        isRebateBudget();
        accessCount();
    }
    function isRebateBudget() {
         var rebate = $('.text-yes .share-price').text(),w;
         rebate = parseFloat(rebate.slice(1));
         if(rebate > 0){
             $.ajax({
                url:rebateBudgetUrl,
                data:{flightJobId:params.flightJobId, logParam: params.logParam, slotId: slotId},
                type: 'get',
                success: function (response) {
                    if(response.data.status == 1 && rebateBid > 0){
                        $('.rebateBudget,#rebateBudget').show();
                    } else {
                        $('.rebateBudget,#rebateBudget').hide();
                    }
                }
            });
        }
    }
    function accessCount() {//页面访问统计
        $.ajax({url: middlePageImpression, data: params, dataType: 'jsonp'});
    }
});
