//app.js
import { urlEncode, subLandingUrl, mixinSource, mixin, clearObj } from "utils/util.js";
import config from 'utils/config.js';
App({
  data: {
    env: 'pre',
    wHeight: 0,
    currentQuery:{},
    code:'',
    system:'',
    $CONFIG: {},
    messageTimer: null,
  },
  globalData: {
    slotType: 2, //广告位类型
    sourceType: 1, //流量来源1:频道跳转（广告点击打开）；2:直接打开（分享点击)
    selectedIndex: 0,
    currentSlotId: 0,
    openId: '',
    userInfo: {
      userId: '',
      name: "",
      gender: 0,
      mobile: "",
      email: "",
      type: 1,
      loginName: "",
      nickname: "",
      avatar: "",
      isRegistered: 0,
      isApproved: 0
    },
    wxUserInfo: {
      nickName: '',
      avatarUrl: ''
    }
  },
  onLaunch: function (options) {
    this.data.$CONFIG = Object.assign({}, config[this.data.env]);
    this.globalData.currentSlotId = this.data.$CONFIG['slots']['topicSlotId'];
    this.getWxUserInfo();
    if (wx.getStorageSync('jwt') !== ''){
      this.getUserInfo(wx.getStorageSync('jwt'),()=>{});
    };
    this.getOpenId();
  },
  onShow: function (options) {
    // Do something when show.
    wx.getSystemInfo({
      success: (res) => {
        this.data.system = res.system.split(' ')[0] + '',
        this.data.wHeight = res.windowHeight
      },
    })
    this.data.currentQuery = options;
    this.shareRebate(options.query);
    if (this.globalData.userInfo.userId != '') {
      this.getTabBarRed();
    }
  },
  getWxUserInfo() {
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              _this.globalData.wxUserInfo.nickName = res.userInfo.nickName;
              _this.globalData.wxUserInfo.avatarUrl = res.userInfo.avatarUrl;
              _this.saveWxUserInfo();
            }
          });
        }
      }
    });
  },
  beforeJumpMap(mapUrl) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] === undefined) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              wx.navigateTo({
                url: mapUrl
              });
            }
          });
        } else if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            content: '请允许获取定位信息',
            cancelText: '下次再说',
            confirmText: '去设置',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    wx.navigateTo({
                      url: mapUrl
                    });
                  }
                });
              } else if (res.cancel) {
                wx.navigateTo({
                  url: mapUrl
                });
              }
            }
          })
        } else {
          wx.navigateTo({
            url: mapUrl
          });
        }
      }
    });
  },
  getTabBarRed() {
    this.getMessageCount(() => { });
    this.data.messageTimer = setInterval(() => {
      this.getMessageCount(() => { });
    }, 30000)
  },
  onHide: function () {
    clearInterval(this.data.messageTimer);
    // Do something when hide.
  },
  onError: function (msg) {
    console.log(msg)
  },
  getOpenId() {
    let openId = wx.getStorageSync('openId');
    if (openId == '') {
      wx.login({
        success: (res) => {
          if (res.code) {
            //发起网络请求        
            wx.request({
              url: this.data.$CONFIG['middlePageUrl'] + '/api/mm/openId',
              data: {
                code: res.code
              },
              method: 'GET',
              success: (res) => {
                wx.setStorageSync('openId', res.data.data.openId);
                this.globalData.openId = res.data.data.openId;
                console.log(this.globalData.openId);
                this.saveWxUserInfo();
              }
            })
          } else {
            console.log('获取openID失败！' + res.errMsg)
          }
        }
      });
    } else {
      this.globalData.openId = openId;
      this.saveWxUserInfo();
    }
  },
  saveWxUserInfo() {
    if (this.globalData.openId == '') return;
    if (this.globalData.wxUserInfo.nickName == '' && this.globalData.wxUserInfo.avatarUrl == '') return;
    let url = this.data.$CONFIG['middlePageUrl'] + '/api/mm/auth'
    this.request(url, 'post', {
      nickname: this.globalData.wxUserInfo.nickName,
      avatar: this.globalData.wxUserInfo.avatarUrl,
      openId: this.globalData.openId,
    });
  },
  getMessageCount(callback) {
    let url = this.data.$CONFIG['middlePageUrl'] + '/api/mm/messageCount';
    this.request(url, 'GET', {}, (res) => {
      if (res.data.code === 200) {
        callback(res.data.data.result);
        if (res.data.data.result != 0) {
          wx.showTabBarRedDot({
            index: 2
          })
        } else {
          wx.hideTabBarRedDot({
            index: 2
          })
        }
      }
    });
  },
  /** 获取用户信息 */
  getUserInfo: function (token, callback){
    wx.request({
      url: this.data.$CONFIG['middlePageUrl'] + '/api/mm/user',
      header:{
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          mixinSource(this.globalData.userInfo, res.data.data);
          callback(res.data.data);
          this.getTabBarRed();
        }      
      }
    })
  },
  /** 返回首页*/
  goHome: function(){
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  /** 打开中间页上报 */
  middlePageImpression: function (options) {
    this.request(this.data.$CONFIG['middlePageImpressionUrl'], 'GET', {
      q: options.q,
      sourceType: options.sourceType
      },(res) => {
        console.log('中间页曝光');
      })
  },
  /** 获取详情页数据 */
  getDetailList(detailId, type, callback, fail) {
    let url = this.data.$CONFIG['mdomain'] + '/api/mm/' + type;
    this.request(url,'GET',{
      id: detailId
    },(res) => {
      if (res.data.code === 200) {
        callback(res.data.data)
      } else if (res.data.code >= 500) {
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 3000
        })
      }
    }, () => {
      fail();
    })
  },   
  /** 获取联合推广商品价格*/
  getProductPrice: function(list,type,callback){
    let productIdList = [];
    let webpage = type == 'product' ? 'items' : 'webpageItems';
    let url = this.data.$CONFIG['middlePageUrl'] + '/api/mm/prices';
    list[webpage].forEach((item) => {
      if (type == 'story' && item.type == 'product') {
        productIdList.push(item.productId + '-' + item.skuId)
      } else if(type == 'product'){
        productIdList.push(item.productId + '-' + item.itemId)
      } else if (item.type == 'product') {
        productIdList.push(item.productId + '-' + item.skuId)
      }

    });
    if (productIdList.length === 0) {
      callback(list);
    } else {
      this.request(url, 'GET', {
        ids: productIdList.join(','),
        areaCode: 0
      }, (price) => {
        if (type == 'product') {
          for (let i = 0; i < list.items.length; i++) {
            for (let j = 0; j < price.data.data.length; j++) {
              if (list.items[i].itemId == price.data.data[j].skuId) {
                list.items[i].price = price.data.data[j].price;
                break;
              }
            }
          }
        } else {
          for (let i = 0; i < list.webpageItems.length; i++) {
            for (let j = 0; j < price.data.data.length; j++) {
              if (list.webpageItems[i].skuId == price.data.data[j].skuId) {
                list.webpageItems[i].price = price.data.data[j].price;
                break;
              }
            }
          }
        }
        callback(list);
      });
    }
  },
  // 获取分享url
  getShareUrl: function(shareItem, cb) {
    let url = this.data.$CONFIG['mdomain'] + '/api/mm/mgs';
    let param = {
      url: shareItem.contentObject ? shareItem.contentObject.landingUrl : '',
      q: shareItem.q,
      o: this.globalData.openId,
      ot: 1,
      p: 2
    };
    if (shareItem.s) {
      param.s = shareItem.s
    }
    this.request(url, 'get', param, (res) => {
      cb(res);
    });
  }, 
  getShareData: function(itemData, cb) {
    let data = {
      title: itemData.cardTitle || itemData.title,
      imageUrl: '/images/share_logo.png',
      path: 'pages/details/' + itemData.type + '/' + itemData.type + '?',
      success: (res) => {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        });
      },
      complete: () => {
        if (cb) {
          cb();
        }
      }
    }
    let urlParam = {
      id: itemData.id,
      type: itemData.type,
      q: itemData.q,
      sourceType: 2
    }
    if (itemData.s) {
      urlParam.s = itemData.s;
    }
    let urlStr = urlEncode(urlParam).slice(1);
    data.path = data.path + urlStr;
    return data;
  },
  /** 查询返利状态*/
  getCommonRebate: function(data, callback){
    let url = this.data.$CONFIG['mdomain'] + '/api/mm/rebateStatus';
    this.request(url,'GET',{
      q: data.q
    },(res) => {
      callback(res.data.data)
    })
  },  
  /** 点击分享上报 */
  adShareImpression: function(data){
    let url = this.data.$CONFIG['mdomain'] + '/api/mm/sr';
    this.request(url,'GET',{
      q: data.q,
      o: this.globalData.openId,
      ot: 1,
      p: 2
    },(res) => {
      console.log('点击分享上报成功！');
    });
  },
  contentShareImp: function(data) {
    let impUrl = this.data.$CONFIG['impression'] + '/mm/monitor';
    let contentId = data.q ? data.q.match(/([0-9])+/) : [];
    this.request(impUrl, 'GET', {
      operationType: 22,
      targetId: data.contentId || contentId[0],
      source: 3,
      timestamp: new Date().getTime()
    }, (res) => {
      console.log('微广告分享上报');
    });
  },
  /** 分享返利上报*/
  shareRebate: function (options){
    if (options.s && options.q){
      let url = this.data.$CONFIG['mdomain'] + '/api/mm/shareRebate';
      this.request(url, 'GET',{
        s: decodeURIComponent(options.s),
        q: decodeURIComponent(options.q),
        o: this.globalData.openId,
        ot: 1
      },(res) => {
        console.log('打开页面分享返利上报！');
      },(err) => {
        console.log('打开页面分享返利上报失败！');
        console.log(err);
      })
    }
  },
  /** 处理曝光*/
  handlerImpression: function (_this, className, Ids, callback) {
    var query = _this.createSelectorQuery().in(_this);
    query.selectAll(className).boundingClientRect()
    query.exec((res) => {
      //res就是 该元素的信息 数组
      let data = res[0];
      for (let i = 0; i < data.length; i++) {
        if (!Ids[data[i].id] && data[i].top > 0 && data[i].top < this.data.wHeight) {
          Ids[data[i].id] = true;
          let t = data[i].dataset.type;
          let url = data[i].dataset.url;
          if (t == 2) {
            url = url + '&source=3&timestamp=' + new Date().getTime();
          }
          this.request(url, 'GET', {}, (res) => {
            callback(Ids);
          });
        }
      }
    })
  },
  /** 封装request */
  request: function (url, method, data, success, fail, complete) {
    let token = wx.getStorageSync('jwt');
    let openId = wx.getStorageSync('openId');
    let header = {};
    if (url && url.indexOf('login') > -1) {
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'openId': openId,
        'userId': this.globalData.userInfo.userId
      }
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: mixin({ 'content-type': 'application/json', 'Authorization': 'Bearer ' + token, 'openId': this.globalData.openId }, header),
      success: (res) => {
        if (typeof success == 'function') {
          if (res.data.code == 401 && url.indexOf('messageCount') == -1){
            clearObj(this.globalData.userInfo);
            wx.hideLoading();
            wx.showModal({
              content: '您的登录已过期，请重新登录',
              confirmText:'登录',
              success: (res) => {
                if( res.confirm ){
                  //去登陆
                  wx.navigateTo({
                    url: '/common/login/login'
                  })
                } else if(res.cancel){
                  //去首页
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          } else {
            success(res)
          }
        }
      },
      fail: (error) => {
        if (typeof fail == 'function') {
          fail(error)
        }
      },
      complete: (data) => {
        if (typeof complete == 'function') {
          complete(data)
        }
      }
    })
  }
})