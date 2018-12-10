import { encrypt, getKeyValue, decrypt, urlEncode } from '../../utils/util.js'
var app = getApp();
Component({
  properties: {
    query: {
      type: Object,
      value: {}
    },
    rebate: {
      type: Object,
      value: {},
      observer: 'onRebate'
    },
    item: {
      type: Object,
      value: {},
      observer: 'onItemChange'
    },
    contentId: {
      type: String,
      value: '',
      observer: 'onContentIdChange'
    }
  },
  data: {
    isShowSuvery: false,
    rebateData: {},
    itemData: {},
    queryData: {},
    isRebate: false,
    isHiddenShare: true,
    cId: '',
    userId: ''
	},
  ready() {
    let that = this;
    if (app.globalData.userInfo.userId == '') {
      if (wx.getStorageSync('jwt') !== '') {
        app.getUserInfo(wx.getStorageSync('jwt'), (res) => {
          that.setData({
            userId: res.userId,
            isRebate: that.data.rebate.rebateStatus == 1 && that.data.rebate.shareRebateBid > 0
          });
        });
      }
    } else {
      that.setData({
        userId: app.globalData.userInfo.userId,
        isRebate: that.data.rebate.rebateStatus == 1 && that.data.rebate.shareRebateBid > 0
      });
    }
  },
  methods: {
    onRebate(newVal, oldVal) {
      this.setData({
        rebateData: newVal,
        isShowSuvery: newVal.researchAppearFlg == 1,
        isRebate: newVal.rebateStatus == 1 && newVal.shareRebateBid > 0
      });
    },
    onItemChange(newVal, oldVal) {
      this.setData({
        itemData: newVal
      });
    },
    onContentIdChange(newVal, oldVal) {
      this.setData({
        cId: newVal
      });
    },
    doShare: function () {
      if (!this.data.cId) {
        app.adShareImpression(this.data.query);
        if (this.data.rebateData.rebateStatus == 1 && this.data.rebateData.shareRebateBid > 0) {  //true 有返利，false 没有返利 （有返利）
          if (app.globalData.userInfo.userId == '') { //没登录
            wx.navigateTo({
              url: '../../../common/login/login'
            })
          } else {  //登录了
            this.triggerEvent('showShareCover');
          }
        } else {
          console.log('无返利');
        }
      } else {
        app.contentShareImp({contentId: this.data.cId})
      }
    },
    toSuvery() {
      console.log(this.data.query.q);
      if (app.globalData.userInfo.userId !== '') {
        wx.navigateTo({
          url: '/pages/details/survey/survey?id=' + this.data.rebateData.questionId + '&q=' + encodeURIComponent(this.data.query.q),
        })
      } else {
        wx.navigateTo({
          url: '/common/login/login?rebateType=survey&id=' + this.data.rebateData.questionId + '&q=' + encodeURIComponent(this.data.query.q)
        })
      }
    }  
  }
})