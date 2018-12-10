<template>
	<div class="index-map">
		<h2 class="map-title">
			<p class="title">整体情况</p>
			<p class="msg">以下数据有近三十分钟的统计延迟</p>
			<div class="action-con">
				<div class="action-item">
					<span class="item-name">产品线</span>
					<el-select v-model="productLine" style="width: 110px;">
						<el-option label="国美众达" :value="2"></el-option>
						<el-option label="国美点效" :value="3"></el-option>
					</el-select>
				</div>
				<div class="action-item">
					<span class="item-name">日期</span>
					<el-select v-model="timeScopeType" placeholder="请选择" style="">
						<el-option :label="formatChartTypeDateToday" value="0"></el-option>
						<el-option :label="formatChartTypeDateYesterday" value="1"></el-option>
						<el-option label="过去7天" value="2"></el-option>
						<el-option label="过去30天" value="3"></el-option>
					</el-select>
				</div>
			</div>
		</h2>
		<div class="map-data">
			<ul>
				<li>
					<strong>曝光量（次）</strong>
					<span>{{ overAll.impression }}</span>
				</li>
				<li>
					<strong>点击量（次）</strong>
					<span>{{ overAll.click }}</span>
				</li>
				<li>
					<strong>平均点击率</strong>
					<span>{{ ctr }}%</span>
				</li>
				<li>
					<strong>广告花费（元）</strong>
					<span>{{ overAll.adCost }}</span>
				</li>
				<li v-if="productLine === 2">
					<strong>返利花费（元）</strong>
					<span>{{ overAll.rebateCost }}</span>
				</li>
			</ul>
		</div>
		<div>
			<div class="map-select">
				<el-select v-model="dataOptions.oneSelected" placeholder="请选择" @change="firstSelectedChanged">
					<el-option v-for="item in dataOptionsSelect" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-select v-model="dataOptions.twoSelected" placeholder="请选择">
					<el-option v-for="item in secondOptions" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<div class="map-direct">
					<span class="direct-view" v-show="isItemShow.impression">曝光量</span>
					<span class="direct-click" v-show="isItemShow.click">点击量</span>
					<span class="direct-cost" v-show="isItemShow.adCost">广告花费</span>
					<span class="direct-rcost" v-show="isItemShow.rebateCost">返利花费</span>
					<span class="direct-ctr" v-show="isItemShow.ctr">平均点击率</span>
				</div>
			</div>
			<div class="map-show">
				<i-chart :lineChartOption="lineChartOption"></i-chart>
			</div>
		</div>
	</div>
</template>
<script>
	import Axios from 'utils/http';
	import IndexChart from './IndexChart.vue';
	import echarts from 'echarts/lib/echarts';
	import 'echarts/lib/chart/line';
	import 'echarts/lib/component/tooltip';
	import {formatDate, mixin} from 'utils/common.js';
	export default {
		name:'app-index-chart',
		components: {
			'i-chart': IndexChart
		},
		data() {
			return {
				productLine: 2,
				lineChartOption: null,
				isTimeScopeType: false,
				isImpression:false,
				chartTypeFormat: new Date(),
				timeScopeType: "0",
				overAll: {
					impression: 0,
					click: 0,
					ctr: 0,
					adCost:0,
					rebateCost:0
				},
				time:{
					starttime:0,
					endtime:0
				},
				charts:{
					xAxis:{
						data:[]
					},
					series:[]
				},
				dataOptions:{
					oneSelected:'impression',
					twoSelected:'click',
					one:[{
						value: 'impression',
						label: '曝光量'
					},{
						value: 'click',
						label: '点击量'
					},{
						value: 'ctr',
						label: '平均点击率'
					},{
						value: 'adCost',
						label: '广告花费'
					},{
						value: 'rebateCost',
						label: '返利花费'
					}]
				}
			};
		},
		created() {
			let vm = this;
			vm.lineChartOption = {
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						let str = params[0].name + "<br/>";
						for(let i = 0; i < params.length; i++) {
							if(params[i].seriesName == '点击率') {
								str += params[i].seriesName + ":" + parseFloat(params[i].value * 100).toFixed(2) + "%<br/>";
							} else if(params[i].seriesName.indexOf('花费') > -1) {
								str += params[i].seriesName + ":" + params[i].value + "元<br/>";
							} else {
								str += params[i].seriesName + ":" + params[i].value + "<br/>";
							}
						}
						return str;
					}
				},
				legend: {
					data: ['曝光量', '点击量', '点击率', '广告花费', '返利花费'],
					show: false,
					selected: {
						'曝光量': true,
						'点击量': true,
						'点击率': false,
						'广告花费': false,
						'返利花费': false
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
					axisLine: {
						lineStyle: {
							color: '#e8ebee'
						}
					},
					axisLabel: {
						color: '#23272c'
					},
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
					axisLabel: {
						show: true,
						color: '#23272c'
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#e8ebee'
						}
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
					axisLabel: {
						show: true,
						color: '#23272c'
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#e8ebee'
						}
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					axisTick: {
						show: false
					},
					nameTextStyle: {
						fontSize: 0
					},
					axisLabel: {
						show: false,
						color: '#23272c',
						formatter: function(value, index) {
							return (value * 100) + '%';
						}
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: '#e8ebee'
						}
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					axisTick: {
						show: false
					},
					nameTextStyle: {
						fontSize: 0
					},
					axisLabel: {
						show: false,
						color: '#23272c',
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: '#e8ebee'
						}
					},
					splitLine: {
						show: false
					}
				}, {
					name: '',
					type: 'value',
					axisTick: {
						show: false
					},
					nameTextStyle: {
						fontSize: 0
					},
					axisLabel: {
						show: false,
						color: '#23272c',
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: '#e8ebee'
						}
					},
					splitLine: {
						show: false
					}
				}],
				series: [{
					name: '曝光量',
					type: 'line',
					smooth: true,
					lineStyle: {
						normal: {
							color: '#19c490'
						}
					},
					itemStyle: {
						normal: {
							color: '#19c490'
						}
					},
					data: []
				}, {
					name: '点击量',
					type: 'line',
					smooth: true,
					yAxisIndex: 1,
					lineStyle: {
						normal: {
							color: '#fe8153'
						}
					},
					itemStyle: {
						normal: {
							color: '#fe8153'
						}
					},
					data: []
				}, {
					name: '点击率',
					type: 'line',
					smooth: true,
					yAxisIndex: 2,
					lineStyle: {
						normal: {
							color: '#DCA8FF'
						}
					},
					itemStyle: {
						normal: {
							color: '#DCA8FF'
						}
					},
					areaStyle: {
						normal: {
							color: '#DCA8FF',
							opacity: 0.5
						}
					},
					data: []
				}, {
					name: '广告花费',
					type: 'line',
					smooth: true,
					yAxisIndex: 3,
					lineStyle: {
						normal: {
							color: '#9EFFB9'
						}
					},
					itemStyle: {
						normal: {
							color: '#9EFFB9'
						}
					},
					data: []
				}, {
					name: '返利花费',
					type: 'line',
					smooth: true,
					yAxisIndex: 3,
					lineStyle: {
						normal: {
							color: '#f70f81'
						}
					},
					itemStyle: {
						normal: {
							color: '#f70f81'
						}
					},
					data: []
				}]
			};
			vm.calcTime();
		},
		computed: {
			dataOptionsSelect() {
				if (this.productLine === 2) {
					return [{
						value: 'impression',
						label: '曝光量'
					},{
						value: 'click',
						label: '点击量'
					},{
						value: 'ctr',
						label: '平均点击率'
					},{
						value: 'adCost',
						label: '广告花费'
					},{
						value: 'rebateCost',
						label: '返利花费'
					}];
				} else {
					return [{
						value: 'impression',
						label: '曝光量'
					},{
						value: 'click',
						label: '点击量'
					},{
						value: 'ctr',
						label: '平均点击率'
					},{
						value: 'adCost',
						label: '广告花费'
					}];
				}
			},
			secondOptions:function() {
				return this.dataOptionsSelect.filter((item) => item.value != this.dataOptions.oneSelected);
			},
			formatChartTypeDateToday: function() {
				return '今天 ' + formatDate(this.chartTypeFormat.getTime(), 'yyyy-MM-dd');
			},
			formatChartTypeDateYesterday: function() {
				let timestamp = this.chartTypeFormat.getTime() - 24 * 60 * 60 * 1000;
				return '昨天 ' + formatDate(timestamp, 'yyyy-MM-dd');
			},
			cost:function() {
				return this.overAll.cost / 100;
			},
			ctr:function() {
				return (this.overAll.ctr * 100).toFixed(2);
			},
			isItemShow:function() {
				let lineItemShow = {
					impression:this.dataOptions.oneSelected == 'impression' || this.dataOptions.oneSelected == '曝光量' || this.dataOptions.twoSelected == 'impression' || this.dataOptions.twoSelected == '曝光量',
					click:this.dataOptions.oneSelected == 'click' || this.dataOptions.oneSelected == '点击量' || this.dataOptions.twoSelected == 'click' || this.dataOptions.twoSelected == '点击量',
					ctr:this.dataOptions.oneSelected == 'ctr' || this.dataOptions.oneSelected == '点击率' || this.dataOptions.twoSelected == 'ctr' || this.dataOptions.twoSelected == '点击率',
					adCost:this.dataOptions.oneSelected == 'adCost' || this.dataOptions.oneSelected == '广告花费' || this.dataOptions.twoSelected == 'adCost' || this.dataOptions.twoSelected == '广告花费',
					rebateCost:this.dataOptions.oneSelected == 'rebateCost' || this.dataOptions.oneSelected == '返利花费' || this.dataOptions.twoSelected == 'rebateCost' || this.dataOptions.twoSelected == '返利花费'
				};
				return lineItemShow;
			},
			selectItemWords:function() {
				let selectItem = {
					one: this.dataOptions.oneSelected === 'impression' ? 0 : (this.dataOptions.oneSelected === 'click' ? 1 : (this.dataOptions.oneSelected === 'ctr' ? 2 : 3)),
					two: this.dataOptions.twoSelected === 'impression' ? 0 : (this.dataOptions.twoSelected === 'click' ? 1 : (this.dataOptions.twoSelected === 'ctr' ? 2 : 3))
				};
				return selectItem;
			}
		},
		methods: {
			loadReport() {
				let vm = this;
				Axios.get('/api/home/report',{
					params: {
						starttime: vm.time.starttime,
						endtime: vm.time.endtime,
						productLine: vm.productLine
					}
				}).then(function(response) {
					let data = response.data;
					if(response.status === 200 && data.code === 200){
						vm.overAll = mixin(vm.overAll, data.data.overall);
						vm.lineChartOption.xAxis.data = data.data.chart.xAxis.data;
						let series = data.data.chart.series;
						vm.setSeries(series);
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
				}).catch(function(error) {
					console.log(error);
				});
			},
			setSeries:function(series) {
				let vm = this;
				for(let i = 0;i<series.length;i++){
					switch (series[i].name){
						case 'impression':{
							vm.lineChartOption.series[0].data = series[i].data;
							break;
						}
						case 'click':{
							vm.lineChartOption.series[1].data = series[i].data;
							break;
						}
						case 'ctr':{
							vm.lineChartOption.series[2].data = series[i].data;
							break;
						}
						case 'adCost':{
							vm.lineChartOption.series[3].data = series[i].data;
							break;
						}
						case 'rebateCost':{
							vm.lineChartOption.series[4].data = series[i].data;
							break;
						}
					}
				}
			},
			calcTime:function() {
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
			firstSelectedChanged:function() {
				let secondSelectOpt = this.secondOptions;
				if (this.dataOptions.oneSelected === this.dataOptions.twoSelected){
					this.dataOptions.twoSelected = secondSelectOpt[0].value;
				}
			}
		},
		watch: {
			'timeScopeType': 'calcTime',
			'time':{
				handler:'loadReport',
				deep:true
			},
			'isItemShow':{
				handler:function(newItem) {
					this.lineChartOption.legend.selected = {
						'曝光量':newItem.impression,
						'点击量':newItem.click,
						'点击率':newItem.ctr,
						'广告花费':newItem.adCost,
						'返利花费':newItem.rebateCost
					};
					this.lineChartOption.yAxis.forEach((element, index) => {
						if (this.selectItemWords.one === index) {
							element.position = 'left';
							element.axisLine.show = true;
							element.axisLabel.show = true;
							element.axisTick.show = true;
						} else if (this.selectItemWords.two === index) {
							element.position = 'right';
							element.axisLine.show = true;
							element.axisLabel.show = true;
							element.axisTick.show = true;
							element.nameTextStyle.fontSize = 12;
						} else {
							element.axisLine.show = false;
							element.axisLabel.show = false;
							element.axisTick.show = false;
						}
					});
				},
				deep:true
			},
			productLine: function(val, oldVal) {
				this.timeScopeType = '0';
				this.dataOptions.oneSelected = 'impression';
				this.dataOptions.twoSelected = 'click';
				this.loadReport();
			}
		}
	};
</script>
<style scoped>
	.map-direct span.direct-cost:before {background: #9EFFB9;}
	.map-direct span.direct-click:before {background: #fe8153;}
	.map-direct span.direct-rcost:before {background: #f70f81;}
	.map-direct span.direct-ctr:before {background: #DCA8FF;}
</style>
