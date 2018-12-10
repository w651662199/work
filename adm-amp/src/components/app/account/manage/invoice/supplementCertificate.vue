<template>
	<div class="page-content">
		<div class="page-title" style="padding: 0 180px;">
			<p>提交资质信息</p>
			<p class="warn-msg">您的资质目前尚未完全，请您补全资质。经审核通过后可以提交开发票申请。</p>
		</div>
		<div class="content" style="background: none;padding:0;">
			<company v-if="config.step == 'company'"></company>
			<contact v-if="config.step == 'contact'"></contact>
			<confirm v-if="config.step == 'confirm'"></confirm>
		</div>
		<div class="page-footer form-footer" style="width: 1200px;margin:0 auto;">
			<button class="btn btn-primary" @click="prevStep()" v-if="config.step == 'contact' || config.step == 'confirm'">上一步</button>
			<button class="btn btn-primary" @click="nextStep()" v-if="config.step == 'company' || config.step == 'contact'">下一步</button>
			<button class="btn btn-primary" @click="save()" v-if="config.step == 'confirm'">提交</button>
		</div>
		<transition name="fade" v-if="isDialogVisible">
			<div class="master" style="z-index: 1300;">
				<div class="dialog-pop">
					<div class="pop-header"><span class="header-text">提示</span><span class="header-close" @click="closeDialog"><em class="icon icon-close"></em></span></div>
					<div class="pop-body">
						<div class="body-infor">
							<h3>申请资料已成功提交！</h3>
							<p>您提交的信息已进入审核序列，请您耐心等待，审核结果会通过站内信通知给您，审核通过后您可以正常提交开发票申请。</p>
						</div>
					</div>
					<div class="pop-footer"><span class="btn btn-simple" @click="closeDialog">关闭</span></div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import store from 'store';
import actions from 'actions';
import Event from 'event';
import Http from 'utils/http'
import RegisterCompany from '../../../register/register-company';
import RegisterContact from '../../../register/register-contact';
import RegisterConfirm from '../../../register/register-confirm';
import {formatDate, mixin, mixinSource,copyObj} from 'utils/common';
import router from '../../../../../route.js';
export default {
	name: 'AccountInvoiceSupplement',
	data() {
		return {
			companyData:{
				companyNature: 0,
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				organization:{
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
					companyEmail: "", //公司邮箱
					orgCode: "", //组织机构代码
					orgCodeImage: "",
					taxNumber: "", //税号
					taxpayerType: 1,  //纳税人类型
					taxCode: "", //纳税类型税码
					taxRegCertImage: "", //税务登记证电子版
					taxpayerQualificationImage: "", //一般纳税人资格电子版
					bankAccountName: " ", //银行开户名
					bankAccount: "", //公司银行账号
					bankBranchName: "", //开户银行支行名称
					bankBranchLineNumber: "", //开户银行支行联行号
					bankBranchAddress: "", //开户银行支行地址
					bankAccountPermissionImage: "", //银行开户
				}
			},
			originalData: {},
			orderKey: ['company', 'contact','confirm'],
			isDialogVisible: false
		}
	},
	components: {
		'company': RegisterCompany,
		'contact': RegisterContact,
		'confirm': RegisterConfirm
	},
	created() {
		this.getAnicerData();
	},
	computed:{
		anicerFormData: () => store.state.anicerFormData,
		config:() => store.state.anicerControl,
		userInfo: () => store.state.userInfo
	},
	methods:{
		getAnicerData() {
			Http.get("/api/anicer/supply").then(res => {
				if (res.data.code == 200) {
					let anicerData = res.data.data;
					anicerData.organization.certificateType = 1;
					let organizationData = mixinSource(this.companyData.organization, anicerData.organization);
					let data = mixinSource(this.companyData, anicerData);
					this.originalData = copyObj(anicerData);
					this.companyData.organization = copyObj(organizationData);
					this.companyData.companyNature = anicerData.type;
					let companyData = copyObj(this.companyData);
					actions.controlAnicer(this.$store, {step: 'company'});
					actions.setAnicerData(this.$store, companyData);
					actions.setShopAnicerData(this.$store, companyData);
				}
			}).catch(err => {
				console.log(err);
			});
		},
		prevStep(){
			//上一步
			Event.$emit('prevStep');
		},
		nextStep(){
			//下一步
			Event.$emit('nextStep');
		},
		save(){
			//提交
			let organization = copyObj(this.anicerFormData.organization);
			let newOrganization = mixinSource(this.originalData.organization, organization);
			let params = mixinSource(this.originalData,this.anicerFormData);
			params.organization = newOrganization;
			if (params.organization.licenseType == 2) {
				params.organization.bizLicenseNumber = "";
				params.organization.orgCode = "";
				params.organization.orgCodeImage = "";
				params.organization.taxNumber = "";
				params.organization.taxpayerType = 0;
				params.organization.taxCode = 0;
				params.organization.taxRegCertImage = "";
				params.organization.taxpayerQualificationImage = "";
			} else {
				params.organization.companyType = "";
				params.organization.socialCreditCode = "";
				params.organization.licenseOffice = "";
			}
			Http.post('/api/anicer/supply', params).then((res) => {
				if(res.data.code == 200 || !res.data.iserror){
					this.isDialogVisible = true;
				}
			})
		},
		closeDialog() {
			this.isDialogVisible = false;
			router.push({name: 'invoice'});
		}
	}
};
</script>