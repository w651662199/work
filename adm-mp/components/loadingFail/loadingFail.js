// components/loadingFail/loadingFail.js
Component({
  ready(){
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading();
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  methods:{
    reload: function(){
      this.triggerEvent("reload");
    }
  }
})