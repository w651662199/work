// pages/active/bag/bag.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuth: false,
    parentOpenId: '',
    parentName: '',
    parentAvatar: '',
    isFromLogin: false,
    isGetBag: false,
    userId: '',
    btnType: 0, //1 点击领福袋  2分享 3 生成礼品卡按钮 从登录页回来后根据此值自动下一步操作
    clickBtn: 0, //1 点击领福袋  2分享 3 生成礼品卡按钮 获取授权后根据此值自动下一步操作
    bagList: [],
    totalCount: 0,
    currentPage: 1,
    pageCount: 0,
    pageSize: 10,
    isNew: false, //是否为新用户
    isConflict: false, //微信openId是否绑定过美媒榜账号,
    userAvatar: '',
    options: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    });
    this.setData({
      parentOpenId: options && options.p && options.p != app.globalData.openId ? options.p : ''
    });
    if (this.data.parentOpenId != '') {
      this.getParentInfo(options.p);
    }
    this.isGetBag();
    this.getBags();
    this.impression('pv');
    if (!app.globalData.userInfo.userId && wx.getStorageSync('jwt') !== '') {
      app.getUserInfo(wx.getStorageSync('jwt'), (res) => {
        this.setData({
          userId: res.userId
        });
      });
    }
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            isAuth: true
          });
        }
      }
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
    if (app.globalData.userInfo.userId) {
      this.setData({
        userId: app.globalData.userInfo.userId
      });
    }
    // if (app.globalData.wxUserInfo.nickName != '' && app.globalData.wxUserInfo.avatarUrl != '') {
    //   this.setData({
    //     isAuth: true,
    //     userAvatar: app.globalData.wxUserInfo.avatarUrl
    //   });
    // }
    if (this.data.isFromLogin && app.globalData.userInfo.userId != '') {
      if (this.data.btnType == 1) {
        this.getBag();
      } else if (this.data.btnType == 3) {
        this.setData({
          isFromLogin: false
        });
        wx.navigateTo({
          url: '/pages/active/bimg/bimg',
        });
      }
    }
  },
  goHome() {
    app.goHome();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  bindGetUserInfo(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        isAuth: true,
        userAvatar: e.detail.userInfo.avatarUrl
      });
      app.globalData.wxUserInfo.nickName = e.detail.userInfo.nickName;
      app.globalData.wxUserInfo.avatarUrl = e.detail.userInfo.avatarUrl;
      app.saveWxUserInfo();
      if (this.data.clickBtn == 1) {
        this.getBag();
      } else if (this.data.clickBtn == 3) {
        this.goSaveImg();
      } else if (this.data.clickBtn == 2) {
        this.shareBag();
      }
    }
    
    // console.log(e.detail.userInfo);
  },
  isGetBag() {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/isGetBag';
    app.request(url, 'get', {}, (res) => {
      if (res.data.code == 200 && res.data.data.getBag) {
        this.setData({
          isGetBag: true
        });
      }
    });
  },
  getBag() {
    if (!this.data.isGetBag) {
      this.impression('click', 1);
    }
    this.setData({
      clickBtn: 1
    });
    if (!this.data.isAuth) return;
    if (app.globalData.userInfo.userId == '') {//没有登录先登录
      wx.navigateTo({
        url: '/common/login/login?f=bag&type=1',
      });
    } else {
      this.setData({
        isFromLogin: false
      });
      if (this.data.isGetBag) return;
      let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/getBag';
      let data = { getOpenId: app.globalData.openId, rebateOpenId: '', isNew: this.data.isNew};
      if (this.data.parentOpenId != '' && this.data.parentOpenId != app.globalData.openId) {
        data.rebateOpenId = this.data.parentOpenId;
      }
      app.request(url, 'post', data, (res) => {
        if (res.data.code == 200) {
          let result = res.data.data;
          if (result.dirtributeOut) {
            //奖品发完了
            this.showResult('今日福袋已领光，明日再来');
          } else if (result.exceedToday) {
            //今天得奖品超过10个
            this.showResult('今日您已领满10个，明日再来');
          } else if (result.getBag) {
            //领取成功
            this.setData({
              isGetBag: true
            });
            this.getBags(false);
            this.showResult('领取成功，发给朋友再领几个');
          } else {
            //领取失败
            this.showToastFn('领取失败', 'none');
          }
        } else {}
      }, (err) => {
        this.showToastFn('网络异常！', 'none', 2000);
      });
    }
  },
  nextPage() {
    this.setData({
      currentPage: this.data.currentPage + 1
    });
    this.getBags();
  },
  getBags() {
    if (app.globalData.openId == '') return;
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/bags';
    app.request(url, 'get', {
      page: this.data.currentPage
    }, (res) => {
      if (res.data.code == 200) {
        this.setData({
          bagList: [...this.data.bagList, ...res.data.data.list],
          totalCount: res.data.data.totalCount,
          pageCount: Math.ceil(res.data.data.totalCount / this.data.pageSize)
        });
      }
    });
  },
  getParentInfo(openId) {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/wxUser';
    app.request(url, 'get', {openId: openId}, (res) => {
      if (res.data.code == 200) {
        this.setData({
          parentName: res.data.data.nickname,
          parentAvatar: res.data.data.avatar
        });
      }
    });
  },
  goSaveImg() {
    this.impression('click', 3);
    this.setData({
      clickBtn: 3
    });
    if (!this.data.isAuth) return;
    let url = '';
    if (app.globalData.userInfo.userId == '') {
      url = '/common/login/login?f=bag&type=3';
    } else {
      url = '/pages/active/bimg/bimg';
    }
    wx.navigateTo({
      url: url,
    });
  },
  shareBag() {
    this.impression('click', 2);
    this.setData({
      clickBtn: 2
    });
    if (!this.data.isAuth) return;
    if (app.globalData.userInfo.userId == '') {
      wx.navigateTo({
        url: '/common/login/login?f=bag&type=2',
      });
    }
  },
  showBagMsg(e) {
    let index = e.currentTarget.dataset.index;
    let code = this.data.bagList[index].exchangeCode;
    wx.showModal({
      title: this.data.bagList[index].prizeName,
      content: code + '\r\n兑换通道已短信发送',
      confirmText: '复制',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: code + '',
            success: () => {
              wx.showToast({
                title: '复制成功',
              });
            }
          });
        }
      }
    });
  },
  showToastFn(title, icon = 'success', duration = 1500) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    });
  },
  showResult(text) {
    wx.showModal({
      title: '',
      content: text,
      showCancel: false,
      confirmText: '知道了'
    });
  },
  impression(t, btnType) {
    let impUrl = app.data.$CONFIG['impression'] + '/mm/monitor';
    app.request(impUrl, 'get', {
      operationType: t == 'pv' ? 13 : 43,
      targetId: t == 'pv' ? 1 : btnType,
      source: 3,
      timestamp: new Date().getTime()
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '免费领福袋，每日限量，先到先得',
      imageUrl: 'https://mevent.meixincdn.com/static/img/bag/bag_share_icon.png',
      path: '/pages/active/bag/bag?p=' + app.globalData.openId
    };
  }
})