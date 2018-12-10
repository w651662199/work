// pages/details/publishContent/publishContent.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{
      city:""
    },
    rejectReasons:'',
    showReject:true,
    showImg:false,
    imgUrl:'',
    showShare:false,
    id: '',
    showHome: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.zf=='2'){
      this.setData({
        showHome: true
      })
    }
    let id = options.id;
    //如果f接收参数为1，显示分享按钮，参数为2，则不显示
    if(options.f == '1'){
      this.setData({
        showShare:true,
        id: id,
      })
    }else{
      this.setData({
        showShare: false,
        id: id,
      })
    }
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/content?id='+id+'&requestType=2';
    app.request(url, "GET", {}, (res) => {
      if (res.data.code === 200) {
        console.log(res)
        let data = res.data.data;
        if (data.rejectReasons != ""){
          let reg = /\[/g;
          let Reg = /\]/g;
          var rejectReasons = data.rejectReasons.replace(reg,"");
          rejectReasons = rejectReasons.replace(Reg,"；");
          this.setData({
            showReject: false,
            rejectReasons: rejectReasons
          })
        }else{
          this.setData({
            showReject: true
          })
        }
        this.setData({
          content:data
        })
      }
    });
    this.impressionContent(id);
  },
  impressionContent(id) {
    let impUrl = app.data.$CONFIG['impression'] + '/mm/monitor';
    app.request(impUrl, 'GET', {
      operationType: 12,
      targetId: id,
      source: 3,
      timestamp: new Date().getTime()
    }, (res) => {
      console.log('微广告中间页打开');
    });
  },
  // 点击复制
  textPaste() {
    wx.setClipboardData({
      data: this.data.content.linkUrl,
      success: function (res) {
        // wx.hideToast();
        // wx.showToast({
        //   title: '已为你复制链接，也可在美媒榜APP看哦',
        //   icon: 'none',
        // })
      }
    })
  },
  goHome() {
    app.goHome();
  },
  previewImg(e) {
    let url = e.currentTarget.dataset.url;
    let arr = [];
    arr.push(url);
    wx.previewImage({
      current: url,
      urls: arr
    });
  },
  Tomap(){
    let url = '/pages/publish/line/line?loc=' + this.data.content.longitude + ',' + this.data.content.latitude + '&city=' + this.data.content.city;
    app.beforeJumpMap(url);
  },
  onShareAppMessage: function () {
    let data = this.data.content;
    let shareData = {
      title: data.title ? data.title : (data.content ? data.content.substr(0, 30) : '一条来自美媒榜的分享'),
      imageUrl: data.image ? data.image : '/images/share_logo.jpg',
      //zf为转发的参数,1不是转发，2是转发
      path: 'pages/details/publishContent/publishContent?id=' + this.data.id+'&f=1&zf=2',
      success: (res) => {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      }
    }
    return shareData;
  }
})