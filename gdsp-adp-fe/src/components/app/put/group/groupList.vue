<template>
	<div>
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
					<button class="btn btn-blue" type="button" @click.prevent="add">新建推广组</button>
				</div>
				<div class="fn-item">
					<el-input v-model="keyword" placeholder="搜索推广组" style="width:170px;display:inline-block;"></el-input>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="getList">搜索</button>
				</div>
				<div class="fn-item" style="float:right;padding: 8px 10px;border: 1px solid #c0ccda;border-radius:4px;cursor: pointer;">
					<span v-popover:popover1>自定义指标</span>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_group_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w140"><span>推广组名称</span></th>
								<th class="w100"><span>操作</span></th>
								<template v-for="headerGroup of customHeaders">
									<th v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{item.msg}}</span>
									</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="group in list" :key="group.groudId">
								<td><span><i class="ellipsis"><router-link :to="{name: 'groupCampaign', params: {id: group.groupId}}">{{group.name}}</router-link></i></span></td>
								<td>
									<span>
										<b class="operat-link">
											<a href="" @click.prevent="modify(group)">编辑</a>
										</b>
									</span>
								</td>
								<template v-for="headerGroup of customHeaders">
									<td v-for="item of headerGroup.fields" v-show="item.checked" class="w80">
										<span>{{group[item.label] != 'undefine' ? group[item.label] : '-'}}</span>
									</td>
								</template>
							</tr>
						</tbody>
					</table>
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
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="isShowGroupDrawer"></div>
		</transition>
		<transition name="drawer">
			<group-drawer v-if="isShowGroupDrawer" :groupId="groupId" :name="name" ></group-drawer>
		</transition>
	</div>
</template>
<script>

import Event from 'event';
import Http from 'http';
import GroupDrawer from './groupDrawer.vue';
export default {
	name: 'GroupList',
	data() {
		return {
			groupId: 0,
			name: 0,
			keyword: '',
			customHeaders: [{
				title: '指标',
				fields: [
					{msg: '展示量', checked: true, label: 'pv'},
					{msg: '点击量', checked: true, label: 'clickCount'},
					{msg: '总花费', checked: true, label: 'totalFee'},
					{msg: '平均点击单价', checked: true, label: 'acp'},
					{msg: '平均CPM单价', checked: true, label: 'cpm'},
					{msg: '点击率', checked: true, label: 'ctr'}
				]}
			],
			isShowGroupDrawer: false,
			list: [],
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			}
		};
	},
	watch: {
		isShowGroupDrawer: function(val) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	components: {
		GroupDrawer
	},
	created() {
		let queryObj = this.getUrlParams();
		if (queryObj) {
			this.keyword = queryObj.keyword;
			this.page.currentPage = +queryObj.page;
			this.page.pageSize = +queryObj.pageSize;
		}
		this.getList();
	},
	mounted() {
		Event.$on('closeGroupDrawer', (res) => {
			this.getList();
			this.groupId = 0;
			this.name = "";
			this.isShowGroupDrawer = false;
		});
	},
	methods: {
		add() {
			this.isShowGroupDrawer = true;
		},
		modify(group) {
			this.groupId = group.groupId;
			this.name = group.name;
			this.isShowGroupDrawer = true;
		},
		getList() {
			this.setUrlParams({
				keyword: this.keyword,
				page: this.page.currentPage,
				pageSize: this.page.pageSize
			});

			Http.get('/api/groups', {
				params: {
					keyword: this.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					this.getReport();
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getReport() {
			if (this.list.length === 0) return;
			let groupIds = [];
			for (let group of this.list) {
				groupIds.push(group.groupId);
			}
			Http.get('/api/report/groups/batch', {
				params: {
					groupIds: groupIds.join(',')
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let groupMap = this.getReportMap(res.data.data);
					for (let group of this.list) {
						let report = groupMap['G_' + group.groupId];
						if (report) {
							this.$set(group, 'pv', report.pv);
							this.$set(group, 'clickCount', report.clickCount);
							this.$set(group, 'totalFee', this.getCurFmt(report.totalFee).toFixed(2));
							this.$set(group, 'acp', this.getAvgClickPrice(this.getCurFmt(report.totalFee), report.clickCount));
							this.$set(group, 'cpm', this.getAvgMillPrice(this.getCurFmt(report.totalFee), report.pv));
							this.$set(group, 'ctr', this.getCtr(report.clickCount, report.pv));
						}
					}
				}
			});
		},
		getReportMap(data) {
			let map = [];
			for (let group of data) {
				let key = 'G_' + group.groupId;
				map[key] = group;
			}
			return map;
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
	}
};
</script>