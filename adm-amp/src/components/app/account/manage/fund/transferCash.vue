<template>
	<div class="page-content">
		<p class="page-title">划拨现金</p>
		<div class="route-tab" style="margin: 0 35px;">
			<div class="tab-list">
				<div class="tab-item" @click="changeTab(1)"><span :class="{'active': !isTransToLine}">总账户转帐到产品线</span></div>
				<div class="tab-item" @click="changeTab(2)"><span :class="{'active': isTransToLine}">产品线转帐到总账户</span></div>
			</div>
		</div>
		<div class="transfer-con">
			<div class="tansfer-content">
				<div class="transfer-tab" v-if="!isTransToLine">
					<h3>总账户现金余额：<span>{{cashBalance | currency('', 2)}}元</span></h3>
					<div class="transfer-section">
						<div class="content">
							<el-form :model="outFormData" ref="outFormData" label-width="0px">
								<div class="transfer-item transfer-item-h" v-for="productLine in productLines">
									<template v-for="(account, index) in outFormData.cashPlineAccounts">
										<div v-if="account.productLine === productLine.productLineId" :class="{'border': account.amountType === 2}">
											<p class="transfer-type over-margin" v-if="account.amountType === 1">转账到国美{{productLine.productLineName}}</p>
											<p class="tranfer-text mgt normal">{{account.amountType === 1 ? '广告' : '返利'}}账户余额<span>￥{{account.balance | currency('', 2)}}元</span></p>
											<div class="transfer-mesg no-margin">
												<span>转账</span>
												<el-form-item
													:key="'out' + index"
													:prop="'cashPlineAccounts.' + index + '.amount'"
													:rules="rules.out"
													label-width="0"
													style="display:inline-block;width: 150px;">
													<el-input v-model="account.amount" :disabled="cashBalance <= 0" style="display:inline-block;vertical-align:middle;"></el-input>
												</el-form-item>
												<span>元</span>
											</div>
										</div>
									</template>
								</div>
							</el-form>
						</div>
					</div>
				</div>
				<div class="transfer-tab" v-if="isTransToLine">
					<h3>总账户现金余额：<span>{{cashBalance | currency('', 2)}}元</span></h3>
					<div class="transfer-section">
						<div class="content">
							<el-form :model="inFormData" ref="inFormData" label-width="0px">
								<div class="transfer-item transfer-item-h" v-for="productLine in productLines">
									<template v-for="(account, index) in inFormData.cashPlineAccounts">
										<div v-if="account.productLine === productLine.productLineId" :class="{'border': account.amountType === 2}">
											<p class="transfer-type over-margin" v-if="account.amountType === 1">从国美{{productLine.productLineName}}转账到总账户</p>
											<p class="tranfer-text mgt normal">{{account.amountType === 1 ? '广告' : '返利'}}账户余额<span>￥{{account.balance | currency('', 2)}}元</span></p>
											<div class="transfer-mesg no-margin">
												<span>转账</span>
												<el-form-item
													:key="'in' + index"
													:prop="'cashPlineAccounts.' + index + '.amount'"
													:rules="rules.in"
													label-width="0"
													style="display:inline-block;width: 150px;">
													<el-input v-model="account.amount" :disabled="account.balance <= 0" style="display:inline-block;vertical-align:middle;"></el-input>
												</el-form-item>
												<span>元</span>
											</div>
										</div>
									</template>
								</div>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="page-footer form-footer" style="margin: 0 30px;">
			<a class="btn btn-primary w120" href="javascript:void(0)" v-if="!isSureDisable" @click.prevent="showDialog">确定</a>
			<a class="btn btn-gray disabled w120" v-if="isSureDisable" href="javascript:void(0)">确定</a>
		</div>
		<m-dialog v-model="dialogData.isShowDialog" :title="dialogData.title" @sure="save">
			<p style="height: 100%;line-height: 200px;text-align:center;">预计将在20分钟到账，金额以实际到账金额为准。</p>
		</m-dialog>
	</div>
</template>
<script>
import Http from 'http';
import store from 'store';
import {mixin, floatMul} from 'utils/common.js';
import router from '../../../../../route.js';
import Dialog from '../../../../common/dialogNew.vue';
import CONST from 'help/CONST.js';
export default {
	name: 'AccountTransferCash',
	data() {
		return {
			dialogData: {
				isShowDialog: false,
				title: '提示',
			},
			isTransToLine: false, //false：从产品线划拨到总账户，true：从总账户划拨到产品线
			balance: '',
			formData: {},
			cashBalance: '',
			outFormData: { //因为el-form的model只接收对象，不接收数组，所以包装一层
				cashPlineAccounts: []
			},
			inFormData: {
				cashPlineAccounts: []
			},
			productLines: [],
			rules: {
				out: [{
					validator: (rule, value, callback) => {
						if (this.cashBalance > 0) {
							let index = Number(rule.field.split('.')[1]);
							// let amount = this.outFormData.cashPlineAccounts[index].amount;
							let reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value == '' && !this.isOutAmountInput) {
								callback(new Error('请输入金额'));
							} else if (value.length > 0 && value < 0.01) {
								callback(new Error('转账金额最小为0.01元'));
							} else if (value.length > 0 && !reg.test(value)) {
								callback(new Error('请输入有效的金额'));
							} else if (this.outTotalAmount > this.cashBalance) {
								callback(new Error('输入的金额超过了可用余额'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
								callback(new Error('最多只能输入两位小数'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				in: [{
					validator: (rule, value, callback) => {
						let index = Number(rule.field.split('.')[1]);
						let account = this.inFormData.cashPlineAccounts[index];
						if (account.balance > 0) {
							let reg = new RegExp("^\\d+(\\.\\d+)?$");
							if (value == '' && !this.isInAmountInput) {
								callback(new Error('请输入金额'));
							} else if (value.length > 0 && value < 0.01) {
								callback(new Error('转账金额最小为0.01元'));
							} else if (value.length > 0 && !reg.test(value)) {
								callback(new Error('请输入有效的金额'));
							} else if (value * 100 > account.balance) {
								callback(new Error('输入的金额超过了可用余额'));
							} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
								callback(new Error('最多只能输入两位小数'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			}
		};
	},
	computed: {
		pLines: () => store.state.productLines,
		outTotalAmount() {
			let amount = 0;
			this.outFormData.cashPlineAccounts.forEach(account => {
				let aAmount = +account.amount;
				amount += aAmount;
			});
			return floatMul(amount, 100);
		},
		isOutAmountInput() { //判断所有账户是否已经有输入过的（转出时）
			let isInput = false;
			for (let i = 0; i < this.outFormData.cashPlineAccounts.length; i++) {
				let account = this.outFormData.cashPlineAccounts[i];
				if (account.amount) {
					isInput = true;
					break;
				}
			}
			return isInput;
		},
		isInAmountInput() { //判断所有账户是否已经有输入过的（转入时）
			let isInput = false;
			for (let i = 0; i < this.inFormData.cashPlineAccounts.length; i++) {
				let account = this.inFormData.cashPlineAccounts[i];
				if (account.amount) {
					isInput = true;
					break;
				}
			}
			return isInput;
		},
		isSureDisable() {//确定按钮是否禁用
			let disable = true; //默认禁用
			if (this.isTransToLine) {
				for (let i = 0; i < this.inFormData.cashPlineAccounts.length; i++) {
					if (this.inFormData.cashPlineAccounts[i].balance > 0) {
						disable = false;
						break;
					}
				}
			} else {
				disable = this.cashBalance === 0;
			}
			return disable;
		}
	},
	components: {
		'm-dialog': Dialog
	},
	created() {
		this.productLines = this.pLines;
		if (this.productLines.length == 0) {
			this.productLines = CONST.PRODUCT_LINES;
		}
		this.getBalance();
	},
	methods: {
		showDialog() {
			let tab = this.isTransToLine ? 'inFormData' : 'outFormData';
			this.$refs[tab].validate((result) => {
				if (!result) return false;
				if (this.isTransToLine) {
					this.dialogData.isShowDialog = true;
				} else {
					this.save();
				}
			});
		},
		changeTab(tabIndex) {
			this.isTransToLine = tabIndex === 2;
		},
		getBalance() {
			Http.get('/api/account/cash/balance').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.cashBalance = res.data.data.balance;
					let accounts = res.data.data.cashPlineAccounts;
					if (accounts && accounts.length > 0) {
						accounts.forEach((account) => {
							let outObj = Object.assign({}, account);
							let inObj = Object.assign({}, account);
							this.$set(outObj, 'amount', '');
							this.$set(inObj, 'amount', '');
							this.outFormData.cashPlineAccounts.push(outObj);
							this.inFormData.cashPlineAccounts.push(inObj);
						});
					}
				}
			});
		},
		save() {
			let tab = this.isTransToLine ? 'inFormData' : 'outFormData';
			let postUrl = this.isTransToLine ? '/api/pline/account/cash/transfer' : '/api/account/cash/transfer/pline';
			let data = [];
			this[tab].cashPlineAccounts.forEach(account => {
				if (Number(account.amount) > 0) {
					let postObj = {
						plineAccountId: account.plineAccountId,
						amount: floatMul(account.amount, 100)
					};
					data.push(postObj);
				}
			});
			Http.post(postUrl, {transferDatas: data}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					router.push({name: 'detail', params: {type: 3}});
				} else {
					this.$message({
						message: '操作失败，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}
}
</script>