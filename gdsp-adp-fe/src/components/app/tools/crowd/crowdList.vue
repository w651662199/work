<template>
	<div>
		<div class="query-information">
			<div class="information-fn">
				<div class="fn-item">
					<router-link class="btn btn-blue" :to="{name: 'crowdEdit', params: { id: 0}}">新建人群</router-link>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue-simple" type="button" @click.prevent="deleteCrowds">删除</button>
				</div>
				<div class="fn-item">
					<span>人群：</span>
					<el-input v-model="searchParams.keyword" placeholder="" style="width:170px;display:inline-block;"></el-input>
				</div>
				<div class="fn-item">
					<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
				</div>
			</div>
			<p>仅当“运算完成”的人群才可被推广单元引用</p>
		</div>
		<div class="data-table" id="JS_crowd_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w40"><span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectAll"></em></span></th>
								<th class="w40"><span>人群ID</span></th>
								<th class="w140"><span>人群名称</span></th>
								<th class="w80"><span>人群类型</span></th>
								<th class="w80"><span>运算状态</span></th>
								<th class="w80"><span>创建时间</span></th>
								<th class="w140"><span>操作</span></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="crowd in list" :key="crowd.crowId">
								<td><span><em class="icon" :class="{'icon-select': !crowd.checked, 'icon-selected': crowd.checked}" @click="selectCrowd(crowd)"></em></span></td>
								<td><span>{{crowd.crowdId}}</span></td>
								<td><span><i class="ellipsis">{{crowd.name}}</i></span></td>
								<td><span>{{getCrowdType(crowd.type)}}</span></td>
								<td><span>{{getRunStatus(crowd.runStatus)}}</span></td>
								<td><span>{{getCrowdCreateTime(crowd.createTime)}}</span></td>
								<td>
									<span>
										<b class="operat-link">
											<a href="javascript:void(0)" @click="showViewCrowd(crowd)">查看</a>
											<a href="javascript:void(0)" class="disabled" v-if="crowd.isUsed === 1">修改</a>
											<router-link :to="{name: 'crowdEdit', params: {id: crowd.crowdId}}" v-if="crowd.isUsed !== 1">修改</router-link>
											<a href="javascript:void(0)" :class="{'disabled': crowd.isUsed === 1}" @click.prevent="deleteCrowd(crowd)">删除</a>
										</b>
									</span>
								</td>
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
			<div style="z-index:1200;" class="master" v-show="isShowCrowdDrawer"></div>
		</transition>
		<transition name="drawer">
			<crowd-drawer v-if="isShowCrowdDrawer" :crowdId="crowdId"></crowd-drawer>
		</transition>
	</div>
</template>
<script>
import Event from 'event';
import CONST from 'help/CONST.js';
import moment from 'moment';
import Http from 'http';
import CrowdDrawer from './viewCrowd.vue';
export default {
	name: 'CrowList',
	data() {
		return {
			list: [],
			searchParams: {
				keyword: ''
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
			isShowCrowdDrawer: false,
			crowdIds: [],
			crowdId: ''
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let crowd of this.list) {
				if (!crowd.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		}
	},
	components: {
		CrowdDrawer
	},
	watch: {
		isShowCrowdDrawer: function(val, oldVal) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	created() {
		this.getList();
	},
	mounted() {
		Event.$off("put-save-success");
		Event.$on("put-save-success", () => {
			this.getList();
		});
		Event.$off("closeCrowdDrawer");
		Event.$on("closeCrowdDrawer", () => {
			this.isShowCrowdDrawer = false;
			this.crowdId = '';
		});
	},
	methods: {
		getList() {
			Http.get('/api/crowds', {
				params: {
					keyword: this.searchParams.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					for (let item of this.list) {
						this.$set(item, 'checked', false);
					}
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
		getCrowdType(type) {
			if (type === 1) {
				return '标签人群';
			}
			return '';
		},
		getCrowdCreateTime(time) {
			return moment(time).format('YYYY/MM/DD');
		},
		getRunStatus(status) {
			if (status === CONST.CROWD_RUN_STATUS.UN_START) {
				return '未开始';
			} else if (status === CONST.CROWD_RUN_STATUS.RUNNING || status === CONST.CROWD_RUN_STATUS.CROWD_RUNNING) {
				return '运算中';
			} else if (status === CONST.CROWD_RUN_STATUS.FINISH) {
				return '运算完成';
			}
			return '';
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let crowd of this.list) {
				crowd.checked = !isAllSelect;
			}
		},
		selectCrowd(crowd) {
			crowd.checked = !crowd.checked;
		},
		deleteCrowd(item) {
			if (item.isUsed === 1) return false;
			this.crowdIds = [item.crowdId];
			this.dialogData.message = '确定删除该人群吗？';
			this.dialogData.sureHandler = this.deleteCrowdsHandler;
			this.dialogData.dialogVisible = true;
		},
		deleteCrowds() {
			let crowdIds = [];
			let isContainUsed = false;
			for (let crowd of this.list) {
				if (crowd.checked) {
					if (crowd.isUsed === 1) {
						isContainUsed = true;
					}
					crowdIds.push(crowd.crowdId);
				}
			}
			if (crowdIds.length === 0) return;
			if (isContainUsed) {
				this.dialogData.message = '已选择' + crowdIds.length + '个人群，其中仅“没有被投放单元引用”的人群才可以删除。请重新选择。';
				this.dialogData.sureHandler = this.closeDialog;
				this.dialogData.dialogVisible = true;
			} else {
				this.crowdIds = crowdIds;
				this.dialogData.message = '已选择' + crowdIds.length + '个人群，确定全部删除吗？';
				this.dialogData.sureHandler = this.deleteCrowdsHandler;
				this.dialogData.dialogVisible = true;
			}
		},
		deleteCrowdsHandler() {
			if (this.crowdIds.length === 0) return;
			Http.delete('/api/crowd', {
				data: {
					crowdIds: this.crowdIds
				}
			}).then(res => {
				if (res.data.code !== 200 || res.data.iserror !== 0) {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				} else {
					this.getList();
					this.crowdIds = [];
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
			this.dialogData.sureHandler = null;
			this.dialogData.dialogVisible = false;
			this.crowdIds = [];
		},
		showViewCrowd(crowd) {
			this.crowdId = crowd.crowdId;
			this.isShowCrowdDrawer = true;
		}
	}
};
</script>