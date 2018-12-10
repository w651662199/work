// pages/publish/finish/finish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPublish() {
    wx.switchTab({
      url: '/pages/publish/publish/publish',
    });
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})