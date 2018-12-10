<template>
	<div class="page-content">
		<div class="page-title sub-title">选择身份</div>
		<div class="content">
			<div class="register-con">
				<div v-if="false && (userInfo.type == 3 || userInfo.loginFrom == 'GOME_ONLINE')" class="identity-item" :class="{'active': selectIdentity == 3}" @click="selectIdentityHandler(3)">
					<em class="icon icon-agent"></em>
					<p class="identity-name">代理商</p>
					<p class="identity-desc">适用于代理商的广告投放</p>
				</div>
				<div v-if="[1, 2, 5].indexOf(userInfo.type) > -1 || userInfo.loginFrom == 'GOME_ONLINE'" class="identity-item" :class="{'active': selectIdentity == 100}" @click="selectIdentityHandler(100)">
					<em class="icon icon-branch"></em>
					<p class="identity-name">企业</p>
					<p class="identity-desc text-left">给企业和组织提供更强大的业务服务与用户管理能力</p>
				</div>
				<div v-if="false && (userInfo.type == 7 || userInfo.loginFrom == 'GOME_ONLINE')" class="identity-item" :class="{'active': selectIdentity === 7}" @click="selectIdentityHandler(7)">
					<em class="icon icon-account"></em>
					<p class="identity-name">个人</p>
					<p class="identity-desc">适用于个人的广告投放</p>
				</div>
				<div class="el-form-item__error" v-show="validteMsg.companyNature.isError">
					{{validteMsg.companyNature.errorMsg}}
				</div>
			</div>
			<div class="content-footer">
				<span>
					<el-checkbox v-model="agreementChecked" @change="saveLocalData('agreementChecked', agreementChecked)"></el-checkbox>
					<a href="https://mevent.meixincdn.com/static/html/platform_service.html" target="_blank">《国美营销平台服务协议》</a>
				</span>
				<div class="el-form-item__error" v-show="validteMsg.agreement.isError">
					{{validteMsg.agreement.errorMsg}}
				</div>
				<div class="footer-btn">
					<button class="btn btn-primary" @click.prevent="saveAndNext">
						同意以上协议，下一步
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store';
window.store = store;
import actions from 'actions';
window.actions = actions;
import Http from 'http';
import router from '../../../route.js';
import {copyObj, formatDate, isEmptyObj} from 'utils/common';

export default{
	name: 'register-identity',
	data() {
		return {
			selectIdentity: 0,//100为企业，为了区分其他值设置了一个较大的值，与后台无关
			companyNature: '0',
			isCompanyNatureClick:false,
			agreementChecked:false,
			validteMsg:{
				'companyNature':{
					isError: false,
					errorMsg: ''
				},
				'agreement':{
					isError: false,
					errorMsg: ''
				}
			},
			companyData: {
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				gomeBrandIds: [],
				categorys: [],
				organization:{
					bizLicenseProvince: "",
					bizLicenseCity: "",
					bizLicensePostcode: "",
					licenseType: 1,
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
		};
	},
	computed: {
		userInfo: () => store.state.userInfo
	},
	created() {
		this.getLocalData();
	},
	methods:{
		selectIdentityHandler(type) {
			this.selectIdentity = type;
			this.companyNature = type;
			localStorage.setItem(this.userInfo.userId + '_identity', this.selectIdentity);
		},
		getLocalData() {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				let selectIdentity = localStorage.getItem(this.userInfo.userId + '_identity');
				this.selectIdentity = !!selectIdentity ? selectIdentity : 0;
				this.agreementChecked = localData.agreementChecked;
			}
		},
		saveLocalData(key, data) {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				localData[key] = data;
				localStorage.setItem(this.userInfo.userId, JSON.stringify(localData));
			}
		},
		saveAndNext(){
			let vm = this;
			if(vm.selectIdentity == 0){
				vm.validteMsg.companyNature.isError = true;
				vm.validteMsg.companyNature.errorMsg = "请选择身份";
			} else {
				vm.validteMsg.companyNature.isError = false;
				vm.validteMsg.companyNature.errorMsg = "";
			}
			if(!vm.agreementChecked){
				vm.validteMsg.agreement.isError = true;
				vm.validteMsg.agreement.errorMsg = "请勾选用户服务协议";
			} else {
				vm.validteMsg.agreement.isError = false;
				vm.validteMsg.agreement.errorMsg = "";
			}
			if(vm.validteMsg.companyNature.isError || vm.validteMsg.agreement.isError) return false;
			if (vm.userInfo.type == 1) {
				Http.get('/api/shop').then(function(response) {
					if(response.status === 200 && response.data.code === 200 && response.data.iserror === 0){
						let data = response.data.data;
						vm.companyData.organization.licenseType = data.licenseType;
						vm.companyData.organization.certificateType = data.certificateType;
						vm.companyData.organization.companyName = data.companyName;
						vm.companyData.organization.bizLicenseNumber = data.bizLicenseNumber;
						vm.companyData.organization.legalReprName = data.legalReprName;
						vm.companyData.organization.legalReprIdNumber = data.legalReprIdNumber;
						vm.companyData.organization.legalReprIdImage = data.legalReprIdImage;
						vm.companyData.organization.legalReprIdBackImage = data.legalReprIdBackImage;
						vm.companyData.organization.bizLicenseAddress = data.bizLicenseAddress;
						vm.companyData.organization.companyFoundDate = data.companyFoundDate;
						vm.companyData.organization.bizStartDate = data.bizStartDate;
						vm.companyData.organization.bizEndDate = data.bizEndDate;
						vm.companyData.organization.regCapital = data.regCapital;
						vm.companyData.organization.bizScope = data.bizScope;
						vm.companyData.organization.bizLicenseImage = data.bizLicenseImage;
						vm.companyData.organization.companyAddress = data.companyAddress;
						vm.companyData.organization.companyPhone = data.companyPhone;
						vm.companyData.organization.emerContact = data.emerContact;
						vm.companyData.organization.emerContactPhone = data.emerContactPhone;
						vm.companyData.organization.companyEmail = data.companyEmail;
						vm.companyData.organization.orgCode = data.orgCode;
						vm.companyData.organization.orgCodeImage = data.orgCodeImage;
						vm.companyData.organization.taxNumber = data.taxNumber;
						vm.companyData.organization.taxpayerType = data.taxpayerType;
						vm.companyData.organization.taxCode = data.taxCode;
						vm.companyData.organization.taxRegCertImage = data.taxRegCertImage;
						vm.companyData.organization.taxpayerQualificationImage = data.taxpayerQualificationImage;
						vm.companyData.organization.bankAccountName = data.bankAccountName;
						vm.companyData.organization.bankAccount = data.bankAccount;
						vm.companyData.organization.bankBranchName = data.bankBranchName;
						vm.companyData.organization.bankBranchLineNumber = data.bankBranchLineNumber;
						vm.companyData.organization.bankBranchAddress = data.bankBranchAddress;
						vm.companyData.organization.bankAccountPermissionImage = data.bankAccountPermissionImage;
						actions.setAnicerData(vm.$store, vm.companyData);
						actions.setShopAnicerData(vm.$store, vm.companyData);
						vm.isCompanyNatureClick = false;
						actions.controlAnicer(vm.$store, {hasCompanyInfo: true, step: 'company'});
						vm.setCompanyNautre();
					} else {
						vm.isCompanyNatureClick = false;
						actions.controlAnicer(vm.$store, {step: 'company'});
						vm.setCompanyNautre();
					}
				}).catch(function(error) {
					console.log(error);
				});
			} else {
				vm.isCompanyNatureClick = false;
				actions.controlAnicer(vm.$store, {step: 'company'});
				vm.setCompanyNautre();
				this.saveLocalData('step', 'company');
			}
		},
		setCompanyNautre() {
			if (this.userInfo.type == 1 || this.userInfo.type == 2) {
				//品牌商和pop商家的companyNature不可选，默认为账户类型
				actions.setAnicerData(this.$store, {companyNature: this.userInfo.type});
				this.saveLocalData('companyNature', this.userInfo.type);
			} else if (this.userInfo.loginFrom == 'GOME_ONLINE') {
				actions.setAnicerData(this.$store, {companyNature: ''});
				this.saveLocalData('companyNature', '');
			}
		},
		emptyObejct(obj) {
			let ancierObj = obj;
			for (let name in ancierObj) {
		        if (ancierObj.hasOwnProperty(name)) {
		        	ancierObj[name] = '';
		        }
		    }
		    return ancierObj;
		},
		closeAgreement() {
			this.isCompanyNatureClick = false;
		}
	}
};
</script>
<style lang="less" scoped>
	html .amp-content .open_account .account_content h1, body .amp-content .open_account .account_content h1{margin: 50px 0 80px 0;}
	html .amp-content .open_account .account_content, body .amp-content .open_account .account_content{height: 890px;}
	.content-footer{
		text-align:center;
		margin: 75px 0 0 0;
		.footer-btn{
			margin:20px 0 0 0 ;
		}
		.footer-agreement{
			color:#3d9fed;
		}
	}
	.fn-search{
		margin:30px 0 0 0;
	}
	.content_img{
		margin: 0;
		width: 100%;
		text-align: center;
	}
	.img_content_f{
		margin: 0 17px;
	}
	.content_img .img_content_f, .content_img .img_content_c{
		width: 262px;
		background-color:#fff;
		color:#e0e5e9;
	}
	.img_content_f:hover, .img_content_c:hover{
		border:1px solid #c3c7cb;
		box-sizing:border-box;
		box-shadow: 1px 1px 20px #c3c7cb;
	}
	.img_content_f.active,.img_content_c.active{
		border:1px solid #c3c7cb;
		box-sizing:border-box;
		box-shadow: 1px 1px 20px #c3c7cb;
	}
	/*.img_content_f:hover em, .img_content_c:hover em {
		color:#ffd660;
	}*/
	.img_content_f:hover p, .img_content_c:hover p {
		color:#282a29;
	}
	.el-form-item__error{
		position:static;
		margin: 5px 0 0 0;
	}
	.imgBox01{
		&.active em{
			color:#54a4ed;
		}
		&.active p{color: #282a29;}
		&:hover{
		  em{color:#54a4ed;}
		}
	}
	.imgBox02{
		&.active em{
			color:#f06086;
		}
		&.active p{color: #282a29;}
		&:hover{
			em{color:#f06086;}
		}
	}
	.imgBox03{
		&.active em{
			 color:#ffd660;
		 }
		&.active p{color: #282a29;}
		&:hover{
			em{color:#ffd660;}
		}
	}
	.imgBox04{
		&.active em{
			 color:#ffd660;
		 }
		&.active p{color: #282a29;}
		&:hover{
			em{color:#ffd660;}
		}
	}
</style>
