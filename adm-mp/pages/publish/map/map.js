// pages/publish/map/map.js
let amapFile = require('../../../utils/amap-wx.js');
import config from '../../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    address: {},
    posShowList: [],
    selectPos: {},
    searchPoiList: [],
    isShowSearchBox: false,
    searchAnimation: {},
    searchCursor: 0,
    aMap: {},
    mapContext: null,
    isShowCover: false
  },
  isToBottom: false,
  keywords: '',
  isFinishSearch: false,
  defaultLocation: '116.466458,39.959036',
  location: '',
  isGetLocation: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let loc = options.loc;
    this.location = options.loc;
    let myAmapFun = new amapFile.AMapWX({ key: config.mapKey });
    that.setData({
      aMap: myAmapFun
    });
    if (loc) {
      that.getLocation(loc, '/images/marker_normal.png', true);
    } else {
      that.getLocation(null, '/images/location.png', true);
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
  regionChange(e) {
    let that = this;
    let cxt = this.data.mapContext;
    if (!cxt) {
      cxt = wx.createMapContext('map', that);
      that.setData({
        mapContext: cxt
      });
    }
    if (e.type == 'end' && e.causedBy == 'drag') {
      cxt.getCenterLocation({
        success: function(res) {
          that.getLocation(res.longitude + ',' + res.latitude, '/images/marker_normal.png', true);
        },
        fail: function(info) {
          console.log(info);
        }
      })
    }
  },
  getLocation(location, iconPath, isInit) {
    let that = this;
    let params = {
      iconPath: iconPath,
      iconWidth: 29,
      iconHeight: 29,
      success: function (data) {
        let marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: iconPath,
          width: data[0].width,
          height: data[0].height
        }];
        that.setData({
          markers: marker,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          address: data[0].regeocodeData.addressComponent
        });
        if (isInit) {
          that.setData({
            posShowList: data[0].regeocodeData.pois,
            selectPos: data[0].regeocodeData.pois[0]
          });
        }
      },
      fail: function (info) {
        console.log(info);
        // wx.showModal({title:info.errMsg})
      }
    };
    if (location) {
      params.location = location;
    }
    that.data.aMap.getRegeo(params);
  },
  posItemTap(e) {
    let location = e.currentTarget.dataset.item.location;
    this.setData({
      selectPos: e.currentTarget.dataset.item
    });
    this.getLocation(location, '/images/marker_normal.png', false);
  },
  searchItemTap(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      selectPos: item,
      posShowList: []
    });
    this.getArroundPoi(item);
    this.setData({
      isShowCover: false
    });
    this.getLocation(item.location, '/images/marker_normal.png', false);
    this.animationInit('100%');
  },
  getArroundPoi(item) {
    let that = this;
    let params = {
      querykeywords: item.name,
      location: item.location,
      success: function (data) {
        if (data.poisData.length == 0) {
          wx.hideLoading();
        } else {
          that.setData({
            posShowList: data.poisData
          });
        }
      },
      fail: function (info) {
        console.log(info);
      }
    };
    that.data.aMap.getPoiAround(params);
  },
  searchBarFocus() {
    this.setData({
      isShowCover: true
    });
    this.animationInit('100rpx');
  },
  searchInput(e) {
    let cursor = e.detail.cursor;
    if (cursor == this.data.searchCursor) return;
    let keywords = e.detail.value;
    this.keywords = keywords;
    this.getSearchPoi(keywords, 1);
  },
  getSearchPoi(keywords) {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let params = {
      keywords: keywords,
      location: '',
      success: function (data) {
        if (data.tips.length == 0) {
          that.isFinishSearch = true;
          wx.hideLoading();
        } else {
          that.setData({
            searchPoiList: data.tips
          }, function() {
            wx.hideLoading();
          });
        }
      },
      fail: function (info) {
        wx.hideLoading();
      }
    };
    // that.data.aMap.getPoiAround(params);
    that.data.aMap.getInputtips(params);
  },
  animationInit(top) {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    });
    animation.top(top).step();
    this.setData({
      searchAnimation: animation.export()
    })
  },
  searchInputConfirm(e) {
    this.setData({
      isShowCover: false
    });
    this.animationInit('100%');
  },
  submit() {
    wx.setStorageSync('position', {
      location: this.data.selectPos,
      address: this.data.address
    });
    wx.navigateBack({
      delta: 1
    });
  }
})