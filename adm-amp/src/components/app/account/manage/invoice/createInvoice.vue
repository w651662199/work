<template>
	<div class="page-content">
		<div class="page-title" style="padding: 0 180px;">
			<p>申请开具发票</p>
			<p class="warn-msg">每个自然月只能提交一次发票申请</p>
		</div>
		<div class="content">
			<el-form :model="formData" ref="formData" :rules="formRules" label-width="155px" style="margin: 0 150px;">
				<div style="font-size:20px;padding-bottom: 20px;">发票详情</div>
				<el-form-item label="公司抬头：" prop="companyName" class="is-required">
					<span>{{formData.companyName}}</span>
				</el-form-item>
				<el-form-item label="发票内容：" prop="content" class="is-required">
					<span>{{formData.content}}</span>
				</el-form-item>
				<el-form-item label="可开金额：" class="is-required" v-if="formData.isSinglePush==0">
					<el-col :span="18">
						{{formData.balance / 100}}&nbsp;元
					</el-col>
				</el-form-item>
				<el-form-item label="发票类型：" class="is-required">
					<el-select v-model="formData.type" style="width:420px;" placeholder="增值税专用发票">
						<el-option v-for="item in identify.options" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择日期：" prop="dateRange" class="is-required" v-if="formData.isSinglePush==0">
					<el-date-picker @change='selectDataRange' v-model="formData.dateRange" type="daterange" :picker-options="datePickerOptions" :editable="false" placeholder="请选择消费日期" style="width:420px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="开票金额：" class="is-required" prop="amount">
					{{formData.amount / 100}}&nbsp;元
				</el-form-item>
				<el-form-item label="纳税人识别号：" class="is-required" v-show="formData.licenseType==1">
					<span>{{formData.taxNumber}}</span>
				</el-form-item>
				<el-form-item label="统一社会信用代码：" class="is-required" v-show="formData.licenseType==2">
					<span>{{formData.socialCreditCode}}</span>
				</el-form-item>
				<el-form-item label="注册地址：" prop="companyAddress" class="is-required">
					<span>{{formData.companyAddress}}</span>
				</el-form-item>
				<el-form-item label="注册电话：" prop="companyPhone" class="is-required">
					<span>{{formData.companyPhone}}</span>
				</el-form-item>
				<el-form-item label="开户银行：" prop="bankBranchName" class="is-required">
					<span>{{formData.bankBranchName}}</span>
				</el-form-item>
				<el-form-item label="银行账号：" prop="bankAccount" class="is-required">
					<span>{{formData.bankAccount}}</span>
				</el-form-item>
				<div style="font-size:20px;padding-bottom: 20px;">收件信息</div>
				<el-form-item label="收件人：" prop="invoiceRecipient.name" class="is-required">
					<el-input style='width:420px;' v-model="formData.invoiceRecipient.name" placeholder="请输入收件人"></el-input>
				</el-form-item>
				<el-form-item label="所在地区：" prop="zone" class="is-required">
					<v-distpicker class='region' @province="getProvince" @city="getCity" @area="getArea" @selected="getRegion"></v-distpicker>
				</el-form-item>
				<el-form-item label="详细地址：" prop="invoiceRecipient.address" class="is-required">
					<el-input style='width:420px;' v-model="formData.invoiceRecipient.address" placeholder="请输入详细地址"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" prop="invoiceRecipient.phone" class="is-required">
					<el-input style='width:420px;' v-model="formData.invoiceRecipient.phone" placeholder="请输入联系电话"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div class="page-footer form-footer">
			<a class="btn btn-primary" href="javascript:void(0)" @click.prevent="saveInvoice">申请开具发票</a>
		</div>
		<transition name="fade" v-if="isShowDialog">
			<div class="master" style="z-index: 1300;">
				<div class="dialog-pop">
					<div class="pop-header"><span class="header-text">提交开票申请</span><span class="header-close" @click="closeDialog"><em class="icon icon-close"></em></span></div>
					<div class="pop-body">
						<div class="body-infor">
							<h3>资料提交后将不可修改确认提交吗？</h3>
						</div>
					</div>
					<div class="pop-footer"><span class="btn btn-primary" @click="saveHandler">确认</span><span class="btn btn-simple" @click="closeDialog">取消</span></div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import Http from 'http';
import Distpicker from 'v-distpicker';
import { copyObj, isEmptyObj, getImgSize, mixin, limitLen, mixinSource } from 'utils/common';
import moment from 'moment';
import router from '../../../../../route.js';
export default {
	name: 'AccountInvoiceCreate',
	data() {
		return {
			isShowDialog: false,
			anicerData: {},
			formData: {
				content: '技术服务费',
				amount: 0,
				type: 1,
				startTime: '',
				endTime: '',
				limitStartTime: '',
				limitEndTime: '',
				companyName: '',
				licenseType: '',
				socialCreditCode: '',
				companyAddress: '',
				companyPhone: '',
				taxNumber: '',
				bankBranchName: '',
				bankAccount: '',
				balance: '',
				isSinglePush: 0,
				selectDateList: [],
				userId: 0,
				source: 0,
				advertiserId: 0,
				organizationId: 0,
				operatorAccountId: 0,
				invoiceTime: [],
				invoiceRecipient: {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					address: ''
				},
				dateRange: ['', '']
			},
			postFormData: {
				content: '',
				amount: 0,
				type: 1,
				startTime: '',
				endTime: '',
				companyName: '',
				companyAddress: '',
				companyPhone: '',
				taxNumber: '',
				bankBranchName: '',
				bankAccount: '',
				invoiceRecipient: {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					address: ''
				},
			},
			select: {
				province: "省",
				city: "市",
				district: "区"
			},
			identify: {
				options: [{
					label: "增值税普通发票",
					value: 1
				}, {
					label: "增值税专用发票",
					value: 2
				}],
			},
			datePickerOptions: {
				disabledDate: (time) => {
					var judge = false;
					this.formData.selectDateList.forEach((data, index) => {
						if (time.getTime() >= data[0] && time.getTime() <= data[1]) {
							judge = true;
						}
					});
					return judge || time.getTime() < moment(this.formData.limitStartTime).startOf('day').valueOf() || time.getTime() >= moment(this.formData.limitEndTime).startOf('day').valueOf();
				}
			},
			formRules: {
				dateRange: [{
					validator: (rule, value, callback) => {
						if(!(value && value[0])) {
							callback(new Error("请选择消费日期"));
						} else {
							callback();
						}
					},
					trigger: "change"
				}],
				'startTime': [{
					validator: (rule, value, callback) => {
						if(value == '' || this.formData.endTime == '') {
							callback(new Error('请选择消费日期'));
						} else if(+this.formData.endTime != 0 && +this.formData.startTime > +this.formData.endTime) {
							callback(new Error("开始时间不得晚于结束时间"));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}],
				'zone':[{validator: (rule, value, callback) => {
					if (this.isRegionError) {
						callback(new Error('请选择地区'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'companyName': [{validator: function(rule, value, callback) {
					if (!limitLen(value, 100)) {
						callback(new Error('最大长度不超过100个字符'));
					} else if (value == '') {
						callback(new Error('请填写公司抬头'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'content': [{validator: function(rule, value, callback) {
					if (!limitLen(value, 30)) {
						callback(new Error('最大长度不超过30个字符'));
					} else if (value == '') {
						callback(new Error('请填写开票内容'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'amount': [{
					validator: (rule, value, callback) => {
						if(!/^\d+(\.\d+)?$/g.test(value)) {
							callback(new Error('请输入合法的金额'));
						} else if (!limitLen(value, 30)) {
							callback(new Error('最大长度不超过30个字符'));
						} else if (value == '') {
							callback(new Error('请填写开票金额'));
						} else if(value < 10000){
							callback(new Error('开票金额需不少于100元'));
						} else {
							callback();
						}
					},
					trigger: 'change'
				}],
				'companyAddress': [{validator: function(rule, value, callback) {
					if (!limitLen(value, 60)) {
						callback(new Error('最大长度不超过60个字符'));
					} else if (value == '') {
						callback(new Error('请填写注册地址'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'companyPhone': [{validator: function(rule, value, callback) {
					if (!limitLen(value, 60)) {
						callback(new Error('最大长度不超过60个字符'));
					} else if (value == '') {
						callback(new Error('请填写注册电话'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'bankBranchName': [{validator: function(rule, value, callback) {
					if (!limitLen(value, 60)) {
						callback(new Error('最大长度不超过60个字符'));
					} else if (value == '') {
						callback(new Error('请填写开户银行'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'bankAccount':[{validator: function(rule, value, callback) {
					if (!limitLen(value, 60)) {
						callback(new Error('最大长度不超过60个字符'));
					} else if (value == '') {
						callback(new Error('请填写银行账号'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'taxNumber':[{validator: function(rule, value, callback) {
					if (!limitLen(value, 60)) {
						callback(new Error('最大长度不超过60个字符'));
					} else if (value == '') {
						callback(new Error('请填写纳税人识别号'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'invoiceRecipient.name': [{validator: function(rule, value, callback) {
					if (value == '' || value.trim().length === 0) {
						callback(new Error('请填写收件人'));
					} else if (!limitLen(value, 10)) {
						callback(new Error('最大长度不超过10个字符'));
					} else if (value == '') {
						callback(new Error('请填写收件人'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'invoiceRecipient.address': [{validator: function(rule, value, callback) {
					if (value == '' || value.trim().length === 0) {
						callback(new Error('请填写详细地址'));
					} else if (!limitLen(value, 100)) {
						callback(new Error('最大长度不超过100个字符'));
					} else if (value == '') {
						callback(new Error('请填写详细地址'));
					} else {
						callback();
					}
				}, trigger: 'change' }],
				'invoiceRecipient.phone': [{
					required: true,
					message: '请填写联系电话',
					trigger: 'blur'
				}, {
					validator: function(rule, value, callback) {
						let integer1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
						let integer2 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
						if(!integer1.test(value) && !integer2.test(value)) {
							callback(new Error('请输入正确的联系电话，座机示例：010-88701111，手机号示例：13811111111'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
			},
			isRegionError: true,
			isRegionEnd: false
		};
	},
	computed: {
		invoiceTime() {
			let selectRange = [];
			selectRange.push(this.formData.startTime);
			selectRange.push(this.formData.endTime);
			return this.getRangeList(this.formData.selectDateList, selectRange);
		}
	},
	components: {
		'v-distpicker': Distpicker
	},
	created() {
		this.getAnicerData();
		this.getInvoiceAvilable();
	},
	methods: {
		closeDialog() {
			this.isShowDialog = false;
		},
		saveInvoice() {
			this.$refs.formData.validate((res) => {
				if (res) {
					this.isShowDialog = true;
				}
			});
		},
		saveHandler() {
			let params = mixin(mixinSource(this.postFormData, this.formData), {'invoiceTime': JSON.stringify(this.invoiceTime)});
			Http.post('/api/invoice', params).then((res) => {
				if(res.data.code == 200) {
					router.push({name: 'invoice'});
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		getAnicerData() {
			Http.get("/api/anicer/supply").then(res => {
				if (res.data.code == 200) {
					this.formData.limitStartTime = res.data.data.createTime;
					this.formData.limitEndTime = Date.now();
					this.formData = mixinSource(this.formData, res.data.data);
					this.formData = mixinSource(this.formData, res.data.data.organization);
					this.formData.type = 1;
				}
			});
		},
		getInvoiceAvilable() {
			Http.get('/api/invoice/available').then((res) => {
				if (res.data.code === 200) {
					this.formData.selectDateList = res.data.data.selectedDates;
					this.formData.balance = res.data.data.balanceAmount;
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		selectDataRange() {
			if (this.formData.dateRange && this.formData.dateRange[0] != null) {
				this.formData.startTime = moment(this.formData.dateRange[0]).startOf('day').valueOf();
				this.formData.endTime = moment(this.formData.dateRange[1]).endOf('day').valueOf();
				Http.get('/api/invoice/time', {
					params: {
						invoiceTime: JSON.stringify(this.invoiceTime),
						startTime: this.formData.startTime,
						endTime: this.formData.endTime
					}
				}).then((res) => {
					if (res.data.code == 200) {
						let amount = res.data.data.amount,
							balance = this.formData.balance;
						this.formData.amount = amount > balance ? balance : amount;
						this.$refs.formData.validateField('amount');
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		getRangeList(disabledList,selectRange){
			let ableList = [];
			for (let i = selectRange[0]; i <= selectRange[1]; i += 8.64e7) {
				let isDisabled = false;
				for (let j = 0; j < disabledList.length; j++) {
					let disabled = disabledList[j];
					if (i >= disabled[0] && i <= disabled[1]) {
						isDisabled = true;
						break;
					}
				}
				if (!isDisabled) {
					ableList.push(i);
				}
			}
			let rangeList = [];
			let tempArr = [];
			let isContinuous = false;
			for (let i = 0; i < ableList.length; i++) {
				let temp1 = ableList[i];
				let temp2 = i == ableList.length ? ableList[i] : ableList[i + 1];
				if (temp1 + 8.64e7 == temp2) {
					if (!isContinuous) {
						tempArr.push(temp1);
					}
					isContinuous = true;
					continue;
				} else {
					isContinuous = false;
					tempArr.push(temp1);
				}
				if (!isContinuous) {
					rangeList.push(tempArr);
					tempArr = [];
				}
			}
			let rangeListArr = [];
			rangeList.forEach((range) => {
				let obj = {
					startTime: range[0],
					endTime: range[range.length - 1] + 8.64e7 -1
				};
				rangeListArr.push(obj);
			});
			return rangeListArr;
		},
		limitSelectWidth(){
			let Box = document.getElementsByClassName('region')[0];
			Box.getElementsByTagName('select')[0].style.width = '155px';
			Box.getElementsByTagName('select')[1].style.width = '135px';
			Box.getElementsByTagName('select')[2].style.width = '120px';
		},
		getProvince(data){
			this.select.province = data.value;
		},
		getCity(data){
			this.select.city = data.value;
		},
		getArea(data){
			this.select.district = data.value;
		},
		getRegion(data){
			this.select.province = data.province.value;
			this.select.city = data.city.value;
			this.select.district = data.area.value;
			this.formData.invoiceRecipient.province = data.province.value;
			this.formData.invoiceRecipient.city = data.city.value;
			this.formData.invoiceRecipient.district = data.area.value;
			this.isRegionError = false;
			this.isRegionEnd = true;
		},
		closeDrawer() {
			Event.$emit('close-invoiced-drawer');
		},
		doChangeImgType(num) {
			let map = {
				'0': 'legalReprIdImage',
				'1': 'legalReprIdBackImage',
				'2': 'bizLicenseImage',
				'3': 'orgCodeImage',
				'4': 'taxRegCertImage',
				'5': 'taxpayerQualificationImage',
				'6': 'bankAccountPermissionImage'
			};
			return map[num];
		}
	},
	watch: {
		'select':{
			handler:function(val,oldVal){
				if (this.isRegionEnd && !this.isRegionError) {
					this.isRegionEnd = false;
					return false;
				};
				if (!this.isRegionError) {
					this.isRegionError = true;
				}
			},
			deep: true
		}
	}
};
</script>