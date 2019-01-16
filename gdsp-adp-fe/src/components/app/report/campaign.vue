<template>
	<div>
		<div class="tab">
			<div class="tab-fn">
				<span :class="{'active': isRt}" @click="changeTab(1)">实时</span>
				<span :class="{'active': !isRt}" @click="changeTab(2)">离线</span>
			</div>
		</div>
		<div class="query-information">
			<div class="information-fn">
				<div class="fn-item">
					<span>推广组：</span>
					<el-select v-model="searchParams.groupId" style="width:130px;display:inline-block;" placeholder="全部" @change="groupChange">
						<el-option v-for="group of groupOptions" :label="group.name" :value="group.groupId"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>投放方式：</span>
					<el-select v-model="searchParams.biddingMode" style="width:130px;display:inline-block;" placeholder="全部" @change="biddingModeChange">
						<el-option label="全部" :value="0"></el-option>
						<el-option label="PDB" :value="CONST.BIDDING_MODE.PDB"></el-option>
						<el-option label="PD" :value="CONST.BIDDING_MODE.PD"></el-option>
						<el-option label="RTB" :value="CONST.BIDDING_MODE.RTB"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>计划：</span>
					<el-select v-model="searchParams.campaignId" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="campaign of campaignOptions" :label="campaign.name" :value="campaign.campaignId"></el-option>
					</el-select>
				</div>
			</div>
			<div class="information-fn">
				<div class="fn-item">
					<span>媒体主：</span>
					<el-select v-model="searchParams.publisherId" style="width:130px;display:inline-block;" placeholder="全部" @change="publisherChange">
						<el-option v-for="publisher of publisherOptions" :label="publisher.name" :value="publisher.publisherId"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>媒体：</span>
					<el-select v-model="searchParams.mediaId" style="width:130px;display:inline-block;" placeholder="全部" @change="mediaChange">
						<el-option v-for="media of mediaOptions" :label="media.name" :value="media.mediaId"></el-option>
					</el-select>
				</div>
				<div class="fn-item">
					<span>广告位：</span>
					<el-select v-model="searchParams.slotId" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="slot of slotOptions" :label="slot.name" :value="slot.slotId"></el-option>
					</el-select>
				</div>
			</div>
			<div class="information-fn">
				<div class="fn-item" v-if="tab === 2">
					<span>日期：</span>
					<el-date-picker v-model="searchDateRange" type="daterange" align="right" placeholder="选择日期范围" :editable="false" :picker-options="datePickOptions" style="width:240px;" :clearable="false"></el-date-picker>
					<el-checkbox v-model="isDailyReport" @change="getList">分日报告</el-checkbox>
				</div>
				<div class="fn-item" style="line-height: 36px;" v-if="tab === 1">
					<span>日期：</span>
					{{date}}
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="search">查询</button>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_group_report_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w100"><span>时间</span></th>
								<th class="w80"><span>推广组</span></th>
								<th class="w80"><span>计划</span></th>
								<th class="w80"><span>投放方式</span></th>
								<th class="w80"><span>广告位</span></th>
								<th class="w80"><span>所属媒体</span></th>
								<th class="w80"><span>媒体主</span></th>
								<th class="w80"><span>请求数</span></th>
								<th class="w80"><span>退量数</span></th>
								<th class="w80"><span>实际退量比</span></th>
								<th class="w80"><span>竞价次数</span></th>
								<th class="w80"><span>竞价率</span></th>
								<th class="w80"><span>获胜次数</span></th>
								<th class="w80"><span>获胜率</span></th>
								<th class="w80"><span>展示量</span></th>
								<th class="w80"><span>点击量</span></th>
								<th class="w80"><span>总花费</span></th>
								<th class="w80"><span>平均点击单价</span></th>
								<th class="w80"><span>平均CPM单价</span></th>
								<th class="w80"><span>点击率</span></th>
								<th class="w80" v-if="!isRt"><span>总商品行</span></th>
								<th class="w80" v-if="!isRt"><span>总商品行金额</span></th>
								<th class="w80" v-if="!isRt"><span>订单量</span></th>
								<th class="w80" v-if="!isRt"><span>订单金额</span></th>
								<th class="w80" v-if="!isRt"><span>转化率</span></th>
								<th class="w80" v-if="!isRt"><span>ROI</span></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in list">
								<td>
									<span v-if="isDaily"><router-link :to="{name: 'campaignHourReport', params: {slotId: item.slotId, campaignId: item.campaignId, startDate: item.adDate, endDate: item.adDate}}">{{item.adDate}}</router-link></span>
									<span v-if="isSummary"><router-link :to="{name: 'campaignHourReport', params: {slotId: item.slotId, campaignId: item.campaignId, startDate: item.adStartDate, endDate: item.adEndDate}}">{{item.adStartDate}}<br>{{item.adEndDate}}</router-link></span>
									<span v-if="isRt">{{item.adHour}}点</span>
								</td>
								<td><span :title="item.groupName"><i class="ellipsis">{{item.groupName}}</i></span></td>
								<td><span :title="item.campaignName"><i class="ellipsis">{{item.campaignName}}</i></span></td>
								<td><span><i class="ellipsis">{{getBiddingMode(item.biddingMode)}}</i></span></td>
								<td><span :title="item.slotName"><i class="ellipsis">{{item.slotName}}</i></span></td>
								<td><span :title="item.mediaName"><i class="ellipsis">{{item.mediaName}}</i></span></td>
								<td><span :title="item.publisherName"><i class="ellipsis">{{item.publisherName}}</i></span></td>
								<td><span>{{item.biddingMode === CONST.BIDDING_MODE.RTB ? '-' : item.requestCount}}</span></td>
								<td><span>{{getBackCount(item.requestCount, item.bidCount, item.biddingMode)}}</span></td>
								<td><span>{{getBackCountRate(item.requestCount, item.bidCount, item.biddingMode)}}</span></td>
								<td><span>{{item.bidCount}}</span></td>
								<td><span>{{getBidRate(item.bidCount, item.requestCount, item.biddingMode)}}</span></td>
								<td><span>{{item.winCount}}</span></td>
								<td><span>{{getWinRate(item.winCount, item.bidCount)}}</span></td>
								<td><span>{{item.pv}}</span></td>
								<td><span>{{item.clickCount}}</span></td>
								<td><span>{{isRt && item.biddingMode === CONST.BIDDING_MODE.PDB ? '-' : getCurFmt(item.totalFee).toFixed(2)}}</span></td>
								<td><span>{{getAvgClickPrice(getCurFmt(item.totalFee), item.clickCount)}}</span></td>
								<td><span>{{isRt && item.biddingMode === CONST.BIDDING_MODE.PDB ? '-' : getAvgImpPrice(getCurFmt(item.totalFee), item.pv)}}</span></td>
								<td><span>{{item.biddingMode === CONST.BIDDING_MODE.PDB && isRt ? '-' :  getCtr(item.clickCount, item.pv)}}</span></td>
								<td v-if="!isRt"><span>{{item.productNum}}</span></td>
								<td v-if="!isRt"><span>{{item.orderPrice}}</span></td>
								<td v-if="!isRt"><span>{{item.orderNum}}</span></td>
								<td v-if="!isRt"><span>{{item.orderPrice}}</span></td>
								<td v-if="!isRt"><span>
								{{getConversionRate(item.productNum, item.clickCount)}}
								</span></td>
								<td v-if="!isRt"><span>
								{{getRoi(item.orderPrice, getCurFmt(item.totalFee))}}
								</span></td>
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
	</div>
</template>
<script>
import Http from 'http';
import CONST from 'help/CONST.js';
import moment from 'moment';
export default {
	name: 'CampaignReport',
	data() {
		return {
			CONST: CONST,
			list: [],
			tab: 1,
			date: moment().format('YYYY-MM-DD'),
			isDailyReport: true,
			searchDateRange: [],
			searchParams: {
				groupId: 0,
				biddingMode: 0,
				campaignId: 0,
				publisherId: 0,
				mediaId: 0,
				slotId: 0
			},
			groupOptions: [{
				name: '全部',
				groupId: 0
			}],
			campaignOptions: [{
				name: '全部',
				campaignId: 0
			}],
			publisherOptions: [{
				name: '全部',
				publisherId: 0
			}],
			mediaOptions: [{
				name: '全部',
				mediaId: 0
			}],
			slotOptions: [{
				name: '全部',
				slotId: 0
			}],
			mapData: [],
			campaigns: [],
			medias: [],
			slots: [],
			datePickOptions: {
				disabledDate(time) {
					return time.getTime() > moment().subtract(1, 'days').valueOf() || time.getTime() < moment().subtract(CONST.REPORT_DAYS, 'days');
				}
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			isInit: true
		};
	},
	computed: {
		isRt() {
			return this.tab === 1;
		},
		isDaily() {
			return this.isDailyReport == true;
		},
		isSummary() {
			return this.isDailyReport != true;
		}
	},
	components: {
	},
	created() {
		let queryObj = this.getUrlParams();
		if (queryObj) {
			this.searchParams.groupId = +queryObj.groupId;
			this.searchParams.biddingMode = +queryObj.biddingMode;
			this.searchParams.campaignId = +queryObj.campaignId;
			this.searchParams.publisherId = +queryObj.publisherId;
			this.searchParams.mediaId = +queryObj.mediaId;
			this.searchParams.slotId = +queryObj.slotId;
			let startTime = queryObj.startTime ? +queryObj.startTime : '';
			let endTime = queryObj.endTime ? +queryObj.endTime : '';
			this.searchDateRange = [startTime, endTime];
			this.page.currentPage = +queryObj.page;
			this.page.pageSize = +queryObj.pageSize;
			this.tab = +queryObj.tab;
			this.isDailyReport = queryObj.isDaily == 1;
		}
		if (this.isRt) {
			this.getRtList();
		} else {
			this.getList();
		}
	},
	mounted() {
	},
	methods: {
		changeTab(tab) {
			if (this.tab === tab) return false;
			this.tab = tab;

			this.searchParams.groupId = 0;
			this.searchParams.publisherId = 0;
			this.searchParams.mediaId = 0;
			this.searchParams.slotId = 0;
			this.searchDateRange = [moment().subtract(1, 'days').startOf('day').valueOf(), moment().subtract(1, 'days').endOf('day').milliseconds(0).valueOf()];
			this.isDailyReport = true;
			this.search();
		},
		getRtList() {
			this.setUrlParams();
			Http.get('/api/report/campaigns/rt', {
				params: {
					page: this.page.currentPage,
					number: this.page.pageSize,
					groupId: this.searchParams.groupId,
					biddingMode: this.searchParams.biddingMode,
					campaignId: this.searchParams.campaignId,
					publisherId: this.searchParams.publisherId,
					mediaId: this.searchParams.mediaId,
					slotId: this.searchParams.slotId
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					if (this.isInit) {
						this.initSearchOptions(res.data.data.search);
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getList() {
			this.setUrlParams({
				tab: this.tab,
				page: this.page.currentPage,
				pageSize: this.page.pageSize,
				groupId: this.searchParams.groupId,
				biddingMode: this.searchParams.biddingMode,
				campaignId: this.searchParams.campaignId,
				publisherId: this.searchParams.publisherId,
				mediaId: this.searchParams.mediaId,
				slotId: this.searchParams.slotId,
				isDaily: this.isDailyReport ? 1 : 0,
				startTime: this.searchDateRange[0] ? moment(this.searchDateRange[0]).valueOf() : 0,
				endTime: this.searchDateRange[1] ? moment(this.searchDateRange[1]).endOf('day').milliseconds(0).valueOf() : 0,
			});
			let url = this.isDailyReport ? '/api/report/campaigns/daily' : '/api/report/campaigns/summary';
			Http.get(url, {
				params: {
					page: this.page.currentPage,
					number: this.page.pageSize,
					groupId: this.searchParams.groupId,
					biddingMode: this.searchParams.biddingMode,
					campaignId: this.searchParams.campaignId,
					publisherId: this.searchParams.publisherId,
					mediaId: this.searchParams.mediaId,
					slotId: this.searchParams.slotId,
					startTime: this.searchDateRange[0] ? moment(this.searchDateRange[0]).valueOf() : 0,
					endTime: this.searchDateRange[1] ? moment(this.searchDateRange[1]).endOf('day').milliseconds(0).valueOf() : 0,
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					if (this.isInit) {
						this.initSearchOptions(res.data.data.search);
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		initSearchOptions(search) {
			let publishers = this.mapToList(search.publishers);
			let medias = this.mapToList(search.medias);
			let slots = this.mapToList(search.slots);
			let groups = this.mapToList(search.groups);
			let campaigns = this.mapToList(search.campaigns);

			this.publisherOptions = [...this.publisherOptions, ...publishers];
			this.mediaOptions = [...this.mediaOptions, ...medias];
			this.slotOptions = [...this.slotOptions, ...slots];
			this.groupOptions = [...this.groupOptions, ...groups];
			this.campaignOptions = [...this.campaignOptions, ...campaigns];

			this.medias = medias;
			this.slots = slots;
			this.campaigns = campaigns;
			this.setAdpMapData(res.data.data.search);
			this.setAdmMapData(res.data.data.search);
			this.isInit = false;
		},
		getBiddingMode(biddingMode) {
			if (biddingMode === CONST.BIDDING_MODE.PDB) {
				return 'PDB';
			} else if (biddingMode === CONST.BIDDING_MODE.PD) {
				return 'PD';
			} else {
				return 'RTB';
			}
		},
		setAdpMapData(data) {
			for (var groupId in data.groups) {
				let key = 'G_' + groupId;
				this.mapData[key] = data.groups[groupId];
			}
			for (var campaignId in data.campaigns) {
				let key = 'G_' + campaignId;
				this.mapData[key] = data.campaigns[campaignId];
			}
			for (var flightId in data.flights) {
				let key = 'F_' + flightId;
				this.mapData[key] = data.flights[flightId];
			}
			for (var materialId in data.materials) {
				let key = 'M_' + materialId;
				this.mapData[key] = data.materials[materialId];
			}
		},
		setAdmMapData(data) {
			for (var publisherId in data.publishers) {
				let key = 'P_' + publisherId;
				this.mapData[key] = data.publishers[publisherId];
			}
			for (var mediaId in data.medias) {
				let key = 'MD_' + mediaId;
				this.mapData[key] = data.medias[mediaId];
			}
			for (var slotId in data.slots) {
				let key = 'S_' + slotId;
				this.mapData[key] = data.slots[slotId];
			}
		},
		groupChange() {
			let campaigns = [{
				name: '全部',
				campaignId: 0,
				groupId: 0
			}];
			for (let c of this.campaigns) {
				if (this.searchParams.groupId !== 0) {
					if (c.groupId === this.searchParams.groupId) {
						campaigns.push(c);
					}
				} else {
					campaigns.push(c);
				}
			}
			this.campaignOptions = campaigns;
			if (this.searchParams.biddingMode !== 0) {
				this.searchParams.biddingMode = 0;
			} else {
				this.biddingModeChange();
			}
		},
		biddingModeChange() {
			let campaigns = [{
				name: '全部',
				campaignId: 0,
				groupId: 0
			}];
			for (let c of this.campaigns) {
				if (this.searchParams.biddingMode !== 0) {
					if (c.biddingMode === this.searchParams.biddingMode) {
						campaigns.push(c);
					}
				} else {
					if (this.searchParams.groupId !== 0) {
						if (c.groupId === this.searchParams.groupId) {
							campaigns.push(c);
						}
					} else {
						campaigns.push(c);
					}
				}
			}
			this.campaignOptions = campaigns;
			this.searchParams.campaignId = 0;
		},
		publisherChange() {
			let medias = [{
				name: '全部',
				publisherId: 0,
				mediaId: 0
			}];
			for (let m of this.medias) {
				if (this.searchParams.publisherId !== 0) {
					if (m.publisherId === this.searchParams.publisherId) {
						medias.push(m);
					}
				} else {
					medias.push(m);
				}
			}
			this.mediaOptions = medias;
			if (this.searchParams.mediaId !== 0) {
				this.searchParams.mediaId = 0;
			} else {
				this.mediaChange();
			}
		},
		mediaChange() {
			let slots = [{
				name: '全部',
				slotId: 0,
				mediaId: 0,
				publisherId: 0,
				mediaId: 0
			}];
			if (this.searchParams.mediaId === 0) {
				let mediaIds = [];
				for (let m of this.mediaOptions) {
					mediaIds.push(m.mediaId);
				}
				for (let s of this.slots) {
					if (mediaIds.indexOf(s.mediaId) > -1) {
						slots.push(s);
					}
				}
			} else {
				for (let s of this.slots) {
					if (s.mediaId === this.searchParams.mediaId) {
						slots.push(s);
					}
				}
			}
			this.slotOptions = slots;
			this.searchParams.slotId = 0;
		},
		search() {
			if (this.page.currentPage === 1) {
				if (this.tab === 1) {
					this.getRtList();
				} else {
					this.getList();
				}
			} else {
				this.page.currentPage = 1;
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			if (this.tab === 1) {
				this.getRtList();
			} else {
				this.getList();
			}
		}
	}
};
</script>