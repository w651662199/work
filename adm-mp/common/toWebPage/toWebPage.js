  // common/toWebPage/toWebPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    timer: ''
  },
  toWebPage: function(){
    wx.redirectTo({
      url: '../webPage/webPage?url=' + this.data.url
    })
    clearInterval(this.data.timer)
  },
  back: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    clearInterval(this.data.timer);
    this.setData({
      url: options.url
    });
    let t = 0;
    this.data.timer = setInterval(() => {
      t ++;
      if(t == 3){
        this.toWebPage();
        clearInterval(this.data.timer)
      }
    },1000)
  },
  onUnload: function(){
    clearInterval(this.data.timer);
  }
})