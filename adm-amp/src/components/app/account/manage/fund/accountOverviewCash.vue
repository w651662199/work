<template>
	<div>
		<div class="balance content">
			<p class="title">现金余额</p>
			<div class="balance-title">
				<ul class="clearfix">
					<li>
						<p class="balance-msg">总账户现金</p>
						<p class="overview-money"><span>¥</span>{{data.balance | currency('', 2)}}</p>
					</li>
					<li><router-link :to="{name: 'recharge'}" target="_blank" class="btn btn-primary w120">充值</router-link></li>
					<li><router-link :to="{name: 'transcash'}" class="btn btn-primary w120" target="_blank">资金划拨</router-link></li>
				</ul>
			</div>
			<div class="balance-details">
				<ul class="clearfix">
					<li v-for="(productLineItem, productLineIndex) in productLines">
						<h2>国美{{productLineItem.productLineName}}</h2>
						<ul class="clearfix details-productLine">
							<li v-for="(cashItem, cashIndex) in data.cashPlineAccounts" v-if="cashItem.productLine == productLineItem.productLineId">
								{{cashItem.amountType === 1 ? '广告' : '返利'}}账户现金余额
								<p class="overview-money">¥{{cashItem.balance | currency('', 2)}}</p>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'utils/http';
import {mixin} from 'utils/common.js';
export default {
	name: 'app-account-account-overview-cash',
	data() {
		return {
			data: {
				"balance": 0,
				"cashPlineAccounts": []
			},
		};
	},
	computed: {
		productLines: () => store.state.productLines,
	},
	created() {
		this.getCash();
	},
	methods: {
		getCash() {
			Http.get('/api/account/cash/balance')
			.then((res) => {
				if (res.data.code === 200) {
					this.data = mixin(this.data, res.data.data);
				}
			})
			.catch((error) => {
				console.log(error);
			})
		},
	}
};
</script>
