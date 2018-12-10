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
						<p class="unitTitle">基本信息</p>
						<el-form-item label="投放单元名称：" prop="name">
							<span>{{formData.name}}</span>
						</el-form-item>
						<el-form-item label="设备类型：">
							<span v-if="formData.platform == 1">无线</span>
							<span v-if="formData.platform == 3">PC</span>
						</el-form-item>
						<el-form-item label="投放广告位：">
							<div class="detail-row detail-row03" v-show="formData.advertisements.length">
								<table class="table">
									<tbody>
										<tr>
											<th><span>媒体名称</span></th>
											<th><span>广告位名称</span></th>
											<th width="90"><span>刊例价</span></th>
											<th width="120"><span>素材尺寸限制</span></th>
											<th width="120"><span>素材大小限制</span></th>
										</tr>
										<tr v-for="(item, index) in formData.advertisements" :key="index">
											<td><span>{{item.publisherName}}</span></td>
											<td><span>{{item.advertisementName}}</span></td>
											<td><span>{{item.adBid/100}}</span></td>
											<td><span>{{item.width}} * {{item.height}}</span></td>
											<td><span>{{item.size}}</span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-form-item>
					</div>
					<div>
						<p class="unitTitle" v-show="isRebate">返利模式</p>
						<el-form-item v-if="formData.rebateBid > 0" prop="rebateBid">
							<div class="rebateDiv">
								<span>分享返利：</span>
								<span>{{formData.rebateBid / 100}}元/次分享</span>
							</div>
						</el-form-item>
						<el-form-item v-if="formData.videoRebate > 0" prop="videoRebate">
							<div class="rebateDiv">
								<span>视频浏览返利：</span>
								<span>{{formData.videoRebate / 100}}元/次观看</span>
							</div>
						</el-form-item>
						<el-form-item v-if="formData.researchRebate > 0" prop="researchRebate">
							<div class="rebateDiv">
								<span>调研返利：</span>
								<span>{{formData.researchRebate / 100}}元/份</span>
							</div>
							<div style="margin-left: 75px;width:614px" class="rebateContent">
								<el-row style="margin-bottom: 5px;">
									<el-col :span="3">调研问卷：</el-col>
									<el-col :span="4">
										<span>{{surveyName}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="5" class="validQuestions">有效问卷收集总数：</el-col>
									<el-col :span="4">
										<span v-if="formData.questionnaireTotalLimited == 0">不限</span>
										<span v-else>{{formData.validQuestionnaireNum}}</span>
									</el-col>
									<el-col :span="2">
										<span v-if="formData.questionnaireTotalLimited != 0" style="margin-left: 6px;">份</span>
									</el-col>
								</el-row>
							</div>
						</el-form-item>
					</div>
					<div>
						<p class="unitTitle">定向</p>
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