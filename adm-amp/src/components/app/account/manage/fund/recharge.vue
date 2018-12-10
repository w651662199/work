<template>
	<div class="page-content">
		<p class="page-title">充值</p>
		<div class="content simple-content money-cont">
			<el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
				<el-form-item label="充值金额：" class="is-required">
					<el-button class="w120" :class="{'actived': formData.type == 5000}" plain @click="changeRechargeType(5000)">5000</el-button>
					<el-button class="w120" :class="{'actived': formData.type == 8000}" plain @click="changeRechargeType(8000)">8000</el-button>
					<el-button class="w120" :class="{'actived': formData.type == 10000}" plain @click="changeRechargeType(10000)">10000</el-button>
					<el-button class="w120" :class="{'actived': formData.type == 20000}" plain @click="changeRechargeType(20000)">20000</el-button>
					<el-button class="w120" :class="{'actived': formData.type == 50000}" plain @click="changeRechargeType(50000)">50000</el-button>
					<el-button class="w120" :class="{'actived': formData.type == 0}" plain @click="changeRechargeType(0)">其他金额</el-button>
				</el-form-item>
				<el-form-item label="其他金额" prop="money" v-show="formData.type == 0" class="money-other" style="margin-left: 100px;" label-width="70px">
					<el-input class="w290" v-model="formData.money" style="display: inline-block;"></el-input>
					<span class="form-text">元</span>
				</el-form-item>
				<el-form-item label="充值方式：" prop="chargeType">
					<el-button :class="{'actived': formData.chargeType == 1}">网银充值</el-button>
				</el-form-item>
				<el-form-item label="支付方式：">
					<span>银联</span>
				</el-form-item>
			</el-form>
			<div class="page-footer">
				<a v-if="url != 'javascript:void(0)'" :href="url" class="btn btn-primary w120" @click="rechargeHandler" target="_blank">充值</a>
				<button v-if="url == 'javascript:void(0)'" class="btn btn-primary w120" @click="rechargeHandler" target="_blank">充值</button>
			</div>
		</div>
		<transition name="fade" v-if="isDoRecharge">
			<div class="master" style="z-index: 1300;">
				<div class="dialog-pop">
					<div class="pop-header"><span class="header-text">提示</span><span class="header-close" @click="closeDialog"><em class="icon icon-close"></em></span></div>
					<div class="pop-body">
						<div class="body-infor">
							<h3>请您在新打开的页面上完成充值。</h3>
							<p>充值完成后，根据您的情况点击下面按钮。</p>
						</div>
					</div>
					<div class="pop-footer"><span class="btn btn-primary" @click="rechargeSuccess">充值成功</span><span class="btn btn-simple" @click="rechargeFail">充值失败</span></div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import router from '../../../../../route.js';
export default {
	name: 'AccountFundRecharge',
	data(){
		return {
			formData: {
				type: 0,
				chargeType: 1,
				money: 0
			},
			rules: {
				money: [{
					validator: (rule, value, callback) => {
						if (this.formData.type == 0) {
							if (this.formData.money == '' || this.formData.money == 0) {
								callback(new Error('请输入充值金额'));
							} else if (/[a-zA-Z]/g.test(this.formData.money)) {
								callback(new Error('请输入有效的充值金额'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			},
			isDoRecharge:false
		};
	},
	computed: {
		url() {
		    let am = this.formData.type == 0 ? this.formData.money : this.formData.type;
		    return +am > 0 && !/[a-zA-Z]/g.test(am) ? '/api/cashier/charge?payMoney=' + am : 'javascript:void(0)';
		}
	},
	methods: {
		rechargeHandler() {
			if (this.url != 'javascript:void(0)') {
				this.isDoRecharge = true;
			} else {
				this.$refs['ruleForm'].validate((result) => {});
			}
		},
		closeDialog() {
			this.isDoRecharge = false;
		},
		rechargeSuccess() {
			router.push({name: 'detail', params: {type: 2}});
		},
		rechargeFail(){
			this.isDoRecharge = false;
		},
		changeRechargeType(type) {
			if (this.formData.type != type) {
				this.formData.type = type;
				this.formData.money = 0;
			}
		}
	}
}
</script>