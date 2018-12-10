// pages/publish/line/line.js
let amapFile = require('../../../utils/amap-wx.js');
import config from '../../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lineMarkers: [{
      iconPath: "/images/line_start.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 24,
      height: 33
    }, {
      iconPath: "/images/line_end.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 24,
      height: 33
    }],
    city: '',
    markers: [],
    curLocation: '',
    targetLocation: '',
    targetCity: '',
    aMap: {},
    polyline: [],
    transits: [],
    points: [],
    isAuthorize: false,
    isShowActionBox: true,
    actionType: 2 // 1 walk, 2 drive, 3 bus
  },
  mapContext: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let myAmapFun = new amapFile.AMapWX({ key: config.mapKey });
    that.setData({
      aMap: myAmapFun
    });
    if (options.loc) {
      let location = options.loc;
      let loc = location.split(',');
      that.setData({
        'targetLocation': location,
        'targetCity': decodeURIComponent(options.city),
        'lineMarkers[1].longitude': loc[0],
        'lineMarkers[1].latitude': loc[1]
      });
      that.setData({
        markers: that.data.lineMarkers
      });
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation']) {
            that.setData({
              isAuthorize: true
            });
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                that.setData({
                  'curLocation': res.longitude + ',' + res.latitude,
                  'lineMarkers[0].longitude': res.longitude,
                  'lineMarkers[0].latitude': res.latitude
                });
                that.setData({
                  markers: that.data.lineMarkers
                });
                // that.getDrivingRoute();
                that.getLocation();
              }
            })
          } else {
            // that.getLocation(true);
            that.showPosition();
          }
        }
      });
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
    let that = this;
    if (!that.data.mapContext) {
      that.mapContext = wx.createMapContext('navi_map', that);
    }
  },
  getWalkingRoute() {
    let that = this;
    that.data.aMap.getWalkingRoute({
      origin: that.data.curLocation,
      destination: that.data.targetLocation,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.mapContext.includePoints({
          points: points
        });
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
      },
      fail: function (info) {
        console.log(info);
      }
    });
  },
  getTransitRoute() {
    let that = this;
    that.data.aMap.getTransitRoute({
      origin: that.data.curLocation,
      destination: that.data.targetLocation,
      city: that.data.city,
      success: function (data) {
        let points = [];
        if (data && data.transits && data.transits[0].segments) {
          let segments = data.transits[0].segments;
          for (let i = 0; i < segments.length; i++) {
            var lines = segments[i].bus.buslines;
            for (let j = 0; j < lines.length; j++) {
              let line = lines[j].polyline.split(';');
              for (var t = 0; t < line.length; t++) {
                points.push({
                  longitude: parseFloat(line[t].split(',')[0]),
                  latitude: parseFloat(line[t].split(',')[1])
                })
              }
            }
          }
        }
        that.mapContext.includePoints({
          points: points
        });
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
      },
      fail: function (info) {
        console.log(info);
      }
    })
  },
  getDrivingRoute() {
    let that = this;
    that.data.aMap.getDrivingRoute({
      origin: that.data.curLocation,
      destination: that.data.targetLocation,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.mapContext.includePoints({
          points: points
        });
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
      },
      fail: function (info) {
        console.log(info);
      }
    });
  },
  showPosition() {
    let that = this;
    let location = that.data.targetLocation.split(',');
    var marker = [{
      latitude: location[1],
      longitude: location[0],
      iconPath: "/images/marker_normal.png",
      width: 24,
      height: 24
    }]
    that.mapContext.includePoints({
      points: [{
        longitude: location[0],
        latitude: location[1]
      }]
    });
    that.setData({
      markers: marker
    });
    that.setData({
      isShowActionBox: false
    });
  },
  getLocation() {
    let that = this;
    let params = {
      iconPath: "/images/marker_normal.png",
      iconWidth: 24,
      iconHeight: 24,
      location: '',
      success: function (data) {
        let address = data[0].regeocodeData.addressComponent;
        that.setData({
          city: address.city.length > 0 ? address.city : address.province
        });
        if (that.data.city != that.data.targetCity) {
          that.showPosition();
        } else {
          that.getDrivingRoute();
        }
      },
      fail: function (info) {
        console.log(info);
        // wx.showModal({title:info.errMsg})
      }
    };
    that.data.aMap.getRegeo(params);
  },
  changeAction(e) {
    let action = +e.currentTarget.dataset.action;
    if (this.data.action != action) {
      this.setData({
        actionType: action
      });
      if (action == 1) {
        this.getWalkingRoute();
      } else if (action == 2) {
        this.getDrivingRoute();
      } else {
        this.getTransitRoute();
      }
    }
  }
})