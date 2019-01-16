<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">添加人群</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form clearfix" style="width: 900px;border: 1px solid #e1e3e6;">
				<div class="crowd-box" style="margin-right: 4px;">
					<div class="query-information" style="padding-top: 0;">
						<div class="information-fn">
							<div class="fn-item">
								<span>人群：</span>
								<el-input v-model="searchParams.keyword" placeholder="搜索人群" style="width:170px;display:inline-block;"></el-input>
							</div>
							<div class="fn-item">
								<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
							</div>
						</div>
						<div class="information-fn">
							<div class="fn-item" style="margin-bottom: 0;">
								<button class="btn btn-blue-simple" type="button" @click="addCrowd">添加</button>
								<span>{{leftSelectCrowds.length}}/{{5 - selectCrowds.length}}</span>
							</div>
						</div>
					</div>
					<div class="data-table" id="JS_crowd_all_list">
						<div class="table-content">
							<div class="main-table-wapper">
								<table class="table main-table">
									<thead>
										<tr>
											<th class="w40">
												<span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectLeftAll"></em></span>
											</th>
											<th class="w140"><span>人群名称</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in list">
											<td>
												<span>
													<em class="icon" :class="{'icon-select': !item.checked, 'icon-selected': item.checked}" @click="selectCrowd(item)"></em>
												</span>
											</td>
											<td><span :title="item.name"><i class="ellipsis">{{item.name}}</i></span></td>
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
				</div>
				<div class="crowd-box">
					<p style="line-height: 36px;">已添加：{{selectCrowds.length}}/5</p>
					<div class="query-information" style="padding-top: 20px;">
						<div class="information-fn">
							<div class="fn-item" style="margin-bottom: 0;">
								<button class="btn btn-blue-simple" type="button" @click="remove">删除</button>
							</div>
						</div>
					</div>
					<div class="data-table" id="JS_crowd_select_list">
						<div class="table-content">
							<div class="main-table-wapper">
								<table class="table main-table">
									<thead>
										<tr>
											<th class="w40">
												<span><em class="icon" :class="{'icon-select': !isRightAllSelect, 'icon-selected': isRightAllSelect}" @click="selectRightAll"></em></span>
											</th>
											<th class="w140"><span>人群名称</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in selectCrowds">
											<td>
												<span>
													<em class="icon" :class="{'icon-select': !item.checked, 'icon-selected': item.checked}" @click="selectRight(item)"></em>
												</span>
											</td>
											<td><span :title="item.name"><i class="ellipsis">{{item.name}}</i></span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
			<span class="error-message" v-if="errorMsg.length > 0">{{errorMsg}}</span>
		</div>
	</div>
</template>
<script>
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
import {copyObj} from 'utils/common';
export default {
	name: 'crowdDrawer',
	props: ['crowds'],
	data() {
		return {
			searchParams: {
				keyword: ''
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			errorMsg: '',
			list: [],
			leftSelectCrowds: [],
			selectCrowds: []
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			if (this.list.length === 0) return false;
			for (let crowd of this.list) {
				if (!crowd.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		},
		isRightAllSelect() {
			let isSelect = true;
			if (this.selectCrowds.length === 0) return false;
			for (let crowd of this.selectCrowds) {
				if (!crowd.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		},
		selectLength() {
			let c = 0;
			for (let crowd of this.selectCrowds) {
				if (crowd.checked) {
					c++;
				}
			}
			return c;
		}
	},
	created() {
		this.leftSelectCrowds = copyObj(this.crowds);
		this.selectCrowds = copyObj(this.crowds);
		this.getCrowdList();
	},
	methods: {
		getCrowdIds() {
			let crowdIds = [];
			for (let crowd of this.crowds) {
				crowdIds.push(crowd.crowdId);
			}
			for (let crowd of this.leftSelectCrowds) {
				if (crowdIds.indexOf(crowd.crowdId) === -1) {
					crowdIds.push(crowd.crowdId);
				}
			}
			return crowdIds;
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getCrowdList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getCrowdList() {
			Http.get('/api/crowds', {
				params: {
					keyword: this.searchParams.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize,
					runStatus: CONST.CROWD_RUN_STATUS.FINISH
				}
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let crowdIds = this.getCrowdIds();
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					for (let crowd of this.list) {
						let isChecked = crowdIds.indexOf(crowd.crowdId) > -1;
						this.$set(crowd, 'checked', isChecked);
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
		selectCrowd(crowd) {
			crowd.checked = !crowd.checked;
			if (crowd.checked) {
				this.leftSelectCrowds.push(crowd);
			} else {
				let index = -1;
				for (let i = 0; i < this.leftSelectCrowds.length; i++) {
					if (this.leftSelectCrowds[i].crowdId === crowd.crowdId) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					this.leftSelectCrowds.splice(index, 1);
				}
			}
		},
		selectRight(crowd) {
			crowd.checked = !crowd.checked;
		},
		selectLeftAll() {
			let isAllSelect = this.isAllSelect;
			for (let crowd of this.list) {
				if (!isAllSelect && !crowd.checked) {
					this.leftSelectCrowds.push(crowd);
				}
				if (isAllSelect && crowd.checked) {
					let index = -1;
					for (let i = 0; i < this.leftSelectCrowds.length; i++) {
						if (this.leftSelectCrowds[i].crowdId === crowd.crowdId) {
							index = i;
							break;
						}
					}
					if (index > -1) {
						this.leftSelectCrowds.splice(index, 1);
					}
				}
				crowd.checked = !isAllSelect;
			}
		},
		selectRightAll() {
			let isAllRightSelect = this.isRightAllSelect;
			for (let crowd of this.selectCrowds) {
				crowd.checked = !isAllRightSelect;
			}
		},
		addCrowd() {
			if (this.leftSelectCrowds.length > 5 || this.selectCrowds.length === 5) {
				this.errorMsg = '最多只能添加5个人群';
				return false;
			}
			this.errorMsg = '';
			let crowds = [];
			for (let crowd of this.leftSelectCrowds) {
				let c = copyObj(crowd);
				c.checked = false;
				crowds.push(c);
			}
			this.selectCrowds = crowds;
		},
		remove() {
			let crowds = [];
			for (let crowd of this.selectCrowds) {
				if (!crowd.checked) {
					crowds.push(crowd);
				} else {
					let index = -1;
					for (let i = 0; i < this.leftSelectCrowds.length; i++) {
						if (this.leftSelectCrowds[i].crowdId === crowd.crowdId) {
							index = i;
							break;
						}
					}
					if (index > -1) {
						this.leftSelectCrowds.splice(index, 1);
					}
					for (let leftCrowd of this.list) {
						if (leftCrowd.crowdId === crowd.crowdId) {
							leftCrowd.checked = false;
							break;
						}
					}
				}
			}
			this.selectCrowds = crowds;
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getCrowdList();
		},
		save() {
			Event.$emit('closeCrowdDrawer', this.selectCrowds);
		},
		closeDrawer() {
			Event.$emit('closeCrowdDrawer');
		}
	}
};
</script>
