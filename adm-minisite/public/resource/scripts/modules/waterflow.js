var page = 0;
var mainItemList=[];
var districtId = '';
$(function () {
    districtId = getDistrictIdByUrl(window.location);
	$('#gotop').on('click', function () {
		$('.page.something-good').animate({scrollTop: "0px"}, 200);
	});
    $('.page.something-good').pullToRefresh().on("pull-to-refresh",function () {
        var wrap = $('.page').find('ul');
        var self = this;
        page = 0;
        $.ajax({
            url: adrequestUrl + '?slotId=' + slotId + '&requestType=3&count=10&districtId=' + districtId,
            dataType: 'jsonp',
            success: function (data) {
                if (Object.keys(data).length === 0) {
                    $(self).pullToRefreshDone();
                    return;
                }
                var mainDataArr = [];
                if (data.datas.length != 0) {
                    mainDataArr = data.datas[0].adContents;
                    wrap.empty();
                    insertGoodChild(mainDataArr);
                    showCheck();
                    $(self).pullToRefreshDone();
                    if (data.ids.length > 0) {
                        initPageIds(data.ids);
                        initInfinite();
                    }else{
                        $('.page-end').show();
                    }
                }
            }
        });
    });
    var loading = false;
    function initInfinite() {
        $('.weui-loadmore').show();
        $('.page-end').hide();
        var dis = $('.weui-loadmore').outerHeight() + $('.product-details').height();
        $('.page.something-good').infinite(dis).on('infinite',function() {
            if(loading) return;
            loading = true;
            $.ajax({
                url: adrequestIdUrl + '?slotId=' + slotId + '&districtId=' + districtId + '&requestType=3&ids=' + mainItemList[page].join(','),
                dataType: 'jsonp',
                success: function (data) {
                    var mainDataArr = [];
                    if (data.length != 0) {
                        mainDataArr = data[0].adContents;
                        slotId = data[0].slotId;
                        insertGoodChild(mainDataArr);
                        loading = false;
                        if (page == mainItemList.length - 1) {
                            $('.page.something-good').destroyInfinite();
                            $('.weui-loadmore').hide();
                            $('.page-end').show();
                        } else {
                            page++;
                        }
                    }
                }
            });
        });
    }
    $(window).onload = simlautePull();
    function simlautePull() {
        var isTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
        if (isTouch) {
            $('.page.something-good').trigger('touchmove',$('.weui-pull-to-refresh__layer').outerHeight()).trigger('touchend');
        } else {
            $('.page.something-good').trigger('mousemove',$('.weui-pull-to-refresh__layer').outerHeight()).trigger('mouseup');
        }
    }
    $('.page.something-good').on('scroll',function () {
        if($(this).scrollTop() > 200){
            $('#gotop1').fadeIn()
        }else {
            $('#gotop1').fadeOut()
        }
        showCheck();
    });
	function insertGoodChild(data) {
		var list = $('#goodProductList');
		var line, product;
		for (var i = 0; i < data.length; i++) {
			if (/\\"/g.test(data[i].content)) {
				var str = data[i].content.replace(/\\/g,'');
				product = JSON.parse(str.slice(1,str.length - 1));
			} else {
				product = JSON.parse(data[i].content);
			}
			product['impression_url'] = getUrlInfoWithDeviceID(product['impression_url']);
			product['click_url'] = getUrlInfoWithDeviceID(product['click_url']);
			//使用模板
			line = $('#goodProductListTmp').tmpl({product: product}).appendTo(list);
		}
	}

	function showCheck() {
		var $pageArea = $('.page.something-good');
		var pageScrollTop = $pageArea.scrollTop();
		$('.product-details[data-visible]').each(function (index, ele) {
			var $this = $(ele), offsetTop = $this.offset().top + pageScrollTop;
			var offsetBottom = offsetTop + 15;
			if (offsetTop >= pageScrollTop && offsetBottom < (pageScrollTop + $(window).height())) {
				$this.removeAttr('data-visible');
				//此处进行曝光
				impression($this.attr('data-url'));
			}
		})
	}

	function initPageIds(idsArr) {
		var pageCount = 10;
		var pageTotal = parseInt((idsArr.length + pageCount - 1) / pageCount);
		console.log(pageTotal);
		mainItemList = [];
		for (var i = 0; i < pageTotal; i++) {
			mainItemList[i] = idsArr.slice(i * pageCount,(i + 1) * pageCount);
		}
	}
	function impression(url){
		$.ajax({url:url,dataType:'jsonp'});
	}
	$('#goodProductList').on('click','.product-local',function() {
        var clickUrl = $(this).attr('data-click'),landingUrl = $(this).attr('data-landing');
        var landingParam = getKeyValue(landingUrl);
        $.ajax({
            url:clickUrl+'&contentType=3',
            dataType:'jsonp',
            success:function(data) {
                if(landingUrl.indexOf('http') > -1){
                    landingUrl += '&districtId=' + districtId;
                    AppInterface.call('/common/localJump',{url:window.btoa(landingUrl)});
                }else {
                    AppInterface.call('/product/detail', landingParam);
                }
            }
        });
    })
});

