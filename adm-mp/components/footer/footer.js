import { encrypt, getKeyValue, subLandingUrl, decrypt, urlEncode} from '../../utils/util.js'
var app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    showPos: {
      type: String,
    },
    footerItem:{
      type: Object,
      value: ""
    },
    index: {
      type: Number,
      value: ''
    }
  },
  data:{
    system: ""
  },
  ready: function(){
    this.setData({
      system: app.data.system.toLowerCase()
    })
  },
  methods: {
    doShare: function(e) {
      let item = this.data.footerItem;
      if (item.type == 2) {
        app.contentShareImp(item);
      } else {
        app.adShareImpression(item);
      }
      if (item.sharePraiseNum && item.sharePraiseNum.rebateStatus == 1 && item.sharePraiseNum.shareRebateBid > 0) { //true 有分享返利，false 没有分享返利 （有返利）
        if (app.globalData.userInfo.userId == ''){ //没有登录
          wx.navigateTo({
            url: '../../common/login/login'
          })
        } else { //登录了
          app.getShareUrl(item, (res) => {
            let shareParam = {};
            if (res.statusCode == 200 && res.data.data.s) {
              shareParam.q = item.q;
              shareParam.s = res.data.data.s;
            }
            let itemObj = subLandingUrl(item.contentObject.landingUrl)
            this.triggerEvent('showShareCover', Object.assign({}, item, itemObj, shareParam));
          });
        }
      }
    }
  }
})