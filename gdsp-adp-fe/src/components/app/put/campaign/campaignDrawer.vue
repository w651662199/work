<template>
	<div class="part-form">
		<div class="form-column">
			<el-form :model="campaignData" ref="campaignForm" :rules="formRules" label-width="155px">
				<el-form-item label="推广组：" prop="groupId"class="is-required">
					<span v-if="drawerConfig.name">{{drawerConfig.name}}</span>
					<el-select v-if="!drawerConfig.name" v-model="campaignData.groupId" placeholder="请选择" style="width: 500px;" :disabled="isModify || !!drawerConfig.groupId">
						<el-option v-for="item in groups" :key="item.groupId" :label="item.name" :value="item.groupId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="计费方式：" prop="saleMode" class="is-required">
					<el-radio-group v-model="campaignData.saleMode" :disabled="isModify">
						<el-radio :label="CONST.SALE_MODE.FIX_CPM">定价CPM</el-radio>
						<el-radio :label="CONST.SALE_MODE.BID_CPM">竞价CPM</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="投放方式：" prop="biddingMode" class="is-required">
					<el-radio-group v-model="campaignData.biddingMode" :disabled="isModify" @change="biddingModeChange">
						<el-radio :label="CONST.BIDDING_MODE.PDB" :disabled="campaignData.saleMode === CONST.SALE_MODE.BID_CPM">PDB</el-radio>
						<el-radio :label="CONST.BIDDING_MODE.PD" :disabled="campaignData.saleMode === CONST.SALE_MODE.BID_CPM">PD</el-radio>
						<el-radio :label="CONST.BIDDING_MODE.RTB" :disabled="campaignData.saleMode === CONST.SALE_MODE.FIX_CPM">RTB</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="广告位：" prop="slots" class="is-required">
					<el-radio-group v-model="campaignData.isLimitedSlot" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB" :disabled="isModify">
						<el-radio :label="1">不限</el-radio>
						<el-radio :label="0">自定义</el-radio>
					</el-radio-group>
					<button v-if="isShowSlotButton" class="btn btn-blue-simple" type="button" :disabled="isModify" @click.prevent="showSlotDrawer">广告位</button>
				</el-form-item>
				<el-form-item v-if="campaignData.slots.length > 0">
					<span class="form-text">已选择{{campaignData.slots.length}}个广告位</span>
					<div class="detail-row">
						<table class="table">
							<tbody>
								<tr>
									<th class="w140"><span>广告位名称</span></th>
									<th class="w140"><span>所属媒体</span></th>
									<th class="w140"><span>支持广告形式</span></th>
									<th class="w80" v-if="!isModify"><span>操作</span></th>
								</tr>
								<tr v-for="(item, index) in campaignData.slots">
									<td><span>{{item.name}}</span></td>
									<td><span>{{item.mediaName}}</span></td>
									<td><span v-html="getFormats(item.slotFormats)"></span></td>
									<td v-if="!isModify"><span><em class="icon icon-delete" @click="removeSlot(index)"></em></span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-form-item>

				<el-form-item label="投放时间段：" prop="isUnlimited" class="is-required" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB">
					<el-radio-group v-model="campaignData.isUnlimited" :disabled="isModify && (campaignData.biddingMode === CONST.BIDDING_MODE.PD || campaignData.biddingMode === CONST.BIDDING_MODE.PDB)">
						<el-radio :label="0">设置开始和结束时间</el-radio>
						<el-radio :label="1">不限结束时间</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="campaignData.biddingMode !== CONST.BIDDING_MODE.RTB ? '投放时间段：' : ''" class="is-required">
					<el-col :span="10" style="margin-right: 10px;">
						<el-form-item prop="startTime">
							<el-date-picker
								type="date"
								placeholder="选择日期"
								v-model="campaignData.startTime"
								:editable="false"
								:disabled="isModify"
								:picker-options="startTimeOptions"
								style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="1">-</el-col>
					<el-col :span="10">
						<el-form-item prop="endTime">
							<span v-if="campaignData.isUnlimited === 1">不限</span>
							<el-date-picker
								type="date"
								placeholder="选择日期"
								v-model="campaignData.endTime"
								:editable="false"
								:disabled="isModify && (campaignData.biddingMode === CONST.BIDDING_MODE.PD || campaignData.biddingMode === CONST.BIDDING_MODE.PDB)"
								:picker-options="endTimeOptions"
								v-if="campaignData.isUnlimited === 0"
								style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="流量设置：" class="is-required" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB || campaignData.biddingMode === CONST.BIDDING_MODE.PD">
					<el-form-item label="采购总量" prop="amount" label-width="90px" style="margin-bottom: 20px" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB">
						<el-col :span="6" style="margin-right: 5px;">
							<el-input v-model="campaignData.amount" :disabled="isModify"></el-input>
						</el-col>
						<el-col :span="4"><span>CPM</span></el-col>
					</el-form-item>
					<el-form-item label="日预算" prop="dailyBudget" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PD" label-width="90px" style="margin-bottom: 20px">
						<el-col :span="6" style="margin-right: 5px;">
							<el-input v-model="campaignData.dailyBudget" :disabled="isModify"></el-input>
						</el-col>
						<el-col :span="4"><span>元</span></el-col>
					</el-form-item>
					<el-form-item label="合约单价" prop="price" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB || campaignData.biddingMode === CONST.BIDDING_MODE.PD" label-width="90px" style="margin-bottom: 20px">
						<el-col :span="6" style="margin-right: 5px;">
							<el-input v-model="campaignData.price" :disabled="isModify"></el-input>
						</el-col>
						<el-col :span="4"><span>元/CPM</span></el-col>
					</el-form-item>
					<el-form-item label="退量比" prop="returnPer" v-if="false && campaignData.biddingMode === CONST.BIDDING_MODE.PDB" label-width="90px" style="margin-bottom: 20px">
						<el-col :span="6" style="margin-right: 5px;">
							<el-input v-model="campaignData.returnPer" :disabled="isModify"></el-input>
						</el-col>
						<el-col :span="4"><span>%</span></el-col>
					</el-form-item>
				</el-form-item>
				<el-form-item label="流量设置：" class="is-required" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.RTB">
					<el-col :span="8">
						<el-form-item prop="dailyBudgetLimite">
							<el-radio-group v-model="campaignData.dailyBudgetLimite" >
								<el-radio :label="-1">不限</el-radio>
								<el-radio :label="0">自定义</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="日预算" prop="dailyBudget" v-if="campaignData.dailyBudgetLimite === 0" label-width="70px">
							<el-col :span="12" style="margin-right: 5px;">
								<el-input v-model="campaignData.dailyBudget" placeholder=""></el-input>
							</el-col>
							<el-col :span="4"><span>元</span></el-col>
						</el-form-item>
					</el-col>
					<br/>
					<p class="pdt-10" v-if="isModify && +modifyDailyBudget != 0">(修改成功，日预算{{+modifyDailyBudget != 0 ? (+modifyDailyBudget === -1 ? '不限' : modifyDailyBudget + '元') : ''}}将于{{getDate()}}00：00生效)</p>
				</el-form-item>
				<el-form-item label="托底素材：" class="is-required" prop="materials" v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB">
					<button class="btn btn-blue" type="button" @click.prevent="showMaterialDrawer" :disabled="campaignData.slots.length === 0">设置托底素材</button>
				</el-form-item>
				<el-form-item v-if="campaignData.biddingMode === CONST.BIDDING_MODE.PDB && campaignData.materials.length > 0">
					<div class="detail-row">
						<table class="table">
							<tbody>
								<tr>
									<th><span>素材名称</span></th>
									<th width="90"><span>素材类型</span></th>
									<th width="90"><span>规格</span></th>
									<th width="90"><span>预览图</span></th>
									<th width="58"><span>操作</span></th>
								</tr>
								<tr v-for="(item, index) in campaignData.materials">
									<td><span>{{item.name}}</span></td>
									<td><span>{{getFormat(item.formatCategoryId)}}</span></td>
									<td><span>{{item.formatName}}</span></td>
									<td><span><img class="img-preview" v-for="image in item.images" :src="image"></span></td>
									<td><span><em class="icon icon-delete" @click="removeMaterial(index)"></em></span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-form-item>
				<el-form-item label="推广计划名称：" prop="name" class="is-required">
					<el-input v-model="campaignData.name" style="width: 500px;" placeholder="请输入计划名称"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<transition-group name="drawer">
			<slot-drawer :key="'addSlot'" v-if="isShowSlotDrawer" :biddingMode="campaignData.biddingMode" :saleMode="campaignData.saleMode" :slots="campaignData.slots"></slot-drawer>
			<material-drawer :key="'addMaterial'" v-if="isShowMaterialDrawer" :type="'campaign'" :materials="campaignData.materials" :formatId="getFormatId()"></material-drawer>
		</transition-group>
	</div>
</template>
<script>
import {mixin, floatMul} from 'utils/common';
import Event from 'event';
import moment from 'moment';
import Http from 'http';
import store from 'store';
import CONST from 'help/CONST.js';
import SlotDrawer from './addSlotDrawer.vue';
import MaterialDrawer from '../addMaterialDrawer.vue';
export default {
	name: 'CampaignDrawer',
	data() {
		return {
			campaignData: {
				name: '',
				groupId: '',
				saleMode: '',
				biddingMode: '',
				isUnlimited: 0,
				companyName:'',
				startTime: '',
				endTime: '',
				amount: '',
				price: '',
				returnPer: '',
				dailyBudget: '',
				dailyBudgetLimite: -1,
				isLimitedSlot: 1,
				slots: [],
				slotIds: [],
				materials: [],
				materialIds: [],
			},
			modifyDailyBudget: '',
			advertisements: [],
			groups: [],
			CONST: CONST,
			isShowSlotDrawer: false,
			isShowMaterialDrawer: false,
			formRules: {
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('请输入计划名称'));
						} else if (value.length > 30) {
							callback(new Error('填写的内容不得超过30个字符'));
						} else {
							/*
							Http.get('/api/campaign/exist?name=' + value, {
								hideLoading: true
							}).then((res) => {
								if (res.data.code == 200 && res.data.iserror === 0) {
									if (res.data.data.exist == 1) {
										callback(new Error('推广计划名称已存在'));
									} else {
										callback();
									}
								} else {
									callback();
								}
							}).catch((error) => {
								callback();
							});*/
							callback();
						}
					},
					trigger: 'blur'
				}],
				groupId: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择推广组'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				saleMode: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择计费方式'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				biddingMode: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择投放方式'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				startTime: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择开始时间'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				endTime: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value && this.campaignData.isUnlimited === 0) {
							callback(new Error('请选择结束时间'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				amount: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!this.isModify) {
							if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB) {
								let reg = new RegExp("^\\d+?$");
								if (('' + value).trim() === '') {
									callback(new Error('请输入采购总量'));
								} else if (!reg.test(value) && value.length > 0) {
									callback(new Error('采购总量只能为整数'));
								} else if (+value === 0) {
									callback(new Error('采购总量必须大于0'));
								} else if (+value > 0) {
									if (this.campaignData.price && +value * this.campaignData.price * 100 > this.balance) {
										callback('当前余额不能支持该合约消耗');
									}
									callback();
								} else {
									callback();
								}
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				price: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!this.isModify) {
							if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB || this.campaignData.biddingMode === CONST.BIDDING_MODE.PD) {
								let reg = new RegExp("^\\d+(\\.\\d+)?$");
								if (('' + value).trim() === '') {
									callback(new Error('请输入合约单价'));
								} else if (!reg.test(value) && value.length > 0) {
									callback(new Error('合约单价只能为数字'));
								} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : 0) {
									callback(new Error('只能二位小数'));
								} else if (+value === 0) {
									callback(new Error('合约单价必须大于0'));
								} else if (+value > 0) {
									if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB) {
										if (+value * +this.campaignData.amount * 100 > this.balance) {
											callback('当前余额不能支持该合约消耗');
										}
									}
									callback();
								} else {
									callback();
								}
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				returnPer: [{
					required: true,
					validator: (rule, value, callback) => {
						callback();
						/*
						if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB) {
							let reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (('' + value).trim() === '') {
								callback(new Error('请输入退量比'));
							} else if (!reg.test(value) && value.length > 0) {
								callback(new Error('退量比只能为数字'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : 0) {
								callback(new Error('只能二位小数'));
							} else if (+value === 0 || +value > 100) {
								callback(new Error('退量比必须0-100之间的数'));
							} else {
								callback();
							}
						} else {
							callback();
						}*/
					},
					trigger: 'blur'
				}],
				dailyBudget: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PD || (this.campaignData.biddingMode === CONST.BIDDING_MODE.RTB && this.campaignData.dailyBudgetLimite === 0)) {
							let reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (('' + value).trim() === '') {
								callback(new Error('请输入日预算'));
							} else if (!reg.test(value) && value.length > 0) {
								callback(new Error('日预算只能为数字'));
							} else if (+value == 0) {
								callback(new Error('日预算应大于0'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : 0) {
								callback(new Error('只能二位小数'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				slots:  [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value || value.length === 0) {
							if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB || this.campaignData.biddingMode === CONST.BIDDING_MODE.PD || this.campaignData.isLimitedSlot === 0) {
								callback(new Error('请选择广告位'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				materials:  [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value || value.length === 0) {
							if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB) {
								callback(new Error('请选择托底素材'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
			},
			startTimeOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			balance: ''
		};
	},
	computed: {
		drawerConfig() {
			return store.state.putDrawerCtr.config;
		},
		isModify() {
			return store.state.putDrawerCtr.action === 'modify';
		},
		endTimeOptions() {
			let that = this;
			return {
				disabledDate(time) {
					return time.getTime() < moment(that.campaignData.startTime) || time.getTime() < Date.now() - 8.64e7;
				}
			};
		},
		isShowSlotButton() {
			return this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB || this.campaignData.biddingMode === CONST.BIDDING_MODE.PD || this.campaignData.isLimitedSlot === 0;
		}
	},
	watch: {
		'campaignData.startTime': function(val) {
			if (moment(val).isAfter(moment(this.campaignData.endTime))) {
				this.campaignData.endTime = val;
			}
		},
		'campaignData.isUnlimited': function(val, oldVal) {
			if (val === 0) {
				this.campaignData.endTime = '';
			} else {
				this.$refs['campaignForm'].validateField('endTime');
			}
		},
		'campaignData.saleMode': function(val) {
			if (!this.isModify) {
				this.campaignData.biddingMode = '';
				this.campaignData.slots = [];
			}
		},
		'campaignData.dailyBudgetLimite': function(val) {
			if (val === -1) {
				this.campaignData.dailyBudget = '';
			} else {
				this.modifyDailyBudget = '';
			}
		},
		'campaignData.dailyBudget': function(val) {
			if (this.campaignData.dailyBudgetLimite === -1) {
				this.modifyDailyBudget = -1;
			} else {
				this.modifyDailyBudget = this.campaignData.dailyBudget;
			}
		},
		'campaignData.amount': function(val) {
			if (this.campaignData.price && !this.isModify) {
				this.$refs['campaignForm'].validateField('price');
			}
		},
		'campaignData.price': function(val) {
			if (this.campaignData.amount && !this.isModify) {
				this.$refs['campaignForm'].validateField('amount');
			}
		}
	},
	components: {
		SlotDrawer,
		MaterialDrawer
	},
	created() {
		if (this.drawerConfig.groupId) {
			this.campaignData.groupId = this.drawerConfig.groupId;
		}
		if (this.drawerConfig.campaignId) {
			this.getCampaignData();
		}
		this.getGroups();
		if (!this.isModify) {
			this.getAmount();
		}
	},
	mounted() {
		Event.$off('closeSlotDrawer');
		Event.$on('closeSlotDrawer', (res) => {
			if (res) {
				this.campaignData.slots = res;
				if (this.$refs['campaignForm']) {
					this.$refs['campaignForm'].validateField('slots');
				}
			}
			this.isShowSlotDrawer = false;
		});
		Event.$off('closeMaterialDrawer');
		Event.$on('closeMaterialDrawer', (res) => {
			if (res) {
				this.campaignData.materials = res;
				if (this.$refs['campaignForm']) {
					this.$refs['campaignForm'].validateField('materials');
				}
			}
			this.isShowMaterialDrawer = false;
		});
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.saveCampaign();
		});
	},
	methods: {
		getDate() {
			return moment().add('days', 1).format('YYYY年MM月DD日');
		},
		getAmount() {
			Http.get('/api/report/finance').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.balance = res.data.data.balance;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getFormatId() {
			let formatIds = [];
			for (let slot of this.campaignData.slots) {
				for (let format of slot.slotFormats) {
					formatIds.push(format.formatId);
				}
			}
			return formatIds;
		},
		showSlotDrawer() {
			this.isShowSlotDrawer = true;
		},
		showMaterialDrawer() {
			this.isShowMaterialDrawer = true;
		},
		removeSlot(index) {
			this.campaignData.slots.splice(index, 1);
		},
		removeMaterial(index) {
			this.campaignData.materials.splice(index, 1);
		},
		getGroups() {
			Http.get('/api/groups/all').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.groups = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getCampaignData() {
			Http.get('/api/campaign?campaignId=' + this.drawerConfig.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignData = mixin(this.campaignData, res.data.data);
					this.campaignData.price = floatMul(res.data.data.price, 0.01);
					if (this.campaignData.biddingMode === CONST.BIDDING_MODE.RTB) {
						if (this.campaignData.dailyBudget === -1) {
							this.campaignData.dailyBudgetLimite = -1;
							this.campaignData.dailyBudget = '';
						} else {
							this.campaignData.dailyBudgetLimite = 0;
							this.campaignData.dailyBudget = floatMul(res.data.data.dailyBudget, 0.01);
						}
					} else {
						this.campaignData.dailyBudget = floatMul(res.data.data.dailyBudget, 0.01);
					}
					this.getDailyBudget();
					this.getSlots();
					if (this.campaignData.materialIds.length > 0) {
						this.getMaterials();
					}
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getDailyBudget() {
			Http.get('/api/campaign/budget?campaignId=' + this.drawerConfig.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.modifyDailyBudget = floatMul(res.data.data, 0.01);
				}
			}).catch(err => {
				console.log(err);
			});
		},
		saveCampaign() {
			this.$refs['campaignForm'].validate((valid) => {
				if (valid) {
					let slotIds = [];
					for (let slot of this.campaignData.slots) {
						slotIds.push(slot.slotId);
					}
					let materialIds = [];
					for (let material of this.campaignData.materials) {
						materialIds.push(material.materialId);
					}
					let isLimitedSlot = this.campaignData.biddingMode === CONST.BIDDING_MODE.RTB ? this.campaignData.isLimitedSlot : 0;
					let dailyBudget = 0;
					if (this.campaignData.biddingMode === CONST.BIDDING_MODE.RTB) {
						if (this.campaignData.dailyBudgetLimite === -1) {
							dailyBudget = -1;
						} else {
							dailyBudget = floatMul(+this.campaignData.dailyBudget, 100);
						}
					} else if (this.campaignData.biddingMode === CONST.BIDDING_MODE.PD) {
						dailyBudget = floatMul(+this.campaignData.dailyBudget, 100);
					} else {
						dailyBudget = -1;
					}
					let saveData = {
						name: this.campaignData.name,
						groupId: this.campaignData.groupId,
						startTime: moment(this.campaignData.startTime).startOf('day').valueOf(),
						endTime: this.campaignData.isUnlimited === 0 ? moment(this.campaignData.endTime).endOf('day').millisecond(0).valueOf() : '',
						isUnlimited: this.campaignData.isUnlimited,
						saleMode: this.campaignData.saleMode,
						biddingMode: this.campaignData.biddingMode,
						amount: this.campaignData.biddingMode === CONST.BIDDING_MODE.PDB ? +this.campaignData.amount : -1,
						price: floatMul(+this.campaignData.price, 100),
						returnPer: this.campaignData.returnPer ? +this.campaignData.returnPer : 0,
						dailyBudget: dailyBudget,
						slotIds: slotIds,
						materialIds: materialIds,
						isLimitedSlot: isLimitedSlot
					};
					if (this.isModify) {
						saveData.campaignId = this.drawerConfig.campaignId;
					}
					Http({
						url: '/api/campaign',
						method: !this.isModify ? 'post' : 'put',
						data: saveData
					}).then(res => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							Event.$emit('put-save-result', {campaignId: res.data.data.campaignId, saleMode: this.campaignData.saleMode, biddingMode: this.campaignData.biddingMode});
						} else {
							this.$message({
								type: 'error',
								message: res.data.msg,
								duration: 3000
							});
						}
					}).catch(err => {
						console.log(err);
					});
				}
			});
		},
		getSlots() {
			if (this.campaignData.slotIds.length === 0) return false;
			Http.get('/api/slots/batch?slotIds=' + this.campaignData.slotIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.campaignData.slots = res.data.data;
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getMaterials() {
			Http.get('/api/materials/batch?materialIds=' + this.campaignData.materialIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let materials = [];
					for (let material of res.data.data) {
						material.images = material.images ? material.images.split(',') : [];
						materials.push(material);
					}
					this.campaignData.materials = materials;
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		biddingModeChange() {
			if (!this.isModify) {
				this.campaignData.amount = '';
				this.campaignData.price = '';
				this.campaignData.dailyBudget = '';
				this.campaignData.dailyBudgetLimite = -1;
				this.campaignData.returnPer = '';
				this.campaignData.slots = [];
				this.campaignData.isUnlimited = 0;
				this.campaignData.materials = [];
			}
		},
		getFormat(formatCategoryId) {
			let formats = [];
			if (formatCategoryId === CONST.FORMAT_CATEGORY.NATIVE) {
				return '原生';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.DOWNLOAD) {
				return '应用下载';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.VIDEO) {
				return '视频';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.IMAGE) {
				return '图片';
			}
			return '';
		},
		getMedia(medias) {
			let mediaMap = new Map();
			for (let media of medias) {
				let key = 'M_' + media.mediaId;
				mediaMap.set(key, media);
			}
			return mediaMap;
		},
		getMediaType(type) {
			if (type === CONST.MEDIA_TYPE.APP) {
				return 'APP';
			} else if (type === CONST.MEDIA_TYPE.WEB) {
				return '网站';
			}
			return '';
		},
		getFormats(slotFormats) {
			let formats = [];
			for (let format of slotFormats) {
				if (format.formatCategoryId === CONST.FORMAT_CATEGORY.NATIVE && !formats.includes('原生')) {
					formats.push('原生');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.DOWNLOAD && !formats.includes('应用下载')) {
					formats.push('应用下载');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.VIDEO && !formats.includes('视频')) {
					formats.push('视频');
				} else if (format.formatCategoryId === CONST.FORMAT_CATEGORY.IMAGE && !formats.includes('图片')) {
					formats.push('图片');
				}
			}
			return formats.join('<br/>');
		},
	}
};
</script>
<style>
	.icon-delete {
		cursor: pointer;
	}
</style>