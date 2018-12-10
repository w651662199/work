<template>
	<div>
		<div class="account-set">
			<div class="set-fn"><span class="btn btn-normal" @click.prevent="newPage">新建问卷</span></div>
			<br>
			<div class="set-fn">
				<div class="fn-plan">
					<span class="plan-title">问卷名称： </span>
					<el-input v-model="search.name" :maxlength="30" placeholder="请输入问卷名称" style="width:170px;display:inline-block;">
						<i slot="icon" class="el-input__icon el-icon-close" @click="handleClickIcon()" v-if="isName"></i>
					</el-input>
				</div>
				<div class="fn-search"><span class="btn btn-primary" @click="searchHandle()">搜索</span></div>
			</div>
		</div>
		<div class="amp-data">
			<div id="con-table-change" class="data-table">
				<table class="table-list">
					<thead class="list-header" style="text-align:left;">
					<th class="span-col-2" style="width: 10%">ID</th>
					<th class="span-col-2" style="width: 20%">问卷名称</th>
					<th class="span-col-2" style="width: 15%">创建时间</th>
					<th class="span-col-2" style="width: 10%">审核状态</th>
					<th class="span-col-2" style="width: 10%">总回收</th>
					<th class="span-col-2" style="width: 10%">昨日回收</th>
					<th class="span-col-2" style="width: 30%">操作</th>
					</thead>
					<tbody class="list-body">
					<tr v-if="list.length == 0">
						<td colspan="6" style="text-align: center; height: 30px;line-height: 30px;">{{noDataMessage}}</td>
					</tr>
					<tr class="body-row" v-for="item in list">
						<td class="span-col-4">
							{{item.surveyId}}
						</td>
						<td class="span-col-4">
							{{item.name.length>16?item.name.substring(0,16)+'...':item.name}}
							<br><a v-if="item.check == false" class="checkQuestion">(问卷不完整)</a>
						</td>
						<td class="span-col-4">{{item.createTime}}</td>
						<td class="span-col-4">
						<span :title="item.rejectReasons" :class="{'NoPass':item.approveStatus==-1&&item.status==0}">
							<!--{{item.approveStatus==1?"审核通过":(item.approveStatus==-1?"审核不通过":"审核中")}}-->
							{{item.approveStatus==0&&item.status==0?"草稿":(item.approveStatus==-1&&item.status==0?"审核不通过":(item.approveStatus==1&&item.status==1?"审核通过":"审核中"))}}
						</span>
						</td>
						<td class="span-col-4">{{item.totalReturn}}</td>
						<td class="span-col-4">{{item.todayReturn}}</td>
						<td class="span-col-4">
							<b class="operat-link">
								<el-button type="text" @click.prevent="showCount(item.surveyId,item.name)" :disabled="!(item.approveStatus==1&&item.status==1)">统计</el-button>
								<el-button type="text" @click.prevent="copy(item.surveyId)">复制</el-button>
								<el-button type="text" @click.prevent="modify(item.surveyId)" :disabled="!((item.approveStatus == -1 && item.status == 0) || (item.approveStatus == 0 && item.status == 0))">编辑</el-button>
								<el-button type="text" @click.prevent="showPreview(item.surveyId)">预览</el-button>
								<el-button type="text" @click.prevent="approve(item.surveyId,item.check)" :disabled="!((item.approveStatus == -1 && item.status == 0) || (item.approveStatus == 0 && item.status == 0))">提交审核</el-button>
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
			<div class="master" v-if="config.show || countShow || previewShow"></div>
		</transition>
		<transition name="drawer" :appear="true">
			<m-drawer  :pageId="pageId" v-if="config.show"></m-drawer>
		</transition>
		<transition name="drawer" :appear="true">
			<m-count   :pageId="pageId" :questionName="questionName" :countShow="countShow" v-if="countShow"></m-count>
		</transition>
		<transition name="drawer" :appear="true">
			<m-preview :surveyId="pageId" :previewShow="previewShow" v-if="previewShow"></m-preview>
		</transition>
		<el-dialog v-model="dialogVisible" :modal-append-to-body = "false">
			<span><h3>是否确认提交审核?</h3></span>
			<span slot="footer" class="dialog-footer">
        		<button class="btn btn-gray" @click="dialogVisible = false">取消</button>
        		<button class="btn btn-primary" @click="comfirDialog()">确认</button>
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
	import Drawer from './drawerSurvey.vue';
	import QueationPreview from './surveyPreview.vue';
	import QueationCount from './surveyCount.vue';
	import store from 'store';
	import CONST from '../../../../help/CONST';
	import {
		objType,
		mixin,
		copyObj
	} from 'utils/common';

	export default {
		name: 'app-question-list',
		data() {
			return{
				countShow:false,
				previewShow:false,
				pageId:'',
				questionName:'',
				previewId:'',
				dialogVisible:false,
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
					pageSize: 20
				},
				list: [],
				search: {
					name: '',
				},
				noDataMessage: '无相关查询结果',
				itemId:-1
			};
		},
		created() {
			this.getList();
		},
		computed: {
			isName() {
				return this.search.name.length > 0;
			},
			config: () => store.state.drawerCtrl
		},
		components: {
			'm-drawer': Drawer,
			'm-preview': QueationPreview,
			'm-count': QueationCount,
		},
		mounted() {
			let vm = this;
			Event.$on('close-preview', () => {
				vm.previewShow = false;
			});
			Event.$on('close-count', () => {
				vm.countShow = false;
			});
			Event.$on('get-list', () =>{
				this.getList();
			});
			Event.$on('clear-pageId', () => {
				this.pageId = '';
			});
		},
		methods: {
		    //确认提交审核
			comfirDialog(){
				console.log(this.itemId);
				Http.put('/api/survey/approve', {
					surveyId:this.itemId
				}).then((res) => {
					this.list = [];
					if (res.data.code === 200) {
						this.$message({
							message: '问卷送审成功！',
							type: 'success'
						});
						this.dialogVisible = false;
						this.getList();
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch((error) => {
					console.log(error);
				});
			},
		    //审核
			approve(id,check){
			    if(!check){ //不完整
					this.$message({
						message: '请完整填写问卷！',
						type: 'error'
					});
					return false;
				}else{
			        console.log(id);
			        this.itemId = id;
			        this.dialogVisible = true;
				}
			},
		    //复制问卷
			copy(id){
				Http.post('/api/survey/copy',{
					surveyId: id,
				}).then((res) => {
					if (res.data.code === 200) {
						this.$message({
							message: '问卷复制成功！',
							type: 'success'
						});
						this.getList();
						return false;
					}else{
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
						return false;
					}
				}).catch((error) => {
					console.log(error);
				})
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
				this.getList();
			},
			showCount(id,name) {
				this.pageId = id;
				this.questionName = name;
				this.countShow = true;
			},
			showPreview(id){
				this.pageId = id;
				this.previewShow = true;
			},
			//新建调查问卷
			newPage() {
				Event.$emit('clear-pageId');
				actions.controlDrawer(this.$store, {
					show: true,
					action: 'new',
					type: 'template',
					config: CONST.DRAWQUESTION
				});
			},
			//获取table信息
			getList() {
				let search = this.search;
				Http.get('/api/surveys', {
					params: {
						keyword: search.name,
						page: this.page.currentPage,
						number: this.page.pageSize
					}
				}).then((res) => {
					this.list = [];
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						this.list = res.data.data.list;
						if (this.list.length > 0) {
							this.list.forEach((item, index) => {
								item.createTime = formatDate(item.createTime, 'yyyy年MM月dd日');
							});
						} else {
							this.noDataMessage = '无相关查询结果';
						}
						this.page.totalCount = res.data.data.totalCount;
					} else {
						this.list = [];
						this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			//搜索
			searchHandle() {
				if (this.page.currentPage > 1) {
					this.page.currentPage = 1;
				} else {
					this.getList();
				}
			},
			//修改、编辑
			modify(id){
				this.pageId = id;
				let object = {
					standQuestion:'标准题库',
					selectQueation:'单选题',
				};
				this.getData(id, (data) => {
					actions.controlDrawer(this.$store, {
						show: true,
						action: 'modify',
						type: 'edit',
						config: mixin(data,object),
					});
				});
			},
			getData(id, cb){
				let that = this;
				Http.get("/api/survey",{
					params:{surveyId: id}
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
		},
		destroyed() {
			actions.controlDrawer(this.$store, {
				show: false,
				action: '',
				type: '',
				config: {}
			});
		},
		watch:{
		    'countShow':{
		        handler: (value) => {
                   value ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
				},
				deep:true
			},
			'previewShow':{
		        handler: (value) => {
                   value ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
				},
				deep:true
			}
		}
	};
</script>
<style scoped>
	.checkQuestion{
		color:#d30312;
		display: block;
		margin-top: 2px;
	}
	.NoPass{
		color: #d30312;
	}
	.operat-link a{
		font-weight:normal;
		margin-right:10px;
	}
	th {line-height: 35px;}
	tr {text-align: left;}
	i {font-style: normal;}
	.a_st {padding: 0 10px;}
	.landingPage{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		width: 300px;
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
