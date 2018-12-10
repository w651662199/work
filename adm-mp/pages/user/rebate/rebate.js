// pages/user/rebate/rebate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    isMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.getAccount();
  },
  more(){
    wx.navigateTo({
      url: 'moreRebate/moreRebate',
    })
  },
  getList(){
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/recordV2';
    app.request(url, "GET", { page: 1, number: 20 }, (res) => {
      if(res.data.code = 200) {
        let data = res.data.data;
        if (data.list.length>5){
          this.setData({
            isMore:true
          })
        }
        data.list.forEach((item)=>{
          if (item.amount.indexOf(".") == -1){
            item.amount += '.00'
          }
        })
        let list = data.list.splice(0,5);
        this.setData({
          list: list
        })
      }
    })
  },
  getAccount() {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/account';
    app.request(url, "GET", {}, (res) => {
      if (res.data.code === 200) {
        this.setData({
          money: (res.data.data.result / 100).toFixed(2)
        })
      }
    });
  },
  showTip() {
    wx.showModal({
      content: '提现功能正在努力开发中，请暂时使用国美app进行提现，国美app下载地址：http//www.gome.com.cn/',
      icon: 'none',
      confirmText: '下载国美',
      cancelText: '知道了',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../../common/toWebPage/toWebPage?url=http://www.gome.com.cn/',
          })
        } else if (res.cancel) {}
      }
    })
  },
  onUnload: function () {
  },
})