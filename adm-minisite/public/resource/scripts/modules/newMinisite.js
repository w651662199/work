$(function() {
	var utils = {
		isGome: /gomeplus/g.test(navigator.userAgent),
		tabContainers: $('.page'),
		gotopBtn: $('.gotop'),
		currentIndex: 0,
		loadDis: $('.weui-loadmore').outerHeight() + $('.product-details').height(),
		initPullToRefresh: function(tab, callBack) {
			tab.pullToRefresh().on("pull-to-refresh", callBack);
		},
		initLoadMore: function(tab, callBack) {
			tab.infinite(utils.loadDis).on("infinite", callBack);
		},
		simulatePullToRefresh: function(tab) {
			var isTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
	        if (isTouch) {
	        	tab.trigger('touchmove',$('.weui-pull-to-refresh__layer').outerHeight()).trigger('touchend');
	        } else {
	            tab.trigger('mousemove',$('.weui-pull-to-refresh__layer').outerHeight()).trigger('mouseup');
	        }
		}
	};
	var minisite = {
		districtId: '',
		url: {
			initAdUrl: adrequestUrl + '?slotId=' + slotId + '&requestType=3&count=10',
			initActiveUrl: adrequestUrl + '?slotId=' + activeId + '&requestType=3&count=10',
			adWithIdsUrl: adrequestIdUrl + '?slotId=' + slotId + '&requestType=3&ids=',
			activeWithIdsUrl: adrequestIdUrl + '?slotId=' + activeId + '&requestType=3&ids=',
		},
		pageContainer: {
			ad: $('.page.something-good'),
			active: $('.page.something-special')
		},
		pageSize: 10,
		products: {
			page: 0,
			pageIds: [],
			isLoading: false
		},
		actives: {
			page: 0,
			pageIds: [],
			isLoading: false
		},
		activePage: 0,
		initAdList: function() {
			var wrap = minisite.pageContainer.ad.find('ul');
			minisite.products.page = 0;
			$.ajax({
	            url: minisite.url.initAdUrl + '&districtId=' + minisite.districtId,
	            dataType: 'jsonp',
	            success: function (data) {
	                if (Object.keys(data).length === 0) {
	                    minisite.pageContainer.ad.pullToRefreshDone();
	                    return;
	                }
	                var mainDataArr = [];
	                if (data.datas.length != 0) {
	                    mainDataArr = data.datas[0].adContents;
	                    wrap.empty();
	                    minisite.renderAdList(wrap, 'goodProductListTmp', mainDataArr);
	                    minisite.checkIsImpression(minisite.pageContainer.ad, $('.product-details[data-visible]'));
	                    minisite.pageContainer.ad.pullToRefreshDone();
	                    if (!!data.ids && data.ids.length > 0) {
	                        minisite.initPageIds('ad', data.ids);
	                        utils.initLoadMore(minisite.pageContainer.ad, minisite.loadMoreAd);
	                    }
	                }
	            },
	            error: function (error) {
	            	minisite.pageContainer.ad.pullToRefreshDone();
	                console.log(error);
	            }
	        });
		},
		initActiveList: function() {
			var wrap = minisite.pageContainer.active.find('ul');
			minisite.actives.page = 0;
			$.ajax({
	            url: minisite.url.initActiveUrl,
	            dataType: 'jsonp',
	            success: function (data) {
	                if (Object.keys(data).length === 0) {
	                    minisite.pageContainer.active.pullToRefreshDone();
	                    return;
	                }
	                var mainDataArr = [];
	                if (data.datas.length != 0) {
	                    mainDataArr = data.datas[0].adContents;
	                    wrap.empty();
	                    minisite.renderAdList(wrap, 'activeAdTmp', mainDataArr);
	                    minisite.checkIsImpression(minisite.pageContainer.active, $('.special-product[data-visible]'));
	                    minisite.pageContainer.active.pullToRefreshDone();
	                    if (!!data.ids && data.ids.length > 0) {
	                        minisite.initPageIds('active', data.ids);
	                        utils.initLoadMore(minisite.pageContainer.active, minisite.loadMoreActive);
	                    }
	                }
	            },
	            error: function (error) {
	            	minisite.pageContainer.active.pullToRefreshDone();
	                console.log(error);
	            }
	        });
		},
		loadMoreAd: function() {
			if (minisite.products.isLoading) return;
			minisite.pageContainer.ad.find('.weui-loadmore').show();
			var wrap = minisite.pageContainer.ad.find('ul');
            minisite.products.isLoading = true;
            $.ajax({
                url: minisite.url.adWithIdsUrl + minisite.products.pageIds[minisite.products.page].join(',') + '&districtId=' + minisite.districtId,
                dataType: 'jsonp',
                success: function (data) {
                    var mainDataArr = [];
                    if (data.length != 0) {
                        mainDataArr = data[0].adContents;
                        slotId = data[0].slotId;
                        minisite.renderAdList(wrap, 'goodProductListTmp', mainDataArr);
                        minisite.products.isLoading = false;
                        if (minisite.products.page == minisite.products.pageIds.length - 1) {
                            minisite.pageContainer.ad.destroyInfinite();
                            minisite.pageContainer.ad.find('.weui-loadmore').hide();
                            minisite.pageContainer.ad.find('.page-end').show();
                        } else {
                            minisite.products.page++;
                        }
                    }
                },
                error: function(error) {
                	minisite.products.isLoading = false;
                	minisite.pageContainer.ad.destroyInfinite();
                    minisite.pageContainer.ad.find('.weui-loadmore').hide();
                    console.log(error);
                }
            });
		},
		checkIsImpression: function(page, list) {
			var $pageArea = page;
	        var pageScrollTop = $pageArea.scrollTop();
	        list.each(function (index, ele) {
	            var $this = $(ele), offsetTop = $this.offset().top + pageScrollTop;
	            var offsetBottom = offsetTop + 20;
	            if (offsetTop >= pageScrollTop && offsetBottom < (pageScrollTop + $(window).height())) {
	                $this.removeAttr('data-visible');
	                //此处进行曝光
	                minisite.impression($this.attr('data-url'));
	            }
	        });
		},
		impression: function(impressionUrl) {
        	$.ajax({url: impressionUrl, dataType: 'jsonp'});
		},
		renderAdList: function(container, templateId, listDatas) {
	        var line, product;
	        for (var i = 0; i < listDatas.length; i++) {
	            if (/\\"/g.test(listDatas[i].content)) {
	                var str = listDatas[i].content.replace(/\\|\r\n|\n/g,'');
	                product = JSON.parse(str.slice(1,str.length - 1));
	            } else {
	                product = JSON.parse(listDatas[i].content.replace(/\\|\r\n|\n/g,''));
	            }
	            if (utils.isGome) {
		            product['impression_url'] = getUrlInfoWithDeviceID(product['impression_url']);
		            product['click_url'] = getUrlInfoWithDeviceID(product['click_url']);
		        }
		        product['landing_url'] = decodeURIComponent(product['landing_url']);
		        product['promotion_title'] = decodeURIComponent(product['promotion_title']);
		        product['promotion_description'] = decodeURIComponent(product['promotion_description']);
	            //使用模板
	            line = $('#' + templateId).tmpl({product: product}).appendTo(container);
	        }
		},
		renderActiveList: function(container, templateId, listDatas) {
			var line, product;
	        for (var i = 0; i < listDatas.length; i++) {
	            if (/\\"/g.test(listDatas[i].content)) {
	                var str = listDatas[i].content.replace(/\\|\r\n|\n/g,'');
	                product = JSON.parse(str.slice(1,str.length - 1));
	            } else {
	                product = JSON.parse(listDatas[i].content.replace(/\\|\r\n|\n/g,''));
	            }
	            if (utils.isGome) {
		            product['impression_url'] = getUrlInfoWithDeviceID(product['impression_url']);
		            product['click_url'] = getUrlInfoWithDeviceID(product['click_url']);
		        }
		        product['landing_url'] = decodeURIComponent(product['landing_url']);
		        product['promotion_title'] = decodeURIComponent(product['promotion_title']);
		        product['promotion_description'] = decodeURIComponent(product['promotion_description']);
	            //使用模板
	            line = $('#' + templateId).tmpl({product: product}).appendTo(container);
	        }
		},
		loadMoreActive: function() {
			if (minisite.actives.isLoading) return;
			minisite.pageContainer.active.find('.weui-loadmore').show();
			var wrap = minisite.pageContainer.active.find('ul');
            minisite.actives.isLoading = true;
            $.ajax({
                url: minisite.url.activeWithIdsUrl + minisite.actives.pageIds[minisite.actives.page].join(',') + '&districtId=' + minisite.districtId,
                dataType: 'jsonp',
                success: function (data) {
                    var mainDataArr = [];
                    if (data.length != 0) {
                        mainDataArr = data[0].adContents;
                        slotId = data[0].slotId;
                        minisite.renderAdList(wrap, 'activeAdTmp', mainDataArr);
                        minisite.actives.isLoading = false;
                        if (minisite.actives.page == minisite.actives.pageIds.length - 1) {
                            minisite.pageContainer.active.destroyInfinite();
                            minisite.pageContainer.active.find('.weui-loadmore').hide();
                            minisite.pageContainer.active.find('.page-end').show();
                        } else {
                            minisite.actives.page++;
                        }
                    }
                },
                error: function(error) {
                	minisite.actives.isLoading = false;
                	minisite.pageContainer.active.destroyInfinite();
                    minisite.pageContainer.active.find('.weui-loadmore').hide();
                    console.log(error);
                }
            });
		},
		initPageIds: function(type, ids) {
	        var pageTotal = parseInt((ids.length + minisite.pageSize - 1) / minisite.pageSize);
	        var idsList = [];
	        for (var i = 0; i < pageTotal; i++) {
	            idsList[i] = ids.slice(i * minisite.pageSize, (i + 1) * minisite.pageSize);
	        }
	        if (type === 'ad') {
	        	minisite.products.pageIds = idsList;
	        } else {
	        	minisite.actives.pageIds = idsList;
	        }
		},
		getAreaCode: function() {
			minisite.districtId = getDistrictIdByUrl(window.location);
		},
		init: function() {
			minisite.getAreaCode();
			utils.initPullToRefresh(minisite.pageContainer.ad, minisite.initAdList);
			utils.initPullToRefresh(minisite.pageContainer.active, minisite.initActiveList);
			utils.simulatePullToRefresh($('.page.something-special'));
		}
	};
	var Event = {
		currentTabIndex: NaN,
		init: function() {
			Event.tabHandler($('.tab-container span'));
			Event.tabScrollHandler($('.page'));
			Event.listItemClick();
			if (!utils.isGome) {
				Event.initTab();
			}
		},
		initTab: function() {
			Event.currentTabIndex = parseInt(sessionStorage.getItem('minisiteTabIndex'));
			if (Event.currentTabIndex) {
				var tabs = $('.tab-container span');
				for (var i = 0; i < tabs.length; i++) {
					var tab = $(tabs[i]);
					if (Event.currentTabIndex === i) {
						tab.addClass('active').siblings().removeClass('active');
						var currentTab = utils.tabContainers.eq(i);
				        currentTab.show().siblings('.page').hide();
				        var ulList = currentTab.find('li');
				        if (ulList.length === 0) {
				        	utils.simulatePullToRefresh(currentTab);
				        }
				        break;
					}
				};
			} else {
				Event.currentTabIndex = 0;
				sessionStorage.setItem('minisiteTabIndex', Event.currentTabIndex);
			}
		},
		tabHandler: function(tabs) {
			tabs.on('click', function(e) {
				var ele = e.target;
				$(ele).addClass('active').siblings().removeClass('active');
		        var index = $(ele).index();
		        utils.currentIndex = index;
		        var currentTab = utils.tabContainers.eq(index);
		        currentTab.show().siblings('.page').hide();
		        var ulList = currentTab.find('li');
		        if (ulList.length === 0) {
		        	utils.simulatePullToRefresh(currentTab);
		        }
		        if (currentTab.scrollTop() > currentTab.height() * 0.5) {
		        	utils.gotopBtn.show();
		        } else {
		        	utils.gotopBtn.hide();
		        }
		        sessionStorage.setItem('minisiteTabIndex', index);
			})
		},
		listItemClick: function() {
			$('#adContainer').on('click','.product-local',function() {
		        var clickUrl = $(this).attr('data-click'),landingUrl = decodeURIComponent($(this).attr('data-landing'));
		        var landingParam = getKeyValue(landingUrl);
		        $.ajax({
		            url: clickUrl+'&contentType=3',
		            dataType: 'jsonp',
		            success: function(data) {
		                if (/-awall/g.test(landingUrl)) {
		                    landingUrl += '&districtId=' + minisite.districtId;
		                    AppInterface.call('/common/localJump',{url:window.btoa(landingUrl)});
		                } else {
		                	window.location.href = landingUrl;
		                    // AppInterface.call('/product/detail', landingParam);
		                }
		            }
		        });
    		});
		},
		tabScrollHandler: function(tabPages) {
			utils.gotopBtn.on('click', function(e) {
				// var goEle = e.target;
				var currentTab = utils.tabContainers.eq(utils.currentIndex);
				// var page = $(goEle).parents('.page');
				currentTab.animate({scrollTop: "0px"}, 200);
			});
			tabPages.on('scroll', function(e) {
				var ele = e.target;
				var pageIndex = $(ele).index();
				// var gotop = $('.gotop');
				var list = $(ele).find('li[data-visible]');
				minisite.checkIsImpression($(ele), list);
				if ($(ele).scrollTop() > $(ele).height() * 0.5) {
					if (utils.gotopBtn.css('display') === 'none') {
						utils.gotopBtn.show();
					}
				} else {
					if (utils.gotopBtn.css('display') === 'block') {
						utils.gotopBtn.hide();
					}
				}
			});
		}
	};
	minisite.init();
	Event.init();
});