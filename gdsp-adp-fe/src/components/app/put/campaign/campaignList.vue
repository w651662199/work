<template>
	<div>
		<div class="crumbs" v-if="!!groupId">
			<a href="#/app/put/group"><span class="">推广组</span></a>&gt;<span class="crumbs-selected">推广计划</span>
		</div>
		<div class="query-information">
			<div class="information-fn">
				<el-popover ref="popover1" placement="bottom" width="260" trigger="click">
					<div class="el-custom-con">
						<div class="el-custom-con_wrap">
							<ul class="el-custom-con_list">
								<ul class="el-custom-group_wrap" v-for="campaign in customHeaders">
									<li class="el-custom-group_wrap-title">{{campaign.title}}</li>
									<li>
										<ul class="el-custom-group" v-for="item in campaign.fields">
											<li :class="{'el-custom-dropdown__item': true, selected: item.checked}" @click="item.checked = !item.checked"><span>{{item.msg}}</span></li>
										</ul>
									</li>
								</ul>
							</ul>
						</div>
					</div>
				</el-popover>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="newCampaign">新建计划</button>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue-simple" type="button" @click.prevent="deleteCampaigns">删除</button>
				</div>
				<div class="fn-item">
					<el-input v-model="searchParams.keyword" placeholder="搜索计划" style="width:170px;display:inline-block;"></el-input>
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
					<span>投放时间段：</span>
					<el-date-picker v-model="searchDateRange" type="daterange" align="right" placeholder="选择日期范围" :editable="false" style="width:240px;"></el-date-picker>
				</div>
				<div class="fn-item">
					<span>计划类型：</span>
					<el-select v-model="searchParams.saleMode" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="status of searchParams.saleModeOptions" :label="status.label" :value="status.value"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>投放类型：</span>
					<el-select v-model="searchParams.biddingMode" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="status of searchParams.biddingModeOptions" :label="status.label" :value="status.value"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>计划状态：</span>
					<el-select v-model="searchParams.status" style="width:130px;display:inline-block;" placeholder="请选择">
						<el-option v-for="status of searchParams.statusOptions" :label="status.label" :value="status.value"></el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_campaign_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w40"><span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectAll"></em></span></th>
								<th class="w140"><span>计划名称</span></th>
								<th class="w120"><span>投放时间段</span></th>
								<th class="w80"><span>计费类型</span></th>
								<th class="w80"><span>计划状态</span></th>
								<th class="w80"><span>投放类型</span></th>
								<th class="w140"><span>操作</span></th>
								<template v-for="headerGroup of customHeaders">
									<th v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{item.msg}}</span>
									</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="campaign in list" :key="campaign.campaignId">
								<td><span><em class="icon" :class="{'icon-select': !campaign.checked, 'icon-selected': campaign.checked}" @click="selectCampaign(campaign)"></em></span></td>
								<td><span :title="campaign.name"><i class="ellipsis"><router-link :to="{name: 'flight', params: {id: campaign.campaignId}}">{{campaign.name}}</router-link></i></span></td>
								<td><span><i class="ellipsis">{{getTime(campaign.startTime)}}<br/>{{getEndTime(campaign)}}</i></span></td>
								<td><span><i class="ellipsis">{{getSaleMode(campaign)}}</i></span></td>
								<td><span :title="getStatus(campaign)"><i class="ellipsis">{{getStatus(campaign)}}</i></span></td>
								<td><span><i class="ellipsis">{{getBiddingMode(campaign)}}</i></span></td>
								<td>
									<span>
										<b class="operat-link">
											<a href="javascript:void(0)" v-if="isShowModify(campaign)" @click.prevent="modify(campaign)">编辑</a>
											<a href="javascript:void(0)" v-if="isShowStart(campaign)" @click.prevent="changeStatus(campaign, 1)">启动</a>
											<a href="javascript:void(0)" v-if="isShowPause(campaign)" @click.prevent="changeStatus(campaign, 0)">暂停</a>
											<a href="javascript:void(0)" v-if="isShowView(campaign)" @click.prevent="showViewCampaign(campaign.campaignId)">查看</a>
										</b>
									</span>
								</td>
								<template v-for="headerGroup of customHeaders">
									<td v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span v-if="item.label === 'dailyBudget'">{{getDailyBudget(campaign)}}</span>
										<span v-if="item.label !== 'dailyBudget'">{{campaign[item.label] != 'undefine' ? campaign[item.label] : '-'}}</span>
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
				<el-button @click="dialogData.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogHandler">确 定</el-button>
			</span>
		</el-dialog>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="isShowCampaignDrawer"></div>
		</transition>
		<transition name="drawer">
			<view-campaign v-if="isShowCampaignDrawer" :campaignId="campaignId"></view-campaign>
		</transition>
	</div>
</template>
<script>

import Event from 'event';
import actions from 'actions';
import CONST from 'help/CONST.js';
import moment from 'moment';
import Http from 'http';
import {
	copyObj,
	floatMul
} from 'utils/common';
import ViewCampaign from './viewCampaign.vue';
export default {
	name: 'CampaignList',
	data() {
		return {
			list: [],
			customHeaders: [{
				title: '指标',
				fields: [
					{msg: '日预算', checked: false, label: 'dailyBudget'},
					{msg: '请求数', checked: false, label: 'requestCount'},
					{msg: '退量数', checked: false, label: 'reCount'},
					{msg: '实际退量比', checked: false, label: 'reRate'},
					{msg: '竞价次数', checked: false, label: 'bidCount'},
					{msg: '竞价率', checked: false, label: 'bidRate'},
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
			searchDateRange: ['', ''],
			searchParams: {
				keyword: '',
				saleMode: -2,
				biddingMode: -2,
				status: -2,
				saleModeOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '定价CPM',
					value: CONST.SALE_MODE.FIX_CPM
				}, {
					label: '竞价CPM',
					value: CONST.SALE_MODE.BID_CPM
				}],
				biddingModeOptions: [{
					label: '全部',
					value: -2
				}, {
					label: 'RTB',
					value: CONST.BIDDING_MODE.RTB
				}, {
					label: 'PDB',
					value: CONST.BIDDING_MODE.PDB
				}, {
					label: 'PD',
					value: CONST.BIDDING_MODE.PD
				}],
				statusOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '投放中',
					value: CONST.CAMPAIGN_STATUS.NORMAL
				}, {
					label: '未开始',
					value: CONST.CAMPAIGN_STATUS.UNSTART
				}, {
					label: '暂停',
					value: CONST.CAMPAIGN_STATUS.SUSPEND
				}, {
					label: '预算不足',
					value: CONST.CAMPAIGN_STATUS.RUN_OUT_OF_BUDGET
				}, {
					label: '已结束',
					value: CONST.CAMPAIGN_STATUS.FINISHED
				}, {
					label: '账户余额不足',
					value: CONST.CAMPAIGN_STATUS.BLANCE_NOT_ENOUGH
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
				sureHandler: null
			},
			campaignIds: [],
			allCampaigns: [],
			queryCampaigns: [],
			isShowCampaignDrawer: false,
			campaignId: ''
		};
	},
	watch: {
		'$route': function(val) {
			this.searchParams.keyword = '';
			this.searchParams.saleMode = -2;
			this.searchParams.biddingMode = -2;
			this.searchParams.status = -2;
			this.searchDateRange = ['', ''];
			this.getCampaignList();
		},
		isShowCampaignDrawer: function(val, oldVal) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let campaign of this.list) {
				if (!campaign.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		},
		groupId() {
			return +this.$route.params.id;
		}
	},
	components: {
		ViewCampaign
	},
	created() {
		let queryObj = this.getUrlParams();
		if (queryObj) {
			this.searchParams.keyword = queryObj.keyword;
			this.searchParams.saleMode = +queryObj.saleMode;
			this.searchParams.biddingMode = +queryObj.biddingMode;
			this.searchParams.status = +queryObj.status;
			let startTime = queryObj.startTime ? +queryObj.startTime : '';
			let endTime = queryObj.endTime ? +queryObj.endTime : '';
			this.searchDateRange = [startTime, endTime];
			this.page.currentPage = +queryObj.page;
			this.page.pageSize = +queryObj.pageSize;
		}
		this.getCampaignList();
	},
	mounted() {
		Event.$off("put-save-success");
		Event.$on("put-save-success", () => {
			this.getCampaignList();
		});
		Event.$off("closeViewCampaign");
		Event.$on("closeViewCampaign", () => {
			this.isShowCampaignDrawer = false;
			this.campaignId = '';
		});
	},
	methods: {
		getDailyBudget(campaign) {
			if (campaign.biddingMode === CONST.BIDDING_MODE.PDB) {
				return '-';
			} else if (campaign.biddingMode === CONST.BIDDING_MODE.PD) {
				return floatMul(campaign.dailyBudget, 0.01).toFixed(2);
			} else {
				if (campaign.dailyBudget === -1) {
					return '不限';
				} else {
					return floatMul(campaign.dailyBudget, 0.01).toFixed(2);
				}
			}
		},
		showViewCampaign(campaignId) {
			this.campaignId = campaignId;
			this.isShowCampaignDrawer = true;
		},
		newCampaign() {
			let config = {};
			if (this.groupId) {
				config.groupId = this.groupId;
			}
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'new',
				type: 'campaign',
				config: config
			});
		},
		getCampaignList() {
			let url = '/api/campaigns';
			if (this.groupId) {
				url += '?groupId=' + this.groupId;
			}
			Http.get(url).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.allCampaigns = res.data.data;
					this.getList();
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getList() {
			this.setUrlParams({
				keyword: this.searchParams.keyword,
				startTime: this.searchDateRange[0] ? moment(this.searchDateRange[0]).startOf('days').valueOf() : 0,
				endTime: this.searchDateRange[1] ? moment(this.searchDateRange[1]).endOf('days').milliseconds(0).valueOf() : 0,
				saleMode: this.searchParams.saleMode,
				biddingMode: this.searchParams.biddingMode,
				status: this.searchParams.status,
				page: this.page.currentPage,
				pageSize: this.page.pageSize
			});

			let campaigns = [];
			campaigns = this.queryByKeyword();
			campaigns = this.queryByDate(campaigns);
			campaigns = this.queryBySaleMode(campaigns);
			campaigns = this.queryByBiddingMode(campaigns);
			campaigns = this.queryByState(campaigns);
			this.queryCampaigns = campaigns;
			let startIndex = (this.page.currentPage - 1) * this.page.pageSize;
			let currentPageCampaigns = this.queryCampaigns.slice(startIndex, startIndex + this.page.pageSize);
			this.page.totalCount = this.queryCampaigns.length;
			let list = [];
			for (let campaign of currentPageCampaigns) {
				let c = copyObj(campaign);
				c.checked = false;
				list.push(c);
			}
			this.list = list;
			this.getReport();
		},
		queryByKeyword() {
			let campaigns = [];
			if (this.searchParams.keyword === '') {
				campaigns = this.allCampaigns;
			} else {
				for (let campaign of this.allCampaigns) {
					let name = campaign.name.toLowerCase();
					if (name.indexOf(this.searchParams.keyword.toLowerCase()) > -1) {
						campaigns.push(campaign);
					}
				}
			}
			return campaigns;
		},
		queryByDate(campaigns) {
			let camps = [];
			if (this.searchDateRange[0] && this.searchDateRange[1]) {
				let startTime = moment(this.searchDateRange[0]).startOf('days').valueOf();
				let endTime = moment(this.searchDateRange[1]).endOf('days').milliseconds(0).valueOf();
				for (let campaign of campaigns) {
					if (campaign.startTime >= startTime && campaign.startTime <= endTime) {
						camps.push(campaign);
					} else if (campaign.endTime >= startTime && campaign.endTime <= endTime) {
						camps.push(campaign);
					} else if (campaign.endTime >= endTime && campaign.startTime <= startTime) {
						camps.push(campaign);
					}
				}
			} else {
				camps = campaigns;
			}
			return camps;
		},
		queryBySaleMode(campaigns) {
			let camps = [];
			if (this.searchParams.saleMode === -2) {
				camps = campaigns;
			} else {
				for (let campaign of campaigns) {
					if (campaign.saleMode === this.searchParams.saleMode) {
						camps.push(campaign);
					}
				}
			}
			return camps;
		},
		queryByBiddingMode(campaigns) {
			let camps = [];
			if (this.searchParams.biddingMode === -2) {
				camps = campaigns;
			} else {
				for (let campaign of campaigns) {
					if (campaign.biddingMode === this.searchParams.biddingMode) {
						camps.push(campaign);
					}
				}
			}
			return camps;
		},
		queryByState(campaigns) {
			let camps = [];
			if (this.searchParams.status === -2) {
				camps = campaigns;
			} else {
				for (let campaign of campaigns) {
					if (campaign.state === this.searchParams.status) {
						camps.push(campaign);
					}
				}
			}
			return camps;
		},
		getReport() {
			if (this.list.length === 0) return;
			let campaignIds = [];
			for (let campaign of this.list) {
				campaignIds.push(campaign.campaignId);
			}
			Http.get('/api/report/campaigns/batch', {
				params: {
					campaignIds: campaignIds.join(','),
					startTime: this.searchDateRange[0] ? moment(this.searchDateRange[0]).startOf('days').valueOf() : 0,
					endTime: this.searchDateRange[1] ? moment(this.searchDateRange[1]).endOf('days').milliseconds(0).valueOf() : 0
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let campaignMap = this.getReportMap(res.data.data);
					for (let campaign of this.list) {
						let report = campaignMap['C_' + campaign.campaignId];
						if (report) {
							//RTB没有请求数
							if (campaign.biddingMode === CONST.BIDDING_MODE.RTB) {
								this.$set(campaign, 'requestCount', '-');
							} else {
								this.$set(campaign, 'requestCount', report.requestCount);
							}
							this.$set(campaign, 'reCount', this.getBackCount(report.requestCount, report.bidCount, campaign.biddingMode));
							this.$set(campaign, 'reRate', this.getBackCountRate(report.requestCount, report.bidCount, campaign.biddingMode));
							this.$set(campaign, 'bidCount', report.bidCount);
							this.$set(campaign, 'bidRate', this.getBidRate(report.bidCount, report.requestCount, campaign.biddingMode));
							if (campaign.biddingMode === CONST.BIDDING_MODE.RTB) {
								this.$set(campaign, 'winCount', report.winCount);
								this.$set(campaign, 'winRate', this.getWinRate(report.winCount, report.bidCount));
							} else {
								this.$set(campaign, 'winCount', report.bidCount);
								this.$set(campaign, 'winRate', this.getWinRate(report.bidCount, report.bidCount));
							}
							this.$set(campaign, 'pv', report.pv);
							this.$set(campaign, 'clickCount', report.clickCount);
							if (campaign.biddingMode === CONST.BIDDING_MODE.PDB) {
								this.$set(campaign, 'totalFee', '-');
								this.$set(campaign, 'cpm', '-');
							} else {
								this.$set(campaign, 'totalFee', this.getCurFmt(report.totalFee).toFixed(2));
								this.$set(campaign, 'cpm', this.getAvgMillPrice(this.getCurFmt(report.totalFee), report.pv));
							}
							this.$set(campaign, 'acp', this.getAvgClickPrice(this.getCurFmt(report.totalFee), report.clickCount));
							this.$set(campaign, 'ctr', this.getCtr(report.clickCount, report.pv));
						}
					}
				}
			});
		},
		getReportMap(data) {
			let map = [];
			for (let campaign of data) {
				let key = 'C_' + campaign.campaignId;
				map[key] = campaign;
			}
			return map;
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		getTime(time) {
			return moment(time).format('YYYY/MM/DD');
		},
		getEndTime(campaign) {
			if (campaign.isUnlimited === 1) {
				return '不限';
			} else {
				return moment(campaign.endTime).format('YYYY/MM/DD');
			}
		},
		getSaleMode(campaign) {
			if (campaign.saleMode === CONST.SALE_MODE.FIX_CPM) {
				return '定价CPM';
			} else if (campaign.saleMode === CONST.SALE_MODE.BID_CPM) {
				return '竞价CPM';
			} else {
				return '';
			}
		},
		getStatus(campaign) {
			if (campaign.state === CONST.CAMPAIGN_STATUS.SUSPEND) {
				return '暂停';
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.NORMAL) {
				return '投放中';
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.UNSTART) {
				return '未开始';
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.RUN_OUT_OF_BUDGET) {
				return '预算不足';
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.BLANCE_NOT_ENOUGH) {
				return '账户余额不足';
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.FINISHED) {
				return '已结束';
			}
			return '';
		},
		getBiddingMode(campaign) {
			if (campaign.biddingMode === CONST.BIDDING_MODE.PDB) {
				return 'PDB';
			} else if (campaign.biddingMode === CONST.BIDDING_MODE.PD) {
				return 'PD';
			} else {
				return 'RTB';
			}
		},
		modify(campaign) {
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'modify',
				type: 'campaign',
				config: {campaignId: campaign.campaignId}
			});
		},
		changeStatus(campaign, type) {
			this.dialogData.data = campaign.campaignId;
			this.dialogData.type = type;
			this.dialogData.message = '是否' + (type === 1 ? '启动' : '暂停') + '该计划?';
			this.dialogData.sureHandler = this.changeStatusHandler;
			this.dialogData.dialogVisible = true;
		},
		changeStatusHandler() {
			Http.put('/api/campaign/status', {
				campaignId: this.dialogData.data,
				status: this.dialogData.type === 1 ? 1 : 0
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.getCampaignList();
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
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let campaign of this.list) {
				campaign.checked = !isAllSelect;
			}
		},
		selectCampaign(campaign) {
			campaign.checked = !campaign.checked;
		},
		deleteCampaigns() {
			let campaignIds = [];
			for (let campaign of this.list) {
				if (campaign.checked) {
					if (campaign.state !== CONST.CAMPAIGN_STATUS.FINISHED) {
						this.dialogData.message = '仅投放结束的推广计划可以删除！';
						this.dialogData.sureHandler = this.closeDialog;
						this.dialogData.dialogVisible = true;
						return;
					} else {
						campaignIds.push(campaign.campaignId);
					}
				}
			}
			if (campaignIds.length === 0) return;
			this.campaignIds = campaignIds;
			this.dialogData.message = '确定要删除选中的推广计划吗？';
			this.dialogData.sureHandler = this.deleteCampaignsHandler;
			this.dialogData.dialogVisible = true;
		},
		deleteCampaignsHandler() {
			if (this.campaignIds.length === 0) return;
			Http.delete('/api/campaign', {
				data: {
					campaignIds: this.campaignIds
				}
			}).then(res => {
				if (res.data.code !== 200 || res.data.iserror !== 0) {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				} else {
					this.getCampaignList();
					this.campaignIds = [];
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
		isShowView(campaign) {
			if (campaign.state === CONST.CAMPAIGN_STATUS.FINISHED) {
				return true;
			}
			return false;
		},
		isShowModify(campaign) {
			if (campaign.state === CONST.CAMPAIGN_STATUS.FINISHED) {
				return false;
			}
			return true;
		},
		isShowStart(campaign) {
			if (campaign.biddingMode === CONST.BIDDING_MODE.PDB) {
				return false;
			} else if (campaign.state === CONST.CAMPAIGN_STATUS.SUSPEND && campaign.state !== CONST.CAMPAIGN_STATUS.FINISHED) {
				return true;
			}
			return false;
		},
		isShowPause(campaign) {
			if (campaign.biddingMode === CONST.BIDDING_MODE.PDB) {
				return false;
			} else if (campaign.state !== CONST.CAMPAIGN_STATUS.SUSPEND && campaign.state !== CONST.CAMPAIGN_STATUS.FINISHED) {
				return true;
			}
			return false;
		}
	}
};
</script>