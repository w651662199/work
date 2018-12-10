<template>
	<div class="page-content">
		<div class="page-title sub-title">联系人信息</div>
		<div class="content">
			<el-form :model="contactForm" :rules="rules" ref="contactForm" label-width="400px" style="margin-top: 60px;">
				<el-form-item label="联系人姓名：" prop="contactName">
					<el-input v-model="contactForm.contactName" @blur="saveLocalData('contactName', contactForm.contactName)"></el-input>
				</el-form-item>
				<el-form-item label="称呼：" prop="contactSex">
					<el-radio-group v-model="contactForm.contactGender" @change="saveLocalData('contactGender', contactForm.contactGender)">
						<el-radio :label="0">女士</el-radio>
						<el-radio :label="1">男士</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机号：" prop="contactMobile">
					<el-input v-model="contactForm.contactMobile" @blur="saveLocalData('contactMobile', contactForm.contactMobile)"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" prop="contactEmail">
					<el-input v-model="contactForm.contactEmail" @blur="saveLocalData('contactEmail', contactForm.contactEmail)"></el-input>
				</el-form-item>
				<el-form-item label="通信地址：" prop="contactAddress">
					<el-input type="textarea" v-model="contactForm.contactAddress" @blur="saveLocalData('contactAddress', contactForm.contactAddress)" :rows="5"></el-input>
				</el-form-item>
			</el-form>
			<div class="form-footer" v-if="fromDrawer !== 'supplementDrawer'">
				<button class="btn btn-simple" @click.prevent="changeStep('company')">上一步</button>
				<button class="btn btn-primary" @click.prevent="changeStep('confirm')">下一步</button>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store';
window.store = store;
import actions from 'actions';
window.actions = actions;
import Event from 'event';
import Axios from 'utils/http';
import {copyObj} from 'utils/common';
export default{
	name:'register-contact',
	data(){
		return{
			contactForm:{
				contactName:'',
				contactGender:0,
				contactMobile:'',
				contactEmail:'',
				contactAddress:''
			},
			rules: {
				contactName: [
					{ required: true, message: '请输入联系人名称', trigger: 'blur'},
				],
				contactMobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur'},
					{ validator: function(rule, value, callback) {
						if(!/^1\d{10}$/g.test(value)) {
							callback(new Error('请输入有效手机号'));
						}else{
							callback();
						}
					}, trigger: 'blur'}
				],
				contactEmail: [
					{ required: true, message: '请输入邮箱', trigger: 'blur'},
					{ validator: function(rule, value, callback) {
						if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) {
							callback(new Error('请输入有效邮箱地址'));
						}else{
							callback();
						}
					}, trigger: 'blur'}
				],
				contactAddress:[
					{ required: true, message: '请输入通讯地址', trigger: 'blur'},
				]
			},
			fromDrawer: ''
		};
	},
	computed:{
		companyNature:() => store.state.anicerFormData.companyNature,
		hasCompanyInfo:() => store.state.anicerControl.hasCompanyInfo,
		anicerData:() => store.state.anicerFormData,
		userInfo: () => store.state.userInfo,
		gomeplusAccount:() => store.state.userInfo.loginName
	},
	created() {;
		/*this.getData();*/
		this.contactForm.contactName = this.anicerData.contactName;
		this.contactForm.contactGender = this.anicerData.contactGender;
		this.contactForm.contactMobile = this.anicerData.contactMobile;
		this.contactForm.contactEmail = this.anicerData.contactEmail;
		this.contactForm.contactAddress = this.anicerData.contactAddress;
		this.getLocalData();
		if (this.$route.name == 'supcert') {
			this.fromDrawer = 'supplementDrawer';
		}
	},
	mounted(){
		//其他页面的上一步
		Event.$off('prevStep');
		Event.$on('prevStep',() => {
			this.changeStep('company');
		});
		//其他页面的下一步
		Event.$off('nextStep');
		Event.$on('nextStep',() => {
			this.changeStep('confirm');
		});
	},
	methods:{
		getLocalData() {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				this.contactForm.contactName = localData.contactName;
				this.contactForm.contactGender = localData.contactGender;
				this.contactForm.contactMobile = localData.contactMobile;
				this.contactForm.contactEmail = localData.contactEmail;
				this.contactForm.contactAddress = localData.contactAddress;
			}
		},
		saveLocalData(key, data) {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				localData[key] = data;
				localStorage.setItem(this.userInfo.userId, JSON.stringify(localData));
			}
		},
		saveHandler(){
			let vm = this;
			vm.$refs.contactForm.validate(function(valid) {
				if (valid) {
					actions.setAnicerData(vm.$store,vm.contactForm);
					Axios.post('/api/anicer',store.state.anicerFormData)
						.then(function(response) {
							if(response.status === 200 && response.data.code === 200 && response.data.iserror === 0){
								vm.showMessage(response.data.msg,'success');
							}else{
								vm.showMessage(response.data.msg,'error');
							}
						})
						.catch(function(error) {
							console.log(error);
							vm.showMessage('修改失败，请检查网络设置或稍后再试','error');
						});
				}else {
					return false;
				}
			});
		},
		changeStep(type){
		    let vm = this;
		    if(type === 'confirm'){
				vm.$refs.contactForm.validate((valid) => {
					if (valid) {
						actions.setAnicerData(vm.$store,vm.contactForm);
						actions.controlAnicer(vm.$store,{isSucceed:store.state.anicerControl.isSucceed,step:type});
						this.saveLocalData('step', type);
					}else {
						return false;
					}
				});
			}else{
				actions.controlAnicer(vm.$store,{isSucceed:store.state.anicerControl.isSucceed,step:type});
				this.saveLocalData('step', type);
			}
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
<style scoped>
	.el-input,.el-textarea,.el-select{width: 420px;}
	.contacts-content{
		background: #fff;
		margin: 30px 0 0 0;
		padding: 20px 0 50px 0;
	}
	.content-p{
		text-align: left;
		margin: 0 0 0 344px;
	}
	.contactHead {
		height: 122px;
		line-height: 122px;
		font-size: 23px;
		color: #2e2e2e;
		padding-left: 146px;
	}
</style>
