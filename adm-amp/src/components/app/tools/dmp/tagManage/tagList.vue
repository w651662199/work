<template>
	<div>
		<div class="account-set">
			<div class="set-fn">
				<div class="fn-plan">
					<span class="btn btn-normal" @click.prevent="newPage">新建标签</span>
				</div>
				<div class="fn-plan">
					<span class="btn btn-normal" @click.prevent="del(0)">删除</span>
				</div>
				<div class="fn-plan-new">
					<div class="fn-plan">
						<span class="plan-title">标签： </span>
						<el-input v-model="search.name" :maxlength="30" placeholder="请输入标签名称" style="width:170px;display:inline-block;">
							<i slot="icon" class="el-input__icon el-icon-close" @click="handleClickIcon()" v-if="isName"></i>
						</el-input>
					</div>
					<div class="fn-search"><span class="btn btn-primary" @click="searchHandle()">查询</span></div>
				</div>
			</div>
		</div>
		<div class="amp-data">
			<div id="con-table-change" class="data-table">
				<table class="table-list">
					<thead class="list-header" style="text-align:left;">
						<tr :class="{actived: isActived, 'list-header': true}">
							<th class="w150"><span style="cursor: pointer;"><em class="icon icon-select select-all" @click="checkall"></em></span></th>
							<th class="w120"><i class="data-id">ID</i></th>
							<th style="width:600px;">标签名称</th>
							<th class="w220">操作</th>
						</tr>
					</thead>
					<tbody class="list-body">
						<tr class="body-row" v-if="list.length == 0">
							<td style="text-align: center; height: 100px;line-height: 100px;" :colspan="4">{{noContentMsg}}</td>
						</tr>
						<tr class="body-row" v-for="item in list" :class="{actived: item.isActived, 'body-row': true}">
							<td><span style="cursor: pointer;"><em @click="checkbox(item.tagId)" :class="'icon icon-select select-' + item.tagId" :data-id="item.tagId"></em></span></td>
							<td class="span-col-4"><i class="data-id">{{item.tagId}}</i></td>
							<td class="span-col-4">{{item.name}}</td>
							<td class="span-col-4">
								<b class="operat-link">
									<a href="javascript:void(0)" @click.prevent="handlePreview(item.tagId)" style="font-weight:normal;margin-right:10px;">查看</a>
									<a href="javascript:void(0)" @click.prevent="modify(item.tagId)" style="font-weight:normal;margin-right:10px;">修改</a>
									<a href="javascript:void(0)" @click.prevent="del(item.tagId)" style="font-weight:normal;margin-right:10px;">删除</a>
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
		<transition name="fade">
			<div class="master" v-if="config.show || previewShow"></div>
		</transition>
		<transition name="drawer" :appear="true">
			<m-drawer  :tagId="tagId" v-if="config.show"></m-drawer>
		</transition>
		<transition name="drawer" :appear="true">
			<m-preview :tagId="tagId" v-if="previewShow && config.show"></m-preview>
		</transition>
		<el-dialog v-model="dialogVisible" :modal-append-to-body = "false" :show-close ="false" :close-on-click-modal="false">
			<span><h3>{{errorMsg}}</h3></span>
			<span slot="footer" class="dialog-footer">
        		<button class="btn btn-gray" @click="closeDialog()">取消</button>
        		<button class="btn btn-primary" @click="comfirDialog()">确定</button>
      		</span>
		</el-dialog>
		<el-dialog v-model="dialogVisibleSimple" :modal-append-to-body = "false" :show-close ="false" :close-on-click-modal="false">
			<span><h3>{{errorMsg}}</h3></span>
			<span slot="footer" class="dialog-footer">
        		<button class="btn btn-primary" @click="closeSimpleDialog()">确定</button>
      		</span>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'Vue';
	import Http from 'utils/http';
	import Event from 'event';
	import { formatDate, debounce } from 'utils/common';
	import actions from 'actions';
	import drawPage from './tagDrawer.vue';
	import drawPreview from './tagPreviewDrawer.vue';
	import CONST from '../../../../../help/CONST';
	export default {
		name: 'app-tag-list',
		data() {
			return{
				showChildComponents: {
					pagePreview: false
				},
				previewShow:false,
				tagId:'',
				previewId:'',
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 20
				},
				list: [],
				search: {
					name: '',
				},
				dialogVisible:false,
				dialogVisibleSimple:false,
				errorMsg:'',
				delIds:'',
				noContentMsg:'暂无内容'
			};
		},
		created() {
			this.getList();
		},
		components: {
			'm-drawer' : drawPage,
			'm-preview' : drawPreview
		},
		computed: {
			config: () => store.state.drawerDmpCtrl,
			isName() {
				return this.search.name.length > 0;
			},
			tagIds(){
				var tagIds = [],list = this.list;
				for(var item of list){
					if(item.isActived){
						tagIds.push(item.tagId);
					}
				}
				return tagIds;
			},
			isActived(){
				var list = this.list;
				var isActived = list.length > 0;

				for(var item of list){
					if(item.isActived){
						continue;
					}
					isActived = false;
					break;
				}
				return isActived;
			},
		},
		mounted() {
			let vm = this;
			//关闭查看标签
			Event.$off('close-preview')
			Event.$on('close-preview', () => {
				vm.previewShow = false;
			});
			Event.$off('get-list');
			Event.$on('get-list', () =>{
				vm.getList();
			});
			Event.$on('clear-pageId', () => {
				vm.tagId = '';
			});
		},
		methods: {
			checkall(){
				var list = this.list, isActived = this.isActived;
				for(var item of list){
					item.isActived = !isActived;
				}
			},
			checkbox(tagId){
				var list = this.list;
				for(var item of list){
					if(item.tagId == tagId){
						item.isActived = !item.isActived;
					}
				}
			},
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
			handlePreview(id) {
				this.tagId = id;
				this.getData(id, (data) => {
					this.previewShow = true;
					actions.controlDmpDrawer(this.$store, {
						show: true,
						action: 'modify',
						type: 'preview',
						config: data
					});
				});
			},
			searchHandle() {
				if (this.page.currentPage > 1) {
					this.page.currentPage = 1;
				} else {
					this.getList('search');
				}
			},
			getList(obj) {
				let search = this.search, vm = this;
				Http.get('/api/tags', {
					params: {
						keyword: search.name,
						page: vm.page.currentPage,
						number: vm.page.pageSize
					}
				}).then((res) => {
					vm.list = [];
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
					    res.data.data.list.forEach((item,index) => {
					        let obj = {};
					        obj.tagId = item.tagId;
					        obj.name = item.name;
					        obj.status = item.status;
					        obj.isActived = false;
							vm.list.push(obj)
						})
						if(vm.list.length == 0 && obj =='search'){
							vm.noContentMsg = '无查询结果';
						}
						vm.page.totalCount = res.data.data.totalCount;
					} else {
						vm.list = [];
						vm.noContentMsg = '加载内容失败，请检查网络或刷新当前页面';
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			newPage() {
				Event.$emit('clear-pageId');
				actions.controlDmpDrawer(this.$store, {
					show: true,
					action: 'new',
					type: 'template',
					config: CONST.DRAWDMP
				});
			},
			modify(id){
				this.tagId = id;
				this.getData(id, (data) => {
					actions.controlDmpDrawer(this.$store, {
						show: true,
						action: 'modify',
						type: 'edit',
						config: data
					});
				});
			},
			//删除 || 批量删除
			del(tagId) {
			    let ids = tagId == 0 ? this.tagIds.join(',') : tagId + '' ;
			    if(tagId == 0 && this.tagIds.length == 0){
					this.errorMsg = '请选择要删除的标签';
					this.dialogVisibleSimple = true;
					return false;
				}
			    Http.get('api/tag/crowd',{
			        params:{
			            tagIds: ids
					}
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
					    if(res.data.data.quote && tagId !== 0){ //true => 被人群引用
                            //单个被人群引用
							this.errorMsg = '没有被人群引用的标签才可以删除';
							this.dialogVisibleSimple = true;

						} else if(!res.data.data.quote && tagId !== 0) {
					        //单个没有被人群引用
							this.errorMsg = '确定删除该标签吗';
							this.dialogVisible = true;
							this.delIds = ids;
						}else if(res.data.data.quote && tagId == 0){
							//批量被人群引用！
							this.errorMsg = '已选择'+ this.tagIds.length +'个标签，其中'+ res.data.data.tagIds.join(',')+'被人群引用无法删除，请重新选择';
							this.dialogVisibleSimple = true;
						}else if(!res.data.data.quote && tagId == 0){
							//批量没有被人群引用
							this.errorMsg = '已选择'+ this.tagIds.length +'个标签，确定全部删除吗？';
							this.dialogVisible = true;
							this.delIds = ids;
						}
					} else {
						this.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				})
			},
			getData(id, cb){
				let that = this;
				Http.get("/api/tag",{
					params:{tagId: id}
				}).then(function(res){
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
			closeSimpleDialog() {
			    this.dialogVisibleSimple = false;
			},
			closeDialog() {
			    this.dialogVisible = false;
			},
			comfirDialog(){
				Http.delete('/api/tag', {
					data: {
						tagIds: this.delIds.split(','),
					}
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						Event.$emit('get-list');
						this.dialogVisible = false;
					} else {
						this.$message({
							message: '操作失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		}
	};
</script>
<style scoped>
	.el-dialog__body h3{
		word-break: break-all;
	}
	.fn-plan-new{
		float: right;
	}
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
