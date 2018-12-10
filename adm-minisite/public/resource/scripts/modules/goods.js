/**
 * Created by qichangchun on 2016/11/15.
 */
$(function () {
    $('.header-back').on('click', function () {
        history.back();
    })
    /**
    $('.other-product-list li').each(function () {
        $(this).css({height: $(this).width()})
    });
     */
    $('.back-btn').on('click', function () {
        history.back();
    });
});
