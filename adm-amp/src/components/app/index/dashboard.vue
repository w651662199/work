<template>
	<div class="index-statis">
		<div class="index-msg" v-if="notice.title">
			<div class="msg-title"><router-link :to="{name: 'adetail', params: {id: notice.messageId}}" target="_blank"><span :class="{'dot-badge': notice.isRead == 0}">{{notice.title}}</span></router-link></div>
			<div class="msg-time">{{notice.create | moment('YYYY-MM-DD')}} <span :class="{'dot-badge': unReadCount > 0}"><router-link :to="{name: 'announce'}">更多</router-link></span></div>
		</div>
		<div class="statis-account">
			<p class="title">总体概览</p>
			<ul class="statis-list">
				<li class="statis-item">
					<p class="item-msg">总账户现金余额</p>
					<p class="item-con"><span>¥</span>{{masterData.cashBalance | currency('', 2)}}</p>
				</li>
				<li class="statis-item" v-if="masterData.oaIsShow === 1">
					<p class="item-msg">总账户内部流转金余额</p>
					<p class="item-con"><span>¥</span>{{masterData.oaBalance | currency('', 2)}}</p>
				</li>
				<li class="statis-item">
					<p class="item-msg">总账户虚拟金余额</p>
					<p class="item-con"><span>¥</span>{{masterData.virtualBalance | currency('', 2)}} <span class="warn-msg" v-show="masterData.virtualWillEnd || masterData.virtualWillStart">{{masterData.virtualWillEnd == 1 ? '即将失效' : '即将开始'}}</span></p>
				</li>
				<li class="statis-item action">
					<router-link :to="{name: 'fund'}" class="btn btn-primary">资金管理</router-link>
				</li>
			</ul>
		</div>
		<div class="statis-pro-line">
			<ul class="pro-list">
				<li class="pro-item">
					<p class="pro-name">国美众达</p>
					<ul class="account-cost">
						<li>
							<p>广告账户现金余额</p>
							<p><span>￥</span>{{cpcData.adBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{cpcData.adYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{cpcData.adTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
					<ul class="account-cost" v-if="masterData.oaIsShow === 1">
						<li>
							<p>广告账户内部流转金余额</p>
							<p><span>￥</span>{{cpcData.oaBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{cpcData.oaYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{cpcData.oaTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
					<ul class="account-cost">
						<li>
							<p>广告账户虚拟金余额</p>
							<p><span>￥</span>{{cpcData.virtualBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{cpcData.virtualYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{cpcData.virtualTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
					<ul class="account-cost">
						<li>
							<p>返利账户现金余额</p>
							<p><span>￥</span>{{cpcData.rebateBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{cpcData.rebateYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{cpcData.rebateTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
				</li>
				<li class="pro-item">
					<p class="pro-name">国美点效</p>
					<ul class="account-cost">
						<li>
							<p>广告账户现金余额</p>
							<p><span>￥</span>{{bidData.adBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{bidData.adYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{bidData.adTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
					<ul class="account-cost" v-if="masterData.oaIsShow === 1">
						<li>
							<p>广告账户内部流转金余额</p>
							<p><span>￥</span>{{bidData.oaBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{bidData.oaYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{bidData.oaTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
					<ul class="account-cost">
						<li>
							<p>广告账户虚拟金余额</p>
							<p><span>￥</span>{{bidData.virtualBalance | currency('', 2)}}</p>
						</li>
						<li>
							<p>昨日花费</p>
							<p><span>￥</span>{{bidData.virtualYesterdayCost | currency('', 2)}}</p>
						</li>
						<li>
							<p>今日花费</p>
							<p><span>￥</span>{{bidData.virtualTodayCost | currency('', 2)}}</p>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<el-dialog title="" :visible.sync="dialogVisible" size="large" custom-class="index-dialog">
			<div v-html="content" class="detail-infor">
				{{content}}
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Http from 'utils/http';
import {mixin} from 'utils/common.js';
export default {
	name: 'index-dashboard',
	data(){
		return {
			content: '',
			dialogVisible: false,
			notice: {
				messageId: 0,
				title: '',
				isRead: 0,
				createTime: 0
			},
			unReadCount: 0,
			masterData: {
				cashBalance: '',
				oaIsShow: 0,
				oaBalance: '',
				virtualBalance: '',
				virtualWillStart: 0,
				virtualWillEnd: 0
			},
			cpcData: {
				adBalance: 0,
				adTodayCost: 0,
				adYesterdayCost: 0,
				oaBalance: 0,
				oaIsShow: 0,
				oaTodayCost: 0,
				oaYesterdayCost: 0,
				productLine: 2,
				rebateBalance: 0,
				rebateTodayCost: 0,
				rebateYesterdayCost: 0,
				virtualBalance: 0,
				virtualTodayCost: 0,
				virtualYesterdayCost: 0
			},
			bidData: {
				adBalance: 0,
				adTodayCost: 0,
				adYesterdayCost: 0,
				oaBalance: 0,
				oaIsShow: 0,
				oaTodayCost: 0,
				oaYesterdayCost: 0,
				productLine: 3,
				rebateBalance: 0,
				rebateTodayCost: 0,
				rebateYesterdayCost: 0,
				virtualBalance: 0,
				virtualTodayCost: 0,
				virtualYesterdayCost: 0
			}
		};
	},
	created() {
		this.loadDashData();
		this.getMessageNotice();
	},
	methods: {
		loadDashData() {
			let vm = this;
			Http.get('/api/account/all/balance')
				.then((response) => {
					if(response.status === 200 && response.data.code === 200){
						let data = response.data.data;
						if (data.notice) {
							vm.notice = mixin(vm.notice, data.notice);
						}
						vm.unReadCount = data.unReadCount;
						vm.masterData = mixin(vm.masterData, data.masterAccount);
						for (let lineData of data.plineAccounts) {
							if (lineData.productLine == 2) {
								vm.cpcData = mixin(vm.cpcData, lineData);
							} else {
								vm.bidData = mixin(vm.bidData, lineData);
							}
						}
					} else if (response.data.code >= 500) {
						vm.$message({
							message: '服务器异常，请稍后再试。',
							type: 'error',
							duration: 3000
						});
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
		},
		getMessageNotice() {
			Http.get('/api/messages/notice').then(res => {
				if (res.data.code === 200 && res.data.data.messageId) {
					this.content = res.data.data.content;
					this.dialogVisible = true;
				}
			}).catch(err => {
				console.log(err);
			})
		}
	}
};
</script>
<style lang="less">
	.index-dialog {
		min-width: 800px;
		height: 500px;
		overflow: auto;
		.el-dialog__body {
			padding-top: 0;
		}
	}
</style>
