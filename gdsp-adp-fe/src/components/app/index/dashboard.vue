<template>
	<div class="index-statis">
		<p class="error-message pdb-10" v-if="isShowCashMsg">当前账户余额不足，请及时充值以免影响广告投放！</p>
		<ul class="index-item-con">
			<li>
				<div class="statis-title"><span>账户余额</span></div>
				<div class="statis-cont">
					<p style="float:left;width:50%;"><span>¥</span>{{formatAmount(dashboardData.balance)}}元</p>
					<div class="statis-action" style="float:left;width:50%;">
						<button class="btn btn-blue" type="button" @click="showCharge">充值</button>
					</div>
				</div>
			</li>
			<li>
				<div class="statis-title"></em><span>今日消耗</span></div>
				<div class="statis-cont">
					<p><span>¥</span>{{formatAmount(dashboardData.todayExpense)}}元</p>
				</div>
			</li>
		</ul>
		<el-dialog v-model="dialogData.dialogVisible" size="tiny">
			<el-form :model="chargeForm" ref="chargeForm" :rules="formRules">
				<p v-if="!isChargeSuccess"class="mgb-10">请输入充值金额</p>
				<p v-if="isChargeSuccess">恭喜，充值成功！</p>
				<el-form-item v-if="!isChargeSuccess" label="" prop="payMoney" label-width="0px">
					<el-input v-model="chargeForm.payMoney" style="display:inline-block;width:300px;"></el-input>元
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button v-if="!isChargeSuccess" @click="closeDialog">取 消</el-button>
				<el-button v-if="isChargeSuccess" type="primary" @click="closeDialog">关闭</el-button>
				<el-button v-if="!isChargeSuccess" type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'utils/http';
import Event from 'event';
import {mixin, floatMul} from 'utils/common.js';
export default {
	name: 'index-dashboard',
	data(){
		return {
			isShowCashMsg: false,
			isChargeSuccess: false,
			dashboardData: {
				balance: '',
				todayExpense: 0
			},
			dialogData: {
				dialogVisible: false,
				sureHandler: ''
			},
			chargeForm: {
				payMoney: ''
			},
			formRules: {
				payMoney: [{
					required: true,
					validator: (rule, value, callback) => {
						let reg = new RegExp("^\\d+(\\.\\d+)?$");
						if (value.trim() === '') {
							callback(new Error('请输入充值金额'));
						} else if (!reg.test(value) && value.length > 0) {
							callback(new Error('充值金额只能为数字'));
						} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : 0) {
							callback(new Error('只能二位小数'));
						} else if (+value === 0) {
							callback(new Error('充值金额必须大于0'));
						} else if (+value > 100000000) {
							callback(new Error('充值金额最大不能超过1亿元'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			},
		};
	},
	created() {
		this.loadDashData();
	},
	methods: {
		showCharge() {
			this.dialogData.dialogVisible = true;
		},
		closeDialog() {
			this.dialogData.dialogVisible = false;
			this.isChargeSuccess = false;
			this.chargeForm.payMoney = '';
		},
		loadDashData() {
			Http.get('/api/report/finance').then((response) => {
				let data = response.data;
				if(response.status === 200 && response.data.code === 200){
					this.dashboardData = mixin(this.dashboardData, data.data);
					this.isShowCashMsg = this.dashboardData.balance < 20000;
				} else if (response.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(function(error) {
				console.log(error);
			});
		},
		formatAmount(amount) {
			let aNum = floatMul(amount, 0.01);
			aNum += 0.0001;
			let nStr = aNum + '';
			let dotIndex = nStr.indexOf('.');
			let last = Number(nStr.substring(dotIndex + 3, dotIndex + 4));
			if (last >= 1) {
				aNum += 0.01;
			}
			nStr = aNum + '';
			return nStr.substring(0, dotIndex + 3);
		},
		save() {
			this.$refs['chargeForm'].validate(valid => {
				if (valid) {
					let payMoney = floatMul(+this.chargeForm.payMoney, 100);
					Http.post('/api/charge', {
						payMoney: payMoney
					}).then(res => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							this.dashboardData.balance += payMoney;
							this.isChargeSuccess = true;
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
		}
	}
};
</script>
