<template>
	<div class="page-content">
		<p class="page-title">划拨虚拟金</p>
		<div class="route-tab" style="margin: 0 35px;">
			<div class="tab-list">
				<div class="tab-item" @click="changeTab(1)"><span :class="{'active': !isTransToLine}">总账户转帐到产品线</span></div>
				<div class="tab-item" @click="changeTab(2)"><span :class="{'active': isTransToLine}">产品线转帐到总账户</span></div>
			</div>
		</div>
		<div class="transfer-con">
			<div class="tansfer-content">
				<div class="transfer-tab" v-if="!isTransToLine">
					<h3 :class="{'normal-text mgt': totalVirtualBalance === 0, 'noback': totalVirtualBalance != 0}">总账户虚拟金余额: <span>{{totalVirtualBalance | currency('', 2)}}元</span><template v-if="totalVirtualBalance === 0"><br>暂时无法转账</template></h3>
					<div class="content">
						<el-form :model="outFormData" ref="outFormData" label-width="0px">
							<div class="transfer-section" v-for="(item, vIndex) in outFormData.virtualList" v-if="item.balance > 0">
								<div class="transfer-item">
									<div>
										<p class="transfer-type">总账户的该批余额</p>
										<p class="transfer-text-main"><span>¥</span>{{item.balance | currency('', 2)}}</p>
										<p class="tranfer-text mgb">
											<span class="warn-msg" v-if="getWarnMsg(item) != ''">{{getWarnMsg(item)}}</span>
											<span v-if="getWarnMsg(item) == ''">&nbsp;</span>
										</p>
										<p class="transfer-type normal-text">{{getVirtualType(item.virtualType)}}</p>
										<p class="tranfer-text">开始日期：{{item.validStartDate | moment('YYYY年MM月DD日')}}</p>
										<p class="tranfer-text">到期日期：{{item.validEndDate | moment('YYYY年MM月DD日')}}</p>
									</div>
								</div>
								<div class="transfer-item transfer-space">
									<p><em class="icon icon-larrow-right"></em></p>
								</div>
								<div class="transfer-item" v-for="(lineItem, lIndex) in item.lineList">
									<div>
										<p class="transfer-type">{{lineItem.productLine === 2 ? '转账到国美众达的广告账户' : '转账到国美点效的广告账户'}}</p>
										<div class="transfer-mesg">
											<span>转账：</span>
											<el-form-item
												:key="'outLine' + lIndex"
												:prop="'virtualList.' + vIndex + '.lineList.' + lIndex + '.amount'"
												:rules="rules.out"
												label-width="0"
												style="display:inline-block;width:150px;text-align:left;">
												<el-input v-model="lineItem.amount" style="display:inline-block;vertical-align:middle;width:100px;"></el-input>
												<span>&nbsp;元</span>
											</el-form-item>
										</div>
										<p class="tranfer-text text-center">该批虚拟金在产品线</p>
										<p class="tranfer-text text-center">余额{{lineItem.balance | currency('', 2)}}元</p>
									</div>
								</div>
							</div>
						</el-form>
					</div>
				</div>
				<div class="transfer-tab" v-if="isTransToLine">
					<el-form :model="inFormData" ref="inFormData" label-width="0px">
						<template v-for="productLine in productLineData">
							<h3 class="noback normal-color">从国美{{productLine.productLineName}}转账到总账户</h3>
							<div class="content">
								<h3 :class="{'normal-text': productLine.balance === 0, 'noback': productLine.balance != 0}" v-if="productLine.balance === 0">产品线虚拟金余额: <span>0.00元</span><br>暂时无法转账</h3>
								<div class="transfer-section" v-for="(item, index) in inFormData.virtualList" v-if="item.productLine === productLine.productLineId && item.balance > 0 && productLine.balance > 0">
									<div class="transfer-item">
										<div>
											<p class="transfer-type">产品线余额</p>
											<p class="transfer-text-main"><span>¥</span>{{item.balance | currency('', 2)}}</p>
											<p class="tranfer-text mgb">
												<span class="warn-msg" v-if="getWarnMsg(item) != ''">{{getWarnMsg(item)}}</span>
												<span v-if="getWarnMsg(item) == ''">&nbsp;</span>
											</p>
											<p class="transfer-type normal-text">{{getVirtualType(item.virtualType)}}</p>
											<p class="tranfer-text">开始日期：{{item.validStartDate | moment('YYYY年MM月DD日')}}</p>
											<p class="tranfer-text">到期日期：{{item.validEndDate | moment('YYYY年MM月DD日')}}</p>
										</div>
									</div>
									<div class="transfer-item transfer-space">
										<p><em class="icon icon-larrow-right"></em></p>
									</div>
									<div class="transfer-item transfer-item-big">
										<div>
											<p class="transfer-type">转账到总账户</p>
											<div class="transfer-mesg">
												<el-form-item
													:key="'in' + index"
													:prop="'virtualList.' + index + '.amount'"
													:rules="rules.in"
													label-width="0"
													style="display:inline-block;width:150px;text-align:left;">
													<el-input v-model="item.amount" style="display:inline-block;vertical-align:middle;width:100px;"></el-input>
													<span>&nbsp;元</span>
												</el-form-item>
											</div>
											<p class="tranfer-text mgt">该批虚拟金在总账户的余额：{{item.virtualBalance | currency('', 2)}} 元</p>
										</div>
									</div>
								</div>
							</div>
						</template>
						<h3 class="back" style="padding-top: 30px;">总账户虚拟金余额: {{totalVirtualBalance | currency('', 2)}}元</h3>
					</el-form>
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
import store from 'store';
import Http from 'http';
import router from '../../../../../route.js';
import {copyObj, floatMul} from 'utils/common.js';
import Dialog from '../../../../common/dialogNew.vue';
import CONST from 'help/CONST.js';
import moment from 'moment';
export default {
	name: 'AccountTransferVirtual',
	data() {
		return {
			dialogData: {
				isShowDialog: false,
				title: '提示',
			},
			isTransToLine: false,
			balance: '',
			totalVirtualBalance: 0,
			outFormData: {
				virtualList: []
			},
			inFormData: {
				virtualList: []
			},
			virtualLineList: [],
			productLineData: [],
			productLines: [],
			virtualLineObj: {
				plineAccountId: null,
				masterAccountId: '',
				productLine: '',
				balance: 0,
				amount: '',
				validStartDate: '',
				validEndDate: ''
			},
			rules: {
				out: [{
					validator: (rule, value, callback) => {
						let vListIndex = Number(rule.field.split('.')[1]);
						let vAccount = this.outFormData.virtualList[vListIndex];
						let reg = new RegExp("^\\d+(\\.\\d+)?$");
						if (value == '' && !this.isOutAmountInput) {
							callback(new Error('请输入金额'));
						} else if (value.length > 0 && value < 0.01) {
							callback(new Error('转账金额最小为0.01元'));
						} else if (value.length > 0 && !reg.test(value)) {
							callback(new Error('请输入有效的金额'));
						} else if (this.totalInputAmount(vListIndex) > vAccount.balance) {
							callback(new Error('输入的金额超过了可用余额'));
						} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
							callback(new Error('最多只能输入两位小数'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				in: [{
					validator: (rule, value, callback) => {
						let index = Number(rule.field.split('.')[1]);
						let vLineAccount = this.inFormData.virtualList[index];
						let reg = new RegExp("^\\d+(\\.\\d+)?$");
						if (value == '' && !this.isInAmountInput) {
							callback(new Error('请输入金额'));
						} else if (value.length > 0 && value < 0.01) {
							callback(new Error('转账金额最小为0.01元'));
						} else if (value.length > 0 && !reg.test(value)) {
							callback(new Error('请输入有效的金额'));
						} else if (value * 100 > vLineAccount.balance) {
							callback(new Error('输入的金额超过了可用余额'));
						} else if (/\.(.*)/.test(value.toString()) ? value.toString().match(/\.(.*)/)[1].length > 2 : false) {
							callback(new Error('最多只能输入两位小数'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			}
		}
	},
	computed: {
		pLines: () => store.state.productLines,
		isOutAmountInput() { //判断所有账户是否已经有输入过的（转出时）
			let isInput = false;
			for (let i = 0; i < this.outFormData.virtualList.length; i++) {
				let account = this.outFormData.virtualList[i];
				for (let j = 0; j < account.lineList.length; j++) {
					let lineAccount = account.lineList[j];
					if (lineAccount.amount) {
						isInput = true;
						return isInput;
					}
				}
			}
			return isInput;
		},
		isInAmountInput() { //判断所有账户是否已经有输入过的（转入时）
			let isInput = false;
			for (let i = 0; i < this.inFormData.virtualList.length; i++) {
				let account = this.inFormData.virtualList[i];
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
				for (let i = 0; i < this.productLineData.length; i++) {
					if (this.productLineData[i].balance > 0) {
						disable = false;
						break;
					}
				}
			} else {
				disable = this.totalVirtualBalance === 0;
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
		this.productLines.forEach(line => {
			let temp = copyObj(line);
			this.$set(temp, 'balance', 0);
			this.productLineData.push(temp);
		});
		this.getVirtualBalance();
	},
	methods: {
		showDialog() {
			if (this.isTransToLine) {
				this.$refs.inFormData.validate((result) => {
					if (!result) return false;
					this.dialogData.isShowDialog = true;
				});
			} else {
				this.$refs.outFormData.validate((result) => {
					if (!result) return false;
					this.save();
				});
			}
		},
		getVirtualType(type) {
			if (type === 0) return '通用';
			let text = '仅适用于国美';
			this.productLines.forEach(line => {
				if (line.productLineId === type) {
					text += line.productLineName;
				}
			});
			return text;
		},
		totalInputAmount(index) {
			let account = this.outFormData.virtualList[index];
			let total = 0;
			account.lineList.forEach(lineItem => {
				total += Number(lineItem.amount);
			});
			return floatMul(total, 100);
		},
		changeTab(tabIndex) {
			this.isTransToLine = tabIndex === 2;
		},
		getVirtualBalance() {
			Http.get('/api/account/virtual/balance').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.totalVirtualBalance = res.data.data.virtualBalance;
					this.outFormData.virtualList = res.data.data.virtualMasterAccounts;
					this.virtualLineList = res.data.data.virtualPlineAccounts;
					this.initTransferOutList();
					this.initTransferInList();
					this.initProductLineData();
				}
			});
		},
		initTransferOutList() {
			this.outFormData.virtualList.forEach((item) => {
				this.$set(item, 'lineList', []);
				this.productLines.forEach((productLine) => {
					let lineItem = this.virtualLineList.find((lineItem) => {
						return lineItem.productLine === productLine.productLineId && item.masterAccountId === lineItem.masterAccountId;
					});
					let tempLineObj;
					if (lineItem) {
						tempLineObj = copyObj(lineItem);
					} else if (item.virtualType === 0 || item.virtualType === productLine.productLineId) {
						tempLineObj = copyObj(this.virtualLineObj);
						tempLineObj.productLine = productLine.productLineId;
					}
					if (tempLineObj) {
						this.$set(tempLineObj, 'amount', '');
						item.lineList.push(tempLineObj);
					}
				})
			});
		},
		initTransferInList() {
			this.virtualLineList.forEach((lineItem) => {
				let virtualItem = this.outFormData.virtualList.find(item => {
					return item.masterAccountId === lineItem.masterAccountId;
				});
				let tempLineObj = copyObj(lineItem);
				this.$set(tempLineObj, 'amount', '');
				this.$set(tempLineObj, 'virtualBalance', virtualItem.balance);
				this.$set(tempLineObj, 'virtualType', virtualItem.virtualType);
				this.inFormData.virtualList.push(tempLineObj);
			});
		},
		initProductLineData() {
			this.productLineData.forEach(line => {
				this.virtualLineList.forEach(lineAccount => {
					if (line.productLineId === lineAccount.productLine) {
						line.balance += lineAccount.balance;
					}
				});
			});
		},
		save() {
			let data = [];
			let postUrl = '';
			if (this.isTransToLine) {
				postUrl = '/api/pline/account/virtual/transfer';
				this.inFormData.virtualList.forEach(account => {
					if (Number(account.amount) > 0) {
						let postObj = {
							plineAccountId: account.plineAccountId,
							amount: floatMul(account.amount, 100)
						};
						data.push(postObj);
					}
				});
			} else {
				postUrl = '/api/account/virtual/transfer/pline';
				this.outFormData.virtualList.forEach(account => {
					account.lineList.forEach(lineAccount => {
						if (Number(lineAccount.amount) > 0) {
							let postObj = {
								masterAccountId: account.masterAccountId,
								plineAccountId: lineAccount.plineAccountId,
								virtualType: account.virtualType,
								productLine: lineAccount.productLine,
								amount: floatMul(lineAccount.amount, 100)
							};
							data.push(postObj);
						}
					});
				});
			}
			this.postData(postUrl, data);
		},
		postData(postUrl, data) {
			if (data.length === 0) return;
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
		},
		getWarnMsg(virtualItem) {
			let isStart = (moment(virtualItem.validEndDate).isAfter(moment()) || moment(virtualItem.validEndDate).isSame(moment().startOf('day'))) && moment(virtualItem.validStartDate).isBefore(moment());
			let isWillStart = moment(virtualItem.validStartDate).isAfter(moment()) && (moment(virtualItem.validStartDate).subtract(4, 'days').isBefore(moment()) || moment(virtualItem.validStartDate).subtract(4, 'days').isSame(moment().startOf('day')));
			if (isStart) {
				return '即将失效';
			} else if (isWillStart) {
				return '即将开始';
			} else {
				return '';
			}
		}
	}
}
</script>