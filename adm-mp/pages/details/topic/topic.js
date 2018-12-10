import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode, handlerImg } from '../../../utils/util.js'
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

  /**
   * 生命周期函数--监听页面加载
   */
  onQuestion(data) {
    this.setData({
      ['showQuestion.flag']: data.detail.showQuestion
    })
  },
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  goHome() {
    app.goHome();
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
  getList() {
    app.middlePageImpression(this.data.options);
    app.getDetailList(this.data.options.id, this.data.options.type, (res) => {
      for (let i = 0; i < res.topic.components.length; i++) {
        let component = res.topic.components[i];
        if (component.type == 'image' && component.scheme) {
          console.log(component.scheme);
          component.scheme = component.scheme.replace('prom', 'prom.m');
          console.log(component.scheme);
        }
      }
      this.setData({
        data: res,
        'data.topic.user.facePicUrl': handlerImg(res.topic.user.facePicUrl),
        showLoadingFail: false,
      });
      
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
        } else {
          that.setData({
            sharePatamsS: ''
          });
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
    console.log('topic')
    this.getList();
  }
})