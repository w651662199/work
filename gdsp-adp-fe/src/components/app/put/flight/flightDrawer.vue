<template>
	<div class="part-form" style="width: 800px;">
		<div class="form-column">
			<el-form :model="flightData" ref="flightForm" :rules="formRules" label-width="155px">
				<el-form-item label="定向设置：">
					<el-form-item label="地域" prop="regionTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.regionTarget.isLimited" @change="regionLimiteChange">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item  prop="regionTarget.content" :rules="formRules.regionTarget" v-if="flightData.regionTarget.isLimited === 1" style="margin-bottom: 20px;">
						<aui-region v-model="flightData.regionTarget.data" style="width: 100%;"></aui-region>
					</el-form-item>
					<el-form-item label="性别" prop="genderTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.genderTarget.isLimited">
							<el-radio :label="0">不限</el-radio>
							<el-radio label="1">男</el-radio>
							<el-radio label="2">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="年龄" prop="ageTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.ageTarget.isLimited" @change="ageLimiteChange">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">按年龄段</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop="ageTarget" label-width="65px" :rules="formRules.ageTarget" v-if="flightData.ageTarget.isLimited === 1" style="margin-bottom: 20px;">
						<el-checkbox-group v-model="flightData.ageTarget.data">
							<el-checkbox label="1">&lt;18</el-checkbox>
							<el-checkbox label="2">18~23</el-checkbox>
							<el-checkbox label="3">24~30</el-checkbox>
							<el-checkbox label="4">31~40</el-checkbox>
							<el-checkbox label="5">41~49</el-checkbox>
							<el-checkbox label="6">50+</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="操作系统" prop="osTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.osTarget.isLimited">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="CONST.OS.ANDROID">android</el-radio>
							<el-radio :label="CONST.OS.IOS">IOS</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="网络" prop="netTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.netTarget.isLimited" @change="netLimiteChange">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop="netTarget" :rules="formRules.netTarget" label-width="65px" v-if="flightData.netTarget.isLimited === 1" style="margin-bottom: 20px;">
						<el-checkbox-group v-model="flightData.netTarget.data">
							<el-checkbox :label="CONST.NET.WIFI">WIFI</el-checkbox>
							<el-checkbox :label="CONST.NET.G4">4G</el-checkbox>
							<el-checkbox :label="CONST.NET.G3">3G</el-checkbox>
							<el-checkbox :label="CONST.NET.G2">2G</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="人群" prop="crowdTarget.isLimited" label-width="80px">
						<el-radio-group v-model="flightData.crowdTarget.isLimited" @change="crowdLimiteChange">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
						<button class="btn btn-blue-simple mgl-10" v-if="flightData.crowdTarget.isLimited === 1" type="button" @click.prevent="showCrowdDrawer">添加人群</button>
					</el-form-item>
					<el-form-item prop="crowdTarget" :rules="formRules.crowdTarget" v-if="flightData.crowdTarget.isLimited === 1">
						<span class="form-text">已选择{{crowds.length}}个</span>
						<div class="detail-row" v-if="crowds.length > 0">
							<table class="table">
								<tbody>
									<tr>
										<th class="w140"><span>人群名称</span></th>
										<th class="w80"><span>操作</span></th>
									</tr>
									<tr v-for="(item, index) in crowds">
										<td><span><i class="ellipsis">{{item.name}}</i></span></td>
										<td><span><em class="icon icon-delete" @click="removeCrowd(index)"></em></span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</el-form-item>
				</el-form-item>
				<el-form-item label="单元定价：" prop="price" class="is-required" v-if="putConfig.saleMode === CONST.SALE_MODE.FIX_CPM">
					<span>{{flightData.price}}元/CPM</span>
				</el-form-item>
				<el-form-item label="单元出价：" prop="bid" class="is-required" v-if="putConfig.saleMode === CONST.SALE_MODE.BID_CPM">
					<el-input v-model="flightData.bid" style="display: inline-block;"></el-input>元/CPM
				</el-form-item>
				<el-form-item label="每日曝光限制：" v-if="putConfig.biddingMode !== CONST.BIDDING_MODE.PDB">
					<el-row>
						<el-col :span="6">
							<el-radio-group v-model="flightData.isImpressionLimited">
								<el-radio :label="-1">不限</el-radio>
								<el-radio :label="1">自定义</el-radio>
							</el-radio-group>
						</el-col>
						<el-col :span="8">
							<el-form-item v-if="flightData.isImpressionLimited === 1" prop="impressionLimited">
								<el-input v-model="flightData.impressionLimited" style="display: inline-block;"></el-input>CPM
							</el-form-item>
						</el-col>
					</el-row>
					<br/>
				</el-form-item>
				<el-form-item prop="isSmooth" v-if="flightData.isImpressionLimited === 1">
					<el-checkbox v-model="flightData.isSmooth" style="margin-left: 0;">匀速投放</el-checkbox>
				</el-form-item>
				<el-form-item label="推广单元名称：" prop="name" class="is-required">
					<el-input v-model="flightData.name" style="width: 300px;" placeholder="请输入单元名称"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<transition name="drawer">
			<crowd-drawer key="addCrowd" v-if="isShowCrowdDrawer" :crowds="crowds"></crowd-drawer>
		</transition>
	</div>
</template>
<script>
import {mixin, floatMul} from 'utils/common';
import CONST from 'help/CONST.js';
import Event from 'event';
import store from 'store';
import Http from 'http';
import AuiRegion from '../../../common/aui-region/';
import CrowdDrawer from './addCrowdDrawer.vue';
export default {
	name: 'flightDrawer',
	data() {
		return {
			CONST: CONST,
			flightData: {
				campaignId: '',
				name: '',
				isImpressionLimited: -1,
				impressionLimited: '',
				isSmooth: false,
				bid: '',
				price: '',
				regionTarget: {
					isLimited: 0,
					data: []
				},
				genderTarget: {
					isLimited: 0,
					data: []
				},
				ageTarget: {
					isLimited: 0,
					data: []
				},
				osTarget: {
					isLimited: 0,
					data: []
				},
				netTarget: {
					isLimited: 0,
					data: []
				},
				crowdTarget: {
					isLimited: 0,
					data: []
				},
				crowdType: 0,
				crowd: [],
			},
			formRules: {
				regionTarget: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.flightData.regionTarget.isLimited === 1) {
							if (this.flightData.regionTarget.data.length === 0) {
								callback(new Error('请选择定向区域'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				ageTarget: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.flightData.ageTarget.isLimited === 1) {
							if (this.flightData.ageTarget.data.length === 0) {
								callback(new Error('请选择定向年龄段'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				netTarget: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.flightData.netTarget.isLimited === 1) {
							if (this.flightData.netTarget.data.length === 0) {
								callback(new Error('请选择定向网络类型'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				crowdTarget: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.flightData.crowdTarget.isLimited === 1) {
							if (this.crowds.length === 0) {
								callback(new Error('请选择定向人群'));
							} else if (this.crowds.length > 5) {
								callback(new Error('最多只能添加5个人群'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				bid: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.putConfig.saleMode === CONST.SALE_MODE.BID_CPM) {
							let reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value.trim() === '') {
								callback(new Error('请输入单元出价'));
							} else if (!reg.test(value) && value.length > 0) {
								callback(new Error('单元出价只能为数字'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : 0) {
								callback(new Error('只能二位小数'));
							} else {
								callback();
							}
						}else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				impressionLimited: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.flightData.isImpressionLimited === 1) {
							let reg = new RegExp("^\\d+?$");
							if (value.trim() === '') {
								callback(new Error('请输入每日曝光限制'));
							} else if (!reg.test(value) && value.length > 0) {
								callback(new Error('每日曝光限制只能为整数'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('请输入推广单元名称'));
						} else if (value.length > 30) {
							callback(new Error('填写的内容不得超过30个字符'));
						} else {
							/*
							Http.get('/api/flight/exist', {
								hideLoading: true,
								params: {
									name: value,
									campaignId: this.flightData.campaignId
								}
							}).then((res) => {
								if (res.data.code == 200 && res.data.iserror === 0) {
									if (res.data.data.exist == 1) {
										callback(new Error('推广单元名称已存在'));
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
			},
			crowds: [],
			isShowCrowdDrawer: false
		};
	},
	components: {
		AuiRegion,
		CrowdDrawer
	},
	computed: {
		actionType() {
			return store.state.putDrawerCtr.action;
		},
		putConfig() {
			return store.state.putDrawerCtr.config;
		}
	},
	created() {
		this.flightData.campaignId = +this.putConfig.campaignId;
		if (this.actionType === 'modify') {
			this.getFlightData();
		}
		if (this.putConfig.saleMode === CONST.SALE_MODE.FIX_CPM) {
			this.getCampaignPrice();
		}
	},
	mounted() {
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.saveFlight();
		});
		Event.$off('closeCrowdDrawer');
		Event.$on('closeCrowdDrawer', (res) => {
			this.isShowCrowdDrawer = false;
			if (res) {
				this.crowds = res;
			}
		});
	},
	methods: {
		getCampaignPrice() {
			Http.get('/api/campaign?campaignId=' + this.putConfig.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.flightData.price = floatMul(res.data.data.price, 0.01);
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
		getFlightData() {
			Http.get('/api/flight?flightId=' + this.putConfig.flightId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.flightData = mixin(this.flightData, res.data.data);
					this.flightData.isImpressionLimited = this.flightData.impressionLimited === -1 ? -1 : 1;
					this.flightData.impressionLimited = this.flightData.impressionLimited === -1 ? '' : (this.flightData.impressionLimited + '');
					this.flightData.isSmooth = this.flightData.isSmooth === 1;
					this.flightData.bid = floatMul(this.flightData.bid, 0.01) + '';
					if (this.flightData.genderTarget.isLimited !== 0) {
						this.flightData.genderTarget.isLimited = this.flightData.genderTarget.data[0];
					}
					if (this.flightData.osTarget.isLimited !== 0) {
						this.flightData.osTarget.isLimited = this.flightData.osTarget.data[0];
					}
					if (this.flightData.crowdTarget.isLimited === 1) {
						this.getCrowds();
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
		getCrowds() {
			Http.get('/api/crowds/batch?crowdIds=' + this.flightData.crowdTarget.data.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.crowds = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
 		saveFlight() {
			this.$refs['flightForm'].validate(valid => {
				if (valid) {
					let saveData = {
						campaignId: this.flightData.campaignId,
						name: this.flightData.name,
						impressionLimited: this.flightData.isImpressionLimited === -1 ? -1 : +this.flightData.impressionLimited,
						isSmooth: this.flightData.isSmooth ? 1 : 0,
						bid: this.putConfig.biddingMode === CONST.BIDDING_MODE.RTB ? floatMul(+this.flightData.bid, 100) : 0,
						regionTarget: this.flightData.regionTarget,
						ageTarget: this.flightData.ageTarget,
						netTarget: this.flightData.netTarget,
						genderTarget: {
							isLimited: this.flightData.genderTarget.isLimited === 0 ? 0 : 1,
							data: this.flightData.genderTarget.isLimited === 0 ? [] : [this.flightData.genderTarget.isLimited]
						},
						osTarget: {
							isLimited: this.flightData.osTarget.isLimited === 0 ? 0 : 1,
							data: this.flightData.osTarget.isLimited === 0 ? [] : [this.flightData.osTarget.isLimited]
						},
						crowdTarget: {
							isLimited: this.flightData.crowdTarget.isLimited,
							data: this.getCrowdIds()
						}
					};
					Http({
						url: '/api/flight',
						method: this.actionType === 'new' ? 'post' : 'put',
						data: this.actionType === 'new' ? saveData : mixin({flightId: this.putConfig.flightId}, saveData)
					}).then(res => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							let params = mixin({isError: false, campaignId: this.putConfig.campaignId}, res.data.data);
							Event.$emit('put-save-result', params);
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
		getCrowdIds() {
			let ids = [];
			for (let crowd of this.crowds) {
				ids.push(crowd.crowdId);
			}
			return ids;
		},
		regionLimiteChange() {
			if (this.flightData.regionTarget.isLimited === 0) {
				this.flightData.regionTarget.data = [];
			}
		},
		ageLimiteChange() {
			if (this.flightData.ageTarget.isLimited === 0) {
				this.flightData.ageTarget.data = [];
			}
		},
		netLimiteChange() {
			if (this.flightData.netTarget.isLimited === 0) {
				this.flightData.netTarget.data = [];
			}
		},
		showCrowdDrawer() {
			this.isShowCrowdDrawer = true;
		},
		crowdLimiteChange() {
			if (this.flightData.netTarget.isLimited === 0) {
				this.crowds = [];
			}
		},
		removeCrowd(index) {
			this.crowds.splice(index, 1);
		}
	}
};
</script>