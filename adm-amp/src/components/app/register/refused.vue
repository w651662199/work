<template>
	<div class="page-content">
		<div class="content">
			<div class="register-page w500 refuse">
				<div class="msg-item">
					<p class="title">对不起！您提交的信息未通过审核</p>
					<p>理由：{{advertiser}}</p>
					<p class="page-footer"><button class="btn btn-primary" @click.prevent="getData">修改信息</button></p>
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
import {copyObj,isEmptyObj} from 'utils/common';
import Http from 'http';
import router from '../../../route.js';
import RegisterCompany from './register-company.vue';
export default {
	name: 'app-approval-refused',
	data() {
		return {
			userId:'',
			advertiser:'',
			companyData:{
				companyNature: '',
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				organization:{
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
					brandIds: [],
					categorys: []
				}
			},
			shopCompanyData:{
				companyNature: '',
				contactName: "",
				contactGender: 0,
				contactEmail: "",
				contactMobile: "",
				contactAddress: "",
				organization:{
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
					brandIds: [],
					categorys: []
				}
			}
		};
	},
	computed:{
	    userInfo: () => store.state.userInfo,
	    config:() => store.state.anicerControl
	},
	components: {
		'company': RegisterCompany
	},
	created() {
		this.getRejectReson();
	},
	methods:{
		getRejectReson() {
			let vm = this;
		    Http.get('/api/anicer/reason').then(function(res){
				if(res.data.code == 200){
					vm.advertiser = res.data.data.join('；');
					localStorage.setItem(vm.userInfo.userId + '_refuse', vm.advertiser);
				} else {
					vm.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(function(error){
				console.log(error);
			});
		},
		getData() {
			let vm = this;
			Http.get('/api/anicer').then(function(response) {
				if(response.status === 200 && response.data.code === 200 && response.data.iserror === 0){
					let data = response.data.data;
					vm.companyData = copyObj(data);
					actions.controlAnicer(vm.$store, {step: 'company'});
					if(vm.userInfo.type == 1){
						Http.get('/api/shop').then(function(response) {
							if(response.status === 200 && response.data.code === 200 && response.data.iserror === 0){
								let data = response.data.data;
								vm.shopCompanyData.organization.companyName = vm.companyData.organization.companyName = data.companyName;
								vm.shopCompanyData.organization.bizLicenseNumber = vm.companyData.organization.bizLicenseNumber = data.bizLicenseNumber;
								vm.shopCompanyData.organization.legalReprName = vm.companyData.organization.legalReprName = data.legalReprName;
								vm.shopCompanyData.organization.legalReprIdNumber = vm.companyData.organization.legalReprIdNumber = data.legalReprIdNumber;
								vm.shopCompanyData.organization.legalReprIdImage = vm.companyData.organization.legalReprIdImage =data.legalReprIdImage;
								vm.shopCompanyData.organization.legalReprIdBackImage = vm.companyData.organization.legalReprIdBackImage =data.legalReprIdBackImage;
								vm.shopCompanyData.organization.bizLicenseAddress = vm.companyData.organization.bizLicenseAddress = data.bizLicenseAddress;
								vm.shopCompanyData.organization.companyFoundDate = vm.companyData.organization.companyFoundDate = data.companyFoundDate;
								vm.shopCompanyData.organization.bizStartDate = vm.companyData.organization.bizStartDate = data.bizStartDate;
								vm.shopCompanyData.organization.bizEndDate = vm.companyData.organization.bizEndDate = data.bizEndDate;
								vm.shopCompanyData.organization.regCapital = vm.companyData.organization.regCapital = data.regCapital;
								vm.shopCompanyData.organization.bizScope = vm.companyData.organization.bizScope = data.bizScope;
								vm.shopCompanyData.organization.bizLicenseImage = vm.companyData.organization.bizLicenseImage = data.bizLicenseImage;
								vm.shopCompanyData.organization.companyAddress = vm.companyData.organization.companyAddress = data.companyAddress;
								vm.shopCompanyData.organization.companyPhone = vm.companyData.organization.companyPhone = data.companyPhone;
								vm.shopCompanyData.organization.emerContact = vm.companyData.organization.emerContact = data.emerContact;
								vm.shopCompanyData.organization.emerContactPhone = vm.companyData.organization.emerContactPhone = data.emerContactPhone;
								vm.shopCompanyData.organization.companyEmail = vm.companyData.organization.companyEmail = data.companyEmail;
								vm.shopCompanyData.organization.orgCode = vm.companyData.organization.orgCode = data.orgCode;
								vm.shopCompanyData.organization.orgCodeImage = vm.companyData.organization.orgCodeImage =data.orgCodeImage;
								vm.shopCompanyData.organization.taxNumber = vm.companyData.organization.taxNumber = data.taxNumber;
								vm.shopCompanyData.organization.taxpayerType = vm.companyData.organization.taxpayerType = data.taxpayerType;
								vm.shopCompanyData.organization.taxCode = vm.companyData.organization.taxCode =data.taxCode;
								vm.shopCompanyData.organization.taxRegCertImage = vm.companyData.organization.taxRegCertImage = data.taxRegCertImage;
								vm.shopCompanyData.organization.taxpayerQualificationImage = vm.companyData.organization.taxpayerQualificationImage = data.taxpayerQualificationImage;
								vm.shopCompanyData.organization.bankAccountName = vm.companyData.organization.bankAccountName = data.bankAccountName;
								vm.shopCompanyData.organization.bankAccount = vm.companyData.organization.bankAccount = data.bankAccount;
								vm.shopCompanyData.organization.bankBranchName = vm.companyData.organization.bankBranchName = data.bankBranchName;
								vm.shopCompanyData.organization.bankBranchLineNumber = vm.companyData.organization.bankBranchLineNumber = data.bankBranchLineNumber;
								vm.shopCompanyData.organization.bankBranchAddress = vm.companyData.organization.bankBranchAddress = data.bankBranchAddress;
								vm.shopCompanyData.organization.bankAccountPermissionImage = vm.companyData.organization.bankAccountPermissionImage = data.bankAccountPermissionImage;
								actions.setAnicerData(vm.$store, vm.companyData);
								actions.setShopAnicerData(vm.$store, vm.shopCompanyData);
								router.push({name: 'register'});
							}
						}).catch(function(error) {
							console.log(error);
						});
					}else{
						actions.setEmptyAnicerData(vm.$store, {});
						actions.setAnicerData(vm.$store, vm.companyData);
						router.push({name: 'register'});
					}
				} else {
					vm.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		}
	}
};
</script>
