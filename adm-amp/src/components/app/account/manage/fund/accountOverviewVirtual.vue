<template>
	<div>
		<div class="balance content">
			<p class="title">虚拟金余额</p>
			<div class="balance-title">
				<ul class="clearfix">
					<li>
						<p class="balance-msg">总账户虚拟金</p>
						<p class="overview-money"><span>¥</span>{{data.virtualBalance | currency('', 2)}}</p>
					</li>
					<li><router-link :to="{name: 'transvir'}" class="btn btn-primary w120" target="_blank">资金划拨</router-link></li>
				</ul>
			</div>
			<div class="balance-details">
				<ul class="clearfix">
					<li v-for="(productLineItem, productLineIndex) in productLines">
						<h2>国美{{productLineItem.productLineName}}</h2>
						<ul class="clearfix details-productLine">
							<li>
								广告账户虚拟金余额
								<p class="overview-money">¥{{(data.virtualPlineBalance[productLineItem.productLineId]?data.virtualPlineBalance[productLineItem.productLineId]:0) | currency('', 2)}}</p>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div class="virtual-list">
			<p class="title">有效／无效虚拟金</p>
			<el-select v-model="balanceVirtual" style="width: 120px;margin: 35px 0 20px;">
				<el-option label="有效" :value="1"></el-option>
				<el-option label="失效" :value="2"></el-option>
			</el-select>
			<virtual-list :balanceVirtual="balanceVirtual"></virtual-list>
		</div>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'utils/http';
import {mixin} from 'utils/common.js';
import VirtualList from './accountOverviewVirtualList.vue';
export default {
	name: 'AccountOverviewVirtual',
	data() {
		return {
			data: {
				"virtualBalance": 0,
				"virtualPlineBalance": {}
			},
			balanceVirtual: 1,
		};
	},
	components: {
		VirtualList: VirtualList
	},
	computed: {
		productLines: () => store.state.productLines,
	},
	created() {
		this.getVirtual();
	},
	methods: {
		getVirtual() {
			Http.get('/api/account/virtual/balance')
			.then((res) => {
				if (res.data.code === 200) {
					let data = res.data.data;
					let account = {};
					this.data.virtualBalance = data.virtualBalance;
					data.virtualPlineAccounts.forEach((item, index) => {
						if (!account[item.productLine]) {
							account[item.productLine] = item.balance;
						} else {
							account[item.productLine] += item.balance;
						}
					});
					this.data.virtualPlineBalance = account;
				}
			})
			.catch((error) => {
				console.log(error);
			})
		},
	}
};
</script>
