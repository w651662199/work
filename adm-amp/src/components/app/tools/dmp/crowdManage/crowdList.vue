<template>
	<div>
		<div class="account-set">
			<div class="set-fn">
				<div class="fn-plan">
					<span class="btn btn-normal" @click.prevent="newPage">新建人群</span>
				</div>
				<div class="fn-plan">
					<span class="btn btn-normal" @click.prevent="del(0)">删除</span>
				</div>
				<div class="fn-plan-new">
					<div class="fn-plan">
						<span class="plan-title">人群： </span>
						<el-input v-model="search.name" :maxlength="30" placeholder="请输入人群名称" style="width:170px;display:inline-block;">
							<i slot="icon" class="el-input__icon el-icon-close" @click="handleClickIcon()" v-if="isName"></i>
						</el-input>
					</div>
					<div class="fn-search"><span class="btn btn-primary" @click="searchHandle()">查询</span></div>
				</div>
			</div>
			<p class="crowdTip">仅当“运算完成”的人群才可被广告单元引用</p>
		</div>
		<div class="amp-data">
			<div id="con-table-change" class="data-table">
				<table class="table-list">
					<thead class="list-header" style="text-align:left;">
					<tr :class="{actived: isActived, 'list-header': true}">
						<th class="w150"><span><em class="icon icon-select select-all" @click="checkall"></em></span></th>
						<th class="w150"><i class="data-id">ID</i></th>
						<th class="w220">人群名称</th>
						<th class="w120">人群类型</th>
						<th class="w120">运算状态</th>
						<th class="w120">创建时间</th>
						<th class="w220">操作</th>
					</tr>
					</thead>
					<tbody class="list-body">
					<tr class="body-row" v-if="list.length == 0">
						<td  :colspan="7" style="text-align: center; height: 100px;line-height: 100px;">{{noContentMsg}}</td>
					</tr>
					<tr class="body-row" v-for="item in list" :class="{actived: item.isActived && item.type == 2, 'body-row': true ,'listDisabled':item.type == 1}">
						<td><span><em @click="checkbox(item.crowdId)" :class="'icon icon-select select-' + item.crowdId" :data-id="item.crowdId"></em></span></td>
						<td class="span-col-4"><i class="data-id">{{item.crowdId}}</i></td>
						<td class="span-col-4">
							{{item.name}}
							<el-tooltip placement="right" effect="light">
								<div slot="content">
									<p v-if="item.name == '核心人群'">近6个月购买过本单元SKU扩展至同品牌、同三级类目、同店铺任意商品用户。</p>
									<p v-if="item.name == '意向人群'">近6个月内加购/收藏过本单元SKU扩展至同品牌、同三级类目、同店铺内任意商品的用户。</p>
									<p v-if="item.name == '潜力人群'">近30天内浏览过本单元SKU扩展至同品牌、同三级类目、同店铺任意商品但未购买用户。</p>
								</div>
								<div class="SKUtipicon" v-if="item.name == '核心人群' || item.name == '意向人群' || item.name == '潜力人群'"><em class="icon icon-doubt"></em></div>
							</el-tooltip>
						</td>
						<td class="span-col-4">{{item.type == 1 ? '系统推荐' : '标签人群'}}</td>
						<td class="span-col-4 crowdStatusCow">
							<span v-if="item.name == '核心人群' || item.name == '意向人群' || item.name == '潜力人群'">
								-
							</span>
							<span v-else :class="{'crowdStatus':item.status !== 3}">
								<!--{{item.status == -1?'删除':(item.status == 0?'运算未开始':(item.status == 1?'运算修改':(item.status==2?'运算中':'运算完成')))}}-->
								{{item.status == 3 ? '运算完成':'运算中'}}
							</span>
							<el-tooltip placement="right" effect="light">
								<div slot="content">
									<p>人群被添加到投放单元后，才开始运算。</p>
								</div>
								<span class="SKUtipicon" v-show="item.name == '核心人群' || item.name == '意向人群' || item.name == '潜力人群'"><em class="icon icon-doubt"></em></span>
							</el-tooltip>
						</td>
						<td class="span-col-4">{{item.createTime | moment('YYYY-MM-DD')}}</td>
						<td class="span-col-4">
							<b class="operat-link">
								<a href="javascript:void(0)" @click.prevent="handlePreview(item.crowdId)" style="font-weight:normal;margin-right:10px;">查看</a>
								<a href="javascript:void(0)" @click.prevent="modify(item.crowdId,item.type)"
								   style="font-weight:normal;margin-right:10px;" :class="{'disabled':item.type == 1}">
									修改
								</a>
								<a href="javascript:void(0)" @click.prevent="del(item.crowdId,item.type)"
								   style="font-weight:normal;margin-right:10px;" :class="{'disabled':item.type == 1}">
									删除
								</a>
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
			<div class="master" v-if="config.show || previewShow || config.type === 'success'"></div>
		</transition>
		<!--新建/修改-->
		<transition name="drawer" :appear="true">
			<m-drawer :crowdId="crowdId" v-if="config.show"></m-drawer>
		</transition>
		<!--查看-->
		<transition name="drawer" :appear="true">
			<m-preview :crowdId="crowdId" v-if="previewShow && config.show"></m-preview>
		</transition>
		<!--成功-->
		<transition name="drawer" :appear="true">
			<m-successpage :crowdId="crowdId" v-if="config.type === 'success'"></m-successpage>
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
	import drawPage from './drawer.vue';
	import drawPreview from './crowdPreviewDrawer.vue';
	import DrawerSuccess from './seccessCrowdDrawer.vue';
	import CONST from '../../../../../help/CONST';
	export default {
		name: 'app-crowd-list',
		data() {
			return{
				previewShow:false,
				crowdId:'',
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
				delIds:[],
				noContentMsg:'暂无内容'
			};
		},
		created() {
			this.getList();
		},
		components: {
			'm-drawer' : drawPage,
			'm-preview' : drawPreview,
			'm-successpage': DrawerSuccess, //成功頁面
		},
		computed: {
			config: () => store.state.drawerDmpCtrl,
			isName() {
				return this.search.name.length > 0;
			},
			crowdIds(){
				var crowdIds = [],list = this.list;
				for(var item of list){
					if(item.isActived){
						crowdIds.push(item.crowdId);
					}
				}
				return crowdIds;
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
			//关闭查看页面
			Event.$off('close-preview');
			Event.$on('close-preview', () => {
				vm.previewShow = false;
				actions.controlDmpDrawer(this.$store, {
					show: false,
					type: 'template',
					action: 'new',
					config: {}
				});
			});
			Event.$off('get-list');
			Event.$on('get-list', () =>{
				vm.getList();
			});
			Event.$off('clear-pageId');
			Event.$on('clear-pageId', () => {
				vm.crowdId = '';
			});
			//保存
			Event.$off('crowd-save')
			Event.$on('crowd-save',(data) => {
				this.save(data.data);
			})
			//打开成功提示抽屉
			Event.$off('crowd-success-template');
			Event.$on('crowd-success-template', (data) => {
				actions.controlDmpDrawer(this.$store, {
					show: false,
					type: 'success',
					action: data.data.action,
					config: {}
				});
			});
			//关闭成功提示抽屉
			Event.$on('success-close', () => {
				actions.controlDmpDrawer(vm.$store, {
					show: false,
					type: 'template',
					action: 'new',
					config: {}
				});
			})

		},
		methods: {
			handleClickIcon() {
				this.search.name = '';
			},
			save(data){
				let tagIds = [];
				data.list.forEach((item) => {
					tagIds.push(item.tagId);
				});
				if(this.crowdId){ //修改
					Http.put('/api/crowd',{
						crowdId:this.crowdId,
						name:data.name,
						type:2,
						tagIds:tagIds
					}).then((res) => {
						if(res.data.iserror == 0){
							Event.$emit('crowd-success-template',{data:{action:'modify'}});
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}
					})
				} else {
					Http.post('/api/crowd',{
						name:data.name,
						type:2,
						tagIds:tagIds
					}).then((res) => {
						if(res.data.iserror == 0){
							Event.$emit('crowd-success-template',{data:{action:'new'}});
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}
					})
				}
			},
			checkall(){
				var list = this.list, isActived = this.isActived;
				for(var item of list){
					item.isActived = !isActived;
				}
			},
			checkbox(crowdId){
				var list = this.list;
				for(var item of list){
					if(item.crowdId == crowdId){
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
				this.crowdId = id;
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
				Http.get('/api/crowds', {
					params: {
						type:0,
						keyword: search.name,
						page: vm.page.currentPage,
						number: vm.page.pageSize
					}
				}).then((res) => {
					vm.list = [];
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						res.data.data.list.forEach((item,index) => {
							//(-1删除 0运算未开始 1运算修改 2运算中 3运算完成)
							let obj = {};
							obj.crowdId = item.crowdId;
							obj.name = item.name;
							obj.type = item.type;
							obj.status = item.status;
							obj.createTime = item.createTime;
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
			modify(id,type){
			    if(type == 1) return false;
				this.crowdId = id;
				this.getData(id, (data) => {
					actions.controlDmpDrawer(this.$store, {
						show: true,
						action: 'modify',
						type: 'template',
						config: data
					});
				});
			},
			//删除 || 批量删除
			del(crowdId,type) {
				if(type == 1) return false;
			    let crowdIds = this.crowdIds.filter((item) => { return this.getSystemCrowd().indexOf(item) == -1});
				let ids = crowdId == 0 ? crowdIds.join(',') : crowdId +'' ;
				if(crowdId == 0 && crowdIds.length == 0){
					this.errorMsg = '请选择要删除的人群';
					this.dialogVisibleSimple = true;
					return false;
				}
				//人群是否被投放单元引用
				Http.get('/api/crowd/flights/check',{
					params:{
						crowdIds: ids
					}
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						if(res.data.data.quote && crowdId !== 0){ //true => 被人群引用
							//单个被投放单元引用
							this.errorMsg = '没有被投放单元引用的人群才可以删除';
							this.dialogVisibleSimple = true;
						} else if(!res.data.data.quote && crowdId !== 0) {
							//单个没有被投放单元引用
							this.errorMsg = '确定删除该人群吗';
							this.dialogVisible = true;
							this.delIds = ids;
						}else if(res.data.data.quote && crowdId == 0){
							//批量被投放单元引用！
							this.errorMsg = '已选择'+ this.crowdIds.length +'个人群，其中'+ res.data.data.crowdIds.join(',')+'被投放单元引用无法删除，请重新选择';
							this.dialogVisibleSimple = true;
						}else if(!res.data.data.quote && crowdId == 0){
							//批量没有被投放单元引用
							this.errorMsg = '已选择'+ this.crowdIds.length +'个人群，确定全部删除吗？';
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
			//获取系统推荐人群的ID
			getSystemCrowd(){
				let arr = [];
				this.list.forEach((item) => {
					if (item.type == 1) {
						arr.push(item.crowdId);
					}
				})
				return arr;
			},
			getData(id, cb){
				let that = this;
				Http.get("/api/crowd",{
					params:{crowdId: id}
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
				Http.delete('/api/crowd', {
					data: {
						crowdIds: this.delIds.split(','),
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
	.listDisabled td:first-child em{
		background-color: #e8ebee;
		cursor: not-allowed;
	}
	.icon{
		color:#b5bcc1;
		margin-left: 10px;
	}
	.operat-link .disabled{
		color:#aeb8c6;
		cursor: not-allowed;
	}
	.crowdStatus{
		color:#d30312;
	}
	.crowdTip{
		color:#b5bbc3;
		margin-top: 10px;
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
