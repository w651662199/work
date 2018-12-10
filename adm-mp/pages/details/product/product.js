// pages/details/product/product.js
import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode, getImage } from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rebateData: {},
    options: {},
    items: {},
    price: '',
    isShareRebate: false,
    sharePatamsS: '',
    showLoadingFail: false,
    showQuestion: {
      flag: false,
    },
    userId: '',
    isShowShareCover: false
  },
  onQuestion(data) {
    this.setData({
      ['showQuestion.flag']: data.detail.showQuestion
    })
  },
  onShow() {
    this.setData({
      userId: app.globalData.userInfo.userId
    });
    this.getRebateState();
  },
  goHome() {
    app.goHome();
  },
  onShareAppMessage: function () {
    let that = this;
    let data = app.getShareData(Object.assign({}, this.data.items, this.data.options, { s: this.data.sharePatamsS }), () => {
      that.hideShareCover();
    });
    return data;
  },
  hideShareCover() {
    this.setData({
      isShowShareCover: false
    });
  },
  showShareCover() {
    this.setData({
      isShowShareCover: true
    });
  },
  handlerImg(){
    this.data.items.items.forEach((item, index) => {
      this.setData({
        ['items.items.[' + index + '].image']: getImage(item.image, 260)
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    params.sourceType = params.s ? 2 : 1;
    params.q = decodeURIComponent(params.q);
    if (params.s) {
      params.s = decodeURIComponent(params.s);
    }
    this.setData({
      options: params
    }, () => {
      this.getList();
    })
  },
  getList() {
    app.middlePageImpression(this.data.options);
    app.getDetailList(this.data.options.id, 'product', (res) => {
      for (let i = 0; i < res.items.length; i++) {
        if (!/^http(s)?:/gi.test(res.items[i].image)) {
          res.items[i].image = 'https:' + res.items[i].image;
        }
      }
      this.setData({
        items: res,
        ['items.productId']: res.promotionId.split(':')[0],
        ['items.skuId']: res.promotionId.split(':')[1],
        showLoadingFail: false,
      }, () => {
        this.handlerImg();
        app.getProductPrice(res, 'product', (data) => {
          this.setData({
            items: data,
            ['items.title']: decodeURIComponent(data.title),
            ['items.description']: decodeURIComponent(data.description)
          })
        });
        //获取主价格
        this.getPrice();
        
      })
    }, () => {
      this.setData({
        showLoadingFail: true,
      })
    })
  },
  //查询返利状态
  getRebateState() {
    let that = this;
    app.getCommonRebate(that.data.options, (re) => {
      if (!!re) {
        let isShareRebate = re.rebateStatus == 1 && re.shareRebateBid > 0;
        that.setData({
          rebateData: re,
          isShareRebate: isShareRebate
        });
        if (isShareRebate && app.globalData.userInfo.userId != '') {
          wx.hideShareMenu();
          app.getShareUrl(that.data.options, (res) => {
            that.setData({
              sharePatamsS: res.data.data.s
            });
          })
        }
      }
    });
  },
  getPrice: function() {
    let ids = this.data.items.promotionId.split(':').join("-")
    app.request(app.data.$CONFIG['middlePageUrl'] + '/api/mm/prices','GET',{
      ids: ids,
      areaCode: 0
    }, (res) => {
      this.setData({
        price: res.data.data[0].price
      })
    })
  },
  _reload() {
    this.getList();
  }
})