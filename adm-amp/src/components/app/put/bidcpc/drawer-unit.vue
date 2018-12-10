<template>
	<div>
		<div class="amp-form amp-form02">
			<el-popover ref="popover1" placement="right-start" width="390" trigger="hover">
				<h2 class="bidcpc-example-title">广告可能出现的位置：</h2>
				<ul class="bidcpc-example-content">
					<li v-for='(item, index) in showExample'>
						<p>{{item.title}}</p>
						<img :src="item.lSrc"/>
						<a :href="item.bSrc" target="_blank">查看大图</a>
					</li>
				</ul>
			</el-popover>
			<div class="form-column">
				<el-form :model="formData" :rules="rules" ref="formData" label-width="140px">
					<el-form-item label="投放单元名称：" prop="name">
						<el-input v-model="formData.name" :disabled="actionType == 'modify'"></el-input>
					</el-form-item>
					<el-form-item label="投放类型：">
						<!--<el-radio-group v-model="formData.type">
							<el-radio :label="1">商品推广</el-radio>
						</el-radio-group>-->
						商品推广
					</el-form-item>
					<el-form-item label="资源位类型：" prop='advertisementGroups'>
						<el-checkbox-group v-model="formData.advertisementGroups">
							<el-checkbox :label="1">搜索位</el-checkbox>
							<el-checkbox :label="2">推荐位<el-button  type="text" v-popover:popover1>(示例)</el-button></el-checkbox>
						</el-checkbox-group>
					</el-form-item>

					<el-form-item label="地域定向：">
						<el-radio-group v-model="formData.regionType">
							<el-radio :label="0">不限</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" style="margin-top: -20px;" prop="region" v-show="formData.regionType">
						<el-checkbox v-model="regionCheck" @change="selectAllRegion">全选</el-checkbox>
						<div class="address-list">
							<div class="list-province">
								<ul>
									<li v-for="(item, index) in regionData" @click="applyInnerCity(index)">
										<el-checkbox v-model="item.checked" :indeterminate="item.city.filter((each) => {return each.checked}).length > 0 && item.city.filter((each) => {return each.checked}).length < item.city.length" @change="selectProvince(item, index)"></el-checkbox>
										<span>{{item.name}}</span>
										<!--<span class="tips-span">{{item.city.filter((each) => {return each.checked}).length}}/{{item.city.length}}</span>-->
									</li>
								</ul>
							</div>
							<div class="list-city">
								<ul>
									<li v-for="(item, index) in regionChildrenData">
										<el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
									</li>
								</ul>
							</div>
						</div>
						<div v-if="formData.region.length>0">
							<span class="selectSpan">已选：</span>
							<div>
								<el-tag
									:key="tag"
									v-for="(tag,index) in regionData.filter((item) => {return item.checked || item.city.filter((each) => {return each.checked}).length > 0 && item.city.filter((each) => {return each.checked}).length < item.city.length})"
									:closable="true"
									:close-transition="false"
									@close="handleClose(tag,index)"
								>
									{{tag.name}}
								</el-tag>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="时间段定向：">
						<el-radio-group v-model="formData.timeType">
							<el-radio :label="0">全时间段</el-radio>
							<el-radio :label="1">自定义时间段</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" v-show="formData.timeType === 1" prop="time" label-width="32px">
						<el-row class="time-space">
							<div class="space-cont">
								<div class="cont-tip">
									<span style="float: left;color:#a5a6a7; margin-left: 10px;">点击或拖拽可选择时间段</span>
									<i class="time-pointer green-module"></i><span class="time-tip-text">已选择</span>
									<i class="time-pointer"></i><span class="time-tip-text">未选择</span>
								</div>
							</div>
						</el-row>
						<table class="time-table" ondragstart="return false">
							<thead>
							<tr>
								<th>小时</th>
								<th :colspan="6">00:00-06:00</th>
								<th :colspan="6">06:00-12:00</th>
								<th :colspan="6">12:00-18:00</th>
								<th :colspan="6">18:00-24:00</th>
							</tr>
							<tr>
								<th>天</th>
								<th v-for="i in 24">{{i}}</th>
							</tr>
							</thead>
							<tbody @mouseleave="timeTip.isShowTip = false">
							<tr v-for="(whichweek,week) in formData.time">
								<td class="timeCheck"  @mouseenter="timeTip.isShowTip = false">
									<el-checkbox v-model="timeAllDayCheck[week]"
												 @change="selectAllDay(week)">星期{{numToCh(week)}}
									</el-checkbox>
								</td>
								<td v-for="(whichtime,t) in whichweek.time"
									@mousedown="timeSelStart(whichtime,t,week)"
									@mouseenter="timeSelMove(t,week)"
									@mouseup="timeSelEnd"
									:class="{'select-module': whichtime.sel,'move-module':whichtime.mov}">
								</td>
							</tr>
							<div class="timeTableTip" :style='{"top":timeTip.top,"left":timeTip.left}' v-show="timeTip.isShowTip" v-html="timeTip.tipMsg"></div>
							</tbody>
						</table>
						<el-row style="margin-top: 20px;">
							<el-col :span="2">
								<span>快速选择:</span>
							</el-col>
							<el-col :span="22" class="timeselBtnGroup">
								<el-radio-group v-model="showTimeSlot">
									<el-button class="btn"  @click="selectMultiDay(['0','1', '2', '3', '4', '5', '6'])">整周投放</el-button>
									<el-button class="btn"  @click="selectMultiDay(['0','1', '2', '3', '4'])">工作日投放</el-button>
									<el-button class="btn"  @click="selectMultiDay(['5', '6'])">周末投放</el-button>
								</el-radio-group>
							</el-col>
						</el-row>
						<el-row v-if="times.filter((item) => {return item.length>0}).length > 0">
							<el-col :span="2">
								<span>已选时间段:</span>
							</el-col>
							<el-col :span="22">
								<div  class="selectTime">
									<el-button @click="clearSelect">清空选择</el-button>
									<div v-for="(items,index) in times" v-if="items.length > 0">
										<span class="selectTimeTitle">星期{{numToCh(index-1)}}</span>
										<div class="selectTimeCont">
												<span v-for="(item , i) in items">
												   {{getTimeZone(item)}}
											    </span>
										</div>
									</div>
								</div>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="人群定向：">
						<el-button @click="selectCrowd">+选择人群</el-button>

						<span v-show="formData.crowds && formData.crowds.length > 0">
							<label style="margin-left: 20px"> 通投: {{formData.isGeneralDelivery == 1 ? '是' : '否' }}</label>
							<el-tooltip placement="right" effect="light">
								<div slot="content">
									设置“通投”<br/>
									1.符合人群定向条件人群以原单元出价*（1+人群溢价）参与竞价；<br/>
									2.不符合人群定向条件的人群以原单元出价参与竞价；<br/>
									<br/>
									未设置“通投”<br/>
									1.符合人群定向条件的人群以原单元出价*（1+人群溢价）参与竞价；<br/>
									2.不符合人群定向条件人群，该单元广告不投放。<br/>
								</div>
								<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
							</el-tooltip>
						</span>

						<div class="detail-row selCrowdsTable" v-show="formData.crowds && formData.crowds.length > 0">
							<table class="table main-table">
								<thead>
								<tr class="list-header">
									<th>人群名称</th>
									<th>溢价</th>
									<th>操作</th>
								</tr>
								</thead>
								<tbody>
								<tr class="body-row" v-for="(item,index) in formData.crowds">
									<td><span>{{item.name}}</span></td>
									<td><span>{{item.premium}}%</span></td>
									<td><span><em class="icon icon-delete" @click="deleteCrowds(index)"></em></span></td>
								</tr>
								</tbody>
							</table>
						</div>
					</el-form-item>

					<!-- <el-form-item label="人群信息定向：">
						<el-radio-group v-model="formData.ageType">
							<el-radio :label="0">不限年龄</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" v-show="formData.ageType === 1">
						<el-checkbox-group v-model="formData.age">
							<el-checkbox label="0-18岁"></el-checkbox>
							<el-checkbox label="19-26岁"></el-checkbox>
							<el-checkbox label="27岁以上"></el-checkbox>
					  </el-checkbox-group>
					</el-form-item>

					<el-form-item label="">
						<el-radio-group v-model="formData.genderType">
							<el-radio :label="0">不限性别</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" v-show="formData.genderType === 1">
						<el-checkbox-group v-model="formData.gender">
							<el-checkbox label="男"></el-checkbox>
							<el-checkbox label="女"></el-checkbox>
						</el-checkbox-group>
					</el-form-item> -->
					<el-form-item label="关键词设置：" v-show="formData.advertisementGroups.find((n) => n == 1)" >
						<el-button style='position: relative;' @click="showAddKeyword = true">{{actionType == 'new' ? '+添加关键词' : '管理关键词'}}<div v-show='showHintKeywords' class="hintKeywords">*请添加关键词</div></el-button>
						<div class="detail-row" v-show="formData.keywords.length">
							<table class="table" style="width:400px;margin-top:20px;">
								<tbody>
								<tr>
									<th><span>已购买</span></th>
									<th><span>PC端出价</span></th>
									<th><span>操作</span></th>
								</tr>
								</tbody>
							</table>
						</div>
						<div class="detail-row" v-show="formData.keywords.length" style="width: 420px;height: 150px;overflow: auto;margin-top: -1px;">
							<table class="table" style="width:400px;">
								<tbody>
								<tr v-for="(item, index) in formData.keywords">
									<td><span>{{item.name}}</span></td>
									<td><span>{{item.pcBid / 100}}</span></td>
									<td><span><em class="icon icon-delete" @click="deleteKeywords(index)"></em></span></td>
								</tr>
								</tbody>
							</table>
						</div>
					</el-form-item>
					<el-form-item label="PC端推荐广告出价：" label-width="160px" v-show="formData.advertisementGroups.find((n) => n == 2)" >
						<el-row style="margin-bottom: -10px;">
							<el-col :span="3">
								<div class="ele-input ele-input04">
									<input type="text" value="" id="adBidInput" v-model="formData.adBid"
										   @keyup="adBidValidator('adBid', 'PC端推荐广告出价')">
									<!--@mouseout="adBidBlurCheck('adBidInput')"-->
								</div>
							</el-col>
							<el-col :span="4">
								<span style="margin-left: 10px">元/点击</span>
							</el-col>
						</el-row>
						<div class="el-form-item__error" id="adBidError" v-if="validate.adBid.isError">{{validate.adBid.errorMsg}}</div>
					</el-form-item>

					<el-form-item label="无线端广告出价系数：" label-width="160px" v-if="false">
						<el-row style="margin-bottom: -10px;">
							<el-col :span="3">
								<div class="ele-input ele-input04">
									<input type="text" value="" id="wirelessAdBidRatioInput" v-model="formData.wirelessAdBidRatio"
										   @keyup="wirelessAdBidRatioValidator('wirelessAdBidRatio', '无线端广告出价系数')">
								</div>
							</el-col>
							<el-col :span="4">
								<span style="margin-left: 10px"></span>
								<el-popover
									ref="popover1"
									placement="right-end"
									width="250"
									trigger="hover"
									content="无线端出价=PC端出价*无线端出价系数">
								</el-popover>
								<em class="icon icon-help" v-popover:popover1></em>
							</el-col>
						</el-row>
						<div class="el-form-item__error" id="wirelessAdBidRatioError" v-if="validate.wireless.isError" >{{validate.wireless.errorMsg}}</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<transition name="drawer">
			<m-add-ad v-if="showAddKeyword" :kwds="formData.keywords"></m-add-ad>
		</transition>
		<transition name="drawer">
			<m-add-crowd v-if="showAddCrowd" :crowd="formData.crowds" :isGeneralDelivery="formData.isGeneralDelivery"></m-add-crowd>
		</transition>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import lListSrc from '../../../../assets/img/bidcpc_example_list.png';
	import lGoodsSrc from '../../../../assets/img/bidcpc_example_goodsDetail.png';
	import lOrderSrc from '../../../../assets/img/bidcpc_example_orderDetail.png';
	import {
		copyObj,
		objType,
		formatDate,
		mixin,
		limitLen
	} from 'utils/common';

	import AREA_DATA from '../../../../help/CITY.js';

	import Event from 'event';
	import Http from 'http';

	import addAd from './drawer-add-keyword.vue';
	import addCrowd from './drawer-add-crowd.vue';
	export default {
		name: 'app-put-bidcpc-new-unit',
		data() {
			return {
			    validate:{
					adBid:{
					    isError:false,
						errorMsg:''
					},
					wireless:{
						isError:false,
						errorMsg:''
					}

				},
				showExample: [
					{'title': '三级品类列表页', 'bSrc': 'https://gfs6.gomein.net.cn/T1ScAvBXhg1RCvBVdK.jpg', 'lSrc': lListSrc},
					{'title': '商品详情页', 'bSrc': 'https://gfs5.gomein.net.cn/T1YmKvBvYb1RCvBVdK.jpg', 'lSrc': lGoodsSrc},
					{'title': '订单详情页', 'bSrc': 'https://gfs5.gomein.net.cn/T18mVvBbEg1RCvBVdK.jpg', 'lSrc': lOrderSrc}
				],
				timeTip:{
					tipMsg:'',
					isShowTip:false,
					top:0,
					left:0
				},
				times:[],
				time:{
					'0': [],
					'1': [],
					'2': [],
					'3': [],
					'4': [],
					'5': [],
					'6': [],
				},
				flag:false,
				pointer:{
					startX:0,
					startY:0
				},
				showHintKeywords: false,
				showHintResource: false,
				showHintCrowds: false,
				formData: {},
				rules: {
					'name':[{validator: (rule, value, callback) => {
						if (!limitLen(value, 60)) {
							callback(new Error('字数不超过30个汉字'));
						} else if (value.trim() == '') {
							callback(new Error('请输入投放单元名称'));
						} else {
							let param =  {
								name: value,
								campaignId: this.formData.campaignId,
							};
							if (this.drawerCtrlAction === 'modify') {
								param.flightId = this.formData.flightId;
							}
							Http.get('/api/flight/exist', {
								hideLoading: true,
								params:param
							})
								.then((res) => {
									if (res.data.code == 200) {
										if (res.data.data.exist == 1) {
											callback(new Error('投放单元名称已存在'));
										} else {
											callback();
										}
									}
								})
								.catch((error) => {
									console.log(error);
								})
						}
					}, trigger: 'blur' }],
					region: [{
						validator: (rule, value, callback) => {
							if (this.formData.region.length === 0 && this.formData.regionType) {
								callback(new Error('请选择投放地域'));
							} else {
								callback();
							}
						}
					}],
					time: [{
						validator: (rule, value, callback) => {
							let len = 0;
							this.times.forEach((item) => {
								len += item.length;
							});
							if (len === 0 && this.formData.timeType === 1) {
								callback(new Error('请选择投放时间段'));
							} else {
								callback();
							}
						}
					}],
					advertisementGroups: [{
						validator: (rule, value, callback) => {
							if (value.length == 0) {
								callback(new Error('请选择资源位类型'));
							} else {
								callback();
							}
						}
					}]
				},
				regionCheck: false,
				regionData: AREA_DATA,
				regionChildrenData: [],
				showTimeSlot: 0,
				timeAllDayCheck: {
					'1': false,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': false,
					'7': false
				},
				showAddKeyword: false,
				showAddCrowd: false,
				httpMethodMap: {
					new: 'post',
					copy: 'post',
					modify: 'put'
				},
			};
		},
		computed: {
			drawerData: () => store.state.drawerCtrl.config, // from store
			drawerCtrlAction: () => store.state.drawerCtrl.action,
			isRebate: () => store.state.drawerCtrl.isRebate, // 是否返利，从 state 中来 如果被复写掉了为 false 达到知晓上一级是否返利的目的
			actionType: () => store.state.drawerCtrl.action,
			isRatioCheck() {
			    return this.formData.adBid >= 0.3 && this.formData.adBid <= 999.99
			},
			isWirelessCheck() {
				return this.formData.wirelessAdBidRatio >= 0.01 && this.formData.wirelessAdBidRatio <= 999.99
			},
		},
		components: {
			'm-add-ad': addAd,
			'm-add-crowd': addCrowd
		},
		created() {
			this.formData = copyObj(this.drawerData);

			this.formData.time = this.actionType=='modify' || this.actionType=='copy' ? this.formData.time : this.initTimes();
			// 分转元
			this.formData.rebateBid = this.formData.rebateBid / 100;
			this.formData.adBid = this.formData.adBid / 100;
		},
		mounted() {
			this.regionData.forEach((item) => {
				Vue.set(item, 'checked', false);
				item.city.forEach((each) => {
					if (this.formData.region.indexOf(each.zip) !== -1) {
						Vue.set(each, 'checked', true);
					} else {
						Vue.set(each, 'checked', false);
					}
				});
			});
			// 隐藏添加关键词
			Event.$off('drawer-hide-add-keyword');
			Event.$on('drawer-hide-add-keyword', () => {
				this.showAddKeyword  = false;
			});
			// 保存关键词
			Event.$off('drawer-save-add-keyword');
			Event.$on('drawer-save-add-keyword', (result) => {
				this.formData.keywords = result;
				this.showAddKeyword = false;
			});
			//隐藏添加人群
			Event.$off('drawer-hide-add-crowd');
			Event.$on('drawer-hide-add-crowd',() => {
				this.showAddCrowd = false;
			})
			//保存添加人群
			Event.$off('drawer-save-add-crowd');
			Event.$on('drawer-save-add-crowd',(result, generalDelivery) => {
				this.formData.crowds = result;
				this.formData.isGeneralDelivery = generalDelivery;
				this.showAddCrowd = false;
			})

			// 保存
			Event.$off('put-save');
			Event.$on('put-save', () => {
				this.$refs.formData.validate((result) => {
					let params = {
						name: this.formData.name,
						type: this.formData.type,
						advertisementGroups : this.formData.advertisementGroups,
						timeType: this.formData.timeType,
						time: this.formData.timeType === 0 ? this.getAllTime() : this.time,
						regionType: this.formData.regionType,
						region: this.formData.regionType ? this.formData.region : [],
						// ageType: this.formData.ageType,
						// age: this.formData.age,
						// genderType: this.formData.genderType,
						// gender: this.formData.gender,
						adBid: this.formData.advertisementGroups.find((n) => n == 2) ? this.formData.adBid * 100 : '0',
						wirelessAdBidRatio: this.formData.wirelessAdBidRatio,
						keywords: this.formData.advertisementGroups.find((n) => n == 1) ? this.formData.keywords : [],
						productLine: 3,
						crowds: this.formData.crowds,
						isGeneralDelivery: this.formData.isGeneralDelivery == undefined ? 0 : this.formData.isGeneralDelivery,
					};
					if (!this.formData.keywords.length && this.formData.advertisementGroups.find((n) => n == 1)) {
						this.showHintKeywords = true;
					} else {
						this.showHintKeywords = false;
					}
					// if(!this.isWirelessCheck) {this.limitedCondition('adBid')};
					if(!this.isRatioCheck && this.formData.advertisementGroups.find((n) => n == 2) == 2) {
						this.limitedCondition('adBid');
						return false;
					};
					// if((!this.isRatioCheck && this.formData.advertisementGroups.find((n) => n == 2) == 2) || !this.isWirelessCheck) return false;
					if((!this.formData.keywords.length && this.formData.advertisementGroups.find((n) => n == 1)) ) return false;//
					if (result) {
						Http({
							url: 'api/flight',
							method: this.httpMethodMap[this.drawerCtrlAction],
							data: this.drawerCtrlAction === 'modify' ? mixin({
								flightId: this.formData.flightId
							}, params) : mixin({
								campaignId: this.formData.campaignId
							}, params)
						})
							.then((res) => {
								if (!res.data.iserror) {
									Event.$emit('put-save-result', {
										error: 0,
										res: res.data,
										isRebate: this.isRebate,
										type: this.formData.type
									});
								} else {
									this.$message({
										message: res.data.msg,
										type: 'error',
										duration: 3000
									});
									Event.$emit('put-save-result', {
										error: 1,
										res: null
									});
								}
							})
							.catch((e) => {
								Event.$emit('put-save-result', {
									error: 1,
									res: null
								});
							});
					} else {
						Event.$emit('put-save-result', {
							error: 1,
							res: null
						});
					}
				});
			});
		},
		methods: {
			//删除人群
			deleteCrowds(index) {
				this.formData.crowds.splice(index,1);
			},
			//选择人群
			selectCrowd() {
				if(this.actionType=='modify'){
					let crowd = this.formData.crowds ? copyObj(this.formData.crowds) : [];
					crowd.forEach((item) =>  {
						item.isActived = false;
					})
					this.formData.crowds = crowd;
				}
				this.showAddCrowd = true;
			},
			//滑动结束
			timeSelEnd() {
				this.flag = false;
				this.timeTip.isShowTip = false;
				this.formData.time.forEach((week) => {
					week.time.forEach((t) => {
						if (t.mov && t.sel) {
							t.sel = false;
							t.mov = false;
						} else if (t.mov && !t.sel) {
							t.sel = true;
							t.mov = false;
						}
					})
				})
			},
			//滑动过程
			timeSelMove(x,y){
				let self = this;
				self.timeTip.isShowTip = true;
				self.timeTip.left = x<18 ? (x+4)*36 + 'px' : (x-2)*36 +'px';
				self.timeTip.top = (y+3)*37 + 'px';
				if (self.flag) {
					let startX = self.pointer.startX; //0
					let startY = self.pointer.startY; //0
					self.timeTip.tipMsg = '星期'+ this.numToCh(startY) + ' 到 星期' + this.numToCh(y) + '<br>'+ this.changgeNum(startX) +'-'+this.changgeNum(x+1);
					self.formData.time.forEach(function(week, curY) {
						week.time.forEach(function(time, curX) {
							time.mov = (curX >= startX &&
								curX <= x &&
								curY >= startY &&
								curY <= y) ||
								(curX <= startX &&
								curX >= x &&
								curY <= startY &&
								curY >= y) ||
								(curX >= startX &&
								curX <= x &&
								curY <= startY &&
								curY >= y) ||
								(curX <= startX &&
								curX >= x &&
								curY >= startY &&
								curY <= y);
						})
					});
				}else{
					self.timeTip.tipMsg = '星期'+ this.numToCh(y) +' '+ this.changgeNum(x) +' '+this.changgeNum(x+1);
				}
			},
			//滑动开始
			timeSelStart(whichtime,x,y) {
				this.flag = true;
				whichtime.mov = true;
				this.pointer.startX = x;
				this.pointer.startY = y;
			},
			//选择某一周filter
			selectAllDay(day) {
				if (!this.timeAllDayCheck[day]) {
					this.formData.time[day].time.map((item) => {
						item.sel = false
					});
				} else {
					this.formData.time[day].time.map((item) => {
						item.sel = true
					});
				}
			},
			//初始化时间表
			initTimes() {
				let times = [];
				let days = [];
				for (let i=0; i<24; i++) {
					days.push({
						sel:false,
						mov:false,
					})
				}
				for(let i=0; i<7; i++){
					times.push({
						on:false,
						weeks:i,
						time:copyObj(days)
					})
				}
				return times
			},
			//已选时间段，合并时间
			mergeTime(time) {
				let times = [[],[],[],[],[],[],[]];
				Object.keys(time).forEach((t) => {
					time[t].sort(function(a, b) {
						return a - b;
					});
					let arr = [];
					let tempArr = [];
					let isContinuous = false;
					for (let i = 0; i < time[t].length; i++) {
						let item1 = time[t][i];
						let item2 = i == time[t].length ? time[t][i] : time[t][i + 1];
						if (item1 + 1 == item2) {
							if (!isContinuous) {
								tempArr.push(item1);
							}
							isContinuous = true;
							continue;
						} else {
							isContinuous = false;
							tempArr.push(item1);
						}
						if (!isContinuous) {
							arr.push(tempArr);
							tempArr = [];
						}
						times[t] = copyObj(arr);
					}
				})
				this.times = copyObj(times);
			},
			getTimeZone(num) {
				if(num.length == 1) {
					return this.changgeNum(num[0]) +'-'+ this.changgeNum(num[0]+1)
				}else{
					return this.changgeNum(num[0]) +'-'+ this.changgeNum(num[1]+1)
				}
			},
			changgeNum(n){
				n = n < 9 ? '0' + n + ':00' : n + ':00'
				return n;
			},
			clearSelect() {
				this.formData.time = this.initTimes();
				this.times = [];
			},
			deleteKeywords(index) {
				this.formData.keywords.splice(index, 1);
			},
			handleClose(tag,index){
				let i = this.regionData.indexOf(tag);
				tag.checked = false;
				this.regionData[i].city.forEach((item) => {
					item.checked = tag.checked;
				})
				this.formData.region.splice(index,1)
			},
			selectProvince(item, index) {
				item.checked = !item.checked;
				this.regionData[index].city.forEach((each) => {
					if (this.formData.region.indexOf(each) === -1) {
						each.checked = item.checked;
					}
				});
			},
			applyInnerCity(index) {
				this.regionChildrenData = [...this.regionData[index].city];
			},
			selectAllRegion() {
				this.regionData.forEach((item) => {
					item.city.forEach((each) => {
						each.checked = this.regionCheck;
					});
				});
			},
			selectOneDay(day, hour) {
				this.formData.time[day].reverse();
				let index = this.formData.time[day].indexOf(hour);
				index !== -1 ? this.formData.time[day].splice(index, 1) : this.formData.time[day].push(hour);
			},
			selectMultiDay(days) {
				this.formData.time = this.initTimes();
				this.isMultiDay = {
					allweek : days.length == 7,
					workday : days.length == 5,
					happyday: days.length == 2
				}
				days.forEach((item) => {
					this.formData.time[item].time.forEach((time) => {
						time.sel = true;
					});
				});
			},
			copyTime(from, array) {
				array.forEach((item) => {
					this.formData.time[JSON.stringify(item)] = [...this.formData.time[from]];
				});
			},
			genContinuousNum(from, to) {
				let realFrom = 0;
				let realTo = 0;
				if (to) {
					realTo = to;
					realFrom = from;
				} else {
					realTo = from;
				}
				let result = [];
				while (realTo >= realFrom) {
					result.push(realTo);
					realTo--;
				}
				return result.reverse();
			},
			numToCh(num) {
				let map = {
					0: '一',
					1: '二',
					2: '三',
					3: '四',
					4: '五',
					5: '六',
					6: '日',
					7: '八',
					8: '九'
				};
				return map[num];
			},
			wirelessAdBidRatioValidator(id, name) {
				var value = this.floatFormat(id);
				this.formData.wirelessAdBidRatio = value;
				return this.limitedCondition(id, name, value);
			},
			adBidValidator(id, name) {
				var value = this.floatFormat(id);
				this.formData.adBid = value;
				return this.limitedCondition(id, name, value);
			},
			additionalCheck(type) {
				if (type.toString().indexOf("2") != -1) {
					return this.adBidValidator('adBid', 'PC端推荐广告出价') & this.wirelessAdBidRatioValidator('wirelessAdBidRatio', '无线端广告出价系数');
				} else {
					return this.wirelessAdBidRatioValidator('wirelessAdBidRatio', '无线端广告出价系数');
				}
			},
			floatFormat(id) {
				var inputId = id + "Input";
				var value = this.formData[id];
				// 处理非数字 非小数点 的字符
				value = value.replace(/[^0-9\.]+/, "");
				// 处理以小数点开头的字符
				//value = value.replace(/^\.+/, "");

				// 处理不小数点开头但出现多次小数点的字符
				var regObject = value.match(/\.+/g);
				var count = 0;
				if (regObject != null && regObject.length > 0) {
					for (var i = 0; i < regObject.length; i++) {
						count += regObject[i].length;
					}
				}
				if (value != 0) {
					value = value.replace(/^0+/, "");
				}
				if (value.indexOf(".") == 0) {
					value = "0" + value;
				}
				// 处理以小数点结尾的字符
				//value = value.replace(/\.$/, "");
				if (value.indexOf(".") > 0) {
					if (count > 1) {
						value = value.substring(0, value.indexOf(".") + 1) + value.substring(value.indexOf(".")).replace(/\./g, "");
					}
					value = value.substring(0, value.indexOf(".") + 3);
				}
				document.getElementById(inputId).value = value;
				return value;
			},
			limitedCondition(id, name, value) {
				var errorId = id + "Error";
				if(id == 'adBid'){
				    let value = this.formData.adBid;
				    if(value == ''){
				        this.validate.adBid.isError = true;
				        this.validate.adBid.errorMsg = '请输入PC端推荐广告出价';
					} else if(value < 0.30) {
						this.validate.adBid.isError = true;
						this.validate.adBid.errorMsg = '出价最小为0.30';
					} else if(value > 999.99) {
						this.validate.adBid.isError = true;
						this.validate.adBid.errorMsg = '出价最大不超过999.99';
					} else {
						this.validate.adBid.isError = false;
						this.validate.adBid.errorMsg = '';
					}
				} else {
					let value = this.formData.wirelessAdBidRatio;
					if(value == ''){
						this.validate.wireless.isError = true;
						this.validate.wireless.errorMsg = '请输入PC端推荐广告出价';
					} else if(value < 0.30) {
						this.validate.wireless.isError = true;
						this.validate.wireless.errorMsg = '出价最小为0.30';
					} else if(value > 999.99) {
						this.validate.wireless.isError = true;
						this.validate.wireless.errorMsg = '出价最大不超过999.99';
					} else {
						this.validate.wireless.isError = false;
						this.validate.wireless.errorMsg = '';
					}
				}
			},
			blurCheck(inputId) {
				var value = document.getElementById(inputId).value;
				console.log(value);
				// 处理一个或者多个0开头 的字符
				if (value != 0) {
					value = value.replace(/^0+/, "");
				}
				if (value.indexOf(".") == 0) {
					value = "0" + value;
				}
				// 处理以小数点结尾的字符
				value = value.replace(/\.$/, "");

				document.getElementById(inputId).value = value;

				return value;
			},
			wirelessAdBidRatioBlurCheck(id) {
				var value = this.blurCheck(id);
				this.formData.wirelessAdBidRatio = value;
			},
			adBidBlurCheck(id) {
				var value = this.blurCheck(id);
				this.formData.adBid = value;
			},
			getAllTime() {
				let allTime = copyObj(this.time);
				for (let day in allTime) {
					for (let i = 0; i < 24; i++) {
						allTime[day].push(i);
					}
				}
				return allTime;
			}
		},
		watch: {
			'formData.time': {
				handler: function() {
					this.time = {};
					this.formData.time.forEach((item,index) => {
						let len = item.time.filter((t) => { return t.sel == true}).length;
						if( len == 24) {
							this.timeAllDayCheck[index] = true;
						}else {
							this.timeAllDayCheck[index] = false;
						}
						this.time[index+1] = [];
						item.time.forEach((time,t) => {
							if(time.sel) {
								this.time[index+1].push(t);
							}
						})
					});
					this.mergeTime(this.time);
				},
				deep: true
			},
			'regionData': {
				handler: function() {
					this.formData.region = [];
					let allLen = 0;
					let allCheckLen = 0;
					this.regionData.forEach((item) => {
						let cur = 0;
						item.city.forEach((each) => {
							allLen++;
							let index = this.formData.region.indexOf(each);
							if (each.checked && index === -1) {
								this.formData.region.push(each.zip);
								cur++;
							}
						});
						if (cur === item.city.length) {
							item.checked = true;
						} else {
							item.checked = false;
						}
						allCheckLen = cur + allCheckLen;
					});
					if (allCheckLen === allLen) {
						this.regionCheck = true;
					}
				},
				deep: true
			}
		}
	};
</script>
<style lang="less" scoped>
	.selCrowdsTable{
		width:400px;
		margin-top: 20px;
		text-align: center
	}
	.selectTime{
		background-color: #f8f9fa;
		padding: 20px 0px;
	div{
		width:86%;
	}
	button{
		float: right;
		margin: 3px 20px 0 0;
	}
	span{
		margin: 0 10px;
	}
	.selectTimeTitle{
		float: left;
	}
	.selectTimeCont{
		display: inline-block;
		width:90%;
	}
	}
	.timeselBtnGroup{
	button{
		margin-right: 20px;
		background: none;
		border: 1px solid #e6e6e6;
	}
	.timeselBtn,.timeselBtn::focus{
		background: linear-gradient(to bottom, #d30312 0%, #d30312 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d30312', endColorstr='#d30312', GradientType=0);
		border-color: #d30312;
		color:#fff;
	&:hover{
		 background: linear-gradient(to bottom, #d30312 0%, #d30312 100%);
		 filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d30312', endColorstr='#d30312', GradientType=0);
		 border-color: #d30312;
		 color:#fff;
	 }
	}
	}
	.tips-span {
		position: absolute;
		background: #14a3ff;
		color: #fff;
		border-radius: 5px;
		font-size: 12px;
		line-height: 12px;
		padding: 2px 5px;
		right: 25px;
		top: 5px;
	}
	.bidcpc-example-title{
		font-size: 14px;
		padding-top: 10px;
	}
	.bidcpc-example-content{
	p{
		font-size: 12px;
		height: 38px;
		line-height: 38px;
		margin-top: 7px;
	}
	a{
		font-size: 14px;
		margin-left: 20px;
	}
	}
	.selectSpan{
		float: left;
		width: 50px;
	&+div{
		  width: 560px;
		  float: left;
	span{
		margin-right: 5px;
		background-color: #dde0e3;
		color:#23272c;
	.el-icon-close:hover{
		background-color: #d30312;
		color:#fff
	}
	&:hover{
		 background-color: #d30312;
		 color:#fff
	 }
	}
	}
	}
	.hintKeywords{
		position: absolute;
		left:4px;
		top: 38px;
		color: #ff4949;
	}
</style>
