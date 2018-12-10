<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span
				class="header-text">查看人群</span>
				<span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form03">
				<el-form label-width="124px" :model="formData" ref="formData">
					<el-form-item label="人群名称：" prop="name">
						<p>
							{{formData.name}}
						</p>
					</el-form-item>
					<el-form-item label="标签："></el-form-item>
					<div>
						<table class="table main-table" style="min-width: 500px; margin-top:-20px;margin-left: 40px;">
							<thead>
							<tr class="list-header">
								<th class="span-col-5">标签名称</th>
							</tr>
							</thead>
							<tbody>
							<tr class="body-row" v-for="(item,index) in formData.tags">
								<td><span>{{item.name}}</span></td>
							</tr>
							</tbody>
						</table>
					</div>
					<el-form-item label="引用单元："></el-form-item>
					<div>
						<table class="table main-table" style="min-width: 500px; margin-top:-20px;margin-left: 40px;">
							<thead>
							<tr class="list-header">
								<th class="span-col-5">单元ID</th>
								<th class="span-col-4">单元名称</th>
								<th class="span-col-4">所属计划</th>
							</tr>
							</thead>
							<tbody>
							<tr v-if="unitList.length == 0">
								<td :colspan="3" style="text-align: center; height: 100px;line-height: 100px;">暂无内容</td>
							</tr>
							<tr class="body-row" v-for="(item,index) in unitList">
								<td><span>{{item.flightId}}</span></td>
								<td><span>{{item.flightName}}</span></td>
								<td><span>{{item.campaignName}}</span></td>
							</tr>
							</tbody>
						</table>
						<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
									   @size-change="pageSizeChange"
									   @current-change="currentPageChange"
									   :current-page="page.currentPage"
									   :page-sizes="page.pageSizes"
									   :page-size="page.pageSize"
									   layout="total, sizes, prev, pager, next"
									   :class="{'el-pagination-reset': true}"
									   :total="page.totalCount">
						</el-pagination>
					</div>
				</el-form>
			</div>
		</div>
		<div class="drawer-btn">
			<button @click="closeDrawer()" class="btn btn-gray">关闭</button>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import Http from 'utils/http';
	import {
		objType,
		mixin,
		copyObj,
		isEmptyObj,
		limitLen
	} from 'utils/common';

	export default {
		name:'app-crowd-preview-template',
		props:['crowdId'],
		data() {
		    return {
				formData:{},
				unitList:[],
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 20
				},
			}
		},
		computed: {
			drawerData: () => store.state.drawerDmpCtrl.config, // from store
			actionType: () => store.state.drawerDmpCtrl.action,
			config: () => store.state.drawerDmpCtrl,
		},
		mounted(){
		},
		created(){
			this.formData = copyObj(this.drawerData);
			this.getUnitList();
		},
		methods:{
			closeDrawer() {
				Event.$emit('close-preview');
			},
			getUnitList() {
				Http.get('/api/crowd/flights',{
					params:{
						crowdId: this.crowdId,
						page: this.page.currentPage,
						number: this.page.pageSize
					}
				}).then((res) => {
					if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						this.unitList = [];
						res.data.data.list.forEach((item,index) => {
							let obj = {};
							obj.flightId = item.flightId;
							obj.flightName = item.flightName;
							obj.campaignName = item.campaignName;
							this.unitList.push(obj)
						})
						this.page.totalCount = res.data.data.totalCount;
					} else {
						this.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				})
			},
			pageSizeChange(size) {
				this.page.pageSize = size;
				this.getUnitList();
			},
			currentPageChange(page) {
				this.page.currentPage = page;
				this.getUnitList();
			},
		}
	}
</script>
<style scoped>
	.table th{
		height:35px;
	}
</style>
