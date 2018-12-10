import { formatTime } from '../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    number: 20,
    list: [],
    stopInfinite: false,
    totalCount: 0,
    showFail: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getList();
  },
  getList() {
    this.setData({
      stopInfinite: true,
    })
    wx.showLoading({
      title: '加载中...',
    });
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/record';
    app.request(url, "GET", { page: this.data.page, number: this.data.number }, (res) => {
      if (res.data.code === 200) {
        let data = res.data.data.list;
        data.forEach((item) => {
          item.time = formatTime(new Date(item.time), 2);
          item.amount = (item.amount / 100).toFixed(2);
        });
        if (this.data.list.length == 0) {
          this.setData({
            list: data,
            stopInfinite: false,
            totalCount: res.data.data.totalCount,
            showFail: false,
          })
        } else {
          this.setData({
            list: [...this.data.list, ...data],
            stopInfinite: false,
          })
        }
        wx.hideLoading();
      }
    });
  },
  onReachBottom() {
    if (!this.data.stopInfinite && this.data.list.length < this.data.totalCount) {
      this.setData({
        page: this.data.page + 1
      }, () => {
        this.getList();
      })
    }
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
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})