<template>
  <div>
    <div class="account-set">
      <div class="set-option">
        <button class="btn btn-normal" @click.prevent="newPlan">新建投放计划</button>
        <button class="btn btn-normal" @click.prevent="campaignStartHandler">启用</button>
        <button class="btn btn-normal" @click.prevent="campaignPauseHandler">暂停</button>
        <button class="btn btn-normal" @click.prevent="campaignDeleteHandler">删除</button>
        <span class="set-option-hint" v-show='showOpationHint'>*请选择至少一项后，再进行操作。</span>
        <span class="set-option-hint" v-show='isActionError'>操作失败，请检查网络设置或稍后再试。</span>
      </div>
      <div class="set-fn">
        <div class="fn-plan"><span class="plan-title">计划名称：</span>
          <div class="ele-input">
            <input v-model="so.keyword" placeholder="请输入计划名称">
          </div>
        </div>
        <el-form :model="so" :rules="rules" ref="formlist">
          <div class="fn-plan">
            <el-form-item prop="startTime" style="display:inline-block;">
              <span class="plan-title">选择时间：</span>
              <el-date-picker v-model="so.startTime" type="date" :editable="false" style="width:125px;" placeholder="开始日期">
              </el-date-picker>
              <span class="plan-title plan-title-gray">-</span>
              <el-date-picker v-model="so.endTime" type="date" :editable="false" style="width:125px;" placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div class="fn-plan fn-plan-new"><span class="plan-title">状态：</span>
          <el-select v-model="so.state.value" style="width:130px;display:inline-block;" placeholder="全部">
            <el-option v-for="item in so.state.options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="fn-search" @click.prevent="search"><a href="" class="btn btn-primary">查询</a></div>
      </div>
    </div>
    <div class="amp-data">
      <div class="data-table" id="con-table-change">
        <div class="main-table-wapper">
          <table class="table main-table">
            <thead>
              <tr :class="{actived: isActived, 'list-header': true}">
              	<th class="w50"><span><em class="icon icon-select select-all" @click="checkall"></em></span></th>
                <th class="w100"><span><i class="data-id">计划ID</i></span></th>
                <th class="w140"><span>计划名称</span></th>
                <th class="w100"><span>状态</span></th>
                <th class="w220"><span>有效期</span></th>
                <th class="w140"><span>广告日预算<em class="icon icon-TableHead-help" :title="adDayBudget"></em></span></th>
                <th class="w80"><span>展现数<em class="icon icon-TableHead-help" :title="displayCount"></em></span></th>
                <th class="w80"><span>点击数<em class="icon icon-TableHead-help" :title="clickCount"></em></span></th>
                <th class="w100"><span>点击率(%)<em class="icon icon-TableHead-help" :title="clickRate"></em></span></th>
                <th class="w140"><span>广告总现金花费<em class="icon icon-TableHead-help" :title="cashCost"></em></span></th>
                <th class="w150"><span>广告总虚拟金花费<em class="icon icon-TableHead-help" :title="virtualCost"></em></span></th>
                <th class="w100"><span>平均点击单价</span></th>
                <th class="w100"><span>千次展现成本</span></th>
                <th class="w220"><span>操作</span></th>
              </tr>
            </thead>
            <tbody>
            	<tr class="body-row" v-if="list.length == 0">
								<td colspan="13" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
              <template v-for="item in list">
                <tr :class="{actived: item.isActived, 'body-row': true}">
                	<td><span><em @click="checkbox(item.campaignId)" :class="'icon icon-select select-' + item.campaignId" :data-id="item.campaignId"></em></span></td>
                  <td><span><i class="data-id">{{item.campaignId}}</i></span></td>
                  <td><span><i class="ellipsis"><router-link :to="{name: 'bidcpcUnit', params: {id: item.campaignId}}" :title="item.name">{{item.name}}</router-link></i></span></td>
                  <td><span :class="{'plan-state-other': item.state !== 2 && item.state !== 3 && item.state !== 4, 'plan-state-expire': item.state === 3, 'span-col-4': true}">
                    {{getCampaignState(item.state)}}
                    <sup v-if="isSystemPause(item.state)" :title="getSystemPauseReason(item.state)">
                      <em class="icon icon-help"></em>
                    </sup>
                  </span></td>
                  <td><span style="position:relative">
                    <i class="data-time" :class="{'time-more': item.schedule.length}" @mouseover="show(item.campaignId, $event)" @mouseout="hide(item.campaignId)">{{item.startTime}}-{{item.isUnlimited==1?'不限':item.endTime}}</i>
                    <div style="position:absolute" class="dialog dialog-white dialog-time" ref="dialog" v-show="item.timeMore">
                       <ul>
                         <li v-for="schedule in item.schedule"><a style="cursor:pointer;">{{schedule}}</a></li>
                       </ul>
                     </div>
                  </span></td>
                  <td><span>{{item.adLimited==0?"不限":item.dailyAdBudget/100}}</span></td>
                  <td><span>{{item.impression}}</span></td>
                  <td><span>{{item.click}}</span></td>
                  <td><span>{{item.ctr}}%</span></td>
                  <td><span>{{item.cashFee/100}}</span></td>
                  <td><span>{{item.virtualFee/100}}</span></td>
                  <td><span>{{item.clickUnitPrice}}</span></td>
                  <td><span>{{item.costPerMills}}</span></td>
                  <td><span>
                    <b class="operat-link">
                      <a href="" @click.prevent="item.state == 3 ? viewCampaign(item.campaignId) : modify(item.campaignId, item)">{{item.state == 3 ? '查看' : '修改'}}</a>
                      <a href="" @click.prevent="copy(item.campaignId)">复制计划</a>
                      <a href="" :class="{'action-disabled': item.state == 3}" @click.prevent="newUnit(item.campaignId, item.state)">新建投放单元</a>
                    </b>
                  </span></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      :current-page="page.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.totalCount"
      :class="{'el-pagination-reset': true}"
      >
    </el-pagination>
    <el-dialog :title="dialogData.title" v-model="dialogData.dialogVisible" size="tiny">
      <span><h3>{{dialogData.message}}</h3></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog" v-show='dialogData.showCancel'>取 消</el-button>
        <el-button type="primary" @click="dialogData.sureHandler">确 定</el-button>
      </span>
    </el-dialog>
    <transition name="fade">
      <div style="z-index:1200;" class="master" v-show="isShowViewDrawer" @click="hideViewDrawer"></div>
    </transition>
    <transition name="drawer">
      <m-view-campaign v-if="isShowViewDrawer" :viewData="viewData"></m-view-campaign>
    </transition>
  </div>
</template>
<script>

import Vue from "vue";
import actions from 'actions';
import CONST from '../../../../help/CONST.js';
import Api from "../../../../config/api.config";
import http from "../../../../utils/http";
import Event from 'event';
import {formatDate,mixin,copyObj} from 'utils/common';
import moment from 'moment';
import {tableHandler, offWindowEvent, initWindowResize} from 'utils/table';
import viewCampaignDrawer from './viewCampaignDrawer.vue';

export default {
  name: 'app-put-bidcpc-plan-list',
  data() {
    return {
      isActionError: false,
    	rules: {
        startTime: [{
          validator: (rule, value, callback) => {
            if(+this.so.endTime != 0 && +this.so.startTime > +this.so.endTime){
              callback(new Error("开始时间不得晚于结束时间"));
            }else{
              callback();
            }
          },
          trigger: "change"
        }]
      },
    	showOpationHint: false,
      so: {
        keyword: "",
        startTime: moment().startOf('day').valueOf(),
        endTime: moment().endOf('day').valueOf(),
        state: {
          options: [{
            label: "全部",
            value: "0"
          },{
            label: "暂停",
            value: "1"
          },{
            label: "系统暂停",
            value: "8"
          },{
            label: "有效",
            value: "2"
          },{
            label: "过期",
            value: "3"
          },{
            label: "未开始",
            value: "4"
          }],
          value: "0"
        }
      },
      list: [],
      noDataMessage: '无相关查询结果',
      adDayBudget:'该投放计划当前的广告日预算',
      displayCount:'该投放计划在选定时间内的展现次数',
      clickCount:'该投放计划在选定时间内的点击次数',
      clickRate:'点击率=点击数/展现数*100%',
	    cashCost:'该投放计划在选定时间内的广告总现金花费',
	    virtualCost:'该投放计划在选定时间内的广告总虚拟金花费',
      page: {
        totalCount: 0,
        currentPage: 1,
        pageSizes: [20, 30, 50],
        pageSize: 20
      },
      dialogData: {
        dialogVisible: false,
        title: '提示',
        message: '',
        sureHandler: () => {}
      },
      isShowViewDrawer: false,
      viewData: {}
    };
  },
  components: {
    'm-view-campaign': viewCampaignDrawer
  },
  computed: {
  	dailyBudget() {
  		var dailyBudgetNum = 0,list = this.list;
      for(var item of list){
        if(item.isActived){
          dailyBudgetNum += item.dailyAdBudget / 100;
        }
      }
      return dailyBudgetNum;
  	},
    campaignIds(){
      var campaignIds = [],list = this.list;
      for(var item of list){
        if(item.isActived){
          campaignIds.push(item.campaignId);
        }
      }
      return campaignIds;
    },
    startStates(){
    	var states = this.selectedPlan,num;
      if (states.length == 1) {
      	if (states[0] == 1) {
      		num = 1;//不是暂停
      	} else {
      		num = 2;
      	}
      } else {
      	for(let i = 0; i < states.length; i++) {
	      	if (states[i] == 1) {
	      		num = 3;
	      	} else {
	      		num = 4;
	      		break;
	      	}
	      }
      }
      return num;
    },
    stopStates(){
    	var states = this.selectedPlan,num;
      if (states.length == 1) {
      	if (states[0] == 2 || states[0] == 4) {
      		num = 1;
      	} else {
      		num = 2;
      	}
      } else {
      	for(var i = 0; i < states.length; i++) {
	      	if (states[i] != 2 && states[i] != 4) {
	      		num = 4;
	      		break;
	      	} else {
	      		num = 3;
	      	}
	      }
      }
      return num;
    },
    delStates(){
    	var states = this.selectedPlan,num;
      if (states.length == 1) {
      	if (states[0] == 1 || states[0] == 3 || states[0] == 4) {
      		num = 1;
      	} else {
      		num = 2;
      	}
      } else {
      	for(let i = 0; i < states.length; i++) {
	      	if (states[i] == 1 || states[i] == 3 || states[i] == 4) {
	      		num = 3;
	      	} else {
	      		num = 4;
	      		break;
	      	}
	      }
      }
      return num;
    },
    isActived(){
      var isActived = true, list = this.list;
      for(var item of list){
        if(item.isActived){
          continue;
        }
        isActived = false;
        break;
      }
      return isActived;
    },
    selectedPlan() {
    	var states = [],list = this.list;
      for(var item of list){
        if(item.isActived){
          states.push(item.state);
        }
      }
      return states;
    }
  },
  created(){
    var that = this;
    this.getList();
    Event.$off("put-save-success");
    Event.$on("put-save-success", function(){
      that.getList();
    });
  },
  mounted() {
    initWindowResize('con-table-change', true, 4);
    Event.$on('close-view-drawer', () => {
      this.hideViewDrawer();
    });
  },
  updated() {
    tableHandler('con-table-change', true, 4);
  },
  destroyed() {
    offWindowEvent('con-table-change');
    actions.controlDrawer(this.$store, {
      show: false,
      action: '',
      type: '',
      config: {}
    });
  },
  methods: {
  	isSystemPause(state) {
      return state == 5 || state == 7;
    },
    getSystemPauseReason(state) {
      if (state == 5) {
        return '预算已用完';
      }
      return '余额不足';
    },
    getCampaignState(state) {
      switch (state) {
        case 1:
          return '暂停';
        case 2:
          return '有效';
        case 3:
          return '过期';
        case 4:
          return '未开始';
        case 5:
        case 7:
          return '系统暂停';
      }
    },
  	search(){
      var that = this;
      this.$refs.formlist.validate(function(valid){
        if(!valid){
          return;
        }
        if (that.page.currentPage > 1) {
          that.page.currentPage = 1;
        } else {
          that.getList();
        }
      });
    },
    checkbox(campaignId){
      var list = this.list;
      for(var item of list){
        if(item.campaignId == campaignId){
          item.isActived = !item.isActived;
        }
      }
    },
    checkall(){
      var list = this.list, isActived = this.isActived;
      for(var item of list){
        item.isActived = !isActived;
      }
    },

    getList(){
      var so = this.so, that = this;
	    let dspCampaignIds = []; //引擎计划ids
        http.get("/api/campaigns", {
          params:{
            keyword: so.keyword,
            startTime: +so.startTime,
            endTime: +so.endTime,
            state: so.state.value,
            page: this.page.currentPage,
            number: this.page.pageSize,
            productLine: 3
          }
        }).then(function(res) {
          if(res.data.code == 200){
            that.list = res.data.data.list;
            if (that.list.length === 0) {
              that.noDataMessage = '无相关查询结果';
            } else {
              that.page.totalCount = res.data.data.totalCount;
              for(var item of that.list){
                  dspCampaignIds.push(item.dspCampaignId);
                Vue.set(item, "isActived", false);
                Vue.set(item, "timeMore", false);
                item.startTime = formatDate(item.startTime, "yyyy/MM/dd");
                item.endTime = formatDate(item.endTime, "yyyy/MM/dd");
                if(Array.isArray(item.schedule) && item.schedule.length){
                  var arr = [];
                  for(var schedule of item.schedule){
                    var temp = [];
                    for(var date of schedule){
                      temp.push(formatDate(+date, "yyyy/MM/dd"));
                    }
                    arr.push(temp.join("-"));
                  }
                  item.schedule = arr;
                }else {
                    item.schedule = [];
                }
              }
	            // 展现数、点击数、点击率、现金总花费、虚拟金总花费接口
	            http.get("/api/report/campaign/consume", {
		                params:{
			                dspCampaignIds:dspCampaignIds.join(','),
			                startTime: +so.startTime,
			                endTime: +so.endTime
		                }
	                })
	                .then((res) => {
		                if(res.data.code == 200){
			                let campaignCounts = res.data.data;
			                that.list.forEach((item) => {
				                let campaign = campaignCounts.find(campaignCount => {
					                return item.dspCampaignId == campaignCount.orderId;
				                });
				                if (campaign) {
					                Vue.set(item, "impression", campaign['impression']);
					                Vue.set(item, "click", campaign['click']);
					                Vue.set(item, "ctr", campaign['ctr']);
					                Vue.set(item, "cashFee", campaign['cashFee']);
					                Vue.set(item, "virtualFee", campaign['virtualFee']);
					                Vue.set(item, "clickUnitPrice", campaign['clickUnitPrice']);
					                Vue.set(item, "costPerMills", campaign['costPerMills']);
				                } else {
					                Vue.set(item, "impression", 0);
					                Vue.set(item, "click", 0);
					                Vue.set(item, "ctr", 0);
					                Vue.set(item, "cashFee", 0);
					                Vue.set(item, "virtualFee", 0);
					                Vue.set(item, "clickUnitPrice", 0);
					                Vue.set(item, "costPerMills", 0);
				                }
			                })
		                }
	                })
	                .catch((error) => {
		                console.log(error);
	                })
            }
          } else {
            that.list = [];
            that.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    hideDialog() {
      this.dialogData.dialogVisible = false;
    },
    campaignStartHandler() {
      let that = this;
      if (!that.campaignIds.length) {
        that.showOpationHint = true;
        return;
      }
      let campaign = that.selectedPlan.find(campaign => {
        return campaign != 1;
      });
      if (campaign) {
        that.dialogData.message = `已选择${that.campaignIds.length}个投放计划，其中仅暂停状态的计划才可以启动。请重新选择。`;
        that.dialogData.showCancel = false;
        that.dialogData.sureHandler = that.hideDialog;
        that.dialogData.dialogVisible = true;
        return;
      }
      http.get('/api/pline/account/all/info?productLine=3').then((res)=> {
        if (res.data.code === 200 && res.data.iserror === 0) {
          let adBalance = res.data.data.adBalance ? res.data.data.adBalance : 0;
          let oaBalance = res.data.data.oaBalance ? res.data.data.oaBalance : 0;
          if ((adBalance + oaBalance) <= 0) {
            that.dialogData.message = `广告账户余额不足，请您充值后，再启动计划。`;
            that.dialogData.showCancel = false;
            that.dialogData.sureHandler = that.hideDialog;
            that.dialogData.dialogVisible = true;
          } else {
            that.dialogData.message = `确定启动所选投放计划吗？`;
            that.dialogData.showCancel = true;
            that.dialogData.sureHandler = that.campaignStart;
            that.dialogData.dialogVisible = true;
          }
        } else {
          that.$message({
            message: '获取数据失败，请检查网络设置或稍后再试',
            type: 'error',
            duration: 3000
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    campaignStart() {
      let that = this;
      http.put("/api/campaigns/status", {
        campaignIds: that.campaignIds,
        status: 1
      }).then((res) => {
        if (res.data.code == 200 && !res.data.iserror) {
          that.isActionError = false;
          that.getList();
        } else {
          that.isActionError = true;
          // that.$message({
          //   message: '操作失败，请检查网络设置或稍后再试',
          //   type: 'error',
          //   duration: 3000
          // });
        }
      }).catch((error) => {
        console.log(error);
      });
      that.hideDialog();
    },
    campaignPauseHandler() {
      let that = this;
      if (!that.campaignIds.length) {
        that.showOpationHint = true;
        return;
      }
      let campaign = that.selectedPlan.find(campaign => {
        return campaign == 1 || campaign == 3;
      });
      if (campaign) {
        that.dialogData.message = `已选择${that.campaignIds.length}个投放计划，其中仅“有效”、“未开始”或“系统暂停”状态的计划才可以暂停。请重新选择。`;
        that.dialogData.showCancel = false;
        that.dialogData.dialogVisible = true;
        that.dialogData.sureHandler = that.hideDialog;
        return;
      }
      that.dialogData.message = `确定暂停所选投放计划吗？`;
      that.dialogData.showCancel = true;
      that.dialogData.sureHandler = that.campaignPause;
      that.dialogData.dialogVisible = true;
    },
    campaignPause() {
      let that = this;
      http.put("/api/campaigns/status", {
        campaignIds: that.campaignIds,
        status: 0
      }).then((res) => {
        if(res.data.code == 200 && !res.data.iserror){
          that.isActionError = false;
          that.getList();
        } else {
          that.isActionError = true;
          // that.$message({
          //   message: '操作失败，请检查网络设置或稍后再试',
          //   type: 'error',
          //   duration: 3000
          // });
        }
      }).catch((error) => {
        console.log(error);
      });
      that.hideDialog();
    },
    campaignDeleteHandler() {
      let that = this;
      if (!that.campaignIds.length) {
        that.showOpationHint = true;
        return;
      }
      let campaign = that.selectedPlan.find(campaign => {
        return campaign == 2 || campaign == 5 || campaign == 7;
      });
      if (campaign) {
        that.dialogData.message = `已选择${that.campaignIds.length}个投放计划，其中仅“未开始”、“暂停”或“过期”状态的计划才可以删除。请重新选择。`;
        that.dialogData.showCancel = false;
        that.dialogData.dialogVisible = true;
        that.dialogData.sureHandler = that.hideDialog;
        return;
      }
      that.dialogData.message = `确定删除所选投放计划吗？`;
      that.dialogData.showCancel = true;
      that.dialogData.sureHandler = that.campaignDelete;
      that.dialogData.dialogVisible = true;
    },
    campaignDelete() {
      let that = this;
      http.delete("/api/campaigns", {
        data:{
          campaignIds: that.campaignIds
        }
      }).then((res) => {
        if(res.data.code == 200 && !res.data.iserror){
          that.isActionError = false;
          that.getList();
        } else {
          that.isActionError = true;
          // that.$message({
          //   message: '操作失败，请检查网络设置或稍后再试',
          //   type: 'error',
          //   duration: 3000
          // });
        }
      }).catch((error) => {
        console.log(error);
      });
      that.hideDialog();
    },
    modify(id, item){
      this.getData(id, (data) => {
        let campaignData = {
          tempDailyAdBudget: item.dailyAdBudget,
          tempAdLimited: item.adLimited
        };
      	actions.controlDrawer(this.$store, {
      		show: true,
      		action: 'modify',
      		type: 'plan',
      		config: Object.assign({}, data, campaignData)
      	});
      });
    },
    viewCampaign(id) {
      this.getData(id, (data) => {
        this.viewData = copyObj(data);
        this.isShowViewDrawer = true;
        document.body.style.overflow = 'hidden';
      });
    },
    hideViewDrawer() {
      this.isShowViewDrawer = false;
      this.viewData = {};
      document.body.style.overflow = 'auto';
    },
    copy(id){
      this.getData(id, (data) => {
      	actions.controlDrawer(this.$store, {
      		show: true,
      		action: 'copy',
      		type: 'plan',
      		config: data
      	});
      });
    },
    newUnit(id) {
    	http.get('/api/flights', {
    		params: {
    			campaignId: id,
    			productLine: 3
    		}
    	})
    	.then((res) => {
    		if (res.data.code == 200) {
    			if (res.data.data.totalCount == 20) {
    				this.showCancel = false;
		    		this.dialogVisible = true;
		      	this.body_html = '<h3>一个投放计划下最多可创建20个投放单元</h3>';
		      	this.btn_state = 'cancel';
    			} else {
    				this.getData(id, (data) => {
			    		actions.controlDrawer(this.$store, {
				    		show: true,
				    		action: 'new',
				    		type: 'unit',
				    		config: mixin(CONST.DRAWERUNIT, {
                  campaignId: id
                }),
				    		isRebate: data.isRebate
				    	});
			    	});
    			}
    		} else {
          this.$message({
            message: '获取数据失败，请检查网络设置或稍后再试',
            type: 'error',
            duration: 3000
          });
        }
    	})
    	.catch((error) => {
    		console.log(error);
    	})
    },
    getData(id, cb){
      var that = this;
      http.get("/api/campaign",{
        params:{campaignId: id}
      })
      .then(function(res){
        if(res.data.code === 200){
        	cb(res.data.data);
        } else {
          that.$message({
            message: '获取数据失败，请检查网络设置或稍后再试',
            type: 'error',
            duration: 3000
          });
        }
      })
      .catch(function(error){
      	console.log(error);
      });
    },
    pageSizeChange(size){
      this.page.pageSize = size;
      this.getList();
    },
    currentPageChange(page){
      this.page.currentPage = page;
      this.getList();
    },
    show(campaignId, event){
    let eventTarget = event.srcElement ? event.srcElement : event.target;
		var list = this.list;
		var tabList = this.$refs.dialog;
		var changeDom = document.getElementById('con-table-change');
		var rage = this.getTop(changeDom) + changeDom.offsetHeight - this.getTop(eventTarget);
		var target = this.getMask(eventTarget);
		for(var item of list){
			if(item.campaignId == campaignId && item.schedule.length){
				item.timeMore = true;
			}
		}

		if(parseInt(rage) <= 180){
			target.className = 'dialog dialog-white dialog-time arrow-b-r';
			target.style.top = -(150) + 'px';
		} else {
			target.className = 'dialog dialog-white dialog-time arrow';
			target.style.top = 50 + 'px';
		}
    },
    hide(campaignId){
      var list = this.list;
      for(var item of list){
        if(item.campaignId == campaignId){
          item.timeMore = false;
        }
      }
    },
    newPlan() {
    	actions.controlDrawer(this.$store, {
    		show: true,
    		action: 'new',
    		type: 'plan',
    		config: CONST.DRAWERPLAN
    	});
    },
	getTop(ele) {
		var T = ele.offsetTop;
		while(ele = ele.offsetParent)
		{
			T += ele.offsetTop;
		}
		return T;
	},
	getMask(ele) {
		for(var item of ele.parentNode.childNodes) {
			for(var goal of this.$refs.dialog)
			if(item == goal){
				return item;
			}
		}
	}
  },
  watch: {
  	'campaignIds' : function() {
			if (this.campaignIds.length) {
				this.showOpationHint = false;
			}
		},
    'dialogData.dialogVisible': function(val, oldVal) {
      if (!val) {
        this.dialogData.sureHandler = () => {};
      }
    }
  }
};
</script>
<style lang="less" scoped>
.plan-state-other{
  color: #d30312;
}
.plan-state-expire{color: #999999;}
.icon-help {
  font-size: 8px;
  &:before {
    color: #d30312;
  }
}
</style>