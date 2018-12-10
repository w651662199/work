/**
 * Created by wuhongling on 2016/12/9.
 */
$(function () {
    var shareCon;
    /**
    $('.other-product-list li').each(function () {
        $(this).css({height: $(this).width()})
    });
     */
    var w = Math.floor(($('.share-container .share-text').width() - Math.ceil($('.share-text-inner').outerWidth(true)) - 4) * 0.5);
    $('.share-container .share-text .text-line').css({width:w});
    $('.back-btn').on('click', function () {
        history.back();
    });
    if (!/gomeplus/g.test(navigator.userAgent) || (/gomeplus/g.test(navigator.userAgent) && !isNewAppVersion())) {
        $('.action-share,.share-cancel,.top-share-btn').on('click', function () {
            showOrHideSHare();
            return false;
        });
        $('.tip,#usl_share').on('click',function () {
            if($('.share-container').hasClass('slid-in')) {
                showOrHideSHare()
            }
            return false;
        });
    }
    function showOrHideSHare() {
        shareCon = $('.share-container');
        if(shareCon.css('display') == 'none'){
            shareCon.show();
        }
        shareCon.toggleClass('slid-in');
        if(shareCon.hasClass('slid-in')){
            $('.tip').fadeIn(1000);
        }else {
            if($('#usl_share').css('display') == 'block'){
                $($('#usl_share')).hide();
            }
            $('.tip').fadeOut(1000);
        }
    }
});