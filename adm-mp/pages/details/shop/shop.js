import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode } from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rebateData: {},
    data: {},
    options: {},
    isShareRebate: false,
    sharePatamsS: '',
    showLoadingFail: false,
    showQuestion: {
      flag: false,
    },
    userId: '',
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
  onShow: function () {
    this.setData({
      userId: app.globalData.userInfo.userId
    });
    this.getRebateState();
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
  changeData() {
    app.getProductPrice(this.data.data, 'shop', (data) => {
      this.setData({
        data: data
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
        this.changeData()
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
          })
        }
      }
    });
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