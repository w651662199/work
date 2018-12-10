// common/toLogin/toLogin.js
import { subLandingUrl, getKeyValue, encrypt, decrypt, urlEncode, isEmptyObj } from '../../utils/util.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    shareCard: {},
    decryptOptions: {},
    rebateType: '',
    surveyId: '',
    surveyParams: '',
  },
  onLoad(options){
    if (this.options.query){
      let decryptOptions = getKeyValue(decrypt(this.options.query)); //解密之后的query
      this.setData({
        decryptOptions: decryptOptions,
        options: options,
        shareCard: {
          title: this.options.title,
          image: this.options.image
        }
      })
    }
    this.setData({
      rebateType: options.rebateType,
      surveyId: options.id ? options.id : '',
      surveyParams: options.params ? options.params : '',
    })
    console.log(this.data);
  },
  toLogin: function(){
    wx.redirectTo({
      url: '../../common/login/login'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let params = app.getEncypyPandQ(this.data.options);
    let Query = encrypt(urlEncode(Object.assign(this.data.decryptOptions, { sourceType: 2 })));
    return {
      title: this.data.shareCard.title,
      imageUrl: this.data.shareCard.image,
      path: 'pages/details/' + this.data.decryptOptions.type + '/' + this.data.decryptOptions.type + '?query=' + Query +'&p=' + params.p + '&q=' + params.q,
      success:  (res) => {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        },2000)
        app.shareSuccess(this.data.decryptOptions.adId);
      },
      fail:  (res) => {
        // 转发失败
      }
    }
  },
  jumpTovideo: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  jumpTosurvey: function(){
    wx.redirectTo({
      url: '../../pages/details/survey/survey?id=' + this.data.surveyId + '&params='+this.data.surveyParams,
    })
  }
})