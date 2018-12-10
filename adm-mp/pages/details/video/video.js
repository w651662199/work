// pages/details/video/video.js
import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode, getImage} from '../../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShareRebate: false,
    sharePatamsS: '',
    options:{},
    items:{},
    videoSrc: '',
    videoUrl:'',
    isWatched: false, //是否观看过视频
    isPlayed: false,  //是否播放过视频
    videoRebateStatus: false,
    showLoadingFail: false,
    showQuestion: {
      flag: false,
    },
    coverView: false,
    videoCtx: '',
    autoplay: false,
    userId: '',
    isShowShareCover: false
  },
  onQuestion(data) {
    this.setData({
      ['showQuestion.flag']: data.detail.showQuestion
    })
  },
  goHome(){
    app.goHome();
  },
  onShareAppMessage: function () {
    let that = this;
    let data = app.getShareData(Object.assign({}, this.data.data, this.data.options, { s: this.data.sharePatamsS }), () => {
      that.hideShareCover();
    });
    return data;
  },
  onShow() {
    this.setData({
      userId: app.globalData.userInfo.userId
    });
    this.getRebateState();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = getKeyValue(decrypt(options.query));
    param.logParam = decodeURIComponent(param.logParam);
    if (params.s) {
      params.s = decodeURIComponent(params.s);
    }
    this.setData({
      options: param
    },() => {
      this.getList();
    });
    
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
  play(){
    this.setData({
      coverView: true,
      videoUrl: this.data.videoSrc,
      autoplay: app.globalData.userInfo.userId != '' || !this.data.videoRebateStatus
    })
    let videoCtx = wx.createVideoContext('myVideo');
    if (app.globalData.userInfo.userId == '' && this.data.videoRebateStatus) { //跳转提示去登录
      wx.navigateTo({
        url: '../../../common/toLogin/toLogin?rebateType=video'
      })
    }
  },
  handlerImg() {
    this.data.items.webpageItems.forEach((item, index) => {
      this.setData({
        ['items.webpageItems.[' + index + '].image']: getImage(item.image, 260)
      })
    });
  },
  getList() {
    app.middlePageImpression(this.data.options);
    app.getDetailList(this.data.options.id, 'video', (res) => {
      this.setData({
        items: res,
        showLoadingFail: false,
      }, () => {
        if (res.promotionType == 1){
          this.handlerImg();
        }
        this.getVideoSrc();
        app.getProductPrice(res, 'video', (data) => {
          this.setData({
            items: data,
          })
        });
      })
    }, () => {
      this.setData({
        showLoadingFail: true,
      })
    })
  },
  getRebateState() {
    //查询返利状态
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
  /** 获取video的src */
  getVideoSrc: function(){
    console.log('get src');
    app.request(app.data.$CONFIG['getVideoUrl'] + '/video/play','GET',{
      video_id: this.data.items.videoId,
      t: Date.parse(new Date())
    },(res) => {
      this.setData({
        videoSrc: res.data.data.videos[0].address
      })
    })
  },
  /** 视频播放完毕 */
  videoPlayOver: function(){
    if (!this.data.isWatched && this.data.videoRebateStatus && app.globalData.userInfo.userId !== ''){
      let doVideoWatch = [];
      doVideoWatch['userId'] = app.globalData.userInfo.userId !== '' ? app.globalData.userInfo.userId : 0;
      doVideoWatch['requestId'] = this.data.options.requestId;
      doVideoWatch['videoId'] = this.data.items.videoId;
      doVideoWatch['slotType'] = app.globalData.slotType;
      doVideoWatch['flightJobId'] = this.data.options.flightJobId;
      doVideoWatch['slotId'] = app.globalData.currentSlotId;
      let obj = {
        p: encrypt(urlEncode(doVideoWatch).slice(1)),
        q: encrypt('logParam=' + this.data.options.logParam)
      };
      app.request(app.data.$CONFIG['videoShareUrl'],'GET',obj,(res) => {
        console.log('视频观看完毕上报成功 去获取返利！');
        this.setData({
          isWatched: true
        })
      })
    }
  },
  _reload() {
    this.getList();
  }
})