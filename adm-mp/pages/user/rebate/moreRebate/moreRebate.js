// pages/user/rebate/moreRebate/moreRebate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isExceed:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getList();
  },
  getList() {
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/recordV2';
    app.request(url, "GET", { page: 1, number: 20 }, (res) => {
      if (res.data.code = 200) {
        let data = res.data.data;
        if (data.list.length == 20) {
          this.setData({
            isExceed: true
          })
        }
        data.list.forEach((item) => {
          if (item.amount.indexOf(".") == -1) {
            item.amount += '.00'
          }
        })
        this.setData({
          list: data.list
        })
      }
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})