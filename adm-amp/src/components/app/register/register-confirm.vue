<template>
	<div class="confirm-content">
		<div class="content-form ">
			<div class="content" v-if="fromDrawer !== 'supplementDrawer'">
				<p>身份：<b>{{ person }}</b></p>
				<p>国美Plus账户：<b>{{ gomeplusAccount }}</b></p>
			</div>
			<div class="form-if">
				<div class="check-item" v-show="anicerData.organization.certificateType==2">
					<div class="if-item"><span class="span">企业信息</span></div>
					<div class="item-unfold item-unfold-comfirm">
						<div class="unfold-content">
							<div class="column-group">
								<div class="group-aside">公司名称：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.organization.companyName}}</span></div>
								</div>
							</div>
							<div class="column-group">
								<div class="group-aside">统一社会信用代码/税号：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.organization.taxNumber}}</span></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<template v-show="anicerData.organization.certificateType==1">
					<div class="check-item">
						<div class="if-item"><span class="span">营业执照</span></div>
						<div class="item-unfold item-unfold-comfirm">
							<div class="unfold-content">
								<div class="column-group">
									<div class="group-aside">公司名称：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.companyName}}</span></div>
									</div>
								</div>
								<div class="column-group" v-show="anicerData.organization.licenseType==2">
									<div class="group-aside">类型：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.companyType}}</span></div>
									</div>
								</div>
								<div class="column-group" v-show="anicerData.organization.licenseType==1">
									<div class="group-aside">注册号（营业执照号）：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bizLicenseNumber}}</span></div>
									</div>
								</div>
								<div class="column-group" v-show="anicerData.organization.licenseType==2">
									<div class="group-aside">统一社会信用代码：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.socialCreditCode}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">法人代表姓名：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.legalReprName}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">法人代表身份证号：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.legalReprIdNumber}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">法人身份证电子版：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">已上传</span></div>
										<!--<div class="detail-row">
											<div class="row-photo-s">
												<div class="photo-add photo-add-nomar"><img
														v-bind:src="anicerData.legalReprIdImage"></div>
											</div>
											<div class="row-photo-s">
												<div class="photo-add photo-add-nomar"><img
														v-bind:src="anicerData.legalReprIdBackImage"></div>
											</div>
										</div>-->
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">营业执照详细地址：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bizLicenseProvince}}{{anicerData.organization.bizLicenseCity}}{{anicerData.organization.bizLicenseAddress}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">邮箱：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bizLicensePostcode}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">成立日期：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{formatFoundDate}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">营业期限：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{formatBizDate}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">注册资本：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.regCapital}} 万元</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">经营范围：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bizScope}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">营业执照副本电子版：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">已上传</span></div>
										<!--<div class="detail-row">
		
											<div class="row-photo-l">
												<div class="photo-add photo-add-nomar"><img
														v-bind:src="anicerData.bizLicenseImage"></div>
											</div>
										</div>-->
									</div>
								</div>
								<div class="column-group" v-show="anicerData.organization.licenseType==2">
									<div class="group-aside">发证机关或登记机关：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.licenseOffice}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司详细地址：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.companyAddress}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司电话：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.companyPhone}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司紧急联系人：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.emerContact}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司紧急联系人电话：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.emerContactPhone}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司邮箱：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.companyEmail}}</span></div>
									</div>
								</div>
							</div>
							<div class="unfold-content-right" style="margin: 25px 55px 0 0;">
								<div class="imgBox">
									<div class="photo-add photo-add-nomar showBizLicenseImage">
										<a :href="anicerData.organization.bizLicenseImage" target="_blank">
											<img :src="anicerData.organization.bizLicenseImage">
										</a>
									</div>
									<p style="margin-top: 13px;">营业执照副本电子版</p>
									<div class="photo-add photo-add-nomar showLegalReprId">
										<a :href="anicerData.organization.legalReprIdImage" target="_blank">
											<img :src="anicerData.organization.legalReprIdImage">
										</a>
									</div>
									<p style="margin-top: 13px;">法人身份证正面照</p>
									<div class="photo-add photo-add-nomar showLegalReprId">
										<a :href="anicerData.organization.legalReprIdBackImage" target="_blank">
											<img :src="anicerData.organization.legalReprIdBackImage">
										</a>
									</div>
									<p style="margin-top: 13px;">法人身份证反面照</p>
								</div>
							</div>
						</div>
					</div>
					<div class="check-item" v-show="anicerData.organization.licenseType==1">
						<div class="if-item"><span class="span">组织机构代码证</span></div>
						<div class="item-unfold item-unfold-comfirm clearfix">
						<div class="unfold-content">
							<div class="column-group">
								<div class="group-aside">组织机构代码：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.organization.orgCode}}</span></div>
								</div>
							</div>
							<div class="column-group">
								<div class="group-aside">组织机构代码副本电子版：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">已上传</span></div>
									<!--<div class="detail-row">
										<div class="row-photo-l">
											<div class="photo-add photo-add-nomar"><img v-bind:src="anicerData.orgCodeImage"></div>
										</div>
									</div>-->
								</div>
							</div>
						</div>
						<div class="unfold-content-right" style="margin: 40px 55px 0 0;">
							<div class="imgBox">
								<div class="photo-add photo-add-nomar showOrgCodeImage">
									<a :href="anicerData.organization.orgCodeImage" target="_blank">
										<img :src="anicerData.organization.orgCodeImage">
									</a>
								</div>
								<p style="margin-top: 10px;">组织机构代码</p>
							</div>
						</div>
					</div>
					</div>
					<div class="check-item" v-show="anicerData.organization.licenseType==1">
						<div class="if-item"><span class="span">税务登记证</span></div>
						<div class="item-unfold item-unfold-comfirm clearfix">
							<div class="unfold-content">
								<div class="column-group">
									<div class="group-aside">税号：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.taxNumber}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">纳税人类型：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{taxpayerTypeText}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">纳税类型税码：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{taxCodeText}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">税务登记证电子版：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">已上传</span></div>
										<!--<div class="detail-row">
											<div class="row-photo-m">
												<div class="photo-add photo-add-nomar"><img v-bind:src="anicerData.taxRegCertImage"></div>
											</div>
										</div>-->
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">一般纳税人资格电子版：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">已上传</span></div>
										<!--<div class="detail-row">
											<div class="row-photo-m">
												<div class="photo-add photo-add-nomar"><img v-bind:src="anicerData.taxpayerQualificationImage"></div>
											</div>
										</div>-->
									</div>
								</div>
							</div>
							<div class="unfold-content-right" style="margin: 40px 55px 0 0;">
								<div class="imgBox">
									<div class="photo-add photo-add-nomar showTaxRegCertImage">
										<a :href="anicerData.organization.taxRegCertImage" target="_blank">
											<img :src="anicerData.organization.taxRegCertImage">
										</a>
									</div>
									<p style="margin-top: 10px;">税务登记证</p>
									<div class="photo-add photo-add-nomar showTaxRegCertImage">
										<a :href="anicerData.organization.taxpayerQualificationImage" target="_blank">
											<img :src="anicerData.organization.taxpayerQualificationImage">
										</a>
									</div>
									<p style="margin-top: 10px;">一般纳税人资格</p>
								</div>
							</div>
						</div>
					</div>
					<div class="check-item">
						<div class="if-item"><span class="span">开户银行许可证</span></div>
						<div class="item-unfold item-unfold-comfirm">
							<div class="unfold-content">
								<div class="column-group">
									<div class="group-aside">银行开户名：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bankAccountName}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">公司银行账号：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bankAccount}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">开户银行支行名称：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bankBranchName}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">开户银行支行联行号：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bankBranchLineNumber}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">开户银行支行地址：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">{{anicerData.organization.bankBranchAddress}}</span></div>
									</div>
								</div>
								<div class="column-group">
									<div class="group-aside">银行开户许可证电子版：</div>
									<div class="group-detail">
										<div class="detail-row"><span class="row-span">已上传</span></div>
										<!--<div class="detail-row">
											<div class="row-photo-m">
												<div class="photo-add photo-add-nomar"><img v-bind:src="anicerData.bankAccountPermissionImage"></div>
											</div>
										</div>-->
									</div>
								</div>
							</div>
							<div class="unfold-content-right" style="margin: 40px 50px 0 0;">
								<div class="imgBox">
									<div class="photo-add photo-add-nomar showBankAccountImg">
										<a :href="anicerData.organization.bankAccountPermissionImage" target="_blank">
											<img :src="anicerData.organization.bankAccountPermissionImage">
										</a>
									</div>
									<p style="margin-top: 13px;">银行开户许可证</p>
								</div>
							</div>
						</div>
					</div>
				</template>
				<div class="check-item">
					<div class="if-item"><span class="span">联系人信息</span>
						<a href="" class="btn btn-normal" v-show="false" @click.prevent="changeStep('company')">编辑</a>
					</div>
					<div class="item-unfold item-unfold-comfirm">
						<div class="unfold-content">
							<div class="column-group">
								<div class="group-aside">联系人：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.contactName}}</span></div>
								</div>
							</div>
							<div class="column-group">
								<div class="group-aside">手机号：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.contactMobile}}</span></div>
								</div>
							</div>
							<div class="column-group">
								<div class="group-aside">邮箱：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.contactEmail}}</span></div>
								</div>
							</div>
							<div class="column-group">
								<div class="group-aside">通讯地址：</div>
								<div class="group-detail">
									<div class="detail-row"><span class="row-span">{{anicerData.contactAddress}}</span></div>
								</div>
							</div>
						</div>
						<div class="unfold-content-right"></div>
					</div>
				</div>
			</div>
			<div class="form-footer" v-if="fromDrawer !== 'supplementDrawer'">
				<button class="btn btn-simple w120" @click.prevent="changeStep('contact')">上一步</button>
				<button class="btn btn-primary" @click.prevent="isConfirm = !isConfirm">提交审核</button>
			</div>
		</div>
		<div v-show="isConfirm">
			<div class="master"></div>
			<div class="dialog-pop">
				<div class="pop-header"><span class="header-text">提示</span><span class="header-close"><em class="icon icon-close"@click="isConfirm = false"></em></span></div>
				<div class="pop-body">
					<div class="body-infor">
						<h3>确定提交审核吗？</h3>
						<p>(提交审核后信息将不可更改，请确保无误)</p>
					</div>
				</div>
				<div class="pop-footer">
					<a href="" class="btn btn-primary" @click.prevent="saveHandler">确定提交</a>
					<a href="" class="btn btn-simple" @click.prevent="isConfirm = false">再检查一下</a>
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
import Event from 'event';
import router from '../../../route';
import {formatDate, copyObj} from 'utils/common';
import Http from 'utils/http';
export default{
	name:'register-confirm',
	data(){
		return{
			isConfirm:false,
			organization: {
				"certificateType": 1,
				"socialCreditCode": "",
				"licenseOffice": "",
				"companyType": "",
				"bizLicenseProvince": "",
				"bizLicenseCity": "",
				"bizLicensePostcode": "",
				"licenseType": 2,
				"companyName": "",
				"bizLicenseNumber": "",
				"legalReprName": "",
				"legalReprIdNumber": "",
				"legalReprIdImage": "", //身份证正面图片路径
				"legalReprIdBackImage": "", //身份证反面图片路径
				"bizLicenseAddress": "",
				"companyFoundDate": "",
				"bizStartDate": "",
				"bizEndDate": "",
				"regCapital": "",
				"bizScope": "",
				"bizLicenseImage": "", //上传营业执照副本电子版
				"companyAddress": "",
				"companyPhone": "",
				"emerContact": "",
				"emerContactPhone": "",
				"companyEmail": "",
				"orgCode": "",
				"orgCodeImage": "", //组织机构代码电子版
				"taxNumber": "",
				"taxpayerType": 0,
				"taxCode": 0,
				"taxRegCertImage": "", //税务登记证电子版
				"taxpayerQualificationImage": "", //一般纳税人资格电子版
				"bankAccountName": "",
				"bankAccount": "",
				"bankBranchName": "",
				"bankBranchLineNumber": "",
				"bankBranchAddress": "",
				"bankAccountPermissionImage": "", //银行开户许可证电子版
			},
			fromDrawer: ''
		};
	},
	created() {
		if (this.$route.name == 'supcert') {
			this.fromDrawer = 'supplementDrawer';
		}
	},
	mounted(){
		//其他页面的上一步
		Event.$off('prevStep');
		Event.$on('prevStep',() => {
			this.changeStep('contact');
		});
	},
	computed:{
		companyNature:() => store.state.anicerFormData.companyNature,
		anicerData:() => store.state.anicerFormData,
		hasCompanyInfo:() => store.state.anicerControl.hasCompanyInfo,
		userInfo: () => store.state.userInfo,
		formatFoundDate(){
		    return formatDate(store.state.anicerFormData.organization.companyFoundDate,'yyyy-MM-dd');
		},
		formatBizDate(){
			return formatDate(store.state.anicerFormData.organization.bizStartDate,'yyyy-MM-dd') + ' - ' + formatDate(store.state.anicerFormData.organization.bizEndDate,'yyyy-MM-dd');
		},
		taxpayerTypeText(){
		    let type = store.state.anicerFormData.organization.taxpayerType;
		    let map  = {
			    0: '非一般纳税人',
			    1: '一般纳税人',
			    2: '小规模纳税人',
			    3: '非增值税纳税人',
			};
			return map[type];
		},
		taxCodeText(){
		    let code = store.state.anicerFormData.organization.taxCode;
			let map = {
				0: '0%',
				1: '3%',
				2: '6%',
				3: '7%',
				4: '11%',
				5: '13%',
				6: '17%',
				7: '图书13%免税',
			};
			return map[code];
		},
		person(){
			let companyNature = this.companyNature ? this.companyNature : store.state.anicerFormData.type;
			if(companyNature == 1){
				return 'POP商家'
			} else if(companyNature == 2){
				return '品牌商'
			} else if(companyNature == 3){
				return '代理商'
			} else if(companyNature == 5){
				return '合作企业'
			}
		},
		gomeplusAccount:() => store.state.userInfo.loginName
	},
	methods:{
		saveHandler(){
			let vm = this;
			if(store.state.anicerFormData.companyNature) {
				actions.setAnicerData(store, {type: store.state.anicerFormData.companyNature});
			}
			let params = copyObj(store.state.anicerFormData);
			let organization = copyObj(this.organization);
			if (params.organization.certificateType == 2) {
				organization.companyName = params.organization.companyName;
				organization.taxNumber = params.organization.taxNumber;
				organization.certificateType = params.organization.certificateType;
				params.organization = organization;
			} else {
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
			}
			Http.post('/api/anicer', params)
				.then((response) => {
					if (response.status === 200 && response.data.code === 200 && response.data.iserror === 0) {
						Http.get('/api/user')
						    .then((res) => {
						    	localStorage.removeItem(this.userInfo.userId);
						    	localStorage.removeItem(this.userInfo.userId + '_brands');
						    	localStorage.removeItem(this.userInfo.userId + '_categorys');
						    	localStorage.removeItem(this.userInfo.userId + '_identity');
						    	localStorage.removeItem(this.userInfo.userId + '_refuse');
							    actions.setUserInfo(store, res.data.data);
							    router.push({name: 'succeed'});
						    });
					}
				}).catch((error) => {
					console.log(error);
					// vm.showMessage('修改失败，请稍后重试！','error');
				});
		},
		saveLocalData(key, data) {
			if (!!localStorage.getItem(this.userInfo.userId)) {
				let localData = JSON.parse(localStorage.getItem(this.userInfo.userId));
				localData[key] = data;
				localStorage.setItem(this.userInfo.userId, JSON.stringify(localData));
			}
		},
		changeStep(type){
			actions.controlAnicer(this.$store,{isSucceed:store.state.anicerControl.isSucceed,step:type});
			this.saveLocalData('step', type);
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
	.supplementConfirm{
		margin: 0;
	}
	.account_content .content-form .form-if .item-unfold .unfold-content .column-group{
		width:600px;
	}
	.unfold-content{
		width:600px;
		display: inline-block;
	}
	.unfold-content-right{
		float: right;
		text-align: center;
	}
	.open_account .group-detail{
		width:300px;
		word-wrap: break-word;
	}
	.account_content .content-form .form-if .item-unfold .unfold-content .column-group  .group-aside{
		width:250px;
	}
	.imgBox p {
		text-align:center;
		margin-bottom: 20px;
	}
	.showBizLicenseImage {
		width:140px;
		margin-top: 20px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
	}
	.showBizLicenseImage img{
		width:138px;
		height: 198px;
		border-radius: 4px;
	}
	.showLegalReprId {
		width: 140px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
	}
	.showLegalReprId img {
		width: 138px;
		height: 78px;
		border-radius: 4px;
	}
	.showBankAccountImg {
		width: 144px;
		height: 100px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 20px;
	}
	.showBankAccountImg img {
		width:100%;
		height: 100%;
	}
	.showOrgCodeImage {
		width: 140px;
		height: 200px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	.showOrgCodeImage img {
		width:100%;
		height: 100%;
	}
	.showTaxRegCertImage {
		width: 140px;
		height: 100px;
		border: 1px solid #d9dbde;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	.showTaxRegCertImage img {
		width:100%;
		height: 100%;
	}
</style>
