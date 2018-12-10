<template>
	<div class="page-content">
		<div class="page-title show-menu">联系方式</div>
		<div class="content">
			<template v-show="isLoadingFinish">
				<el-form :model="user" :rules="rules" ref="contactForm" label-width="120px" style="width: 600px;margin: 0 auto;">
					<el-form-item label="联系人：" prop="name">
						<el-input v-model="user.name" style="width: 400px;"></el-input>
					</el-form-item>
					<el-form-item label="称呼：" prop="gender">
						<el-radio-group v-model="user.gender">
							<el-radio :label="0">男士</el-radio>
							<el-radio :label="1">女士</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机号：" prop="tel">
						<el-input v-model="user.tel" style="width: 400px;"></el-input>
					</el-form-item>
					<el-form-item label="邮箱：" prop="email">
						<el-input v-model="user.email" style="width: 400px;"></el-input>
					</el-form-item>
					<el-form-item label="通信地址：" prop="address">
						<el-input type="textarea" v-model="user.address" :rows="5" style="width: 400px;"></el-input>
					</el-form-item>
				</el-form>
			</template>
			<div class="page-footer" style="margin-top: 80px;">
				<span class="btn btn-primary"  @click.prevent="onSubmit">提交修改</span>
				<span v-show="errorMsg" style="color: #ff0000;">{{errorMsg}}</span>
			</div>
		</div>
	</div>
</template>
<script>
import { ERRORMESSAGE} from 'help/textMessage';
import actions from 'actions';
import Http from 'utils/http';
import {limitLen} from 'utils/common';
export default {
	name: 'AccountContact',
	data() {
		return {
			errorMsg: '',
			isLoadingFinish:false,
			user:{
			    name:'',
				gender:0,
				tel:'',
				email:'',
				address:''
			},
			rules: {
				name: [
					{ required: true, message: '请输入联系人名称', trigger: 'blur'},
					{ validator: function(rule, value, callback) {
						if(!limitLen(value, 20)){
							callback(new Error('最大长度不超过十个汉字'));
						}else if(/[`~!@_#$^&*()=|\d|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]/g.test(value)) {
							callback(new Error(ERRORMESSAGE.ContactWay.nameContainChar));
						}else{
							callback();
						}
					}, trigger: 'blur'}
				],
				tel: [
					{ required: true, message: '请输入手机号', trigger: 'blur'},
					{ validator: function(rule, value, callback) {
						if(!/^1\d{10}$/g.test(value)) {
							callback(new Error(ERRORMESSAGE.ContactWay.cellPhoneNumberInvalid));
						}else{
						    callback();
						}
					}
						, trigger: 'blur'}
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur'},
					{ validator: function(rule, value, callback) {
						if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) {
							callback(new Error(ERRORMESSAGE.ContactWay.emailInvalid));
						}else{
						    callback();
						}
					}, trigger: 'blur'}
				]
			}
		};
	},
	created() {
	    this.loadData();
	},
	methods:{
		loadData() {
			Http.get('/api/account/contact').then((res) => {
					let data = res.data;
					if(res.status === 200 && res.data.code === 200) {
						this.user.name = data.data.name;
						this.user.gender = data.data.gender;
						this.user.tel = data.data.mobile + '';
						this.user.email = data.data.email;
						this.user.address = data.data.address;
						this.isLoadingFinish = true;
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
				}).then((error) => {
					console.log(error);
				});
		},
		onSubmit(){
			let vm = this;
			this.$refs.contactForm.validate((valid) => {
				if(valid){
					let params = {
						name: this.user.name,
						gender: parseInt(this.user.gender),
						mobile: this.user.tel,
						email: this.user.email,
						address: this.user.address
					};
					Http.post('/api/account/contact', params).then((res) => {
						if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
							this.errorMsg = '';
							actions.setUserName(this.$store, this.user.name);
							this.showMessage(res.data.msg, 'success');
						} else if (res.data.code >= 500) {
							this.errorMsg = '服务器异常，请稍后再试。';
						} else {
							this.errorMsg = '操作失败，请检查网络设置或稍后再试。';
						}
					}).catch((error) => {
						console.log(error);
					});
				}else {
					return false;
				}
			});
		},
		showMessage(message, type) {
			this.$message({
				message: message,
				type: type
			});
		}
	}
};
</script>
