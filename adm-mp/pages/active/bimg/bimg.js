// pages/active/bimg/bimg.js
var app = getApp();
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
  saveImg() {
    wx.showToast({
      title: '正在保存',
      icon: 'loading',
    });
    wx.downloadFile({
      url: 'https://mevent.meixincdn.com/static/img/bag/bag_save.jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '已保存至系统相册',
              icon: 'success',
            });
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
            });
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
        });
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