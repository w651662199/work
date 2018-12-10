import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode, handlerImg} from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rebateData: {},
    isShareRebate: false,
    sharePatamsS: '',
    data: {},
    options: {},
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
    app.getProductPrice(this.data.data, 'story', (data) => {
      for (let item of data.webpageItems) {
        if (item.type == 'rich_text') {
          let regx = /<[^>]*>|<\/[^>]*>/gm;
          item.words = item.words.replace(/<\/p>/g, '\r\n');
          item.words = item.words.replace(regx, '');
        }
      }
      this.setData({
        data: data
      })
    });
    this.data.data.webpageItems.forEach((item, index) => {
      if (item.type == 'video') {
        let url = app.data.$CONFIG['getVideoUrl'] + '/video/play';
        app.request(url, 'GET', { video_id: item.videoId, t: Date.parse(new Date()) }, (res) => {
          let str = "data.webpageItems[" + index + "].videoSrc"
          this.setData({
            [str]: res.data.data.videos[0].address
          })
        });
      }
    });
  },
  getList() {
    let that = this;
    app.middlePageImpression(this.data.options);
    app.getDetailList(this.data.options.id, this.data.options.type, (res) => {
      this.setData({
        data: res,
        'data.platformAvatar': handlerImg(res.platformAvatar),
        showLoadingFail: false,
      }, () => {
        this.changeData();
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
    this.getList();
  }
})