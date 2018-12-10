<template>
	<div>
		<div class="preview-cont">
			<p class="title">广告账户</p>
			<div class="item">
				<div class="item-block">
					<p class="sub-title">
						<span>现金</span>
					</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.adBalance | currency('', 2)}}</p>
					<p class="msg">余额</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.adYesterdayCost | currency('', 2)}}</p>
					<p class="msg">昨日花费</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.adTodayCost | currency('', 2)}}</p>
					<p class="msg">今日花费</p>
				</div>
			</div>
			<div class="item" v-if="oaIsShow === 1">
				<div class="item-block">
					<p class="sub-title">
						<span>内部流转金</span>
					</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.oaBalance | currency('', 2)}}</p>
					<p class="msg">余额</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.oaYesterdayCost | currency('', 2)}}</p>
					<p class="msg">昨日花费</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.oaTodayCost | currency('', 2)}}</p>
					<p class="msg">今日花费</p>
				</div>
			</div>
			<div class="item">
				<div class="item-block">
					<p class="sub-title">
						<span>虚拟金</span>
					</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.virtualBalance | currency('', 2)}}</p>
					<p class="msg">余额</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.virtualYesterdayCost | currency('', 2)}}</p>
					<p class="msg">昨日花费</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.virtualTodayCost | currency('', 2)}}</p>
					<p class="msg">今日花费</p>
				</div>
			</div>
			<p class="title" v-if="productLine === 2">返利账户</p>
			<div class="item" v-if="productLine === 2">
				<div class="item-block">
					<p class="sub-title">
						<span>现金</span>
					</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.rebateBalance | currency('', 2)}}</p>
					<p class="msg">余额</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.rebateYesterdayCost | currency('', 2)}}</p>
					<p class="msg">昨日花费</p>
				</div>
				<div class="item-block">
					<p class="item-number"><span class="item-dollar">￥</span>{{previewData.rebateTodayCost | currency('', 2)}}</p>
					<p class="msg">今日花费</p>
				</div>
			</div>
		</div>
		<m-chart :productLine="productLine"></m-chart>
	</div>
</template>
<script>
import Chart from './IChart.vue';
import Http from 'utils/http';
import {mixin} from 'utils/common.js';
export default {
	name: 'put-preview',
	components: {
		'm-chart': Chart
	},
	props: ['productLine'],
	data() {
		return {
			oaIsShow: 0,
			previewData: {
				adBalance: '',
				adYesterdayCost: '',
				adTodayCost: '',
				rebateBalance: '',
				rebateYesterdayCost: '',
				rebateTodayCost: '',
				oaIsShow: 0,
				oaBalance: '',
				oaYesterdayCost: '',
				oaTodayCost: '',
				virtualBalance: '',
				virtualYesterdayCost: '',
				virtualTodayCost: ''
			}
		};
	},
	created() {
		this.getOaIsShow();
		this.getPreviewData();
	},
	methods: {
		getOaIsShow() {
			Http.get('/api/account/all/balance').then((res) => {
				let data = res.data;
				if(res.data.code === 200 && res.data.iserror === 0) {
					this.oaIsShow = res.data.data.oaIsShow;
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		getPreviewData() {
			Http.get('/api/pline/account/all/info?productLine=' + this.productLine)
				.then((response) => {
					let data = response.data;
					if(response.status === 200 && response.data.code === 200){
						this.previewData = mixin(this.previewData, data.data);
					} else if (response.data.code >= 500) {
						this.$message({
							message: '服务器异常，请稍后再试。',
							type: 'error',
							duration: 3000
						});
					} else {
						this.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				}).catch(function(error) {
					console.log(error);
				});
		}
	},
	watch: {
		productLine: function(val, oldVal) {
			this.getPreviewData();
		}
	}
};
</script>