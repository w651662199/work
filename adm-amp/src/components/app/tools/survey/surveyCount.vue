<template>
	<div class="amp-drawer" style="padding-bottom: 0;">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">{{questionName}}</span><span class="header-fn"><em
				@click="closeCount()" class="icon icon-close"></em></span></h2>
				<div class="questionCount-main">
					<div class="header">
						<ul>
							<li :class="showSituation?'active':''" @click='tapShowSituation'>问卷概况</li>
							<li :class="showStatistics?'active':''" @click='tapShowStatistics'>分题统计</li>
						</ul>
					</div>
					<div class="situation" v-show='showSituation'>

						<div class="situation-top">
							<ul>
								<li>
									<span style="color: #e74c3a;">{{situationSummary.totalView}}</span>
									<p>浏览总量</p>
								</li>
								<li>
									<span style="color: #3598db;">{{situationSummary.totalSubmit}}</span>
									<p>回收总量</p>
								</li>
								<li>
									<span style="color: #2fb465;">{{situationSummary.lastDaySubmit}}</span>
									<p>昨日回收</p>
								</li>
								<li>
									<span style="color: #f1c50e;">{{situationSummary.submitRate*100+'%'}}</span>
									<p>回收率</p>
								</li>
							</ul>
						</div>
						<div class="situation-content">
							<h2>每日回收数</h2>
							<div class="time">
								<div class="time-left">
									<el-date-picker :picker-options="pickerOptions0" v-model="startTime" type="date" :editable="false" style="width:130px;" placeholder="开始日期">
						            </el-date-picker>
						            <span class="plan-title plan-title-gray" style="padding: 0 5px;">-</span>
						            <el-date-picker :picker-options="pickerOptions0" v-model="endTime" type="date" :editable="false" style="width:130px;" placeholder="结束日期">
						            </el-date-picker>
					            </div>
					            <div class="time-right">
					            	<ul>
					            		<li :class="lineBg?'selected':''" @click='selectLine'>折线图</li>
					            		<li :class="barBg?'selected':''" @click='selectBar'>柱状图</li>
					            	</ul>
					            </div>
					            <div class="time-middle">{{hintText}}</div>
							</div>
							<div id="lineChart"></div>
							<h3>问卷回收率</h3>
							<div id="pieChart"></div>
						</div>
					</div>
					<!--分题统计-->
					<div class="statistics" v-if='showStatistics'>
						<div class="question" v-for='(item,index1) in questions'>
							<div class="question-table" style="box-sizing: content-box;">
								<h2>Q{{index1+1}}. {{item.name}}<span @click='showTextAnswer(item.type,item.surveyQuestionId)' :class="item.type==4?'showText':''">{{item.type==1?"（单选）":(item.type==2?"（多选）":(item.type==3?"（评分）":"查看回答"))}}</span></h2>
								<div class="table-content" style="width:690px;" v-show='item.type!=4'>
									<table class="table">
										<thead>
											<tr class="media-tr">
												<th><span>选项</span></th>
												<th style="width:115px"><span>人数</span></th>
												<th style="width:240px"><span>比例</span></th>
											</tr>
										</thead>
										<tbody>
											<tr class="media-list-tr" v-for='(data,index2) in item.list'>
												<td><span>{{item.type==3?'':data.name}}<ul class="score-heart" v-show='item.type==3'>
													<li v-for='(heartData,index3) in heart' :class='heartData<=data.name?"showHeart":""'></li>
												</ul></span></td>
												<td><span>{{data.number}}</span></td>
												<td><span style="overflow: hidden;"><p class="rateBar"><em :style="{width: data.rate}"></em></p><p style="float: left;">{{data.rate}}</p></span></td>
											</tr>
										</tbody>
									</table>
									<div class="totalPeople">
										<ul>
											<li>总人数：{{totalPeople}}</li>
											<li v-if='item.type==3'>平均分：{{item.avgNumber}}</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="question-chart" v-show='item.type!=4'>
								<div class="chartChange">
					            	<ul>
					            		<li class="selected" @click='changeBar($event,index1,"bar")'>柱状图</li>
					            		<li v-show='item.type!=2' @click='changeBar($event,index1,"pie")'>饼状图</li>
					            	</ul>
					            </div>
					            <div v-show='item.chartType == 1' class="statisticsChart" :id='"bar-"+item.surveyQuestionId' style="width: 752px;height:260px;"></div>
					            <div v-show='item.chartType == 2' class="statisticsChart" :id='"pie-"+item.surveyQuestionId' style="width: 752px;height:260px;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		<transition name="drawer" :appear="true">
			<m-count :answerId='answerId' :countShow="countShow" v-if="countShow"></m-count>
		</transition>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import http from 'utils/http';
	import echarts from 'echarts/lib/echarts';
	import 'echarts/lib/chart/line';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/chart/pie';
	import 'echarts/lib/component/tooltip';
	import answerSummary from './answerSummary.vue';
	import {
		objType,
		floatSub,
	} from 'utils/common';
	import moment from 'moment/moment.js';
	export default {
		name: 'app-survey-count',
		props: ['pageId','questionName'],
		data() {
			return {
				pickerOptions0: {
		            disabledDate(time) {
		            	return time.getTime() > Date.now() - 8.64e7;
		            }
		        },
		        hintText: '',
				countShow: false,
				showSituation: true,
				showStatistics: false,
				lineBg: true,
				barBg: false,
				statisticsBar: true,
				statisticsPie: false,
				situationSummary: {},
				startTime: moment().add(-7, 'days').format(),
       			endTime: moment().add(-1, 'days').format(),
       			setOptionBar: [],
       			heart: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
       			setOptionPie: {
				    series: [{
				            type: 'pie',
				            radius : '75%',
				            center: ['50%', '50%'],
				            data: [],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            },
				            startAngle: 225
				       }],
				    color: ['#e84c3d', '#fcd8dc']
       			},
       			setOptionLine: {
	                tooltip: {
	                	trigger: 'axis',
	                },
	                xAxis: {
	                    type: 'category',
						boundaryGap: false,
						data: [],
						axisLabel: {
					        interval: 4
					    },
					    axisPointer: {
					    	show: true,
					    	type: 'line',
					    },
					    axisTick: {
					    	alignWithLabel: true
					    }
	                },
	                yAxis: {
	                	interval: 50,
	                	type: 'value'
	                },
	                series: [{
	                	name: '回收数',
			            type: 'line',
			            smooth: true,
			            itemStyle: {
			                normal: {
			                    color: 'rgb(8, 172, 244)'
			                }
			            },
			            areaStyle: {
			                normal: {
			                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                        offset: 0,
			                        color: 'rgb(200, 247, 251)'
			                    }, {
			                        offset: 1,
			                        color: 'rgb(200, 247, 251)'
			                    }])
			                }
			            },
			            data: []
			        }],
	                animation: true,
	                grid: {
				        left: '3%',
				        right: '5%',
				        bottom: '3%',
				        containLabel: true
				    }
       			},
       			myChart: '',
       			myChartPie: '',
       			myChartBar: [],
       			questions: [],
       			answerId: '',
       			totalPeople: '',
       			statisticOpationBar: {
                    xAxis: {
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: [],
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        }
                    },
                    yAxis: {},
                    series: [{
                        type: 'bar',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: 'rgb(53, 152, 219)'
                            }
                        },
                        barMaxWidth: '85'
                    }],
                    animation:true,
                    grid: {
                        left: '0',
                        right: '5%',
                        containLabel: true
                    }
                },
                statisticOpationPie: {
                	series: [{
                            type: 'pie',
                            radius : '75%',
                            center: ['50%', '50%'],
                            data: [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            startAngle: 225
                       }],
                    color: ['#e84c3d', '#fcd8dc'] 
                }
       		};
		},
		computed: {
			config: () => store.state.drawerCtrl
		},
		components: {
			'm-count': answerSummary,
		},
		created() {
			this.getSituationSummary();
		},
		mounted() {
			var vm = this;
			vm.myChart = echarts.init(document.getElementById('lineChart'));
			vm.myChartPie = echarts.init(document.getElementById('pieChart'));
			vm.getList();
			Event.$on('close-answerSummary', () => {
				vm.countShow = false;
			});
		},
		methods: {
			showTextAnswer(type,id) {
				if (type == 4) {
					this.countShow = true;
					this.answerId = id;
				}
			},
			getInformation() {
				var vm = this;
				http.get('/api/survey/statistics', {
					params: {
						surveyId: vm.pageId
					}
				})
				.then(function(res) {
					if (res.data.code == 200) {
						vm.totalPeople = res.data.data.totalPeople;
						vm.questions = res.data.data.questionList;
						for (var i = 0;i < res.data.data.questionList.length;i++) {
							Vue.set(vm.questions[i], 'chartType', 1);
						}
						vm.$nextTick(function() {
							for (var i = 0;i < res.data.data.questionList.length;i++) {
								var storageChartHeight = [];
								vm.statisticOpationBar.xAxis.data = [];
								vm.statisticOpationBar.series[0].data = [];
								vm.statisticOpationPie.series[0].data = [];
								for (var j = 0;j < vm.questions[i].list.length;j++) {
									var showGrade = vm.questions[i].type == 3 ? '分' : '';
									vm.statisticOpationBar.xAxis.data.push(vm.questions[i].list[j].name + showGrade);
									storageChartHeight.push(vm.questions[i].list[j].name.length);
									vm.statisticOpationBar.series[0].data.push(vm.questions[i].list[j].number);
									vm.statisticOpationPie.series[0].data.push({value:vm.questions[i].list[j].number, name:vm.questions[i].list[j].name + showGrade});
								}
								var actualHeight = 260 + ((storageChartHeight.sort(function(a,b){return a - b;})[storageChartHeight.length - 1]) * 6);
								var gridBottom = floatSub(1,(260/actualHeight).toFixed(2))*100;
								vm.statisticOpationBar.grid.bottom = gridBottom+'%';
								document.getElementById("bar-" + vm.questions[i].surveyQuestionId).style.height = actualHeight + 'px';
								echarts.init(document.getElementById('bar-' + vm.questions[i].surveyQuestionId)).setOption(vm.statisticOpationBar);
								echarts.init(document.getElementById('pie-' + vm.questions[i].surveyQuestionId)).setOption(vm.statisticOpationPie);
							}
						})
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
				})
			},
			getList() {
				var vm = this;
				vm.setOptionLine.series[0].data = [];
				vm.setOptionPie.series[0].data = [];
				vm.setOptionLine.xAxis.data = [];
				http.get('/api/survey/recover', {
					params: {
						surveyId: vm.pageId,
						startTime: moment(vm.startTime).valueOf(),
						endTime: moment(vm.endTime).valueOf()
					}
				})
				.then(function(res) {
					if (res.data.code == 200) {
						var data = res.data.data;
						vm.setOptionPie.series[0].data.push({value:data.timeSubmitRate, name:'已回收的问卷占比(' + data.timeSubmitRate*100 + '%)'},{value:1 - data.timeSubmitRate, name:'(' + floatSub(1,data.timeSubmitRate)*100 + '%)'});
						for (var i = 0;i < data.report.length;i++) {
							vm.setOptionLine.xAxis.data.push(moment(data.report[i].surveySummaryTime).format('YYYY-MM-DD'));
							vm.setOptionLine.series[0].data.push(data.report[i].submitNumber);
						}
						vm.drawLine();
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
				})
			},
			drawLine() {
			    this.myChart.setOption(this.setOptionLine);
			    this.myChartPie.setOption(this.setOptionPie);
			},
			closeCount() {
				Event.$emit('close-count');
			},
			tapShowSituation() {
				this.showSituation = true;
				this.showStatistics = false;
				this.getList();
				this.getSituationSummary();
			},
			tapShowStatistics() {
				this.getInformation();
				this.showSituation = false;
				this.showStatistics = true;
			},
			selectLine() {
				this.lineBg = true;
				this.barBg = false;
				this.setOptionLine.series[0].type = 'line';
				this.setOptionLine.xAxis.boundaryGap = false;
				this.drawLine();
			},
			selectBar() {
				this.lineBg = false;
				this.barBg = true;
				this.setOptionLine.series[0].type = 'bar';
				this.setOptionLine.series[0].barMaxWidth = '85';
				this.setOptionLine.xAxis.boundaryGap = true;
				this.drawLine();
			},
			changeBar(event,index1,type) {
				var allChild = event.currentTarget.parentElement.childNodes;
				for (var i = 0;i < allChild.length;i++) {
					if (!allChild[i].innerHTML) {
						continue;
					}
					allChild[i].setAttribute('class','');
				}
				event.currentTarget.setAttribute('class','selected');
				if (type == 'pie') {
					this.questions[index1].chartType = 2;
				} else {
					this.questions[index1].chartType = 1;
				}
			},
			getSituationSummary() {
				var vm = this;
				http.get('/api/survey/summary', {
					params: {
						surveyId: vm.pageId
					}
				}).then((res) => {
					if (res.data.code == 200) {
						vm.situationSummary = res.data.data;
					} else {
						vm.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			getHintText(judge) {
				var start = moment(this.startTime).valueOf();
				var end = moment(this.endTime).valueOf();
				if (!(end <= start) || !this.endTime || !this.startTime) {
					var values = moment(this.endTime).diff(moment(this.startTime), 'days');
					if (values > 30) {
						this.hintText = '时间段不能超过30天';
					} else {
						if (!this.endTime || !this.startTime) {
							this.hintText = '开始或结束时间不能为空';
						} else {
							this.getList();
							this.hintText = '';
						}
					}
				} else {
					if (judge == 'endTime') {
						this.hintText = '结束时间不能小于或等于开始时间';
					} else {
						this.hintText = '开始时间不能大于或等于结束时间';
					}
				}
			}
		},
		watch: {
			'endTime': function() {
				this.getHintText('endTime');
			},
			'startTime': function() {
				this.getHintText('startTime');
			}
		}
	}
</script>
<style lang="less">
	.questionCount-main{
		.header{
			height: 60px;
			border-top: 1px solid #e5e5e5;
			border-bottom: 1px solid #e5e5e5;
			text-align: center;
			ul{
				display: inline-block;
					li{
					float: left;
					height: 59px;
					width: 100px;
					text-align: center;
					line-height: 60px;
					color: #676767;
					font-size: 15px;
					cursor: pointer;
					&:first-child{
						margin-right: 45px;
					}
				}
				li.active{
					border-bottom: 2px solid #e94c3d;
				}
			}
		}
		.situation{
			.situation-top{
				ul{
					text-align: center;
					li{
						display: inline-block;
						height: 162px;
						padding: 40px 73px;
						span{
							display: block;
							text-align: center;
							font-size: 30px;
							line-height: 30px;
						}
						p{
							text-align: center;
							line-height: 30px;
							color: #676767;
							font-size: 15px;
						}
					}
				}
			}
			.situation-content{
				padding: 0 140px;
				h2{
					height: 45px;
					color: #26272c;
				}
				h3{
					height: 75px;
					color: #26272c;
					line-height: 75px;
					margin-top: 20px;
				}
				.time{
					overflow: hidden;
					position: relative;
					.time-left{
						float: left;
					}
					.time-right{
						float: right;
						ul li{
							float: left;
							height: 35px;
							line-height: 35px;
							cursor: pointer;
							padding: 0 25px;
							color: #a5b5c5;
						}
						ul li.selected{
							background: #a5b5c5;
							color: #fff;
							border-radius: 20px;
						}
					}
					.time-middle{
						position: absolute;
						left: 295px;
						top: 0;
						line-height: 36px;
						color: red;
						font-size: 12px;
					}
				}
				#lineChart{
					width:100%;
					height: 260px;
				}
				#pieChart{
					width:100%;
					height: 260px;
				}
			}
		}
		.statistics{
			padding-left: 120px;
			.question{
				overflow: hidden;
				width:781px;
				padding: 20px 0px 10px 20px;
				border: 1px solid #e9e9e9;
				margin-bottom:17px;
				&:first-child{
					margin-top:33px;
				}
				h2{
					color: #343434;
					.showText{
						display: inline-block;
						width:100px;
						height: 35px;
						background: #e84d3b;
						text-align: center;
						line-height: 35px;
						color: #fff;
						border-radius: 5px;
						margin-left: 18px;
						cursor: pointer;
					}
				}
				.table-content{
					padding: 22px 0 26px 33px;
					.totalPeople{
						ul {
							overflow: hidden;
							li{
								float: right;
								margin-left: 20px;
								padding-top: 15px;
								color: #343434;
							}
						}
					}
				}
				.question-chart{
					.chartChange{
						overflow:hidden;
						ul li{
							float: left;
							height: 35px;
							line-height: 35px;
							cursor: pointer;
							padding: 0 25px;
							color: #a5b5c5;
						}
						ul li.selected{
							background: #a5b5c5;
							color: #fff;
							border-radius: 20px;
						}
					}
					.statisticsChart{
						width:100%;
						height: 260px;
					}
				}
				.score-heart{
					overflow: hidden;
					li{
						width:23px;
						height: 20px;
						float: left;
						background: url(../../../../assets/img/heart-border.png) no-repeat center center;
						background-size: 80%;
						margin-left: 6px;
					}
				}
				.score-heart li.showHeart{
					background: url(../../../../assets/img/heart.png) no-repeat center center;
					background-size: 80%;
				}
				.rateBar{
					display: block;
					width:115px;
					height: 8px;
					background: #e7f5fe;
					margin-right: 20px;
					border-radius: 4px;
					float: left;
					margin-top: 6px;
					margin-left: 18px;
					em{
						width:0%;
						height: 8px;
						display: block;
						background: #68b6e7;
						border-radius: 4px;
					}
				}
			}
		}
	}
</style>
