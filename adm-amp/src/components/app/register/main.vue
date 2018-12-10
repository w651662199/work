<template>
	<div class="amp-content page-content">
		<div v-if="config.isSucceed === false" class="open_account">
			<div class="content" v-if="refuseInfo.length > 0">
				<div class="refuse-con">
					<div class="left"><em class="icon-refuse"></em><span>审核未通过</span></div>
					<div class="right">
						<p>理由：{{refuseInfo}}</p>
					</div>
				</div>
			</div>
			<div class="account-step">
				<div class="part-guid-crumbs">
					<div class="crumbs-item" :class="{'step-crumbs':(orderKey.indexOf(config.step) + 1) >= 1}">
						<span class="step-num">1</span>
						<span class="stem-name">选择身份</span>
						<span class="stem-res"><em class="icon icon-right"></em></span>
					</div>
					<div class="crumbs-item" :class="{'step-crumbs':(orderKey.indexOf(config.step) + 1) >= 2}">
						<span class="step-num">2</span>
						<span class="stem-name">填写企业信息</span>
						<span class="stem-res"><em class="icon icon-right"></em></span>
					</div>
					<div class="crumbs-item" :class="{'step-crumbs':(orderKey.indexOf(config.step) + 1) >= 3}">
						<span class="step-num">3</span>
						<span class="stem-name">指定联系人</span>
						<span class="stem-res"><em class="icon icon-right"></em></span>
					</div>
					<div class="crumbs-item" :class="{'step-crumbs':(orderKey.indexOf(config.step) + 1) >= 4}">
						<span class="step-num">4</span>
						<span class="stem-name">资料确认</span>
						<span class="stem-res"><em class="icon icon-right"></em></span>
					</div>
				</div>
			</div>
			<transition name="component-fade" mode="out-in">
				<keep-alive>
					<component v-bind:is="config.step"></component>
				</keep-alive>
			</transition>
		</div>
		<div v-if="config.isSucceed" class="open_account">
			<div class="account-icon"><em class="icon icon-confirm"></em>
				<h1>申请资料已成功提交!</h1>
				<h4>信息进入审核序列，请您耐心等待。结果将以邮件形式通知!</h4>
			</div>
		</div>
		<div class="footer">
			<p>如您在填写过程中遇到问题，可发送邮件至：ad-service@gomeplus.com 进行咨询</p>
		</div>
	</div>
</template>
<script>
import store from 'store';
import actions from 'actions';
import RegisterIdentity from './register-identity.vue';
import RegisterCompany from './register-company.vue';
import RegisterContact from './register-contact.vue';
import RegisterConfirm from './register-confirm.vue';
import {copyObj} from 'utils/common';
export default {
	name: 'register',
	data() {
		return {
			refuseInfo: '',
			orderKey: ['identity', 'company', 'contact','confirm'],
			localFormData: {
				step: "identity",
				agreementChecked: false,
				companyNature: "0",
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				licenseOffice: "",
				bizLicensePostcode: "",
				bizLicenseProvince: "",
				bizLicenseCity: "",
				socialCreditCode: "",
				companyType: "",
				licenseType: 2,
				certificateType: 1,
				companyName: "", //公司名称
				bizLicenseNumber: "", //注册号（营业执照号）
				legalReprName: "",  //法人代表姓名
				legalReprIdNumber: "", //身份证号
				legalReprIdImage: "", //身份证正面
				legalReprIdBackImage: "",//身份证反面
				bizLicenseAddress: "", //营业执照详细地址
				companyFoundDate: "", //公司成立时间
				bizStartDate: "", //营业期限-开始时间
				bizEndDate: "",   //营业期限-结束时间
				regCapital: "",  //注册资本
				bizScope: "", //经营范围
				bizLicenseImage: "", //营业执照副本电子版
				companyAddress: "", //公司详细地址
				companyPhone: "",  //公司电话
				emerContact: "",  //公司紧急联系人
				emerContactPhone: "",  //公司紧急联系人电话
				companyEmail: "",
				orgCode: "", //组织机构代码
				orgCodeImage: "",
				taxNumber: "", //税号
				taxpayerType: "",  //纳税人类型
				taxCode: "", //纳税类型税码
				taxRegCertImage: "", //税务登记证电子版
				taxpayerQualificationImage: "", //一般纳税人资格电子版
				bankAccountName: "", //银行开户名
				bankAccount: "", //公司银行账号
				bankBranchName: "", //开户银行支行名称
				bankBranchLineNumber: "", //开户银行支行联行号
				bankBranchAddress: "", //开户银行支行地址
				bankAccountPermissionImage: "", //银行开户
				gomeBrandIds: [],
				categorys: []
			}
		};
	},
	components: {
		'identity': RegisterIdentity,
		'company': RegisterCompany,
		'contact': RegisterContact,
		'confirm': RegisterConfirm
	},
	computed:{
	    config:() => store.state.anicerControl,
	    userInfo: () => store.state.userInfo
	},
	created() {
		if (this.userInfo.isRegistered && this.userInfo.isApproved == 1) {
			this.$router.push({name: 'index'});
		} else if (this.userInfo.isRegistered && !this.userInfo.isApproved) {
			this.$router.push({name: 'succeed'});
		}
		if (this.userInfo.type != 1 && !localStorage.getItem(this.userInfo.userId)) {
			localStorage.setItem(this.userInfo.userId, JSON.stringify(this.localFormData));
		}
		if (this.userInfo.type != 1) {
			actions.controlAnicer(this.$store,{step: JSON.parse(localStorage.getItem(this.userInfo.userId)).step});
			this.setAnicerFormData();
		}
		let refuseRes = localStorage.getItem(this.userInfo.userId + '_refuse');
		if (refuseRes) {
			this.refuseInfo = refuseRes;
		}
	},
	methods: {
		setAnicerFormData() {
			let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
			let contactData = copyObj(localData);
			delete localData.step;
			delete localData.agreementChecked;
			delete localData.companyNature;
			delete localData.contactName;
			delete localData.contactGender;
			delete localData.contactEmail;
			delete localData.contactMobile;
			delete localData.contactAddress;
			let formData = {
				companyNature: contactData.companyNature,
				contactAddress: contactData.contactAddress,
				contactEmail: contactData.contactEmail,
				contactGender: contactData.contactGender,
				contactMobile: contactData.contactMobile,
				contactName: contactData.contactName,
				organization: localData
			}
			actions.setAnicerData(this.$store, formData);
		}
	}
};
</script>
