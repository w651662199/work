import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode, getImage } from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShareRebate: false,
    sharePatamsS: '',
    rebateData: {},
    data: {},
    options: {},
    showLoadingFail: false,
    showQuestion: {
      flag: false,
    },
    userId:'',
    isShowShareCover: false
  },
  goHome() {
    app.goHome();
  },
  onQuestion(data) {
    this.setData({
      ['showQuestion.flag']: data.detail.showQuestion
    })
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
    this.data.data.webpageItems.forEach((item,index) => {
      this.setData({
        ['data.webpageItems.[' + index + '].image']: getImage(item.image,360)
      })
    });
  },
  getList() {
    app.middlePageImpression(this.data.options);
    app.getDetailList(this.data.options.id, this.data.options.type, (res) => {
      this.setData({
        data: res,
        showLoadingFail: false,
      }, () => {
        this.changeData();
        this.handlerImg();
      })
    }, () => {
      this.setData({
        showLoadingFail: true,
      })
    });
  },
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
          });
        }
      }
    });
  },
  changeData() {
    app.getProductPrice(this.data.data, 'item', (data) => {
      this.setData({
        data: data
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userId: app.globalData.userInfo.userId
    });
    this.getRebateState();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let data = app.getShareData(Object.assign({}, this.data.data, this.data.options, { s: this.data.sharePatamsS }), () => {
      that.hideShareCover();
    });
    return data;
  },
  _reload() {
    this.getList();
  }
})