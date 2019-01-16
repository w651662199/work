<template>
	<div>
		<div class="query-information">
			<div class="information-fn">
				<div v-bind:style="{'text-align': 'center', 'font-size': '20px'}" v-html="title"></div>
			</div>
		</div>
		<div class="data-table" id="JS_group_report_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w80"><span>时段</span></th>
								<th class="w80"><span>展示量</span></th>
								<th class="w80"><span>点击量</span></th>
								<th class="w80"><span>总花费</span></th>
								<th class="w80"><span>平均点击单价</span></th>
								<th class="w80"><span>平均CPM单价</span></th>
								<th class="w80"><span>点击率</span></th>
								<th class="w80"><span>总商品行</span></th>
								<th class="w80"><span>总商品行金额</span></th>
								<th class="w80"><span>订单量</span></th>
								<th class="w80"><span>订单金额</span></th>
								<th class="w80"><span>转化率</span></th>
								<th class="w80"><span>ROI</span></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in list">
								<td><span>{{item.adHour}}时</span></td>
								<td><span>{{item.pv}}</span></td>
								<td><span>{{item.clickCount}}</span></td>
								<td><span>{{getCurFmt(item.totalFee).toFixed(2)}}</span></td>
								<td><span>{{getAvgClickPrice(getCurFmt(item.totalFee), item.clickCount)}}</span></td>
								<td><span>{{getAvgImpPrice(getCurFmt(item.totalFee), item.pv)}}</span></td>
								<td><span>{{getCtr(item.clickCount, item.pv)}}</span></td>
								<td><span>{{item.productNum}}</span></td>
								<td><span>{{item.orderPrice}}</span></td>
								<td><span>{{item.orderNum}}</span></td>
								<td><span>{{item.orderPrice}}</span></td>
								<td><span>{{getConversionRate(item.productNum, item.clickCount)}}</span></td>
								<td><span>{{getRoi(item.orderPrice, getCurFmt(item.totalFee))}}</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'http';
import moment from 'moment';
export default {
	name: 'GroupHourReport',
	data() {
		return {
			list: [],
			title: '',
		};
	},
	computed: {
		slotId() {
			return this.$route.params.slotId;
		},
		groupId() {
			return this.$route.params.groupId;
		},
		startTime() {
			var date = this.$route.params.startDate;
			return moment(date).valueOf();
		},
		endTime() {
			var date = this.$route.params.endDate;
			return moment(date).add(86399, 'second').valueOf();
		}
	},
	components: {
	},
	created() {
		this.getList();
	},
	mounted() {
	},
	methods: {
		getList() {
			Http.get('/api/report/groups/hour', {
				params: {
					groupId: this.groupId,
					slotId: this.slotId,
					startTime: this.startTime,
					endTime: this.endTime,
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.title = res.data.data.search.title;
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}
};
</script>
