<template>
	<div>
		<div class="crumbs">
			<a href="#/app/put/campaign"><span class="">推广计划</span></a>&gt;<span class="crumbs-selected">推广单元</span>
		</div>
		<div class="query-information">
			<div class="information-fn">
				<el-popover ref="popover1" placement="bottom" width="260" trigger="click">
					<div class="el-custom-con">
						<div class="el-custom-con_wrap">
							<ul class="el-custom-con_list">
								<ul class="el-custom-group_wrap" v-for="group in customHeaders">
									<li class="el-custom-group_wrap-title">{{group.title}}</li>
									<li>
										<ul class="el-custom-group" v-for="item in group.fields">
											<li :class="{'el-custom-dropdown__item': true, selected: item.checked}" @click="item.checked = !item.checked"><span>{{item.msg}}</span></li>
										</ul>
									</li>
								</ul>
							</ul>
						</div>
					</div>
				</el-popover>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="newFlight">新建单元</button>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue-simple" type="button" @click.prevent="deleteFlights">删除</button>
				</div>
				<div class="fn-item">
					<el-input v-model="searchParams.keyword" placeholder="搜索单元" style="width:170px;display:inline-block;"></el-input>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
				</div>
				<div class="fn-item" style="float:right;padding: 8px 10px;border: 1px solid #c0ccda;border-radius:4px;cursor: pointer;">
					<span v-popover:popover1>自定义指标</span>
				</div>
			</div>
			<div class="information-fn">
				<div class="fn-item">
					<span>单元状态：</span>
					<el-select v-model="searchParams.flightStatus" style="width:130px;display:inline-block;" placeholder="请选择">
						<el-option v-for="status of searchParams.statusOptions" :label="status.label" :value="status.value"></el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_flight_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w40"><span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectAll"></em></span></th>
								<th class="w140"><span>单元名称</span></th>
								<th class="w80"><span>单元状态</span></th>
								<th class="w80"><span>出价</span></th>
								<th class="w140"><span>操作</span></th>
								<template v-for="headerGroup of customHeaders">
									<th v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{item.msg}}</span>
									</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="flight in list" :key="flight.groudId">
								<td><span><em class="icon" :class="{'icon-select': !flight.checked, 'icon-selected': flight.checked}" @click="selectFlight(flight)"></em></span></td>
								<td><span><i class="ellipsis"><router-link :to="{name: 'material', params: {id: flight.flightId}}">{{flight.name}}</router-link></i></span></td>
								<td><span>{{getFlightStatus(flight.state)}}</span></td>
								<td><span>{{saleMode === CONST.SALE_MODE.BID_CPM ? flight.bid : price | currency('', 2)}}</span></td>
								<td>
									<span>
										<b class="operat-link">
											<a href="" @click.prevent="modify(flight)">编辑</a>
											<a href="javascript:void(0)" v-if="isShowStart(flight)" @click.prevent="changeStatus(flight, 1)">启动</a>
											<a href="javascript:void(0)" v-if="isShowPause(flight)" @click.prevent="changeStatus(flight, 0)">暂停</a>
										</b>
									</span>
								</td>
								<template v-for="headerGroup of customHeaders">
									<td v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{flight[item.label] != 'undefine' ? flight[item.label] : '-'}}</span>
									</td>
								</template>
							</tr>
						</tbody>
					</table>
					<p class="no-content" v-if="list.length === 0">无相关查询结果</p>
				</div>
			</div>
		</div>
		<el-pagination
			@current-change="currentPageChange"
			:current-page="page.currentPage"
			:page-size="page.pageSize"
			layout="total, prev, pager, next"
			:total="page.totalCount"
			:class="{'el-pagination-reset': true}">
		</el-pagination>
		<el-dialog :title="dialogData.title" v-model="dialogData.dialogVisible" size="tiny">
			<h3>{{dialogData.message}}</h3>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="dialogHandler">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>

import actions from 'actions';
import Http from 'http';
import Event from 'event';
import CONST from 'help/CONST.js';
import {
	copyObj,
	floatMul
} from 'utils/common';
export default {
	name: 'FlightList',
	data() {
		return {
			list: [],
			CONST: CONST,
			customHeaders: [{
				title: '效果指标',
				fields: [
					{msg: '竞价次数', checked: false, label: 'bidCount'},
					{msg: '获胜次数', checked: false, label: 'winCount'},
					{msg: '获胜率', checked: false, label: 'winRate'},
					{msg: '展示量', checked: true, label: 'pv'},
					{msg: '点击量', checked: true, label: 'clickCount'},
					{msg: '总花费', checked: true, label: 'totalFee'},
					{msg: '平均点击单价', checked: true, label: 'acp'},
					{msg: '平均CPM单价', checked: true, label: 'cpm'},
					{msg: '点击率', checked: true, label: 'ctr'}
				]}
			],
			searchParams: {
				keyword: '',
				flightStatus: -2,
				statusOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '投放中',
					value: CONST.FLIGHT_STATUS.NORMAL
				}, {
					label: '暂停',
					value: CONST.FLIGHT_STATUS.SUSPEND
				}, {
					label: '每日曝光到量',
					value: CONST.FLIGHT_STATUS.DAILY_EXPOSURE_ENOUGHT
				}]
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			dialogData: {
				dialogVisible: false,
				body_html: '',
				title: '',
				data: '',
				type: '',
				sureHandler: ''
			},
			flightIds: [],
			saleMode: '',
			biddingMode:'',
			price: '',
			allFlights: [],
			queryFlights: []
		};
	},
	computed: {
		campaignId() {
			return this.$route.params.id;
		},
		isAllSelect() {
			let isSelect = true;
			for (let flight of this.list) {
				if (!flight.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		}
	},
	created() {
		let queryObj = this.getUrlParams();
		if (queryObj) {
			this.searchParams.keyword = queryObj.keyword;
			this.searchParams.flightStatus = +queryObj.status;
			this.page.currentPage = queryObj.page;
			this.page.pageSize = queryObj.pageSize;
		}
		this.getCampaign();
		this.getFlightList();
	},
	mounted() {
		Event.$off("put-save-success");
		Event.$on("put-save-success", () => {
			this.getFlightList();
		});
	},
	methods: {
		getCampaign() {
			Http.get('/api/campaign?campaignId=' + this.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.saleMode = res.data.data.saleMode;
					this.biddingMode = res.data.data.biddingMode;
					this.price = res.data.data.price;
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		newFlight() {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'new',
				type: 'flight',
				config: {campaignId: this.campaignId, saleMode: this.saleMode, biddingMode: this.biddingMode}
			});
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getFlightList() {
			Http.get('/api/flights?campaignId=' + this.campaignId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.allFlights = res.data.data;
					this.getList();
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getList() {
			this.setUrlParams({
				keyword: this.searchParams.keyword,
				status: this.searchParams.flightStatus,
				page: this.page.currentPage,
				pageSize: this.page.pageSize
			});

			let flights = [];
			flights = this.queryByKeyword();
			flights = this.queryByState(flights);
			this.queryFlights = flights;
			let startIndex = (this.page.currentPage - 1) * this.page.pageSize;
			let currentPageFlights = this.queryFlights.slice(startIndex, startIndex + this.page.pageSize);
			this.page.totalCount = this.queryFlights.length;
			let list = [];
			for (let flight of currentPageFlights) {
				let f = copyObj(flight);
				f.checked = false;
				list.push(f);
			}
			this.list = list;
			this.getReport();
		},
		queryByKeyword() {
			let flights = [];
			if (this.searchParams.keyword === '') {
				flights = this.allFlights;
			} else {
				for (let flight of this.allFlights) {
					let name = flight.name.toLowerCase();
					if (name.indexOf(this.searchParams.keyword.toLowerCase()) > -1) {
						flights.push(flight);
					}
				}
			}
			return flights;
		},
		queryByState(flights) {
			let flis = [];
			if (this.searchParams.flightStatus === -2) {
				flis = flights;
			} else {
				for (let flight of flights) {
					if (flight.state === this.searchParams.flightStatus) {
						flis.push(flight);
					}
				}
			}
			return flis;
		},
		getReport() {
			if (this.list.length === 0) return;
			let flightIds = [];
			for (let flight of this.list) {
				flightIds.push(flight.flightId);
			}
			Http.get('/api/report/flights/batch', {
				params: {
					flightIds: flightIds.join(',')
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let flightMap = this.getReportMap(res.data.data);
					for (let flight of this.list) {
						let report = flightMap['F_' + flight.flightId];
						if (report) {
							this.$set(flight, 'bidCount', report.bidCount);
							if (this.biddingMode === CONST.BIDDING_MODE.RTB) {
								this.$set(flight, 'winCount', report.winCount);
								this.$set(flight, 'winRate', this.getWinRate(report.winCount, report.bidCount));
							} else {
								this.$set(flight, 'winCount', report.bidCount);
								this.$set(flight, 'winRate', this.getWinRate(report.bidCount, report.bidCount));
							}
							this.$set(flight, 'pv', report.pv);
							this.$set(flight, 'clickCount', report.clickCount);
							this.$set(flight, 'totalFee', this.getCurFmt(report.totalFee).toFixed(2));
							this.$set(flight, 'acp', this.getAvgClickPrice(this.getCurFmt(report.totalFee), report.clickCount));
							this.$set(flight, 'cpm', this.getAvgMillPrice(this.getCurFmt(report.totalFee), report.pv));
							this.$set(flight, 'ctr', this.getCtr(report.clickCount, report.pv));
						}
					}
				}
			});
		},
		getReportMap(data) {
			let map = [];
			for (let flight of data) {
				let key = 'F_' + flight.flightId;
				map[key] = flight;
			}
			return map;
		},
		modify(flight) {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'modify',
				type: 'flight',
				config: {campaignId: this.campaignId, flightId: flight.flightId, biddingMode: this.biddingMode, saleMode: this.saleMode}
			});
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let flight of this.list) {
				flight.checked = !isAllSelect;
			}
		},
		selectFlight(flight) {
			flight.checked = !flight.checked;
		},
		deleteFlights() {
			let flightIds = [];
			for (let flight of this.list) {
				if (flight.checked) {
					if (flight.state !== CONST.FLIGHT_STATUS.SUSPEND) {
						this.dialogData.message = '仅暂停状态单元可被删除！';
						this.dialogData.sureHandler = this.closeDialog;
						this.dialogData.dialogVisible = true;
						return;
					} else {
						flightIds.push(flight.flightId);
					}
				}
			}
			if (flightIds.length === 0) return;
			this.flightIds = flightIds;
			this.dialogData.message = '确定要删除选中单元吗？';
			this.dialogData.sureHandler = this.deleteFlightsHandler;
			this.dialogData.dialogVisible = true;
		},
		deleteFlightsHandler() {
			if (this.flightIds.length === 0) return;
			Http.delete('/api/flight', {
				data: {
					flightIds: this.flightIds
				}
			}).then(res => {
				if (res.data.code !== 200 || res.data.iserror !== 0) {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				} else {
					this.getFlightList();
					this.flightIds = [];
				}
			}).catch(err => {
				console.log(err);
			});
		},
		dialogHandler() {
			this.dialogData.sureHandler();
			this.closeDialog();
		},
		closeDialog() {
			this.dialogData.message = '';
			this.dialogData.data = '';
			this.dialogData.type = '';
			this.dialogData.sureHandler = null;
			this.dialogData.dialogVisible = false;
		},
		isShowStart(flight) {
			if (flight.state === CONST.FLIGHT_STATUS.SUSPEND) {
				return true;
			}
			return false;
		},
		isShowPause(flight) {
			if (flight.state === CONST.FLIGHT_STATUS.NORMAL) {
				return true;
			}
			return false;
		},
		getFlightStatus(state) {
			if (state === CONST.FLIGHT_STATUS.SUSPEND) {
				return '暂停';
			} else if (state === CONST.FLIGHT_STATUS.NORMAL) {
				return '投放中';
			} else if (state === CONST.FLIGHT_STATUS.DAILY_EXPOSURE_ENOUGHT) {
				return '每日曝光到量';
			}
			return '';
		},
		changeStatus(flight, type) {
			this.dialogData.data = flight.flightId;
			this.dialogData.type = type;
			this.dialogData.message = '是否' + (type === 1 ? '启动' : '暂停') + '该单元?';
			this.dialogData.sureHandler = this.changeStatusHandler;
			this.dialogData.dialogVisible = true;
		},
		changeStatusHandler() {
			Http.put('/api/flight/status', {
				flightId: this.dialogData.data,
				status: this.dialogData.type === 1 ? 1 : 0
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.getFlightList();
					this.closeDialog();
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 300
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
	}
};
</script>