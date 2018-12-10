// pages/user/user.js
import { handlerImg, clearObj } from '../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: 0,
    messageCount: 0,
    nickname: '',
    avatar: '',
    userId: '',
    status: '',
    companyName: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.setData({
      userId: app.globalData.userInfo.userId,
    })
    if (app.globalData.userInfo.userId != '') {
      this.setData({
        nickname: app.globalData.userInfo.nickname,
        avatar: handlerImg(app.globalData.userInfo.avatar)
      })
      app.getMessageCount((res) => {
        this.setData({
          messageCount: res
        })
      });
      this.getAccount();
      this.getVerifyStatus();
    } else {
      this.setData({
        account: 0,
        messageCount: 0,
        nickname: '',
        avatar: '',
        userId: '',
      })
    }
  },
  logins(){
    this.login();
  },
  login(pageUrl) {
    wx.navigateTo({
      url: '../../common/login/login?pageUrl='+pageUrl,
    })
  },
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  getAccount() {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/account';
    app.request(url, "GET", {}, (res) => {
      if (res.data.code === 200) {
        this.setData({
          account: (res.data.data.result / 100).toFixed(2)
        })
      }
    });
  },
  // 获取企业认证状态
  getVerifyStatus(){
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/verifyStatus';
    app.request(url, 'GET', {}, (res) => {
      if (res.data.code == 200) {
        let data = res.data.data;
        if (data.verifyStatus==3){
          this.getCompanyName();
        }
        this.setData({
          status: data.verifyStatus
        })
      }
    })
  },
  // 获取企业简称
  getCompanyName() {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/verify';
    app.request(url, 'GET', {}, (res) => {
      if(res.data.code == 200){
        let data = res.data.data;
        this.setData({
          companyName: data.shortName
        })
      }
    })
  },
  // rebateRecord() {
  //   if (this.data.userId == '') {
  //     this.login();
  //   } else {
  //     wx.navigateTo({
  //       url: 'rebateRecord/rebateRecord',
  //     })
  //   } 
  // },
  news() {
    if (this.data.userId == '') {
      this.login('/pages/user/news/news');
    } else {
      wx.navigateTo({
        url: 'news/news',
      })
    }
  },
  // 点击红包，跳转
  money() {
    if (this.data.userId == '') {
      this.login('/pages/user/rebate/rebate');
    } else {
      wx.navigateTo({
        url: 'rebate/rebate',
      })
    }
  },
  // 点击我的发布，跳转
  release() {
    if (this.data.userId == '') {
      this.login('/pages/user/release/release');
    } else {
      wx.navigateTo({
        url: 'release/release',
      })
    }
  },
  // 点击规则，跳转
  getRules() {
    wx.navigateTo({
      url: 'rules/rules',
    })
  },
  // 点出认证提示
  authenticationTip() {
    wx.showModal({
      title: '提示',
      content: '目前美媒榜小程序暂不支持商家认证，请移步至美媒榜APP哦',
      icon:'none',
      confirmText:'知道了',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {} 
        else if (res.cancel) {}
      }
    });
  }
})