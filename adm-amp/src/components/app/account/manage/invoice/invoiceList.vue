<template>
	<div class="page-content">
		<div class="content" style="margin-top: 30px;">
			<div class="account-set">
				<div class="set-fn">
					<button class="btn btn-primary" @click.prevent="add">申请开具发票</button>
					<span v-show="isShowMonthTip" style="color: red;">每个自然月只能提交一次发票申请</span>
					<span v-show="isShowApproveWaitTip" style="color: red;">您的资质正在审核中</span>
				</div>
				<div class="set-fn">
					<div class="fn-plan">
						<span class="plan-title">选择时间</span>
						<el-date-picker v-model="searchParams.date" type="daterange" :editable="false" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="datePickOptions">
						</el-date-picker>
					</div>
					<div class="fn-search" @click.prevent="search">
						<a href="" class="btn btn-primary">查询</a>
					</div>
				</div>
			</div>
			<div class="amp-data">
				<div class="data-table" id="con-table-change">
					<div class="main-table-wapper">
						<table class="table main-table">
							<thead class="list-header">
							<tr>
								<th><span>申请日期</span></th>
								<th><span>金额</span></th>
								<th><span>状态</span></th>
								<th><span>查看详情</span></th>
							</tr>
							</thead>
							<tbody>
							<tr class="body-row" v-if="list.length == 0">
								<td colspan="4" style="text-align: center; height: 100px;line-height: 100px;">无相关查询结果</td>
							</tr>
							<tr v-for="item in list">
								<td><span>{{item.createTime | moment('YYYY.MM.DD')}}</span></td>
								<td><span>{{item.amount/100}}元</span></td>
								<td><span>{{approveStatus(item.approveStatus)}}</span></td>
								<td>
									<span>
										<b class="operat-link">
											<router-link :to="{name: 'viewinvoice', params: {id: item.invoiceId}}" target="_blank" class="el-icon-search"
											   style="padding:5px;cursor:pointer;color:black;"></router-link>
										</b>
									</span>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<el-pagination
				v-show="Math.floor(page.totalCount / page.pageSize) > 0" @size-change="pageSizeChange"
				@current-change="currentPageChange" :current-page="page.currentPage" :page-sizes="page.pageSizes"
				:page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount"
				:class="{'el-pagination-reset': true}">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import Http from 'utils/http';
	import moment from 'moment';
	import CONST from 'help/CONST.js';
	import {formatDate, mixin, mixinSource,copyObj} from 'utils/common';
	import router from '../../../../../route.js';

	export default {
		name: 'invoiceList',
		data() {
			return {
				params: '',
				showAdvertiserPass: false,
				invoiceId: '',
				data: {},
				datePickOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				searchParams: {
					keyword: "",
					startTime: "",
					endTime: "",
					date: []
				},
				list: [],
				date: '',
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 20
				},
				isMonthInvoced: false,
				isShowMonthTip: false,
				isShowApproveWaitTip: false,
				isFull: true,       //true => 资质全 false=> 资质不全
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
				originalOrganization:{}
			};
		},
		computed: {
			supplementUrl() {
				return $CONFIG['domain'] + '/#/app/account/supcert';
			},
			createInvoice() {
				return $CONFIG['domain'] + '/#/app/account/newinvoice';
			}
		},
		created() {
			this.getList();
		},
		methods: {
			search() {
				this.getList();
			},
			getList() {
				let searchParams = this.searchParams;
				Http.get("/api/invoices", {
					params: {
						startTime: searchParams.date[0] ? moment(searchParams.date[0]).valueOf() : '',
						endTime: searchParams.date[1] ? moment(searchParams.date[1]).valueOf() : '',
						page: this.page.currentPage,
						number: this.page.pageSize,
						source: 1
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.list = res.data.data.list;
						this.page.totalCount = res.data.data.totalCount;
						if (this.page.currentPage === 1) {
							let monthStart = moment().startOf('month').valueOf();
							let monthEnd = moment().endOf('month').valueOf();
							if (this.list.length > 0 && this.list[0].createTime >= monthStart && this.list[0].createTime <= monthEnd) {
								this.isMonthInvoced = true;
							}
						}
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			pageSizeChange(size) {
				this.page.pageSize = size;
				this.getList();
			},
			currentPageChange(page) {
				this.page.currentPage = page;
				this.getList();
			},
			getData(cb) {
				var that = this;
				let message;
				Http.get("/api/anicer/supply")
					.then((res) => {
						let anicerData = res.data.data;
						anicerData.organization.certificateType = 1;
						let organizationData = mixinSource(this.companyData.organization, anicerData.organization);
						let data = mixinSource(this.companyData, anicerData);
						this.originalOrganization = copyObj(anicerData);
						this.companyData.organization = copyObj(organizationData);
						this.companyData.companyNature = anicerData.type;
						this.handlerOrganization(this.companyData);
						if(anicerData.approveStatus == 0){   //-1为审核失败,0为待审核，1为审核通过
							this.isShowApproveWaitTip = true;
						} else if(this.isFull && anicerData.approveStatus == 1){
							Http.get('/api/invoice/available')
								.then((res) => {
									if (res.data.code === 200) {
										this.isShowApproveWaitTip = false;
										cb();
									}
								})
								.catch((error) => {
									console.log(error);
								});
						} else {
							this.isShowApproveWaitTip = false;
							router.push({name: 'supcert', target: 'blank'});
						}
					})
					.catch((error) => {
						console.log(error);
					});
			},
			//判断资质是否为空
			handlerOrganization(Data){
				this.isFull = true;
				let organization = Data.organization;
				if (organization.licenseType == 2) {
					for (let data in organization) {
						if (!(data == 'bizLicenseNumber' || data == 'orgCode' || data == 'orgCodeImage' || data == 'taxNumber' || data == 'taxpayerType' || data == 'taxCode' || data == 'taxRegCertImage' || data == 'taxpayerQualificationImage')) {
							if(!organization[data] && organization[data] !== 0){
								this.isFull = false;
								break;
							}
						}
					}
				} else {
					for (let data in organization) {
						if (!(data == 'companyType' || data == 'socialCreditCode' || data == 'licenseOffice')) {
							if(!organization[data] && organization[data] !== 0){
								this.isFull = false;
								break;
							}
						}
					}
				}
			},
			add() {
				if (this.isMonthInvoced) {
					this.isShowMonthTip = true;
					return;
				}
				this.getData(() => {
					router.push({name: 'newinvoice', target: 'blank'});
				});
			},
			approveStatus(status) {
				// @todo
				if (status == 1) {
					return "已通过";
				} else if (status == 0) {
					return "已提交";
				} else if (status == -1) {
					return "未通过";
				}
				return "";
			}
		}
	};
</script>

