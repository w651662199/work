<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">查看单元</span>
				<span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span>
			</h2>
			<div class="amp-form amp-form02">
				<div class="form-column">
					<el-form :model="formData" ref="formData" label-width="140px">
					<div>
						<el-form-item label="投放单元名称：" prop="name">
							<span>{{formData.name}}</span>
						</el-form-item>
						<el-form-item label="投放类型：">
							<span>商品推广</span>
						</el-form-item>
						<el-form-item label="资源位类型：" prop='advertisementGroups'>
							<span v-for="type in formData.advertisementGroups" :key="type">
								{{type == 1 ? '搜索位' : '推荐位'}}
							</span>
						</el-form-item>
					</div>
					<div>
						<el-form-item label="地域定向：">
							<span v-if="formData.regionType == 0">不限</span>
							<div v-if="formData.regionType != 0" class="regionContent">
								<div>
									<el-tag
										:key="tag.zip"
										v-for="(tag, index) in regionData.filter((item) => {return item.checked || item.city.filter((each) => {return each.checked}).length > 0 && item.city.filter((each) => {return each.checked}).length <= item.city.length})"
										:closable="false" style="margin-left: 5px;">
										{{tag.name}}
									</el-tag>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="时间段定向：">
							<span v-if="formData.timeType == 0">全时间段</span>
						</el-form-item>
						<el-form-item label="" v-show="formData.timeType === 1" prop="time" label-width="140px">
							<el-row v-if="times.filter((item) => {return item.length > 0}).length > 0">
								<el-col :span="22">
									<div  class="selectTime">
										<div v-for="(items, index) in times" v-if="items.length > 0" :key="index">
											<span class="selectTimeTitle">星期{{numToCh(index-1)}}</span>
											<div class="selectTimeCont">
												<span v-for="(item , i) in items" :key="i">
												   {{getTimeZone(item)}}
											    </span>
											</div>
										</div>
									</div>
								</el-col>
							</el-row>
						</el-form-item>
					</div>
					<el-form-item label="人群定向：">

						<div v-show="formData.crowds && formData.crowds.length > 0">
							<label> 通投: {{formData.isGeneralDelivery == 1 ? '是' : '否' }}</label>
							<el-tooltip placement="right" effect="light">
								<div slot="content">
									设置“通投”<br/>
									1.符合人群定向条件人群以原单元出价*（1+人群溢价）参与竞价；<br/>
									2.不符合人群定向条件的人群以原单元出价参与竞价；<br/>
									<br/>
									未设置“通投”<br/>
									1.符合人群定向条件的人群以原单元出价*（1+人群溢价）参与竞价；<br/>
									2.不符合人群定向条件人群，该单元广告不投放。<br/>
								</div>
								<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
							</el-tooltip>
						</div>

						<div class="detail-row selCrowdsTable" v-show="formData.crowds && formData.crowds.length > 0">
							<table class="table main-table">
								<thead>
								<tr class="list-header">
									<th>人群名称</th>
									<th>溢价</th>
								</tr>
								</thead>
								<tbody>
								<tr class="body-row" v-for="(item,index) in formData.crowds">
									<td><span>{{item.name}}</span></td>
									<td><span>{{item.premium}}%</span></td>
								</tr>
								</tbody>
							</table>
						</div>
					</el-form-item>
					<el-form-item label="关键词：" v-if="formData.advertisementGroups.find((n) => n == 1)" >
						<div class="detail-row" v-show="formData.keywords.length">
							<table class="table" style="width:400px;margin-top:20px;">
								<tbody>
								<tr>
									<th><span>已购买</span></th>
									<th><span>PC端出价</span></th>
								</tr>
								</tbody>
							</table>
						</div>
						<div class="detail-row" v-show="formData.keywords.length" style="width: 420px;height: 150px;overflow: auto;margin-top: -1px;">
							<table class="table" style="width:400px;">
								<tbody>
									<tr v-for="(item, index) in formData.keywords">
										<td><span>{{item.name}}</span></td>
										<td><span>{{item.pcBid / 100}}</span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</el-form-item>
					<el-form-item label="PC端推荐广告出价：" label-width="160px" v-if="formData.advertisementGroups.find((n) => n == 2)" >
						<el-row style="margin-bottom: -10px;">
							<el-col :span="10">
								<span style="margin-left: 10px">{{formData.adBid / 100}}元/点击</span>
							</el-col>
						</el-row>
						<div class="el-form-item__error" id="adBidError"></div>
					</el-form-item>
					<el-form-item label="无线端广告出价系数：" label-width="160px" v-if="false">
						<el-row style="margin-bottom: -10px;">
							<el-col :span="3">
								<span>{{formData.wirelessAdBidRatio}}</span>
							</el-col>
						</el-row>
						<div class="el-form-item__error" id="wirelessAdBidRatioError"></div>
					</el-form-item>
				</el-form>
				</div>
			</div>
		</div>
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
	formatTimeByUnit,
} from 'utils/common';
import AREA_DATA from '../../../../help/CITY.js';

import Event from 'event';
import Http from 'http';

export default {
	name: 'app-put-view-flight',
	props: ['viewData'],
	data() {
		return {
			showHintSelectTime: false,
			formData: {},
			startTime: '',
			endTime: '',
			surveyName: '',
			regionData: AREA_DATA,
			times: [],
			time: {},
			timeAllDayCheck: {
				'1': false,
				'2': false,
				'3': false,
				'4': false,
				'5': false,
				'6': false,
				'7': false
			}
		};
	},
	computed: {
		isRebate() {
			return this.formData.rebateBid > 0 || this.formData.videoRebate > 0 || this.formData.researchRebate > 0
		}
	},
	created() {
		this.formData = copyObj(this.viewData);
		// 分转元
		this.formData.dailyRebateBudget = this.formData.dailyRebateBudget / 100;
		this.formData.dailyAdBudget = this.formData.dailyAdBudget / 100;
		this.startTime = this.formData.startTime || Date.now();
		this.endTime = this.formData.endTime || Date.now();
		if (this.formData.surveyId) {
			this.getSurveyWithId();
		}
		if (this.formData.regionType != 0) {
			this.initRegion();
		}
		if (this.formData.timeType != 0) {
			this.handleTime();
		}
	},
	methods: {
		closeDrawer() {
			Event.$emit('close-view-drawer');
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
		getSurveyWithId() {
			Http.get('/api/survey?surveyId=' + this.formData.surveyId).then((res) => {
				if (res.status === 200 && res.data.code === 200 && res.data.iserror == 0) {
					this.surveyName = res.data.data.name;
				}
			}).catch((err) => {
				console.log(err);
			})
		},
		handleTime() {
			this.time = {};
			let times = [];
			let days = [];
			for (let i = 0; i < 24; i++) {
				days.push({
					sel:false,
					mov:false,
				})
			}
			for(let i = 0; i  <7; i++){
				times.push({
					on:false,
					weeks:i,
					time:copyObj(days)
				})
			}
			let time = copyObj(this.formData.time);
			for(let i = 0; i < times.length; i++) {
				times[i].time.forEach((item,index) => {
					item.sel = time[i+1].indexOf(index) > -1;
				})
			}
			this.formData.time = times;
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
		initRegion() {
			this.regionData.forEach((region) => {
				let regionSele = this.formData.region.find(fFegion => {
					return fFegion == region.zip;
				});
				if (regionSele) {
					Vue.set(region, 'checked', true);
				} else {
					Vue.set(region, 'checked', false);
				}
				if (region.city.length) {
					region.city.forEach((city) => {
						let citySele = this.formData.region.find(fCFegion => {
							return fCFegion == city.zip;
						});
						if (citySele) {
							Vue.set(city, 'checked', true);
						} else {
							Vue.set(city, 'checked', false);
						}
					})
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
.unitTitle{
	font-size: 30px;
	color:#3e4044;
	margin-left: 25px;
	margin-bottom: 30px;
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
</style>
