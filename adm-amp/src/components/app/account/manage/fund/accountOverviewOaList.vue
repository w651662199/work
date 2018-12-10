<template>
	<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
		<div class="usable" v-show='balanceOa==1'>
			<ul class="clearfix" v-show='usableData.length!=0'>
				<li v-for="item in usableData">
					<div class="detail-item">
						<div class="details">
							<p class="title">该批次总额</p>
							<p class="overview-money">¥{{item.balance | currency('', 2)}}</p>
						</div>
					</div>
					<p class="detail-time">预算号：{{item.oaBudgetNo}}</p>
					<p class="detail-time">有效期：{{item.validStartDate | moment('YYYY/MM/DD')}}-{{item.validEndDate | moment('YYYY/MM/DD')}}</p>
				</li>
			</ul>
			<div class="noData" v-show='usableData.length==0'>
				无相关查询结果
			</div>
		</div>
		<div class="expired" v-show='balanceOa==2'>
			<ul class="clearfix" v-show='expiredData.length!=0'>
				<li v-for="item in expiredData">
					<div class="detail-item">
						<div class="details">
							<p class="title">该批次总额</p>
							<p class="overview-money">¥{{item.balance | currency('', 2)}}</p>
						</div>
					</div>
					<p class="detail-time">预算号：{{item.oaBudgetNo}}</p>
					<p class="detail-time">有效期：{{item.validStartDate | moment('YYYY/MM/DD')}}-{{item.validEndDate | moment('YYYY/MM/DD')}}</p>
				</li>
			</ul>
			<div class="noData" v-show='expiredData.length==0'>
				无相关查询结果
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'utils/http';
import Event from 'event';
export default {
	name: 'app-account-overview-oa-list',
	data() {
		return {
			busy: true,
			check: false,
			usableData: [],
			expiredData: [],
			usablePage: 1,
			expiredPage: 1,
			number: 10,
			usableDataTotalCount: 0,
			expireDataTotalCount: 0,
		};
	},
	props: ['balanceOa'],
	created() {
		this.getData(false, 1);
		this.getData(false, 2);
	},
	methods: {
		getData(flag, option){
			Http.get('/api/account/oas', {
				params: {
					page: option == 1 ? this.usablePage : this.expiredPage,
					number: this.number,
					isValid: option == 1 ? 1 : 0
				}
			})
			.then((res) => {
				if (flag) {
					if (option == 1) {
						this.usableDataTotalCount = res.data.data.totalCount;
						this.usableData = this.usableData.concat(res.data.data.list);
					} else {
						this.expireDataTotalCount = res.data.data.totalCount;
						this.expiredData = this.expiredData.concat(res.data.data.list);
					}
				} else {
					if (option == 1) {
						this.usableDataTotalCount = res.data.data.totalCount;
						this.usableData = res.data.data.list;
					} else {
						this.expireDataTotalCount = res.data.data.totalCount;
						this.expiredData = res.data.data.list;
					}
				}
				this.busy = false;
			})
			.catch((error) => {
				console.log(error);
			})
		},
		loadMore() {
			if (this.balanceOa === 1) {
				if (this.usableData.length >= this.usableDataTotalCount) {
					return false;
				}
			} else {
				if (this.expiredData.length >= this.expireDataTotalCount) {
					return false;
				}
			}
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			this.busy = true;
			if (scrollTop != 0) {
				if (this.balanceOa == 1) {
					this.usablePage++;
					this.getData(true, 1);
				} else {
					this.expiredPage++;
					this.getData(true, 2);
				}
			}
		}
	}
};
</script>
