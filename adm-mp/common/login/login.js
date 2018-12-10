import { mixinSource } from "../../utils/util.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlParam: '',
    selectIndex: 0,
    getCode: false,
    btnDisabled: true,
    loginBtnDisabled: true,
    form_info: '',
    codeText: '获取验证码',
    phoneNum:'',
    code: '',
    username:'',
    password:'',
    pageUrl:'',
    tips:{
      '-101':'请重试',
      '-102':'请输入正确的手机号',
      '-104':'请重试',
      '-106':'请输入正确的手机号',
      '-108':'验证码获取较频繁，请稍后再试',
      '-112':'验证码获取较频繁，请稍后再试',
      '-113':'请输入正确的手机号和验证码',
      '-116':'请使用国内手机号',
      '-1002':'请重新获取验证码',
      '-1004':'验证码今日获取已达上限',
      '-1003':'验证码错误',
      '200':'登录成功',
      '1001':'手机号或密码不匹配，请重新输入',
      '1003':'手机号或密码不匹配，请重新输入',
      '1002':'请输入正确手机号',
      '1100':'手机号或密码不匹配，请重新输入',
      '1104':'请重试',
      '1300':'您的账户异常，请联系客服',
      '1301':'您的账户异常，请联系客服',
      '1302':'请重试',
      '1304':'请重试',
      '1400':'请输入正确的手机号',
      '1401':'请输入正确的手机号',
      '1402':'请输入正确的手机号',
      '2003':'密码错误',
      '2002':'密码错误',
      '2004':'请重试',
      '4000':'请重试',
      '4001':'您的账户存在安全隐患，请1小时后再试',
      '4002':'登录失败超次数限制，请明天再试',
      '4003':'请重试',
      '4004':'请重试',
      '4007':'请勿频繁登录',
      '401':'请前往国美App进行会员卡与手机号绑定后再使用小程序'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        urlParam: options,
      });
    }
    // options.pageUrl参数为页面绝对路径
    if (options.pageUrl && options.pageUrl!="undefined") {
      this.setData({
        pageUrl: options.pageUrl
      });
    }
  },
  selectedNavBar: function(e){
    let data = e.currentTarget.dataset;
    this.setData({
      selectIndex: Number(data.selectindex),
      btnDisabled: true,
      loginBtnDisabled: true,
      phoneNum: '',
      code: '',
      username: '',
      password: ''
    })
  },
  isALl: function () {
    if (this.data.phoneNum !== '' && this.data.code !== '') {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  isLoginAll: function(){
    if (this.data.username !== '' && this.data.password !== '') {
      this.setData({
        loginBtnDisabled: false
      })
    } else {
      this.setData({
        loginBtnDisabled: true
      })
    }
  },
  bindPhoneNum: function(e){
    this.setData({
      phoneNum: e.detail.value
    })
    this.isALl();
  },
  bindCode: function(e){
    this.setData({
      code: e.detail.value
    })
    this.isALl();
  },
  bindUserName:function(e){
    this.setData({
      username: e.detail.value
    })
    this.isLoginAll();
  },
  bindPassword: function(e){
    this.setData({
      password: e.detail.value
    })
    this.isLoginAll();
  },
  getCode: function(){
    let phone = this.data.phoneNum;
    if (!/^1[34578]\d{9}$/g.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      this.clearData();
    } else {
      if (!this.data.getCode){
        let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/veriCode';
        app.request(url, 'GET', {
          phoneNumber: this.data.phoneNum
        }, (res) => {
          let code = res.data.code;
          if(code !== 200){
            let c = code + ''
            wx.showToast({
              title: this.data.tips[c],
              icon: 'none'
            })
          } else {
            //获取成功，验证码倒计时
            this.count();
          }
        }, (error) => {
          wx.showToast({
            title: '网络异常',
            duration: 2000
          })
        })
      }
    }
  },
  formSubmitReg: function(e){
    let formData = e.detail.value;
    this.login('verifycode', formData);
  },
  formSubmitLogin: function(e){
    let formData = e.detail.value;
    this.login('password', formData);
  },
  jump: function(){
    if(this.data.pageUrl != "") {
      wx.redirectTo({
        url: this.data.pageUrl,
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  },
  login: function (type, formData){
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/login?type=' + type;
    if (!/^1[34578]\d{9}$/g.test(formData.username)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      this.clearData();
    } else {
      formData.openId = app.globalData.openId;
      app.request(url, 'POST', formData, (res) => {
        let code = res.data.code;
        if (code !== 200) {
          let c = code + ''
          wx.showToast({
            title: this.data.tips[c],
            icon: 'none'
          })
          this.clearData();
        } else if (code == 200 && res.data.data.isConflict) {
          wx.showModal({
            title: '',
            content: '当前微信账号已与其他国美账号绑定请更换账号登录',
          });
        } else {
          wx.showToast({
            title: '登录成功'
          })
          mixinSource(app.globalData.userInfo, res.data.data);
          wx.setStorageSync('jwt', res.data.data.token);
          if (this.data.urlParam.f == 'bag') {
            let pages = getCurrentPages();
            let bagPage = pages[pages.length - 2];
            bagPage.setData({
              isFromLogin: true,
              btnType: this.data.urlParam.type,
              isNew: res.data.data.isNew,
              isConflict: res.data.data.isConflict
            });
          }
          setTimeout(() => {
            this.jump();
          },3000)
          app.getTabBarRed();
        }
      }, (error) => {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        })
      })
    }
  },
  clearData: function(){
    this.setData({
      form_info: '',
      btnDisabled: true,
      loginBtnDisabled: true,
      phoneNum: '',
      code: '',
      username: '',
      password: ''
    });
  },
  count: function(){
    this.setData({
      getCode: true,
    })
    let time = 60;
    let timer = setInterval(() => {
      this.setData({
        codeText: time + 's后重新获取'
      })
      time = time - 1;
      if (time == 0) {
        clearInterval(timer);
        this.setData({
          getCode: false,
          codeText: '获取验证码'
        })
      }
    }, 1000)
  }
})