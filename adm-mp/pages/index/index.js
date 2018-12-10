var app = getApp();
import {subLandingUrl, urlEncode, limitLen} from '../../utils/util.js';
Page({
    data: {
      fixedNav: true,
      topImageContents: [],
      navSelectIndex: 1,
      items: [],
      noMoreData: false,
      loading: false,
      infinite: false,
      showLoadingFail: false,
      showDialog: false,
      dialogDetail:{},
      shareCard:{},
      showGoTop: false,
      bannerHeight: 0,
      bannerAnimationData: {},
      navAnimationData: {},
      isAnimation: false,
      isShowShareCover: false,
      shareItem: {},
      bannerImpressionCount: 0,
      bannerImpressionIndex: 0,
      imPressionIds: {},
    },
    textPaste(eve) {
      wx.setClipboardData({
        data: eve.currentTarget.dataset.url,
        success: function (res) {
          // wx.hideToast();
          // wx.showToast({
          //   title: '已为你复制链接，也可在美媒榜APP看哦',
          //   icon: 'none',
          // })
        }
      })
    },
    jumpMap(eve) {
      let data = eve.currentTarget.dataset;
      let url = '/pages/publish/line/line?loc=' + data.loc + '&city=' + data.city;
      app.beforeJumpMap(url);
    },
    showRebateDetail(eve) {
      let sharePraiseNum = eve.currentTarget.dataset.sharepraisenum;
      this.setData({
        showDialog: true,
        dialogDetail: Object.assign({ type: 'redpacket' }, sharePraiseNum)
      })
    },
    hideDialog() {
      this.setData({
        showDialog: false
      })
    },
    toWebPageClick(event) {
      let clickUrl = event.currentTarget.dataset.clickurl;
      let landPage = event.currentTarget.dataset.landpage;
      app.request(clickUrl, 'GET', { contentType: 3 }, (res) => {
        wx.navigateTo({
          url: '../../common/webPage/webPage?url=' + landPage
        });
      })
    },
    light(event) {
      let clickUrl = event.currentTarget.dataset.clickurl;
      let q = event.currentTarget.dataset.q;
      let landingUrl = event.currentTarget.dataset.landingurl;
      let typeAndId = subLandingUrl(landingUrl);
      let Query = urlEncode(Object.assign({q: q}, typeAndId));
      let jumpUrl = '';
      if (typeAndId.type == 'topic') {
        jumpUrl = '../../pages/details/topic/topic?' + Query;
      } else if (typeAndId.type == 'story') {
        jumpUrl = '../../pages/details/story/story?' + Query;
      } else if (typeAndId.type == 'product') {
        jumpUrl = '../../pages/details/product/product?' + Query;
      } else if (typeAndId.type == 'item') {
        jumpUrl = '../../pages/details/item/item?' + Query;
      } else if (typeAndId.type == 'shop') {
        jumpUrl = '../../pages/details/shop/shop?' + Query;
      } else if (typeAndId.type == 'content') {
        jumpUrl = '../../pages/details/publishContent/publishContent?' + Query + '&f=1';
        clickUrl = clickUrl + '&source=3&timestamp=' + new Date().getTime();
      }
      app.request(clickUrl, 'GET', { contentType: 3 }, (res) => {
        wx.navigateTo({
          url: jumpUrl
        });
      })
    },
    onShow() {
      if (app.globalData.userInfo.userId != '') {
        app.getMessageCount((res) => { });
      }
    },
    showShareCover(e) {
      wx.hideTabBar({
        animation: true
      });
      this.setData({
        isShowShareCover: true,
        shareItem: e.detail
      });
    },
    hideShareCover() {
      this.setData({
        isShowShareCover: false
      });
      wx.showTabBar({
        animation: true
      });
    },
    selectedNavBar(e) {
      let data = e.currentTarget.dataset;
      wx.pageScrollTo({scrollTop: 0, duration: 0});
      this.setData({
        navSelectIndex: Number(data.selectindex),
        noMoreData: false,
        items: []
      });
      this.getList(1, this.data.navSelectIndex);
    },
    onPullDownRefresh() {
      if(this.data.showLoadingFail){
        wx.stopPullDownRefresh()
      } else {
        wx.showNavigationBarLoading();
        // this.pickListTop();
        this.getList(1, this.data.navSelectIndex);
      }
    },
    onLoad() {
      // this.pickListTop();
      this.getList(1, 1);
    },
    onReady() {
      // this.getBannerHeigh();
    },
    getBannerHeigh() {
      let _this = this;
      let query = wx.createSelectorQuery();
      query.select('#index-banner').boundingClientRect().exec((res) => {
        if (res[0]) {
          this.setData({
            bannerHeight: res[0].height
          })
        } else {
          this.setData({
            fixedNav: true
          });
        }
      });
    },
    pickListTop() {
      app.request(app.data.$CONFIG['mdomain'] + '/api/mm/pickListTop', 'GET', {}, (res) => {
        let adContents = res.data.data.adContents;
        adContents.forEach((item) => {
          item.content = JSON.parse(item.content);
        });
        this.setData({
          bannerImpressionCount: 0,
          topImageContents: adContents
        }, () => {
          app.request(this.data.topImageContents[this.data.bannerImpressionIndex].content.impressionUrl, 'GET', {}, (res) => {
            this.setData({
              bannerImpressionCount: ++this.data.bannerImpressionCount
            })
            console.log('曝光banner');
          });
        });
      }, (error) => {
        console.log(error);
      })
    },
    bannerImpression(eve) {
      this.setData({
        bannerImpressionIndex: eve.detail.current
      })
      if (this.data.topImageContents.length == this.data.bannerImpressionCount) {
        return;
      }
      let currentIndex = eve.detail.current;
      app.request(this.data.topImageContents[currentIndex].content.impressionUrl, 'GET', {}, (res) => {
        this.setData({
          bannerImpressionCount: ++this.data.bannerImpressionCount
        })
        console.log('曝光banner');
      })
    },
    goTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    animationInit(length) {
      let bannerAnimation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
      });
      bannerAnimation.translateY(-length).step();
      let navAnimation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
      });
      navAnimation.translateY(-length).step();
      this.setData({
        bannerAnimationData: bannerAnimation.export(),
        navAnimationData: navAnimation.export(),
        isAnimation: length > 0
      });
    },
    onPageScroll(e) {
      /* 暂时不显示banner
      if (this.data.bannerHeight == 0) {
        this.getBannerHeigh();
      }
      if (this.data.fixedNav != (e.scrollTop >= this.data.bannerHeight)) {
        this.setData({
          fixedNav: e.scrollTop >= this.data.bannerHeight
        });
      }*/
      if (this.data.showGoTop != (e.scrollTop > 500)) {
        this.setData({
          showGoTop: e.scrollTop > 500
        });
      }
      this.listImpression();
    },
    onReachBottom() {
      if (this.data.loading && !this.data.noMoreData) {
        this.getList(2, this.data.navSelectIndex);
      }
    },
    getList(ac, k) {
      this.setData({
        loading: false,
      })
      if (ac == 1) {
        this.setData({
          imPressionIds: {}
        })
      }
      app.request(app.data.$CONFIG['mdomain'] + '/api/mm/recommend','GET',{
        ac: ac,
        k: k,
        p: 3
      },(res) => {
        if (res.data.code === 200) {
          let data = this.listDataChange(res.data.data);
          let items = ac == 1 ? data : this.data.items.concat(data);
          this.setData({
            items: items,
            loading: true,
            showLoadingFail: false
          }, () => {
            this.listImpression();
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          if (ac == 2 && res.data.data.length == 0) {
            this.setData({
              noMoreData: true
            });
          }
        } else {
          this.setData({
            items: [],
            showLoadingFail: false,
            loading: true,
            noMoreData: true
          });
        }
      },(error) => {
        this.setData({
          showLoadingFail: true,
          loading: true,
          items: [],
          noMoreData: false
        })
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      })
    },
    listImpression() {
      app.handlerImpression(this, '.impression-item', this.data.imPressionIds, (imPressionIds) => {
        this.setData({
          "imPressionIds": imPressionIds
        })
      });
    },
    listDataChange(data) {
      let currentData = data;
      currentData.forEach((item, index) => {
        // if (item.sharePraiseNum && item.sharePraiseNum.rebateStatus == 0) {
        //   console.log(item);
        // }
        if (item.contentObject.ctype == 2) {
          item.contentObject.showFullText = false;
          if (!limitLen(item.contentObject.text, 140)) {
            item.contentObject.text = this.subMicroText(item.contentObject.text, 140);
            item.contentObject.showFullText = true;
          }
        }
      });
      return currentData;
    },
    subMicroText(str, len) {
      let strlen = 0;
      let s = "";
      for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
          strlen = strlen + 2;
          if (strlen > len) {
            return s.substring(0, s.length - 1) + "...";
          }
        } else {
          strlen = strlen + 1;
          if (strlen > len) {
            return s.substring(0, s.length - 2) + "...";
          }
        }
      }
      return s;
    },
    indexImageOnload(event) {
      let imgWidth = 'items[' + event.currentTarget.dataset.index + '].contentObject.imgWidth';
      let imgHeight = 'items[' + event.currentTarget.dataset.index + '].contentObject.imgHeight';
      this.setData({
        [imgWidth]: event.detail.width,
        [imgHeight]: event.detail.height
      })
    },
    previewImage(event) {
      let currenturl = event.currentTarget.dataset.currenturl;
      let itemIndex = event.currentTarget.dataset.index;
      wx.previewImage({
        current: currenturl,
        urls: this.data.items[itemIndex].contentObject.images
      });
    },
    _reload(){
      this.pickListTop();
      this.getList(1, this.data.navSelectIndex);
    },
    onShareAppMessage: function (e) {
      if (e.from == 'button'){
        let landingUrl = e.target.dataset.landingurl;
        let i = e.target.dataset.i;
        let item = this.data.items[i];
        let text = item && item.contentObject.text ? item.contentObject.text.substring(0, 30) : '';
        let title = e.target.dataset.title || text || '一条来自美媒榜的分享';
        let image = '/images/share_logo.png';
        let pageType = subLandingUrl(landingUrl);
        let urlParam = {
          id: pageType.id,
          type: pageType.type,
          q: e.target.dataset.q,
          sourceType: 2
        }
        if (this.data.shareItem && this.data.shareItem.s) {
          urlParam.s = this.data.shareItem.s;
        }
        let pType = pageType.type;
        if (pType == 'content') {
          pType = 'publishContent';
          urlParam.type = pType;
          urlParam.f = 1;
          urlParam.zf = 2;
        }
        let urlStr = '?' + urlEncode(urlParam).slice(1);
        let url = '/pages/details/' + pType + '/' + pType + urlStr;
        return {
          title: title,
          imageUrl: image,
          path: url,
          success: (res) => {
            // 转发成功
            wx.showToast({
              title: '分享成功',
            });
          },
          fail: (res) => {
            // 转发失败
          },
          complete: () => {
            this.hideShareCover();
          }
        }
      } else {
        return {
          title: '只看我关心的优惠',
          imageUrl: '/images/share_logo.png',
          success: () => {
            wx.showToast({
              title: '分享成功',
            });
          }
        }
      }
    }
})