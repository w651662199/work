// pages/user/release/release.js
var app = getApp();
Page({
  data: {
    showGoTop: true,
    page: 1,
    loading: false,
    delBtnWidth: 120,
    showLoadingFail:false,
    list:[],
    noMoreData:false,
    showGoTop: true,
    totalCount:''
  },
  onLoad: function (options) {
    this.getList();
  },
  getList(page) {
    this.setData({
      loading: false,
    });
    page = page || 1;
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/contents';
    app.request(url, "GET", {
      page: page,
      number: 20
      }, (res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          wx.stopPullDownRefresh();
          if (data.list.length > 0){
            if (data.page > 1){
              var list = this.data.list.concat(data.list);
            }else{
              var list = data.list;
            }
            if (data.list.length < 20) {
              this.setData({
                noMoreData: true
              });
            }else{
              this.setData({
                noMoreData: false
              });
            }
            console.log(list);
            this.setData({
              page: data.page,
              list: list,
              showLoadingFail: false,
              loading: true,
              totalCount: data.totalCount
            });
          }else{
            this.setData({
              loading: true
            });
          }
        }
      }, (error) => { 
        this.setData({
          showLoadingFail: true,
          loading: true,
        })
    });
  },
  toReleaseDetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/publishContent/publishContent?id=' + id + '&f=2',
    })
  },
  // 手指刚放到屏幕触发
  touchS(e){
    this.data.list.forEach((value, index) => {
      if (value.txtStyle != "") {
        value.txtStyle = "";
      }
    })
    //判断是否只有一个触摸点 
    if(e.touches.length==1){ 
      this.setData({ 
      //记录触摸起始位置的X坐标 
      startX:e.touches[0].clientX,
      startY:e.touches[0].clientY
      }); 
    };
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次 
  touchM(e){ 
    let that = this;
    if(e.touches.length==1){ //记录触摸点位置的X坐标 
      let moveX = e.touches[0].clientX; //计算手指起始点的X坐标与当前触摸点的X坐标的差值 
      let moveY = e.touches[0].clientY;
      let disX = that.data.startX - moveX; //delBtnWidth 为右侧按钮区域的宽度 
      let disY = that.data.startY - moveY;
      let delBtnWidth = that.data.delBtnWidth; 
      let txtStyle = ""; 
      if (disX > 0 && disY<20){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-"+disX+"rpx"; 
        if(disX>=delBtnWidth){ //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-"+delBtnWidth+"rpx"; 
        } 
      }
      //获取手指触摸的是哪一个item 
      let index = e.currentTarget.dataset.index;
      let list = that.data.list; //将拼接好的样式设置到当前item中 
      list[index].txtStyle = txtStyle; //更新列表的状态 
      that.setData({ 
        list: list,
      }); 
    } 
  },
  touchE(e) {
    let that = this;
    if(e.changedTouches.length == 1) { //手指移动结束后触摸点位置的X坐标 
      let endX = e.changedTouches[0].clientX; //触摸开始与结束，手指移动的距离 
      let disX = that.data.startX - endX;
      let endY = e.changedTouches[0].clientY;
      let disY = Math.abs(that.data.startY - endY);
      let delBtnWidth = that.data.delBtnWidth; //如果距离小于删除按钮的1/2，不显示删除按钮
      let txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"rpx":""; //获取手指触摸的是哪一项 
      let index = e.currentTarget.dataset.index;
      let list = that.data.list;
      if (disY < 50) {
        list[index].txtStyle = txtStyle; //更新列表的状态 
        that.setData({
          list: list,
        }); 
      }else{
        that.setData({
          list: list,
        });
      }
    } 
  },
  delete(e) {
    let id = e.currentTarget.dataset.id;
    let url = app.data.$CONFIG['middlePageUrl'] + '/api/mm/content/' + id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除后信息不可恢复，请确认是否删除。',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          app.request(url, "DELETE", {}, (res) => {
            if(res.statusCode == 200){
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none',
              });
              that.getList();
            }
          });
        }
      }
    })
  },
  goTop() {
    this.setData({
      showGoTop: true
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  _reload() {
    this.getList(this.data.pageSize);
  },
  onPullDownRefresh() {
    if (this.data.showLoadingFail) {
      wx.stopPullDownRefresh()
    } else {
      this.getList();
    }
  },
  onReachBottom: function () {
    if (this.data.list.length < this.data.totalCount){
      let page = this.data.page * 1 + 1;
      this.getList(page);
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 500) {
      this.setData({
        showGoTop: false,
      })
    } else {
      this.setData({
        showGoTop: true,
      })
    }
  }, 
  onUnload: function () {
   
  },
})