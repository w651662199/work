<template>
	<div class="page-content">
		<div class="page-title show-menu">余额提醒</div>
		<div class="content normal-font">
			<el-form :model="balanceForm" :rules="rules" ref="balanceForm" label-width="0px">
				<p class="form-item-title">账户现金余额</p>
				<el-form-item prop="isBalanceOpened">
					<el-radio-group v-model="balanceForm.isOpen">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">关闭</el-radio>
					</el-radio-group>
				</el-form-item>
				<p class="form-item-title mgtb">提醒金额</p>
				<el-form-item prop="remindAmount" label-width="100px" class="is-required" label="当账户少于">
					<el-input v-model="balanceForm.remindAmount" :disabled="!balanceForm.isOpen"></el-input>
					<span>元时提醒我</span>
				</el-form-item>
				<p class="form-item-title sub-title" style="padding-top: 40px;">通知方式</p>
				<el-row>
					<el-col :span="2" style="margin-right: 20px;">
						<el-form-item prop="isSms">
							<el-checkbox v-model="balanceForm.isSms">手机短信</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="mobile">
							<el-input v-model="balanceForm.mobile" :disabled="!balanceForm.isSms"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="2" style="margin-right: 20px;">
						<el-form-item prop="isEmail">
							<el-checkbox v-model="balanceForm.isEmail">电子邮件</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="email">
							<el-input v-model="balanceForm.email" :disabled="!balanceForm.isEmail"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="page-footer">
				<a href="" class="btn btn-primary w120" @click.prevent="onSubmit">提交</a>
			</div>
		</div>
	</div>
</template>
<script>
import { ERRORMESSAGE} from 'help/textMessage';
import Http from 'utils/http';
export default {
	name: 'AccountBalance',
	data() {
		return {
			balanceForm: {
				isOpen: 1,
				remindAmount: 0,
				mobile: '',
				email: '',
				isSms: false,
				isEmail: false
			},
			rules: {
			    remindAmount: [{
			    	validator: (rule, value, callback) => {
				    	if (this.balanceForm.isOpen && (!value || value == '')) {
				    		callback(new Error('请输入提醒金额'));
				    	} else if (/[^\d^\.]+/g.test(value)) {
				    		callback(new Error('请输入合法的数字'));
				    	} else if (+value > 1000) {
				    		callback(new Error('提醒金额最高不超过1000元'));
				    	} else {
				    		callback();
				    	}
					},
					trigger: 'blur'
				}],
				mobile: [{
					validator: (rule, value, callback) => {
						if (this.balanceForm.isSms) {
							if (!value || value == '') {
								callback(new Error('请输入手机号'));
							} else if(!/^1\d{10}$/g.test(value)) {
								callback(new Error('请输入有效手机号'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				email: [{
					validator: (rule, value, callback) => {
						if (this.balanceForm.isSms) {
							if (!value || value == '') {
								callback(new Error('请输入邮箱'));
							} else if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) {
								callback(new Error('请输入有效邮箱'));
							}else{
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
	created() {
	    this.loadData();
	},
	methods: {
		loadData(){
	        Http.get('/api/account/balance/remind').then((res)=> {
				let data = res.data.data;
				if(res.data.code === 200) {
					this.balanceForm.isOpen = data.isOpen;
					this.balanceForm.remindAmount = data.remindAmount / 100;
					this.balanceForm.isSms = data.isSms == 1;
					this.balanceForm.mobile = data.mobile;
					this.balanceForm.isEmail = data.isEmail == 1;
					this.balanceForm.email = data.email;
				} else if (res.data.code >= 500) {
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
			}).catch((error) => {
				console.log(error);
			});
		},
		onSubmit(){
		    let vm = this;
		    this.$refs.balanceForm.validate(valid => {
		    	if (valid) {
		    		this.doPost();
		    	}
		    });
		},
		doPost(){
			let params = {
				isOpen: this.balanceForm.isOpen,
				remindAmount: +this.balanceForm.remindAmount * 100,
				isSms: this.balanceForm.isSms ? 1 : 0,
				mobile: this.balanceForm.isSms ? this.balanceForm.mobile : '',
				isEmail: this.balanceForm.isEmail ? 1 : 0,
				email: this.balanceForm.isEmail ? this.balanceForm.email : ''
			};
			Http.post('/api/account/balance/remind', params).then((response) => {
				if(response.status === 200 && response.data.code === 200 && response.data.iserror === 0){
					this.showMessage(response.data.msg,'success');
				} else if (response.data.code >= 500) {
					this.showMessage('服务器异常，请稍后再试。', 'error');
				} else {
					this.showMessage('操作失败，请检查网络设置或稍后再试。', 'error');
				}
			}).catch(function(error) {
				console.log(error);
				// vm.showMessage('修改失败，请稍后重试！','error');
			});
		},
		showMessage(message,type){
		    let vm = this;
			vm.$message({
				showClose:true,
				message: message,
				type: type
			});
		}
	}
};
</script>
