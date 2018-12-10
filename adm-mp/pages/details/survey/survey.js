import { subLandingUrl, getKeyValue, encrypt, decrypt, urlEncode, isEmptyObj } from '../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyData: {},
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.q = decodeURIComponent(options.q);
    this.setData({
      options: options
    }, () => {
      this.questionView();
    })
    this.getSurvey(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  questionView() {
    let url = app.data.$CONFIG['mdomain'] + '	/api/mm/sv';
    app.request(url, "GET", { q: this.data.options.q}, (res) => {
      console.log("questionRebate");
    });
  },
  getSurvey(surveyId) {
    let url = app.data.$CONFIG.middlePageUrl + '/api/mm/survey';
    app.request(url, 'GET', { id: surveyId }, (res) => {
      if (res.data.code == 200) {
        let data = res.data.data;
        data.questions.forEach((item) => {
          if (item.type == 3) {
            item['gradeIndex'] = -1;
          }
        });
        this.setData({
          surveyData: data
        })
      }
    });
  },
  gradeClick(e) {
    let index = e.currentTarget.dataset.index;
    let itemIndex = e.currentTarget.dataset.itemindex;
    this.setData({
      ['surveyData.questions[' + itemIndex +'].gradeIndex']: index
    })
  },
  formSubmit(e) {
    let answers = [];
    let form = e.detail.value;
    let flag = false;
    for (let i in form) {
      let content = '';
      if (typeof form[i] != 'string') {
        content = form[i].join();
      } else {
        content = form[i];
      }
      let obj = {'surveyQuestionId': i, 'content': content};
      answers.push(obj);
    }
    for (let j = 0; j < answers.length; j++) {
      if (answers[j].content == '' || answers[j].content == '0') {
        let isAnswerRequiredObj = this.data.surveyData.questions.find((n) => { return answers[j].surveyQuestionId == n.surveyQuestionId });
        if (isAnswerRequiredObj.isAnswerRequired == 1) {
          flag = true;
          break;
        }
      }
    }
    if (flag) {
        wx.showToast({
        title: '请填写全部必答问题',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.postAnswer(answers);
    }
  },
  postAnswer(answers) {
    let url = app.data.$CONFIG['mdomain'] + '/api/mm/surveyCommitV2';
    app.request(url, 'POST',{ surveyId: this.data.surveyData.surveyId, q: this.data.options.q, answers: answers }, (res) => {
      if (res.data.code == 200) {
        wx.showModal({
          title: '答题完成',
          content: '感谢您的参与',
          success: (res) => {
            wx.navigateBack({
              delta: 1
            })
          },
          showCancel: false,
          confirmText: '完成'
        });
      } else {
        wx.showModal({
          content: '问卷提交失败，请稍后再试',
          showCancel: false,
          confirmText: '知道了'
        });
      }
    });
  }
})