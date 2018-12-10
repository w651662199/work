<template>
	<div>
		<div class="amp-form amp-form02">
			<div class="form-column">
				<el-form :model="formData" :rules="rules" ref="formData" label-width="140px">
					<div>
						<p class="unitTitle">基本信息</p>
						<el-form-item label="投放单元名称：" prop="name">
							<el-input v-model="formData.name" :disabled="actionType == 'modify'" style="width:420px"></el-input>
						</el-form-item>
						<el-form-item label="设备类型：">
							<el-radio-group v-model="formData.platform" :disabled="actionType == 'modify'">
								<el-radio :label="1">无线</el-radio>
								<el-radio :label="3">PC</el-radio>
							</el-radio-group>
						</el-form-item><!--
						<el-form-item label="投放类型：">
							<el-radio-group v-model="formData.type">
								<el-radio :label="1" :disabled="actionType === 'modify'">商品推广</el-radio>
								<el-radio :label="2" :disabled="actionType === 'modify'">活动推广</el-radio>
								<el-radio :label="3" :disabled="actionType === 'modify'">视频</el-radio>
							</el-radio-group>
						</el-form-item>-->
						<el-form-item label="投放广告位：">
							<span class="form-text">已选择<i class="group-tip">{{formData.advertisements.length}}</i>个广告位</span>
							<el-button @click="showAddAd = true" :disabled="actionType == 'modify'">添加广告位</el-button>
							<div class="detail-row detail-row03" v-show="formData.advertisements.length">
								<table class="table">
									<tbody>
										<tr>
											<th><span>媒体名称</span></th>
											<th><span>广告位名称</span></th>
											<th width="90"><span>刊例价</span></th>
											<th v-show="actionType != 'modify'" width="58"><span>操作</span></th>
										</tr>
										<tr v-for="(item, index) in formData.advertisements">
											<td><span>{{item.publisherName}}</span></td>
											<td><span>{{item.advertisementName}}</span></td>
											<td><span>{{item.adFloorBid/100}}</span></td>
											<td v-show="actionType != 'modify'"><span><em class="icon icon-delete" @click="delAd(index)"></em></span></td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="SKUerror" v-show="validateMsg.advert.isError && formData.advertisements.length == 0">{{validateMsg.advert.errorMsg}}</div>
						</el-form-item>
						<!--
						<el-form-item label="返利金额：" v-show="isRebate" prop="rebateBid">
							<el-row>
								<el-col :span="8">
									<el-input placeholder="请输入返利金额" v-model.number="formData.rebateBid"></el-input>
								</el-col>
								<el-col :span="4">
									<span style="margin-left: 10px">元/次分享</span>
									<!-- <el-tooltip effect="light" placement="top-end">
										<div slot="content">
											<div class="dialog-white dialog-tip" style="font-size: 14px;">
												<p class="dialog-text"></p>
											</div>
										</div>
										<em class="icon icon-help"></em>
									</el-tooltip> --><!--
								</el-col>
							</el-row>
						</el-form-item>-->
					</div>
					<div>
						<p class="unitTitle" v-show="shareType || videoType || researchype">返利模式</p>
						<el-form-item v-show="shareType" class="Unitrebate"  prop="rebateBid">
							<el-row>
								<el-col :span="1">
									<el-checkbox v-model="rebateBid"></el-checkbox>
								</el-col>
								<div class="rebateDiv">
									<span>分享返利</span>
									<el-tooltip placement="right" effect="light">
										<div slot="content">以CPA形式计费。广告主设置每次分享成功可获得返利金额，<br>登陆用户在列表页或中间页点击分享分享到站内或站外，<br>当分享被成功打开，执行CPA扣费。</div>
										<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
									</el-tooltip>
								</div>
								<div :class="{rebateDivContent:true,rebateDisabled:!rebateBid}" :rules="rules.rebateBid">
									<el-col :span="6">返利金额：</el-col>
									<el-col :span="10">
										<el-input placeholder="请输入返利金额" v-model="formData.rebateBid" :disabled="!rebateBid"></el-input style="">
									</el-col>
									<el-col :span="6">元/次分享</el-col>
								</div>
							</el-row>
						</el-form-item>
						<el-form-item v-show="videoType" prop="videoRebate" class="Unitrebate">
							<el-row>
								<el-col :span="1">
									<el-checkbox v-model="videoRebate"></el-checkbox>
								</el-col>
								<div class="rebateDiv">
									<span>视频浏览返利</span>
									<el-tooltip placement="right" effect="light">
										<div slot="content">以CPA形式计费。广告主设置视频广告每次观看完可获得返利金额，<br>登陆用户在中间页观看完成执行CPA扣费。</div>
										<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
									</el-tooltip>
								</div>
								<div :class="{rebateDivContent:true,rebateDisabled:!videoRebate}">
									<el-col :span="6">返利金额：</el-col>
									<el-col :span="10">
										<el-input placeholder="请输入返利金额" v-model="formData.videoRebate" :disabled="!videoRebate"></el-input style="">
									</el-col>
									<el-col :span="6">元/次浏览</el-col>
								</div>
							</el-row>
						</el-form-item>
						<el-form-item v-show="researchype" prop="researchRebate" class="Unitrebate">
							<el-row>
								<el-col :span="1">
									<el-checkbox v-model="researchRebate"></el-checkbox>
								</el-col>
								<div class="rebateDiv">
									<span>调研返利</span>
									<el-tooltip placement="right" effect="light">
										<div slot="content">以CPA形式计费。广告主设置每次调研成功可获得返利金额，<br>登陆用户在中间页点完成调研问卷，<br>执行CPA扣费。</div>
										<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
									</el-tooltip>
								</div>
								<div  :class="{rebateDivContent:true,rebateDisabled:!researchRebate}">
									<el-col :span="6">返利金额：</el-col>
									<el-col :span="10">
										<el-input placeholder="请输入返利金额" v-model="formData.researchRebate" :disabled="!researchRebate"></el-input style="">
									</el-col>
									<el-col :span="6">元/份</el-col>
								</div>
							</el-row>
							<div style="margin-left: 208px;width:614px" :class="{rebateContent:true,rebateDisabled:!researchRebate}">
								<el-row>
									<el-col :span="3">调研问卷：</el-col>
									<el-col :span="4">
										<el-button @click="showAddSurvey = true" :disabled="!researchRebate" >选择问卷</el-button>
									</el-col>
									<el-col :span="15" v-if="survey.length > 0">
										<span>{{survey[0].name}}<em class="icon icon-delete" @click="delSurvey"></em></span>
									</el-col>
									<div class="SKUerror" v-if="validateMsg.survey.isError && survey.length == 0">{{validateMsg.survey.errorMsg}}</div>
								</el-row>
							</div>
						</el-form-item>
						<el-form-item v-show="researchype" prop="validQuestionnaireNum" :class="{rebateContent:true,questionRebate:true,rebateDisabled:!researchRebate}">
							<el-col :span="7" class="validQuestions">有效问卷收集总数</el-col>
							<el-col :span="4">
								<el-radio-group style="vertical-align: middle;" :disabled="!researchRebate" v-model="formData.questionnaireTotalLimited">
									<el-radio :label="0">不限</el-radio>
									<el-radio :label="1">自定义</el-radio>
								</el-radio-group>
							</el-col>
							<el-col :span="3" prop="validQuestionnaireNum" style="position: relative;">
								<el-input  v-model.number="formData.validQuestionnaireNum" style="widht: 100%" :disabled="formData.questionnaireTotalLimited == 0" @blur="checkSurvey"></el-input>
								<span class="error-message" v-show="isSurverError">请输入大于当前已回收问卷的份数（已回收{{surveyCount}}份）</span>
							</el-col>
							<el-col :span="2">
								<span style="margin-left: 6px;">份</span>
							</el-col>
						</el-form-item>
						<div class="SKUerror" v-show="validateMsg.rebate.isError && !(rebateBid || videoRebate || researchRebate)">{{validateMsg.rebate.errorMsg}}</div>
					</div>
					<div>
						<p class="unitTitle">定向</p>
						<el-form-item label="地域定向：">
							<el-radio-group v-model="formData.regionType">
								<el-radio :label="0">不限</el-radio>
								<el-radio :label="1">自定义</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="" style="margin-top: -20px;" prop="region" v-show="formData.regionType" label-width="142px">
							<el-checkbox v-model="regionCheck" @change="selectAllRegion">全选</el-checkbox>
							<div class="address-list">
								<div class="list-province">
									<ul>
										<li v-for="(item, index) in regionData" @click="applyInnerCity(index)">
											<el-checkbox v-model="item.checked" :indeterminate="item.city.filter((each) => {return each.checked}).length > 0 && item.city.filter((each) => {return each.checked}).length < item.city.length" @change="selectProvince(item, index)"></el-checkbox>
											<span>{{item.name}}</span>
											<!--<span class="tips-span">{{item.city.filter((each) => {return each.checked}).length}}/{{item.city.length}}</span>-->
										</li>
									</ul>
								</div>
								<div class="list-city">
									<ul>
										<li v-for="(item, index) in regionChildrenData">
											<el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
										</li>
									</ul>
								</div>
							</div>
							<div v-if="formData.region.length > 0" class="regionContent">
								<span class="selectSpan">已选：</span>
								<div>
									<el-tag
										:key="tag.zip"
										v-for="(tag,index) in regionData.filter((item) => {return item.checked || item.city.filter((each) => {return each.checked}).length > 0 && item.city.filter((each) => {return each.checked}).length < item.city.length})"
										:closable="true"
										:close-transition="false"
										@close="handleClose(tag,index)"
									>
										{{tag.name}}
									</el-tag>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="时间段定向：">
							<el-radio-group v-model="formData.timeType">
								<el-radio :label="0">全时间段</el-radio>
								<el-radio :label="1">自定义时间段</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="" v-show="formData.timeType === 1" prop="time" label-width="32px">
							<el-row class="time-space">
								<div class="space-cont">
									<div class="cont-tip">
										<span style="float: left;color:#a5a6a7; margin-left: 10px;">点击或拖拽可选择时间段</span>
										<i class="time-pointer green-module"></i><span class="time-tip-text">已选择</span>
										<i class="time-pointer"></i><span class="time-tip-text">未选择</span>
									</div>
								</div>
							</el-row>
							<table class="time-table" ondragstart="return false">
								<thead>
								<tr>
									<th>小时</th>
									<th :colspan="6">00:00-06:00</th>
									<th :colspan="6">06:00-12:00</th>
									<th :colspan="6">12:00-18:00</th>
									<th :colspan="6">18:00-24:00</th>
								</tr>
								<tr>
									<th>天</th>
									<th v-for="i in 24">{{i}}</th>
								</tr>
								</thead>
								<tbody @mouseleave="timeTip.isShowTip = false">
								<tr v-for="(whichweek,week) in formData.time">
									<td class="timeCheck" @mouseenter="timeTip.isShowTip = false">
										<el-checkbox v-model="timeAllDayCheck[week]"
													 @change="selectAllDay(week)">星期{{numToCh(week)}}
										</el-checkbox>
									</td>
									<td v-for="(whichtime,t) in whichweek.time"
										@mousedown="timeSelStart(whichtime,t,week)"
										@mouseenter="timeSelMove(t,week)"
										@mouseup="timeSelEnd"
									    :class="{'select-module': whichtime.sel,'move-module':whichtime.mov}">
									</td>
								</tr>
								<div class="timeTableTip" :style='{"top":timeTip.top,"left":timeTip.left}' v-show="timeTip.isShowTip" v-html="timeTip.tipMsg"></div>
								</tbody>
							</table>
							<el-row style="margin-top: 20px;">
								<el-col :span="2" style="line-height: 49px;">
									<span>快速选择:</span>
								</el-col>
								<el-col :span="22" class="timeselBtnGroup">
									<el-radio-group v-model="showTimeSlot">
										<el-button class="btn"  @click="selectMultiDay(['0','1', '2', '3', '4', '5', '6'])">整周投放</el-button>
										<el-button class="btn"  @click="selectMultiDay(['0','1', '2', '3', '4'])">工作日投放</el-button>
										<el-button class="btn"  @click="selectMultiDay(['5', '6'])">周末投放</el-button>
									</el-radio-group>
								</el-col>
							</el-row>
							<el-row v-if="times.filter((item) => {return item.length>0}).length > 0">
								<el-col :span="2">
									<span>已选时间段:</span>
								</el-col>
								<el-col :span="22">
									<div  class="selectTime">
										<el-button @click="clearSelect">清空选择</el-button>
										<div v-for="(items,index) in times" v-if="items.length > 0">
											<span class="selectTimeTitle">星期{{numToCh(index-1)}}</span>
											<div class="selectTimeCont">
												<span v-for="(item , i) in items">
												   {{getTimeZone(item)}}
											    </span>
											</div>
										</div>
									</div>
								</el-col>
							</el-row>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</div>
		<transition name="drawer">
			<m-add-ad v-if="showAddAd" :form-data="formData"></m-add-ad>
		</transition>
		<transition name="drawer">
			<m-add-survey v-if="showAddSurvey" :form-data="formData"></m-add-survey>
		</transition>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import {
	copyObj,
	objType,
	formatDate,
	mixin,
	limitLen
} from 'utils/common';
import AREA_DATA from '../../../../help/CITY.js';
import Event from 'event';
import Http from 'http';
import addAd from './drawer-add-ad.vue';
import addSurvey from './drawer-add-survey.vue';
import moment from 'moment';

export default {
	name: 'app-put-new-unit',
	data() {
		let vm = this;
		return {
		    timeTip:{
		        tipMsg:'',
				isShowTip:false,
				top:0,
				left:0
			},
		    times:[],
			time:{
				'0': [],
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
			},
			advertisements: {
				pc: [],
				wap: []
			},
			flag:false,
			pointer:{
			    startX:0,
				startY:0
			},
			formData: {},
			isShow: true,
			rules: {
				'name':[{validator: (rule, value, callback) => {
					if (value.trim() == '') {
						callback(new Error('请输入投放单元名称'));
					}else if (!limitLen(value, 60)) {
						callback(new Error('字数不超过30个汉字'));
					} else {
						let param =  {
							name: value,
							campaignId: this.formData.campaignId
						};
						if (this.drawerCtrlAction === 'modify') {
							param.flightId = this.formData.flightId;
						}
						Http.get('/api/flight/exist', {
							hideLoading: true,
							params: param
						})
						.then((res) => {
							if (res.data.code == 200) {
								if (res.data.data.exist == 1) {
									callback(new Error('投放单元名称已存在'));
								} else {
									callback();
								}
							}
						})
						.catch((error) => {
							console.log(error);
						})
					}
				}, trigger: 'blur' }],
				rebateBid: [{
					validator: (rule, value, callback) => {
						if(this.isRebate ==1 && this.rebateBid == true){
							var reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value === '') {
								callback(new Error('请输入返利出价'));
							} else if (!reg.test(value)) {
								callback(new Error('只能为数字'));
							} else if (this.isRebate === 1 && value < 0.1) {
								callback(new Error('返利出价最低为0.1元/次'));
							} else if (this.isRebate === 1 && value > 100) {
								callback(new Error('返利出价最高不超过100元/次'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length >1 : 0) {
								callback(new Error('只能一位小数'));
							}
						}
						callback();
					},
					trigger: 'change'
				}],
				videoRebate: [{
					validator: (rule, value, callback) => {
						if(this.isRebate ==1 && this.videoRebate == true ){
							var reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value === '') {
								callback(new Error('请输入返利出价'));
							} else if (!reg.test(value)) {
								callback(new Error('只能为数字'));
							} else if (this.isRebate === 1 && value < 0.1) {
								callback(new Error('返利出价最低为0.1元/次'));
							} else if (this.isRebate === 1 && value > 100) {
								callback(new Error('返利出价最高不超过100元/次'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length >1 : 0) {
								callback(new Error('只能一位小数'));
							}
						}
						callback();
					},
					trigger: 'change'
				}],
				researchRebate: [{
					validator: (rule, value, callback) => {
						if(this.isRebate== 1 && this.researchRebate == true){
							var reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value === '') {
								callback(new Error('请输入返利出价'));
							} else if (!reg.test(value)) {
								callback(new Error('只能为数字'));
							} else if (this.isRebate === 1 && value < 3) {
								callback(new Error('返利出价最低为3.0元/次'));
							} else if (this.isRebate === 1 && value > 100) {
								callback(new Error('返利出价最高不超过100元/次'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length >1 : 0) {
								callback(new Error('只能一位小数'));
							}
						}
						callback();
					},
					trigger: 'change'
				}],
				validQuestionnaireNum: [{
					validator: (rule, value, callback) => {
						if (this.isRebate == 1 && this.researchRebate == true && this.formData.questionnaireTotalLimited == 1) {
							var reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (!reg.test(value)) {
								callback(new Error('只能为数字'));
							}else if(value <=0) {
								callback(new Error('请输入大于0的数'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					}
				}],
				surveryList: [{
					validator: (rule, value, callback) => {
						if (this.isRebate == 1 && this.researchRebate) {
							if (value.list.length === 0) {
								callback(new Error('请选择问卷'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					}
				}],
				region: [{
					validator: (rule, value, callback) => {
						if (this.formData.region.length === 0 && this.formData.regionType) {
							callback(new Error('请选择投放地域'));
						} else {
							callback();
						}
					}
				}],
				time: [{
					validator: (rule, value, callback) => {
						let len = 0;
						this.times.forEach((item) => {
							len += item.length;
						});
						console.log(len);
						if (len === 0 && this.formData.timeType === 1) {
							callback(new Error('请选择投放时间段'));
						} else {
							callback();
						}
					}
				}]
			},
			rebateBid: false,
			videoRebate: false,
			researchRebate: false,
			regionCheck: false,
			regionData: AREA_DATA,
			regionChildrenData: [],
			showTimeSlot: 0,
			timeAllDayCheck: {
				'1': false,
				'2': false,
				'3': false,
				'4': false,
				'5': false,
				'6': false,
				'7': false
			},
			survey: [],
			showAddAd: false,
			showAddSurvey: false,
			httpMethodMap: {
				new: 'post',
				copy: 'post',
				modify: 'put'
			},
			validateMsg:{
			    rebate:{
			        isError:false,
					errorMsg:''
				},
				advert:{
			        isError:false,
					errorMsg:''
				},
				survey:{
			        isError:false,
					errorMsg:''
				}
			},
			isSurverError: false,
			surveyCount: 0
		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action,
		isRebate: () => store.state.drawerCtrl.isRebate, // 是否返利，从 state 中来 如果被复写掉了为 false 达到知晓上一级是否返利的目的
		actionType: () => store.state.drawerCtrl.action,
		shareType() {
			if(this.isRebate == 0 || this.isRebate == undefined){
				return false;
			}else{
				if(this.formData.advertisements.length !=0){
					return true;
				}
			}
		},
		researchype() {
			if(this.isRebate == 0 || this.isRebate == undefined){
				return false;
			}else{
				if(this.formData.advertisements.length !=0){
					if(this.formData.advertisements[0].productType == 3){
					    return false;
					}else if(this.formData.advertisements[0].productType == 4){
					    return true;
					}
				}
			}
		},
		videoType() {
			if(this.isRebate == 0 || this.isRebate == undefined){
				return false;
			}else{
				if(this.formData.advertisements.length != 0){
					if(this.formData.advertisements[0].generalizeType == 9){ //视频
						return true;
					}else{
						return false;
					}
				}
			}
		},
	},
	components: {
		'm-add-ad': addAd,
		'm-add-survey': addSurvey
	},
	created() {
		this.formData = copyObj(this.drawerData);
		if(this.actionType=='modify' || this.actionType=='copy'){
			this.getMaterialCount();
			this.rebateBid = this.formData.rebateBid != 0;
			this.videoRebate = this.formData.videoRebate != 0;
			this.researchRebate = this.formData.researchRebate != 0;
			if (this.researchRebate) {
				this.getSurveyWithId();
				this.formData.validQuestionnaireNum = this.formData.validQuestionnaireNum == 0 ? '' : this.formData.validQuestionnaireNum;
			}
			if (this.formData.platform === 1) {
				this.advertisements.wap = this.formData.advertisements;
			} else {
				this.advertisements.pc = this.formData.advertisements;
			}
		}
		this.formData.time = this.actionType=='modify' || this.actionType=='copy' ? this.formData.time : this.initTimes();

		// 分转元
		this.formData.rebateBid = this.formData.rebateBid / 100;
		this.formData.videoRebate = this.formData.videoRebate / 100;
		this.formData.researchRebate = this.formData.researchRebate / 100;
	},
	mounted() {
		this.regionData.forEach((item) => {
			Vue.set(item, 'checked', false);
			item.city.forEach((each) => {
				if (this.formData.region.indexOf(each.zip) !== -1) {
					Vue.set(each, 'checked', true);
				} else {
					Vue.set(each, 'checked', false);
				}
			});
		});
		// 隐藏添加广告位
		Event.$off('drawer-hide-add-ad');
		Event.$on('drawer-hide-add-ad', () => {
			this.showAddAd = false;
		});
		// 保存广告位
		Event.$off('drawer-save-add-ad');
		Event.$on('drawer-save-add-ad', (result) => {
			this.formData.advertisements = result;
			if (this.formData.platform === 1) {
					this.advertisements.wap = result;
				} else {
					this.advertisements.pc = result;
				}
			this.showAddAd = false;
		});
		// 隐藏添加问卷
		Event.$off('drawer-hide-add-survey');
		Event.$on('drawer-hide-add-survey', (result) => {
			if (result) {
				this.survey = result;
				this.formData.surveyId = result[0].surveyId;
			}
			this.showAddSurvey = false;
		});
		// 保存
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.$refs.formData.validate((result) => {
				if(this.formData.advertisements.length == 0){
					this.validateMsg.advert.isError = true;
					this.validateMsg.advert.errorMsg = '请添加广告位';
					return false;
				}else if(this.isRebate == 1){
					if (this.rebateBid == false && this.videoRebate == false && this.researchRebate == false) {
						this.validateMsg.rebate.isError = true;
						this.validateMsg.rebate.errorMsg = '请至少勾选一种返利';
						return false;
					} else if (this.researchRebate && this.survey.length === 0) {
						this.validateMsg.survey.isError = true;
						this.validateMsg.survey.errorMsg = '请选择问卷';
						return false;
					}
				}
				if (this.isSurverError) {
					return false;
				}
				let params = {
					name: this.formData.name,
					platform: this.formData.platform,
					type: this.formData.type,
					timeType: this.formData.timeType,
					time: this.formData.timeType === 0 ? this.getAllTime() : this.time,
					regionType: this.formData.regionType,
					region: this.formData.regionType ? this.formData.region : [],
					rebateBid: this.isRebate && this.rebateBid ? this.formData.rebateBid * 100: 0,
					videoRebate: this.isRebate && this.videoRebate ? this.formData.videoRebate * 100: 0,
					researchRebate: this.isRebate && this.researchRebate ? this.formData.researchRebate * 100: 0,
					advertisements: this.formData.advertisements,
					productLine: 2,
					surveyId: this.formData.surveyId,
					validQuestionnaireNum: this.formData.validQuestionnaireNum == '' ? 0 : this.formData.validQuestionnaireNum,
					questionnaireTotalLimited:this.formData.questionnaireTotalLimited
				};
				if (result) {
					Http({
						url: 'api/flight',
						method: this.httpMethodMap[this.drawerCtrlAction],
						data: this.drawerCtrlAction === 'modify' ? mixin({
							flightId: this.formData.flightId
						}, params) : mixin({
							campaignId: this.formData.campaignId
						}, params)
					})
					.then((res) => {
						if (!res.data.iserror) {
							Event.$emit('put-save-result', {
								error: 0,
								res: res.data,
								isRebate: this.isRebate,
								type: this.formData.type
							});
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
								duration: 3000
							});
							Event.$emit('put-save-result', {
								error: 1,
								res: null
							});
						}
					})
					.catch((e) => {
						Event.$emit('put-save-result', {
							error: 1,
							res: null
						});
					});
				} else {
					Event.$emit('put-save-result', {
						error: 1,
						res: null
					});
				};
			});
		});
	},
	methods: {
		checkSurvey() {
			let that = this;
			if(that.actionType == 'modify') {
				if (that.survey.length > 0) {
					Http.get('/api/flight/survey', {params: {flightId: that.formData.flightId, surveyId: that.survey[0].surveyId}}).then((res) => {
						if (res.status === 200 && res.data.code === 200 && res.data.iserror == 0) {
							if (res.data.data.count > that.formData.validQuestionnaireNum) {
								that.isSurverError = true;
								that.surveyCount = res.data.data.count;
							} else {
								that.isSurverError = false;
								that.surveyCount = 0;
							}
						}
					})
				}
			}
		},
	    //滑动结束
		timeSelEnd() {
			this.flag = false;
			this.timeTip.isShowTip = false;
			this.formData.time.forEach((week) => {
				week.time.forEach((t) => {
					if (t.mov && t.sel) {
						t.sel = false;
						t.mov = false;
					} else if (t.mov && !t.sel) {
						t.sel = true;
						t.mov = false;
					}
				})
			})
		},
	    //初始化时间表
		initTimes() {
			let times = [];
			let days = [];
			for (let i = 0; i < 23; i++) {
				days.push({
					sel: false,
					spec: false
				})
			}
			for (let i = 0; i < 7; i++) {
				times.push({
					on: false,
					weeks: i,
					days: copyObj(days)
				})
			}
		},
	    //滑动过程
		timeSelMove(x,y){
			let self = this;
			self.timeTip.isShowTip = true;
			self.timeTip.left = x<18 ? (x+4)*36 + 'px' : (x-2)*36 +'px';
			self.timeTip.top = (y+3)*37 + 'px';
			if (self.flag) {
				let startX = self.pointer.startX; //0
				let startY = self.pointer.startY; //0
				self.timeTip.tipMsg = '星期'+ this.numToCh(startY) + ' 到 星期' + this.numToCh(y) + '<br>'+ this.changgeNum(startX) +'-'+this.changgeNum(x+1);
				self.formData.time.forEach(function(week, curY) {
					week.time.forEach(function(time, curX) {
						time.mov = (curX >= startX &&
							curX <= x &&
							curY >= startY &&
							curY <= y) ||
							(curX <= startX &&
							curX >= x &&
							curY <= startY &&
							curY >= y) ||
							(curX >= startX &&
							curX <= x &&
							curY <= startY &&
							curY >= y) ||
							(curX <= startX &&
							curX >= x &&
							curY >= startY &&
							curY <= y);
					})
				});
			}else{
				self.timeTip.tipMsg = '星期'+ this.numToCh(y) +' '+ this.changgeNum(x) +' '+this.changgeNum(x+1);
			}
		},
	    //滑动开始
		timeSelStart(whichtime,x,y) {
		    this.flag = true;
			whichtime.mov = true;
			this.pointer.startX = x;
			this.pointer.startY = y;
		},
	    //选择某一周
		selectAllDay(day) {
			if (!this.timeAllDayCheck[day]) {
				this.formData.time[day].time.map((item) => {
				    item.sel = false
				});
			} else {
				this.formData.time[day].time.map((item) => {
					item.sel = true
				});
			}
		},
	    //初始化时间表
		initTimes() {
			let times = [];
			let days = [];
			for (let i=0; i<24; i++) {
			    days.push({
					sel:false,
					mov:false,
				})
			}
			for(let i=0; i<7; i++){
			    times.push({
					on:false,
					weeks:i,
					time:copyObj(days)
				})
			}
			return times
		},
		//已选时间段，合并时间
		mergeTime(time) {
		    let times = [[],[],[],[],[],[],[]];
			Object.keys(time).forEach((t) => {
			    time[t].sort(function(a, b) {
					return a - b;
				});
				let arr = [];
				let tempArr = [];
				let isContinuous = false;
				for (let i = 0; i < time[t].length; i++) {
					let item1 = time[t][i];
					let item2 = i == time[t].length ? time[t][i] : time[t][i + 1];
					if (item1 + 1 == item2) {
						if (!isContinuous) {
							tempArr.push(item1);
						}
						isContinuous = true;
						continue;
					} else {
						isContinuous = false;
						tempArr.push(item1);
					}
					if (!isContinuous) {
						arr.push(tempArr);
						tempArr = [];
					}
					times[t] = copyObj(arr);
				}
			})
			this.times = copyObj(times);
		},
		clearSelect() {
			this.formData.time = this.initTimes();
			this.times = [];
		},
		handleClose(tag,index){
		    let i = this.regionData.indexOf(tag);
			tag.checked = false;
		    this.regionData[i].city.forEach((item) => {
		        item.checked = tag.checked;
			})
			this.formData.region.splice(index,1)
		},
		delSurvey() {
			this.survey.splice(0, 1);
			this.formData.surveyId = '';
		},
		delAd(index) {
			this.formData.advertisements.splice(index, 1);
		},
		getSurveyWithId() {
			Http.get('/api/survey?surveyId=' + this.formData.surveyId).then((res) => {
				if (res.status === 200 && res.data.code === 200 && res.data.iserror == 0) {
					this.survey.push({
						surveyId: res.data.data.surveyId,
						name: res.data.data.name,
						createTime: moment(res.data.data.createTime).format('YYYY年MM月DD日')
					});
				}
			}).catch((err) => {
				this.$message({
					message: err,
					type: 'error'
				});
			})
		},
		selectProvince(item, index) {
			item.checked = !item.checked;
			this.regionData[index].city.forEach((each) => {
				if (this.formData.region.indexOf(each) === -1) {
					each.checked = item.checked;
				}
			});
		},
		applyInnerCity(index) {
			this.regionChildrenData = [...this.regionData[index].city];
		},
		selectAllRegion() {
			this.regionData.forEach((item) => {
				item.city.forEach((each) => {
					each.checked = this.regionCheck;
				});
			});
		},
		selectOneDay(day, hour) {
			this.formData.time[day].reverse();
			let index = this.formData.time[day].indexOf(hour);
			index !== -1 ? this.formData.time[day].splice(index, 1) : this.formData.time[day].push(hour);
		},
		selectMultiDay(days) {
		    this.formData.time = this.initTimes();
			days.forEach((item) => {
				this.formData.time[item].time.forEach((time) => {
				    time.sel = true;
				});
			});
		},
		copyTime(from, array) {
			array.forEach((item) => {
				this.formData.time[JSON.stringify(item)] = [...this.formData.time[from]];
			});
		},
		genContinuousNum(from, to) {
			let realFrom = 0;
			let realTo = 0;
			if (to) {
				realTo = to;
				realFrom = from;
			} else {
				realTo = from;
			}
			let result = [];
			while (realTo >= realFrom) {
				result.push(realTo);
				realTo--;
			}
			return result.reverse();
		},
		numToCh(num) {
			let map = {
				0: '一',
				1: '二',
				2: '三',
				3: '四',
				4: '五',
				5: '六',
				6: '日',
				7: '八',
				8: '九'
			};
			return map[num];
		},
		getMaterialCount(){
		  let tem = this;
			Http.get("/api/material/total?flightId=" +this.formData.flightId, {
			})
			.then(function(res) {
				if(res.data.code == 200){
					 if(res.data.data.materialTotal != 0){
							tem.isShow = false;
					 }
				} else {
					tem.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		getTimeZone(num) {
			if(num.length == 1) {
			    return this.changgeNum(num[0]) +'-'+ this.changgeNum(num[0]+1)
			}else{
			    return this.changgeNum(num[0]) +'-'+ this.changgeNum(num[1]+1)
			}
		},
		changgeNum(n){
			n = n < 9 ? '0' + n + ':00' : n + ':00'
			return n;
		},
		getAllTime() {
			let allTime = copyObj(this.time);
			console.log(allTime);
			for (let day in allTime) {
				for (let i = 0; i < 24; i++) {
					allTime[day].push(i);
				}
			}
			console.log(allTime);
			return allTime;
		}
	},
	watch: {
		'formData.time': {
			handler: function() {
				this.time = {};
			 	this.formData.time.forEach((item,index) => {
			 	    let len = item.time.filter((t) => { return t.sel == true}).length;
					if( len == 24) {
						this.timeAllDayCheck[index] = true;
					}else {
						this.timeAllDayCheck[index] = false;
					}
					this.time[index+1] = [];
					item.time.forEach((time,t) => {
					    if(time.sel) {
							this.time[index+1].push(t);
						}
					})
				});
			 	this.mergeTime(this.time);
			},
			deep: true
		},
		'regionData': {
			handler: function() {
				this.formData.region = [];
				let allLen = 0;
				let allCheckLen = 0;
				this.regionData.forEach((item) => {
					let cur = 0;
					item.city.forEach((each) => {
						allLen++;
						let index = this.formData.region.indexOf(each);
						if (each.checked && index === -1) {
							this.formData.region.push(each.zip);
							cur++;
						}
					});
					if (cur === item.city.length) {
						item.checked = true;
					} else {
						item.checked = false;
					}
					allCheckLen = cur + allCheckLen;
				});
				if (allCheckLen === allLen) {
					this.regionCheck = true;
				}
			},
			deep: true
		},
		'formData.platform': {
			handler: function(val, oldVal) {
				if (val === 1) {
					this.formData.advertisements = this.advertisements.wap;
				} else {
					this.formData.advertisements = this.advertisements.pc;
				}
			}
		}
	}
};
</script>
<style lang="less" scoped>
	.error-message {
		color: #ff0000;
		position: absolute;
		right: 0;
		width: 400px;
		text-align: right;
	}
	.el-form-item__error {
		left: 287px!important;
		top: 38px!important;
	}
	.btn:focus {
		color: #23272c;
		background: linear-gradient(to bottom, #e7e7e7 0%, #f3f3f3 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e7e7e7', endColorstr='#f3f3f3', GradientType=0);
	}
	.timeselBtnGroup{
	    button{
			margin-right: 20px;
			background: none;
			border: 1px solid #e6e6e6;
		}
		.timeselBtn{
			background: linear-gradient(to bottom, #d30312 0%, #d30312 100%);
			filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d30312', endColorstr='#d30312', GradientType=0);
			border-color: #d30312;
			color:#fff;
			&:hover{
				 background: linear-gradient(to bottom, #d30312 0%, #d30312 100%);
				 filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d30312', endColorstr='#d30312', GradientType=0);
				 border-color: #d30312;
				 color:#fff;
			 }
		}
	}

	.selectTime{
		background-color: #f8f9fa;
		padding: 20px 0px;
		div{
			width:86%;
		}
		button{
			float: right;
			margin: 3px 20px 0 0;
		}
		span{
			margin: 0 10px;
		}
		.selectTimeTitle{
			float: left;
		}
		.selectTimeCont{
	        display: inline-block;
	        width:90%;
		}
	}
	.SKUerror{
		color: #ff4949;
		margin: 0 0 10px 40px;
	}
	.regionContent{
		background-color: #f7f9fa;
		margin: 20px 0 0 0;
	}
	.rebateDisabled{
		color:#b5bcc1;
		cursor: not-allowed;
	}
	.rebateContent{
		line-height: 36px;
		em{
			margin-left: 10px;
			color: #1197ed;
		}
	}
	.validQuestions{
	    text-align:right;
		margin: 0 22px 0 0;
		&+.el-col .el-form-item__content{
		  width:300px;
		}
	}
		.Unitrebate {
			margin-left: 30px;
			margin-bottom: 20px;
			.rebateDiv {
				width: 170px;
				float: left;
			}
			.rebateDivContent {
			float: left;
			vertical-align: middle;
			display: block;
			WIDTH: 307px;
			div {
				line-height: 36px;
				&:nth-of-type(3) {
					margin-left: 10px;
				}
			}
			.icon-doubt {
				margin-left: 5px;
			}
	    }
	   }

	.amp-form02{
		width: auto;
		padding: 0 20px;
	}
	.unitTitle{
		font-size: 30px;
		color:#3e4044;
		margin-left: 25px;
		margin-bottom: 30px;
	}
	.selectSpan{
		float: left;
		width: 50px;
		&+div{
	      	width: 800px;
		  	float: left;
		  	span{
			  	margin-right: 5px;
			  	background-color: #dde0e3;
			 	color:#23272c;
				.el-icon-close:hover{
					background-color: #d30312;
					color:#d30312
				}
			 	&:hover{
					background-color: #d30312;
		        	color:#fff
			  	}
		  	}
		}
	}
.tips-span {
	position: absolute;
	background: #14a3ff;
	color: #fff;
	border-radius: 5px;
	font-size: 12px;
	line-height: 12px;
	padding: 2px 5px;
	right: 25px;
	top: 5px;
}
</style>
