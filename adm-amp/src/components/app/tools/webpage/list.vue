<template>
	<div>
		<div class="account-set">
			<div class="set-fn"><span class="btn btn-normal" @click.prevent="newPage">新建自建页面</span></div>
			<br>
			<div class="set-fn">
				<div class="fn-plan">
					<span class="plan-title">页面名称： </span>
					<el-input v-model="search.name" :maxlength="30" placeholder="请输入页面名称" style="width:170px;display:inline-block;">
						<i slot="icon" class="el-input__icon el-icon-close" @click="handleClickIcon()" v-if="isName"></i>
					</el-input>
				</div>
				<div class="fn-plan fn-plan-new">
				<span class="plan-title">设备： </span>
					<el-select v-model="search.platform" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="item in platform.options" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="fn-plan fn-plan-new">
				<span class="plan-title">状态： </span>
					<el-select v-model="search.status" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="item in state.options" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="fn-search"><span class="btn btn-primary" @click="searchHandle()">查询</span></div>
			</div>
		</div>
		<div class="amp-data">
			<div id="con-table-change" class="data-table">
				<table class="table-list">
					<thead class="list-header" style="text-align:left;">
						<th class="span-col-2"><i class="data-id">ID</i></th>
						<th class="span-col-2">页面名称</th>
						<th class="span-col-2">设备</th>
						<th class="span-col-2">模板类型</th>
						<th class="span-col-2">页面URL</th>
						<th class="span-col-2">创建时间</th>
						<th class="span-col-2">状态</th>
						<th class="span-col-2">操作</th>
					</thead>
					<tbody class="list-body">
						<tr class="body-row" v-if="list.length == 0">
							<td colspan="8" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
						</tr>
						<tr class="body-row" v-for="item in list">
							<td class="span-col-4"><i class="data-id">{{item.webpageId}}</i></td>
							<td class="span-col-4">{{item.name}}</td>
							<td class="span-col-4">{{item.platform}}</td>
							<td class="span-col-4">{{item.webpageTemplate.name}}</td>
							<td class="span-col-4">
								<span :title="item.landingPage" class="landingPage">
									{{item.landingPage}}
								</span>
							</td>
							<td class="span-col-4">{{item.createTime}}</td>
							<td class="span-col-4">{{item.status}}</td>
							<td class="span-col-4">
								<b class="operat-link">
									<a href="javascript:void(0)" @click.prevent="handlePreview(item)" style="font-weight:normal;margin-right:10px;">预览</a>
									<a href="javascript:void(0)" v-show="item.status == '草稿'" @click.prevent="modify(item)" style="font-weight:normal;">修改</a>
								</b>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
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
		<m-drawer :webpageId="webpageId"></m-drawer>
		<m-preview v-if="showChildComponents.pagePreview" :showPreview="showChildComponents.pagePreview" :pageId="webpageId" :isTemplate="isTemplate5"></m-preview>
	</div>
</template>
<script>
import Vue from 'Vue';
import Http from 'utils/http';
import Event from 'event';
import { formatDate, debounce, mixinSource } from 'utils/common';
import actions from 'actions';
import Drawer from './drawer.vue';
import pagePreview from './pagePreview.vue';
import CONST from '../../../../help/CONST.js';
export default {
	name: 'app-page-list',
	data() {
		return{
			showChildComponents: {
				pagePreview: false
			},
			webpageId:'',
			isTemplate5: false,
			previewId:'',
			state: {
				options: [{
					label: "全部",
					value: ""
				},{
					label: "草稿",
					value: "0"
				},{
					label: "发布",
					value: "1"
				},{
					label: "发布中",
					value: "2"
				}],
				value: ""
			},
			platform: {
				options: [{
					label: "全部",
					value: ""
				},{
					label: "无线",
					value: "1"
				},{
					label: "PC",
					value: "3"
				}],
				value: ""
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			list: [],
			search: {
				name: '',
				platform: '',
				status: ''
			},
			noDataMessage: '无相关查询结果',
		};
	},
	created() {
		this.getList();
	},
	computed: {
		isName() {
			return this.search.name.length > 0;
		}
	},
	components: {
	'm-drawer': Drawer,
	'm-preview': pagePreview
	},
	mounted() {
		let vm = this;
		Event.$on('close-preview', () => {
			vm.showChildComponents.pagePreview = false;
			// vm.pageId = '';
		});
		Event.$on('get-list', () =>{
			vm.getList();
		});
		Event.$on('clear-pageId', () => {
			vm.webpageId = '';
		});
	},
	methods: {
		pageSizeChange(size) {
			this.page.pageSize = size;
			this.getList();
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		handleClickIcon() {
			this.search.name = '';
		},
		handlePreview(item) {
			this.isTemplate5 = item.webpageTemplate.webpageTemplateId == 5;
			this.webpageId = item.webpageId;
			this.showChildComponents.pagePreview = true;
		},
		searchHandle() {
			if (this.page.currentPage > 1) {
				this.page.currentPage = 1;
			} else {
				this.getList();
			}
		},
		getList() {
			let search = this.search, vm = this;
			Http.get('/api/webpages', {
				params: {
					name: search.name,
					platform: search.platform ? search.platform : '',
					status: search.status ? search.status : '',
					page: vm.page.currentPage,
					number: vm.page.pageSize
				}
			}).then((res) => {
				vm.list = [];
				if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
					vm.list = res.data.data.list;
					vm.list.forEach((item, index) => {
						item.createTime = formatDate(item.createTime, 'yyyy年MM月dd日');
						item.platform = item.platform == 1 ? '无线' : 'PC';
						item.status = item.status == 0 ? '草稿' : (item.status == 1 ? '已发布' : (item.status == 2 ? '发布中' : '已删除'));
					});
					vm.page.totalCount = res.data.data.totalCount;
				} else {
					vm.list = [];
					vm.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		newPage() {
			Event.$emit('clear-pageId');
			this.webpageId = '';
			actions.controlDrawer(this.$store, {
				show: true,
				action: 'new',
				type: 'template',
				config: {}
			});
		},
		modify(item){
			this.webpageId = item.webpageId;
			this.getData(item, (data) => {
				let type = data.webpageTemplateId && data.webpageTemplateId === 5 ? 'template5' : 'edit';
				let webpageData = mixinSource(Object.assign({webpageId: ''}, CONST.DRAWERTEMPLATE5), data);
				actions.controlDrawer(this.$store, {
					show: true,
					action: 'modify',
					type: type,
					config: webpageData
				});
			});
		},
		getData(item, cb){
			let that = this;
			Http.get("/api/webpage?webpageId=" + item.webpageId).then(function(res) {
				if(res.data.code === 200){
					cb(res.data.data);
				} else {
					that.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(function(error){
				console.log(error);
			});
		},
	},
	destroyed() {
		actions.controlDrawer(this.$store, {
			show: false,
			action: '',
			type: '',
			config: {}
		});
	}
};
</script>
<style scoped>
th {line-height: 35px;}
tr {text-align: left;}
i {font-style: normal;}
.a_st {padding: 0 10px;}
.landingPage{
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 280px;
	padding: 0 20px 0 0;
}
.table-list td.span-col-4 {
	width: 155px;
	height: 60px;
}
.table-list {
	margin-bottom: 8px;
	font-size: 14px;
	min-width: 100%;
	color: #23272c;
	width: 155px;
	height: 60px;
}
table{text-align: left;}
th:first-child, td:first-child{padding-left: 20px;}
</style>
