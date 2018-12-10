// pages/publish/publish.js
import config from '../../../utils/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      title: '',
      content: '',
      image: '',
      contentImages: [],
      tag: '',
      linkUrl: '',
      country: '',
      province: '',
      city: '',
      district: '',
      cityCode: '',
      adCode: '',
      street: '',
      number: '',
      poiName: '',
      aoiName: '',
      longitude: '',
      latitude: ''
    },
    tagList: [
      { text: '优惠打折促销', isActived: false, isCustom: false },
      { text: '美食特惠', isActived: false, isCustom: false },
      { text: '亲子乐园', isActived: false, isCustom: false },
      { text: '休闲娱乐', isActived: false, isCustom: false },
      { text: '交通出行', isActived: false, isCustom: false },
      { text: '住宿酒店', isActived: false, isCustom: false },
      { text: '生活服务', isActived: false, isCustom: false },
      { text: '学习培训', isActived: false, isCustom: false },
      { text: '健身运动', isActived: false, isCustom: false },
      { text: '求购招租', isActived: false, isCustom: false }
    ],
    selectTags: [],
    selectImages: [],
    uploadImgPath: [],
    isShowSetModal: false,
    isShowTagModal: false,
    maxImgSize: 5242880
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.userInfo.userId == '') { //没登录
      wx.navigateTo({
        url: '/common/login/login'
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
    let position = wx.getStorageSync('position');
    if (position) {
      this.setPosition(position);
    }
  },
  setPosition(position) {
    let location = position.location;
    let address = position.address;
    let loc = location.location.split(',');
    this.setData({
      'formData.country': address.country,
      'formData.province': address.province,
      'formData.city': address.city.length > 0 ? address.city : address.province,
      'formData.district': address.district,
      'formData.adcode': address.adcode,
      'formData.citycode': address.citycode,
      'formData.poiName': location.name,
      'formData.aoiName': location.name,
      'formData.latitude': loc[1],
      'formData.longitude': loc[0],
    });
  },
  chooseImg() {
    let that = this;
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      itemColor: '#E82C2C',
      success: function(res) {
        let selectIndex = res.tapIndex;
        let imgType = selectIndex == 0 ? 'camera' : 'album';
        that.showImgPick(imgType);
      },
    });
  },
  showImgPick(type) {
    let that = this;
    let imgCount = 9 - this.data.selectImages.length;
    wx.chooseImage({
      count: imgCount,
      sizeType: ['compressed'],
      sourceType: [type],
      success: function(res) {
        for (let imgItem of res.tempFiles) {
          if (imgItem.size > that.data.maxImgSize) {
            wx.compressImage({
              src: imgItem.path,
              quality: Math.floor(that.data.maxImgSize / imgItem.size) * 100,
              success(compress) {
                that.setData({
                  selectImages: that.data.selectImages.concat(compress.tempFilePath),
                  uploadImgPath: that.data.uploadImgPath.concat(compress.tempFilePath)
                });
              },
              fail(info) {
                console.log(info);
              }
            });
          } else {
            that.setData({
              selectImages: that.data.selectImages.concat(imgItem.path),
              uploadImgPath: that.data.uploadImgPath.concat(imgItem.path)
            });
          }
        }
      }
    });
  },
  previewImg(e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.selectImages
    });
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.i;
    this.data.selectImages.splice(index, 1);
    this.setData({
      selectImages: this.data.selectImages,
      uploadImgPath: this.data.selectImages
    });
  },
  textareaInput(e) {
    this.setData({
      'formData.content': e.detail.value
    });
  },
  textareaBlur: function(e) {
    this.setData({
      'formData.content': e.detail.value
    });
  },
  openMap: function() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] === undefined) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              that.goToMap();
            }
          });
        } else if (!res.authSetting['scope.userLocation']) {
          that.setData({
            isShowSetModal: true
          });
        } else {
          that.goToMap();
        }
      }
    });
  },
  goToMap() {
    let formData = this.data.formData;
    let url = '/pages/publish/map/map';
    if (formData.longitude != '') {
      url = url + '?loc=' + formData.longitude + ',' + formData.latitude;
    }
    wx.navigateTo({
      url: url,
    });
  },
  openSetCb(res) {
    if (res.detail.authSetting['scope.userLocation'] === true) {
      this.setData({
        isShowSetModal: false
      });
      this.goToMap();
    }
  },
  modalCancel() {
    this.setData({
      isShowSetModal: false
    });
    // this.goToMap();
  },
  selectTag(e) {
    let tagText = e.currentTarget.dataset.text;
    let i = e.currentTarget.dataset.i;
    let index = this.data.selectTags.indexOf(tagText);
    let tagArr = this.data.selectTags.splice(0);
    let tempTagList = this.data.tagList.splice(0);
    if (index == -1) {
      if (tagArr.length === 3) {
        this.showNormalToast('最多可添加三个标签');
      } else {
        tagArr.push(tagText);
        tempTagList[i].isActived = true;
      }
    } else {
      tagArr.splice(index, 1);
      tempTagList[i].isActived = false;
    }
    this.setData({
      selectTags: tagArr,
      tagList: tempTagList
    });
  },
  triggerTagModal() {
    if (!this.data.isShowTagModal && this.data.selectTags.length === 3) {
      this.showNormalToast('最多可添加三个标签');
      return;
    }
    this.setData({
      isShowTagModal: !this.data.isShowTagModal
    })
  },
  formTagSubmit(e) {
    let tagText = e.detail.value.tag;
    let regEmoji = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/igm;
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/igm;
    let flag = (regEmoji.test(tagText) || !reg.test(tagText)) && tagText.length > 0;
    let isExist = false;
    for (let tag of this.data.tagList) {
      if (tag.text === tagText) {
        isExist = true;
        break;
      }
    }
    if (flag) {
      this.showNormalToast('签暂不支持添加表情和特殊字符，请重新输入~');
    } else if (tagText.trim().length === 0) {
      this.showNormalToast('请输入标签');
    } else if (isExist) {
      this.showNormalToast('您输入的标签已存在，可直接点亮~');
    } else {
      if (this.data.selectTags.length === 3) {
        this.showNormalToast('最多可添加三个标签');
      } else {
        let tempList = this.data.tagList.splice(0);
        let tempTags = this.data.selectTags.splice(0);
        tempList.push({
          text: tagText,
          isActived: true,
          isCustom: true
        });
        tempTags.push(tagText);
        this.setData({
          tagList: tempList,
          selectTags: tempTags
        });
        this.triggerTagModal();
      }
    }
  },
  deleteTag(e) {
    let index = e.currentTarget.dataset.i;
    let t = e.currentTarget.dataset.t;
    let i = this.data.selectTags.indexOf(t);
    this.data.tagList.splice(index, 1);
    if (i > -1) {
      this.data.selectTags.splice(i, 1);
    }
    this.setData({
      tagList: this.data.tagList,
      selectTags: this.data.selectTags
    });
  },
  tagInput(e) {
    let tagText = e.detail.value;
    let regEmoji = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/igm;
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/igm;
    let flag = (regEmoji.test(tagText) || !reg.test(tagText)) && tagText.length > 0;
    if (flag) {
      this.showNormalToast('签暂不支持添加表情和特殊字符，请重新输入~');
    }
  },
  showNormalToast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
    });
  },
  uploadImages() {
    wx.showLoading({
      title: '正在发布',
    });
    let that = this;
    if (that.data.uploadImgPath.length > 0) {
      let path = that.data.uploadImgPath[0];
      let token = wx.getStorageSync('jwt');
      wx.uploadFile({
        url: app.data.$CONFIG['mdomain'] + '/api/mm/upload',
        filePath: path,
        name: 'file',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        success(res) {
          console.log(res);
          if (res.statusCode == 200) {
            let data = JSON.parse(res.data);
            that.data.uploadImgPath.splice(0, 1);
            that.setData({
              'formData.contentImages': that.data.formData.contentImages.concat([data.data.imageUrl]),
              'uploadImgPath': that.data.uploadImgPath
            });
            that.uploadImages();
          } else {
            wx.hideLoading();
            that.showNormalToast('发布失败，请稍后再试');
          }
        },
        fail(info) {
          console.log(info);
          wx.hideLoading();
          that.showNormalToast('发布失败，请稍后再试');
        }
      });
    } else {
      that.publish();
    }
  },
  submit() {
    if (app.globalData.userInfo.userId == '') { //没登录
      wx.navigateTo({
        url: '/common/login/login'
      })
    } else {
      if (this.data.formData.content == '' && this.data.selectImages.length == 0) {
        wx.showModal({
          title: '',
          content: '正文与图片至少添加其一，请检查是否填写。',
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        this.uploadImages();
      }
    }
  },
  publish() {
    let that = this;
    let url = app.data.$CONFIG['mdomain'] + '/api/mm/content';
    let postData = Object.assign({}, that.data.formData, {tag: that.data.selectTags.join(',')});
    app.request(url, 'post', postData, (res) => {
      wx.hideLoading();
      if (res.data.code == 200 && res.statusCode == 200) {
        wx.removeStorageSync('position');
        wx.reLaunch({
          url: '/pages/publish/finish/finish',
        });
      } else {
        that.showNormalToast('发布失败，请稍后再试');
      }
    }, (err) => {
      wx.hideLoading();
      that.showNormalToast('发布失败，请稍后再试');
    });
  }
})