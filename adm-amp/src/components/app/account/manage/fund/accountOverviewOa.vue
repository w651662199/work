<template>
	<div>
		<div class="balance content">
			<p class="title">内部流转金余额</p>
			<div class="balance-title">
				<ul class="clearfix">
					<li>
						<p class="balance-msg">总账户内部流转金</p>
						<p class="overview-money"><span>¥</span>{{data.oaBalance | currency('', 2)}}</p>
					</li>
					<li><router-link :to="{name: 'transoa'}" class="btn btn-primary w120" target="_blank">资金划拨</router-link></li>
				</ul>
			</div>
			<div class="balance-details">
				<ul class="clearfix">
					<li v-for="(productLineItem, productLineIndex) in productLines">
						<h2>国美{{productLineItem.productLineName}}</h2>
						<ul class="clearfix details-productLine">
							<li>
								广告账户内部流转金余额
								<p class="overview-money">¥{{(data.oaPlineBalance[productLineItem.productLineId]?data.oaPlineBalance[productLineItem.productLineId]:0) | currency('', 2)}}</p>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div class="oa-list">
			<p class="title">有效／无效内部流转金</p>
			<el-select v-model="balanceOa" style="width: 120px;margin: 35px 0 20px;">
				<el-option label="有效" :value="1"></el-option>
				<el-option label="失效" :value="2"></el-option>
			</el-select>
			<oa-list :balanceOa="balanceOa"></oa-list>
		</div>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'utils/http';
import {mixin} from 'utils/common.js';
import oaList from './accountOverviewOaList.vue';
export default {
	name: 'AccountOverviewOa',
	data() {
		return {
			isDrawerShow: false,
			isTransferOADrawerShow: false,
			data: {
				"oaBalance": 0,
				"oaPlineBalance": {}
			},
			balanceOa: 1,
		};
	},
	components: {
		oaList: oaList
	},
	computed: {
		productLines: () => store.state.productLines,
	},
	created() {
		this.getOa();
	},
	methods: {
		getOa() {
			Http.get('/api/account/oa/balance')
			.then((res) => {
				if (res.data.code === 200) {
					let data = res.data.data;
					let account = {};
					this.data.oaBalance = data.oaBalance;
					data.oaPlineAccounts.forEach((item, index) => {
						if (!account[item.productLine]) {
							account[item.productLine] = item.balance;
						} else {
							account[item.productLine] += item.balance;
						}
					});
					this.data.oaPlineBalance = account;
				}
			})
			.catch((error) => {
				console.log(error);
			})
		},
	}
};
</script>
