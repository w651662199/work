<template>
	<div class="index-map">
		<h2 class="map-title"><span>整体情况</span><i>（以下数据有近三十分钟的统计延迟）</i>
		</h2>
		<div class="map-data">
			<ul class="clearfix">
				<li>
					<strong>总花费(元)</strong>
					<span>{{ overAll.totalFee }}</span>
				</li>
				<li>
					<strong>展示量(次)</strong>
					<span>{{ overAll.pv }}</span>
				</li>
				<li>
					<strong>点击量(次)</strong>
					<span>{{ overAll.clickCount }}</span>
				</li>
				<li>
					<strong>点击率</strong>
					<span>{{ overAll.ctr }}</span>
				</li>
				<li>
					<strong>平均点击单价(元)</strong>
					<span>{{ overAll.avgClickPrice }}</span>
				</li>
				<li>
					<strong>平均千次展示费用(元)</strong>
					<span>{{ overAll.avgMillPrice }}</span>
				</li>
			</ul>
		</div>
		<div class="map-select">
			<el-select v-model="dataOptions.oneSelected" placeholder="请选择" @change="firstSelectedChanged">
				<el-option v-for="item in dataOptionsSelect" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="dataOptions.twoSelected" placeholder="请选择">
				<el-option v-for="item in secondOptions" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="timeScopeType" placeholder="请选择" style="float: right;margin-right: 0;">
				<el-option :label="formatChartTypeDateToday" value="0"></el-option>
				<el-option :label="formatChartTypeDateYesterday" value="1"></el-option>
				<el-option label="过去7天" value="2"></el-option>
				<el-option label="过去30天" value="3"></el-option>
			</el-select>
			<div class="map-direct">
				<span class="direct-total" v-show="isShowTotalFee">总花费</span>
				<span class="direct-view" v-show="isShowImpression">展示量</span>
				<span class="direct-click" v-show="isShowClick">点击量</span>
				<span class="direct-ctr" v-show="isShowCtr">点击率</span>
				<span class="direct-avgClick" v-show="isShowAvgClickPrice">平均点击单价</span>
				<span class="direct-avgMill" v-show="isShowAvgMillPrice">平均千次展示费用</span>
			</div>
		</div>
		<div class="map-show">
			<i-chart :lineChartOption="lineChartOption" ref="chart"></i-chart>
		</div>
	</div>
</template>
<script>
	import Http from 'utils/http';
	import IndexChart from './IndexChart.vue';
	import {formatDate, floatMul} from 'utils/common.js';
	export default {
		name:'app-index-chart',
		components: {
			'i-chart': IndexChart
		},
		data() {
			return {
				lineChartOption: null,
				chartTypeFormat: new Date(),
				timeScopeType: "0",
				overAll: {
					totalFee: 0,
					pv: 0,
					clickCount: 0,
					ctr: 0,
					avgClickPrice: 0,
					avgMillPrice: 0
				},
				yXaisIndex: {'totalFee': 0, 'pv': 1, 'click': 1, 'ctr': 2, 'avgClickPrice': 3, 'avgMillPrice': 3},
				time:{
					starttime:0,
					endtime:0
				},
				dataOptionsSelect: [{
					value: 'totalFee',
					label: '总花费'
				},{
					value: 'pv',
					label: '展示量'
				},{
					value: 'click',
					label: '点击量'
				},{
					value: 'ctr',
					label: '点击率'
				},{
					value: 'avgClickPrice',
					label: '平均点击单价'
				},{
					value: 'avgMillPrice',
					label: '平均千次展示费用'
				}],
				dataOptions:{
					oneSelected: 'totalFee',
					twoSelected: 'pv'
				}
			};
		},
		created() {
			let vm = this;
			vm.lineChartOption = {
				tooltip: {
					trigger: 'axis',
					formatter: function(params){
						let str = params[0].name + "<br/>";
						for (let i = 0; i < params.length; i++) {
							if (params[i].seriesName == '点击率') {
								str += params[i].seriesName + ":" + parseFloat(params[i].value * 100).toFixed(2) + "%<br/>";
							} else if (params[i].seriesName.indexOf('量') > -1){
								str += params[i].seriesName + ":" + params[i].value + "<br/>";
							} else {
								str += params[i].seriesName + ":" + params[i].value.toFixed(2) + "元<br/>";
							}
						}
						return str;
					}
				},
				legend: {
					data: ['总花费', '展示量', '点击量', '点击率', '平均点击单价', '平均千次展示费用'],
					show: false,
					selected: {
						'总花费': true,
						'曝光量': true,
						'点击量': false,
						'点击率': false,
						'平均点击单价': false,
						'平均千次展示费用': false
					}
				},
				animation: true,
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: []
				},
				yAxis: [{
					name: '',
					type: 'value',
					position: 'left',
					axisTick: {
						show: true
					},
					nameTextStyle: {
						fontSize: 12
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					position: 'right',
					axisTick: {
						show: true
					},
					nameTextStyle: {
						fontSize: 12
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					nameTextStyle: {
						fontSize: 0
					},
					axisLabel: {
						formatter: function(value, index) {
							return (value * 100) + '%';
						}
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					nameTextStyle: {
						fontSize: 0
					},
					splitLine: {
						show: false
					}
				}],
				series: [{
					name: '总花费',
					type: 'line',
					smooth: true,
					lineStyle: {
						normal: {
							color: '#ECF752'
						}
					},
					itemStyle: {
						normal: {
							color: '#ECF752'
						}
					},
					data: []
				}, {
					name: '展示量',
					type: 'line',
					smooth: true,
					yAxisIndex: 1,
					lineStyle: {
						normal: {
							color: '#79E8D0'
						}
					},
					itemStyle: {
						normal: {
							color: '#79E8D0'
						}
					},
					data: []
				}, {
					name: '点击量',
					type: 'line',
					smooth:true,
					yAxisIndex: 1,
					lineStyle: {
						normal: {
							color: '#FFB8B8'
						}
					},
					itemStyle: {
						normal: {
							color: '#FFB8B8'
						}
					},
					data: []
				}, {
					name: '点击率',
					type: 'line',
					smooth:true,
					yAxisIndex: 2,
					lineStyle: {
						normal: {
							color: '#86E65A'
						}
					},
					itemStyle: {
						normal: {
							color: '#86E65A'
						}
					},
					areaStyle:{
						normal:{
							color: '#86E65A',
							opacity:0.5
						}
					},
					data: []
				}, {
					name: '平均点击单价',
					type: 'line',
					smooth: true,
					yAxisIndex: 3,
					lineStyle: {
						normal: {
							color: '#24D197'
						}
					},
					itemStyle: {
						normal: {
							color: '#24D197'
						}
					},
					data: []
				}, {
					name: '平均千次展示费用',
					type: 'line',
					smooth: true,
					yAxisIndex: 3,
					lineStyle: {
						normal: {
							color: '#01a9f4'
						}
					},
					itemStyle: {
						normal: {
							color: '#01a9f4'
						}
					},
					data: []
				}]
			};
			vm.calcTime();
		},
		computed: {
			isShowTotalFee() {
				return this.dataOptions.oneSelected === 'totalFee' || this.dataOptions.twoSelected === 'totalFee';
			},
			isShowImpression() {
				return this.dataOptions.oneSelected === 'pv' || this.dataOptions.twoSelected === 'pv';
			},
			isShowClick() {
				return this.dataOptions.oneSelected === 'click' || this.dataOptions.twoSelected === 'click';
			},
			isShowCtr() {
				return this.dataOptions.oneSelected === 'ctr' || this.dataOptions.twoSelected === 'ctr';
			},
			isShowAvgClickPrice() {
				return this.dataOptions.oneSelected === 'avgClickPrice' || this.dataOptions.twoSelected === 'avgClickPrice';
			},
			isShowAvgMillPrice() {
				return this.dataOptions.oneSelected === 'avgMillPrice' || this.dataOptions.twoSelected === 'avgMillPrice';
			},
			secondOptions() {
				return this.dataOptionsSelect.filter((item) => item.value != this.dataOptions.oneSelected);
			},
			formatChartTypeDateToday() {
				return '今天 ' + formatDate(this.chartTypeFormat.getTime(), 'yyyy-MM-dd');
			},
			formatChartTypeDateYesterday() {
				let timestamp = this.chartTypeFormat.getTime() - 24 * 60 * 60 * 1000;
				return '昨天 ' + formatDate(timestamp, 'yyyy-MM-dd');
			}
		},
		methods: {
			calcTime() {
				let startDate = new Date(),endDate = new Date();
				let vm = this;
				startDate.setHours(0);
				startDate.setMinutes(0);
				startDate.setSeconds(0);
				startDate.setMilliseconds(0);
				endDate.setHours(23);
				endDate.setMinutes(59);
				endDate.setSeconds(59);
				endDate.setMilliseconds(999);
				switch (parseInt(vm.timeScopeType)){
				case 0:
					vm.time.starttime = startDate.getTime();
					break;
				case 1:
					startDate.setDate(startDate.getDate() - 1);
					endDate.setDate(endDate.getDate() - 1);
					vm.time.starttime = startDate.getTime();
					break;
				case 2:
					startDate.setDate(startDate.getDate() - 7);
					vm.time.starttime = startDate.getTime();
					break;
				case 3:
					startDate.setDate(startDate.getDate() - 30);
					vm.time.starttime = startDate.getTime();
					break;
				}
				vm.time.endtime = endDate.getTime();
			},
			firstSelectedChanged() {
				let secondSelectOpt = this.secondOptions;
				if (this.dataOptions.oneSelected === this.dataOptions.twoSelected){
					this.dataOptions.twoSelected = secondSelectOpt[0].value;
				}
			},
			getChartData() {
				Http.get('/api/report/all', {
					params: {
						startTime: this.time.starttime,
						endTime: this.time.endtime
					}
				}).then(res => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						this.setLineData(res.data.data);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			formatAmount(amount) {
				let aNum = floatMul(amount, 0.01);
				aNum += 0.0001;
				let nStr = aNum + '';
				let dotIndex = nStr.indexOf('.');
				let last = Number(nStr.substring(dotIndex + 3, dotIndex + 4));
				if (last >= 1) {
					aNum += 0.01;
				}
				nStr = aNum + '';
				return nStr.substring(0, dotIndex + 3);
			},
			setLineData(data) {
				let xAxis = [];
				let totalFee = 0, pv = 0, clickCount = 0;
				let totalFees = [], pvs = [], clickCounts = [], ctrs = [], avgClickPrices = [], avgMillPrices = [];
				for (let d of data) {
					xAxis.push(d.time);
					totalFees.push(floatMul(d.totalFee, 0.000001));
					pvs.push(d.pv);
					clickCounts.push(d.clickCount);
					let ctr = d.pv > 0 ? Number((d.clickCount / d.pv).toFixed(2)) : 0;
					ctrs.push(ctr);
					let avgClickPrice = d.clickCount > 0 ? Number((floatMul(d.totalFee, 0.000001) / d.clickCount).toFixed(2)) : 0;
					avgClickPrices.push(avgClickPrice);
					let avgMillPrice = d.pv > 0 ? Number((floatMul(d.totalFee, 0.000001) * 1000 / d.pv).toFixed(2)) : 0;
					avgMillPrices.push(avgMillPrice);
					totalFee += floatMul(d.totalFee, 0.000001);
					pv += d.pv;
					clickCount += d.clickCount;
				}
				this.lineChartOption.xAxis.data = xAxis;
				this.lineChartOption.series[0].data = totalFees;
				this.lineChartOption.series[1].data = pvs;
				this.lineChartOption.series[2].data = clickCounts;
				this.lineChartOption.series[3].data = ctrs;
				this.lineChartOption.series[4].data = avgClickPrices;
				this.lineChartOption.series[5].data = avgMillPrices;

				this.overAll.totalFee = this.formatAmount(totalFee * 100);
				this.overAll.pv = pv;
				this.overAll.clickCount = clickCount;
				this.overAll.ctr = this.getCtr(clickCount, pv);
				this.overAll.avgClickPrice = this.getAvgClickPrice(totalFee, clickCount);
				this.overAll.avgMillPrice = this.getAvgMillPrice(totalFee, pv);
			}
		},
		watch: {
			'timeScopeType': 'calcTime',
			'time': {
				handler: 'getChartData',
				deep: true
			},
			'dataOptions': {
				handler: function(val) {
					this.lineChartOption.legend.selected = {
						'总花费': this.isShowTotalFee,
						'展示量': this.isShowImpression,
						'点击量': this.isShowClick,
						'点击率': this.isShowCtr,
						'平均点击单价': this.isShowAvgClickPrice,
						'平均千次展示费用': this.isShowAvgMillPrice
					};
					let oneIndex = this.yXaisIndex[this.dataOptions.oneSelected];
					let twoIndex = this.yXaisIndex[this.dataOptions.twoSelected];
					this.lineChartOption.yAxis.forEach((element, index) => {
						if (oneIndex === twoIndex) {
							if (oneIndex === index) {
								element.position = 'left';
							}
						} else {
							if (oneIndex === index) {
								element.position = 'left';
							} else if (twoIndex === index) {
								element.position = 'right';
							}
						}
					});
				},
				deep: true
			}
		}
	};
</script>