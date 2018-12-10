<template>
	<div class="amp-form">
		<div class="form-column">
			<el-form :model="formData" :rules="rules" ref="formData" label-width="140px">
				<el-form-item label="投放计划名称：" prop="name">
					<el-input v-model="formData.name" :disabled="disableModify"></el-input>
				</el-form-item>
				<el-form-item label="起止时间：" v-if="formData.isContinuous" label-width="140px">
					<el-radio-group v-model="formData.isUnlimited" :disabled="isExpire">
						<el-radio :label="1">不限结束时间</el-radio>
						<el-radio :label="0">设定结束时间</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" v-if="formData.isContinuous" prop="startTime" label-width="140px">
					<el-col :span="11">
						<el-row>
							<el-col :span="7">
								<span>开始时间:</span>
							</el-col>
							<el-col :span="17">
								<el-date-picker :picker-options="pickerOptions" :editable="false" :disabled="isPaused || isSystemPaused || isExpire || isValid" :clearable="false" type="date" placeholder="开始时间" v-model="startTime" style="width: 100%;"></el-date-picker>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="2" style="text-align: center;">-</el-col>
					<el-col :span="11" v-if="!formData.isUnlimited">
						<el-row>
							<el-col :span="7">
								<span>结束时间:</span>
							</el-col>
							<el-col :span="17">
								<el-date-picker :picker-options="pickerOptions" :editable="false" :disabled="isExpire" :clearable="false" type="date" placeholder="结束时间" v-model="endTime" style="width: 100%;"></el-date-picker>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="11" v-else>
						<span>本计划将长期有效</span>
					</el-col>
				</el-form-item>
				<el-form-item label="" v-if="formData.isContinuous === 0" style="margin-top: -15px;">
					<div class="time-setting">
						<div class="setting-header">
							<span class="header-day">共 {{daysLen}} 天</span>
							<span class="header-del" @click.prevent="formData.schedule = []"><em class="icon icon-delete"></em>全部删除</span>
							<span class="header-calendar" style="position: relative;">
								<em class="icon icon-calendar"></em>
								<el-date-picker :picker-options="pickerOptions" type="daterange" placeholder="请选择时间" size="mini" :editable="false" v-model="noContinuousDate" style="width: 14px;height: 14px;position: absolute;left: 0;top: 13px;opacity: 0;"></el-date-picker>
							</span>
						</div>
						<div class="setting-list" style="position: relative;">
							<ul>
								<li v-for="(item, index) in scheduleList">
									<span>{{item}}</span>
									<i @click="delSchedule(index)" style="cursor: pointer;font-size: 12px;margin-left: 80px;" class="el-icon-close"></i>
								</li>
							</ul>
							<div class="hintSelectTime" v-show='showHintSelectTime'>请选择投放时间段</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="计费方式：">
					<!--<el-radio-group v-model="formData.saleMode">
						&lt;!&ndash; <el-radio :label="1">CPM</el-radio> &ndash;&gt;
						<el-radio :label="3">CPC</el-radio>
					</el-radio-group>-->
					CPC（定价）
				</el-form-item>
				<el-form-item label="广告现金日预算：" prop="dailyAdBudget" class="daliyRebate">
					<el-row>
						<el-col :span="7">
							<el-radio-group style="vertical-align: middle;" v-model="formData.adLimited" :disabled="isExpire">
								<el-radio :label="0">不限</el-radio>
								<el-radio :label="1">自定义</el-radio>
							</el-radio-group>
							<p class="bc-orange" v-if="formData.adLimited === 0 && isShowAdBudgetMessage">{{dailyBudget.dailyAdBudgetMessage}}</p>
						</el-col>
						<el-col :span="14">
							<el-input :disabled="formData.adLimited === 0 || isExpire" v-filterNum="{'model':'dailyAdBudget'}"
									  :placeholder="formData.adLimited === 0 ? '不限预算' : ''"
									  v-model="formData.adLimited === 0 ? '' : formData.dailyAdBudget" style="widht: 100%">
							</el-input>
							<p class="bc-orange" v-if="formData.adLimited === 1 && isShowAdBudgetMessage">{{dailyBudget.dailyAdBudgetMessage}}</p>
						</el-col>
						<el-col :span="2">
							<span style="margin-left: 6px;">元/天</span>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="返利活动：">
					<el-switch on-text="" off-text="" v-model="isRebateCampaign" @change="customIsRebate"></el-switch>
					<p class="bc-orange" v-if="formData.isRebate == 0 && isShowRebateBudgetMessage" style="width: 160px;">{{dailyBudget.dailyRebateBudgetMessage}}</p>
				</el-form-item>
				<el-form-item label="返利日预算：" prop="dailyRebateBudget" v-show="isRebate" class="daliyRebate">
					<el-row>
						<el-col :span="7">
							<el-radio-group style="vertical-align: middle;" v-model="formData.rebateLimited" :disabled="isExpire">
								<el-radio :label="0">不限</el-radio>
								<el-radio :label="1">自定义</el-radio>
							</el-radio-group>
							<p class="bc-orange" v-if="formData.rebateLimited === 0 && isShowRebateBudgetMessage">{{dailyBudget.dailyRebateBudgetMessage}}</p>
						</el-col>
						<el-col :span="14">
							<el-input :disabled="formData.rebateLimited === 0 || isExpire" v-filterNum="{'model':'dailyRebateBudget'}"
									  :placeholder="formData.rebateLimited === 0 ? '不限预算' : ''"
									  v-model="formData.rebateLimited === 0 ? '' : formData.dailyRebateBudget"
									  style="widht: 100%">
							</el-input>
							<p class="bc-orange" v-if="formData.rebateLimited === 1 && isShowRebateBudgetMessage">{{dailyBudget.dailyRebateBudgetMessage}}</p>
						</el-col>
						<el-col :span="2">
							<span style="margin-left: 6px;">元/天</span>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
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
	limitLen,
	mixinSource
} from 'utils/common';
import moment from 'moment';
import Event from 'event';
import Http from 'http';

var _THIS = '';
export default {
	name: 'app-put-new-plan',
	data() {
		return {
			dailyBudget: {
				isRebate: 0,
				dailyRebateBudgetMessage: '',
				dailyAdBudgetMessage: '',
				dailyAdBudget: 0,
				dailyRebateBudget: 0,
				adLimited: 0,
				rebateLimited: 0
			},
			isRebateCampaign: true,
			showHintSelectTime: false,
			formData: {},
			pickerOptions: {
	          	disabledDate(time) {
	            	return time.getTime() < Date.now() - 8.64e7;
	          	}
	        },
			rules: {
				'name':[{validator: (rule, value, callback) => {
					if (!limitLen(value, 60)) {
						callback(new Error('字数不超过30个汉字'));
					} else if (value.trim() == '') {
						callback(new Error('请输入投放计划名称'));
					} else {
						let param =  {
							name: value,
							productLine: 2
						};
						if (this.drawerCtrlAction === 'modify') {
							param.campaignId = this.formData.campaignId;
						}
						Http.get('/api/campaign/exist', {
							hideLoading: true,
							params: param
						})
						.then((res) => {
							if (res.data.code == 200) {
								if (res.data.data.exist == 1) {
									callback(new Error('投放计划名称已存在'));
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
				dailyAdBudget: [{
					validator: (rule, value, callback) =>  {
					    if(this.formData.adLimited == 1) {
							if (value === '') {
								callback(new Error('请输入广告现金日预算'));
							}  else if (value < 0) {
								callback(new Error('不能为负数'));
							} else if (value > 99999999) {
								callback(new Error('广告现金日预算最大值不超过99999999.00'));
							} else if (value < 10) {
								callback(new Error('广告现金日预算最小不小于10.00'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
								callback(new Error('只能两位小数'));
							} else {
								callback();
							}
						}else{
							callback();
						}
					},
					trigger: 'change'
				}],
				dailyRebateBudget: [{
					validator: (rule, value, callback) =>  {
						if(this.formData.rebateLimited == 1 && this.formData.isRebate == 1) {
							if (value === '') {
								callback(new Error('请输入返利日预算'));
							}  else if (value < 0) {
								callback(new Error('不能为负数'));
							} else if (value > 99999999) {
								callback(new Error('返利日预算最大值不超过99999999.00'));
							} else if (value < 10) {
								callback(new Error('返利日预算最小不小于10.00'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
								callback(new Error('只能两位小数'));
							} else {
								callback();
							}
						}else {
							callback();
						}
					},
					trigger: 'change'
				}],
				startTime: [{
					validator: (rule, value, callback) => {
						if (this.formData.isUnlimited === 0 && this.endTime === '') {
							callback(new Error('请选择结束时间'));
						} else if (this.startTime.valueOf() > this.endTime.valueOf() && this.formData.isUnlimited === 0) {
							callback(new Error('开始时间不得迟于结束时间'));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}]
			},
			noContinuousDate: [null, null],
			startTime: '',
			endTime: '',
			httpMethodMap: {
				new: 'post',
				copy: 'post',
				modify: 'put'
			}
		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action,
		isRebate: function() {
			return this.formData.isRebate === 1;
		},
		scheduleList: function() {
			if (this.formData.schedule[0] === null)  {
				return [];
			}
			let result = [];
			this.formData.schedule.forEach((item) => {
				let one = Number(item[0]);
				let two = Number(item[1]);
				if (one === two) {
					result.push(formatDate(one, 'yyyy-MM-dd'));
				} else {
					result.push(`${formatDate(one, 'yyyy-MM-dd')} 至 ${formatDate(two, 'yyyy-MM-dd')}`);
				}
			});
			return result;
		},
		daysLen: function() {
			let len = 0;
			this.formData.schedule.forEach((item) => {
				let cur = item;
				let result = formatTimeByUnit(cur[0], cur[1], {
					day: true
				});
				len += result.day;
			});
			return len;
		},
		disableModify() {
			return this.drawerCtrlAction === 'modify';
		},
		isUnstart() {
			return this.disableModify && this.formData.state == 4;
		},
		isPaused() {
			return this.disableModify && this.formData.state == 1;
		},
		isSystemPaused() {
			return this.disableModify && (this.formData.state == 5 || this.formData.state == 7);
		},
		isExpire() {
			return this.disableModify && this.formData.state == 3;
		},
		isValid() {
			return this.disableModify && this.formData.state == 2;
		},
		isShowAdBudgetMessage() {
			return this.drawerCtrlAction === 'modify' && this.dailyBudget.dailyAdBudgetMessage.length > 0;
		},
		isShowRebateBudgetMessage() {
			return this.drawerCtrlAction === 'modify' && this.dailyBudget.dailyRebateBudgetMessage.length > 0;
		}
	},
	created() {
		_THIS = this;
		this.formData = copyObj(this.drawerData);
		// 分转元
		// this.formData.dailyRebateBudget = this.formData.dailyRebateBudget / 100;
		// this.formData.dailyAdBudget = this.formData.dailyAdBudget / 100;
		// this.startTime = this.formData.startTime || Date.now();
		// this.endTime = this.formData.endTime || Date.now();
		this.isRebateCampaign = this.isRebate;
		if (this.drawerCtrlAction == 'new') {
			this.formData.dailyAdBudget = '10.00';
			this.formData.dailyRebateBudget = '10.00';
		} else {
			this.formData.dailyRebateBudget = this.formData.dailyRebateBudget / 100;
			this.formData.dailyAdBudget = this.formData.dailyAdBudget / 100;
		}
		if (this.drawerCtrlAction == 'new' || this.drawerCtrlAction == 'copy') {
			this.formData.isUnlimited = 1;
			this.startTime = moment().startOf('day').valueOf();
			// this.endTime = moment().endOf('day').valueOf();
		} else {
			this.startTime = moment(this.formData.startTime).startOf('day').valueOf();
			this.endTime = moment(this.formData.endTime).endOf('day').valueOf();
		}
		if (this.drawerCtrlAction == 'modify') {
			this.dailyBudget.dailyAdBudget = this.formData.tempDailyAdBudget / 100;
			this.dailyBudget.dailyRebateBudget = this.formData.tempDailyRebateBudget / 100;
			this.dailyBudget.adLimited = this.formData.tempAdLimited;
			this.dailyBudget.rebateLimited = this.formData.tempRebateLimited;
			this.dailyBudget.isRebate = this.formData.tempIsRebate;
		}
	},
	mounted() {
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.$refs.formData.validate((result) => {
				let schedule = null;
				if (!this.formData.isContinuous) {
					schedule = this.formData.schedule.map((item) => {
						return [item[0].toString(), item[1].toString()];
					});
					if (schedule.length === 0) {
						this.showHintSelectTime = true;
						return false;
					}
				} else {
					schedule = [];
				}

				let params = {
					name: this.formData.name,
					isContinuous: this.formData.isContinuous,
					isUnlimited: this.formData.isUnlimited,
					startTime: this.formData.startTime,
					endTime: this.formData.endTime,
					schedule: schedule,
					saleMode: this.formData.saleMode,
					adLimited: this.formData.adLimited,
					dailyAdBudget: this.formData.adLimited ? this.formData.dailyAdBudget * 100 : 0,
					isRebate: this.formData.isRebate,
					rebateLimited: this.formData.isRebate ? this.formData.rebateLimited : 0,
					dailyRebateBudget: this.formData.rebateLimited ? this.formData.dailyRebateBudget * 100 : 0,
					productLine: 2
				};
				if (result) {
					Http({
						url: 'api/cpc/campaign',
						method: this.httpMethodMap[this.drawerCtrlAction],
						data: this.drawerCtrlAction === 'modify' ? mixin({
							campaignId: this.formData.campaignId
						}, params) : params
					})
						.then((res) => {
							if (!res.data.iserror) {
								Event.$emit('put-save-result', {
									error: 0,
									res: res.data,
									isRebate: this.formData.isRebate
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
				}
			});
		});
	},
	methods: {
		filterNumFn(val,model){
			let value = val + "";
			// 处理非数字 非小数点 的字符
			value = value.replace(/[^0-9\.]+/, "");
			// 处理不小数点开头但出现多次小数点的字符
			var regObject = value.match(/\.+/g);
			var count = 0;
			if (regObject != null && regObject.length > 0) {
				for (var i = 0; i < regObject.length; i++) {
					count += regObject[i].length;
				}
			}
			if (value != 0) {
				value = value.replace(/^0+/, "");
			}
			if (value.indexOf(".") == 0) {
				value = "0" + value;
			}
			// 处理以小数点结尾的字符
			//value = value.replace(/\.$/, "");
			if (value.indexOf(".") > 0) {
				if (count > 1) {
					value = value.substring(0, value.indexOf(".") + 1) + value.substring(value.indexOf(".")).replace(/\./g, "");
				}
				value = value.substring(0, value.indexOf(".") + 3);
			}
			this.formData[model] = value;
			return value;
		},
		customIsRebate(value) {
			// value -> true/false transform to 1/0
			this.formData.isRebate = Number(value);
			if (!this.isRebateCampaign) {
				this.formData.rebateLimited = 0;
			}
		},
		delSchedule(index) {
			this.formData.schedule.splice(index, 1);
		},
		mergeTime() {
			var start = null;
			var end = null;
			for(let i = 0; i < this.formData.schedule.length; i++) {
				for (let j = i + 1; j < this.formData.schedule.length; j++) {
					if (this.formData.schedule[j][0] <= this.formData.schedule[i][1] && this.formData.schedule[j][1] >= this.formData.schedule[i][0]) {
						if (this.formData.schedule[j][0] < this.formData.schedule[i][0]) {
							start = this.formData.schedule[j][0];
						} else {
							start = this.formData.schedule[i][0];
						}
						if (this.formData.schedule[j][1] < this.formData.schedule[i][1]) {
							end = this.formData.schedule[i][1];
						} else {
							end = this.formData.schedule[j][1];
						}
						this.formData.schedule[i] = [start, end];
						this.formData.schedule.splice(j, 1);
					}
				}
			}
		},
		dailyMessage() {
			if (this.formData.isRebate == undefined || this.formData.rebateLimited == undefined || this.formData.dailyRebateBudget == undefined) {
				//console.log('有值为undefined');
				this.dailyBudget.dailyRebateBudgetMessage = '';
				return false;
			}
			let daily = (this.formData.dailyRebateBudget + '').length > 0 ? Number(this.formData.dailyRebateBudget) : 0;
			if (this.formData.isRebate == this.dailyBudget.isRebate) {
				//console.log('是否返利没有变化');
				if (this.formData.rebateLimited == this.dailyBudget.rebateLimited) {
					//console.log('返利日预算状态没有变化');
					if (this.formData.rebateLimited == 1) {
						//console.log('自定义的值发生了变化');
						if (daily >= 10) {
							//console.log('输入值符合最低标准');
							if (daily >= this.dailyBudget.dailyRebateBudget) {
								//console.log('输入值大于等于现在生效的值');
								this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
							} else {
								//console.log('输入值小于等于现在生效的值');
								this.dailyBudget.dailyRebateBudgetMessage = '保存后第二天生效';
							}
						} else {
							//console.log('没有输入或者输入不符合最低标准');
							this.dailyBudget.dailyRebateBudgetMessage = '';
						}
					} else {
						//console.log('不限变为不限');
						this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
					}
				} else {
					//console.log('返利日预算状态变化了');
					if (this.formData.rebateLimited == 0) {
						//console.log('变成不限了');
						this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
					} else {
						//console.log('变成自定义了');
						if (daily >= 10) {
							//console.log('输入值符合最低标准');
							this.dailyBudget.dailyRebateBudgetMessage = '保存后第二天生效';
						} else {
							//console.log('没有输入或者输入不符合最低标准');
							this.dailyBudget.dailyRebateBudgetMessage = '';
						}
					}
				}
			} else {
				//console.log('返利状态发生变化');
				if (this.formData.isRebate == 0) {
					//console.log('变成了非返利');
					this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
				} else {
					//console.log('变成了返利');
					if (this.formData.rebateLimited == 0) {
						//console.log('不限日预算');
						this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
					} else {
						if (daily >= 10) {
							this.dailyBudget.dailyRebateBudgetMessage = '保存后即时生效';
						} else {
							this.dailyBudget.dailyRebateBudgetMessage = '';
						}
					}
				}
			}
		}
	},
	watch: {
		'formData.adLimited': function(val, oldVal) {
			if (oldVal != undefined) {
				if (this.formData.adLimited !== this.dailyBudget.adLimited) {
					if (!this.formData.adLimited) {
						this.dailyBudget.dailyAdBudgetMessage = '保存后即时生效';
					} else {
						this.dailyBudget.dailyAdBudgetMessage = '';
					}
				} else {
					this.dailyBudget.dailyAdBudgetMessage = '保存后即时生效';
				}
			}
		},
		'formData.rebateLimited': function(val, oldVal) {
			if (oldVal != undefined) {
				this.dailyMessage();
			}
		},
		'formData.isRebate': function(val, oldVal) {
			if (oldVal != undefined) {
				this.dailyMessage();
			}
		},
		'formData.dailyAdBudget': function(val, oldVal) {
			if (!val) {
				this.dailyBudget.dailyAdBudgetMessage = '';
			} else {
				let daily = val.length > 0 ? Number(val) : 0;
				if (this.formData.adLimited === 1 && this.dailyBudget.adLimited === 0) {
					if (daily >= 10) {
						this.dailyBudget.dailyAdBudgetMessage = '保存后第二天生效';
					} else {
						this.dailyBudget.dailyAdBudgetMessage = '';
					}
				} else {
					if (daily >= this.dailyBudget.dailyAdBudget) {
						this.dailyBudget.dailyAdBudgetMessage = '保存后即时生效';
					} else if (daily < this.dailyBudget.dailyAdBudget && daily > 10) {
						this.dailyBudget.dailyAdBudgetMessage = '保存后第二天生效';
					} else {
						this.dailyBudget.dailyAdBudgetMessage = '';
					}
				}
			}
		},
		'formData.dailyRebateBudget': function(val, oldVal) {
			if (oldVal != undefined) {
				this.dailyMessage();
			}
		},
		noContinuousDate: function() {
			// 重置
			if (this.noContinuousDate[0] !== null) {
			    this.formData.schedule.push([this.noContinuousDate[0].valueOf(),this.noContinuousDate[1].valueOf()]);
				this.noContinuousDate[0] = this.noContinuousDate[1] = null;
			}
			this.showHintSelectTime = false;
		},
		startTime: function() {
			if (this.startTime) {
				this.formData.startTime = new Date(this.startTime).valueOf();
			}
		},
		endTime: function() {
			if (this.endTime) {
				this.formData.endTime = new Date(this.endTime).valueOf();
			}
		},
		'formData.schedule': function() {
			this.mergeTime();
		}
	},
	directives:{
		'filterNum': {
			bind: function(el,binding,vnode){
				const model = binding.value.model;
				const Input = el.getElementsByTagName('input')[0];
				if(window.addEventListener) {
					Input.addEventListener('keyup',(e) => {
						Input.value = _THIS.filterNumFn(Input.value,model);
					});
				} else if(window.attachEvent) {
					Input.attachEvent('keyup',(e) => {
						Input.value = _THIS.filterNumFn(Input.value,model);
					});
				}

			},
			update: function(el,binding,vnode){
				const model = binding.value.model;
				const Input = el.getElementsByTagName('input')[0];
				if (Input.value != _THIS.formData[model]) {
					if (model == 'dailyRebateBudget') {
						if (_THIS.formData.isRebate) {
							Input.value = _THIS.filterNumFn(Input.value,model);
						}
					} else {
						Input.value = _THIS.filterNumFn(Input.value,model)
					}
				}
			}
		}
	}
};
</script>
<style scoped>

	.el-upload__tip{
		line-height: 0.8;
		margin: -8px 0 22px 140px;
	}
.error {
	color: #ff5151;
}
.hintSelectTime{
	position: absolute;
	left: 0;
	top: 10px;
	color: #ff4949;
	font-size: 13px;
}
	.ele-input{
		width: 240px!important;
	input{
		width: 240px!important;
	}
	}

	.disableDiv{
		cursor: not-allowed;
		background:#EFF2F7;
		input[disabled]{
			cursor: not-allowed;
		}
	}
</style>
