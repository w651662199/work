<template>
	<el-form :model="formData" ref="formData"  label-width="100px">
		<div class="amp-form">
			<div class="form-column">
				<div class="set-fn">
					<div class="fn-plan">
						<span class="btn btn-normal" @click="newTagPage" >新建标签</span>
					</div>
					<div class="fn-plan-new">
						<div class="fn-plan">
							<span class="plan-title">标签： </span>
							<el-input v-model="search.name" :maxlength="30" placeholder="请输入标签名称" style="width:170px;display:inline-block;">
								<i slot="icon" class="el-input__icon el-icon-close" @click="handleClickIcon()" v-if="isName"></i>
							</el-input>
						</div>
						<div class="fn-search"><span class="btn btn-primary" @click="getTagList('search')">查询</span></div>
					</div>
				</div>
				<div class="errorTag" v-if="validateMsg.selectTags.isError">{{validateMsg.selectTags.errorMsg}}</div>
				<div>
					<div>
						<table class="table main-table">
							<tr class="body-row" v-if="list.length == 0">
								<td colspan="13" style="text-align: center; height: 100px;line-height: 100px;">{{noContentMsg}}</td>
							</tr>
							<thead class="list-header" style="text-align:left;">
							<tr :class="{actived: isActived, 'list-header': true}">
								<th style="width:10%">
									<span><em class="icon icon-select select-all"
											  @click="checkall"></em></span>
								</th>
								<th style="width:90%">标签名称</th>
							</tr>
							</thead>
							<tbody class="list-body">
							<tr class="body-row" v-for="(item,index) in list"
								:class="{actived: item.isActived, 'body-row': true}">
								<td><span><em @click="checkbox(item.tagId,index)"
											  :class="'icon icon-select select-' + item.tagId"
											  :data-id="item.tagId"></em></span></td>
								<td class="span-col-4">{{item.name}}</td>
							</tr>
							</tbody>
						</table>
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
				</div>
				<el-form-item label="已选择：" v-if="formData.list.length > 0" style="margin-top: 20px">
					<el-tag
						:key="item.tagId"
						v-for="(item,index) in formData.list"
						:closable="true"
						:close-transition="false"
						@close="handleClose(item.tagId,index)">
						<span :title="item.name">
							{{item.name.length > 5 ? item.name.substring(0,5) + '...' : item.name}}
						</span>
					</el-tag>
				</el-form-item>
				<el-form-item label="" label-width="110px">
					<div class="errorTag" v-if="formData.list.length > 5">最多可选择5个标签</div>
				</el-form-item>
			</div>
		</div>
		<transition name="fade">
			<div class="master" v-if="drawTagShow && config.show"></div>
		</transition>
		<transition name="drawer" :appear="true">
			<m-drawer  :entry="crowd" v-if="drawTagShow && config.show"></m-drawer>
		</transition>
	</el-form>
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
	import CONST from '../../../../../help/CONST.js';
	import tagDraw from '../tagManage/tagDrawer.vue'

	export default {
		name:'app-crowd-template',
		props:['crowdId'],
		components:{
		    'm-drawer': tagDraw
		},
		data(){
			return {
				formData:{},
				search: {
					name: '',
				},
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 20, 30],
					pageSize: 20
				},
				validateMsg:{
				    selectTags:{
				        isError:false,
						errorMsg:''
					}
				},
				drawTagShow:false,
				crowd:'crowd',
				list:[],
				noContentMsg:'暂无内容'
			}
		},
		computed: {
			drawerData: () => store.state.drawerDmpCtrl.config, // from store
			actionType: () => store.state.drawerDmpCtrl.action,
			config: () => store.state.drawerDmpCtrl,
			isName() {
				return this.search.name.length > 0;
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
			tagIds() {
				var tagIds = [],list = this.list;
				for(var item of list){
					if(item.isActived){
						tagIds.push(item.tagId);
					}
				}
				return tagIds;
			},
		},
		created(){
		    this.formData = copyObj(this.drawerData);
		    if(this.actionType == 'modify'){
		        Vue.set(this.formData,'list',this.formData.tags)
			}
            this.getTagList();
		},
		mounted() {
		    Event.$on('close-tagTemplate', () => {
		        this.drawTagShow = false;
		        this.getTagList();
			})
			Event.$off('template-next-save');
			Event.$on('template-next-save',() => {
				if(this.formData.list.length == 0){
				    this.validateMsg.selectTags.isError = true;
				    this.validateMsg.selectTags.errorMsg = '请至少选择一个标签';
				    return false;
				} else if(this.formData.list.length > 5){
					this.validateMsg.selectTags.isError = false;
					return false;
				} else {
					this.validateMsg.selectTags.isError = false;
					Event.$emit('template-next-save-result',{data:this.formData});
				}

			})
		},
		methods:{
			handleClickIcon() {
				this.search.name = '';
			},
			checkall(){
				var list = this.list, isActived = this.isActived;
				list.forEach((item) => {
					item.isActived = !isActived;
                    if(!isActived){ //全选
						this.formData.list = copyObj(list)
					}else{
						this.formData.list = [];
					}
				})

			},
			checkbox(tagId,index){
				let list = this.list;
				for(var item of list){
					if(item.tagId == tagId){
						item.isActived = !item.isActived;
						if(item.isActived && this.formData.list.indexOf(item) == -1){
						    this.formData.list.push(item);
						}else{
						    this.formData.list.forEach((items,index) => {
						        if(items.tagId == tagId){
									this.formData.list.splice(index,1);
								}
							})
						}
					}
				}
			},
			handleClose(tagId,index){
			    let list = this.formData.list;
				for(let item of list){
					if(item.tagId == tagId){
						list.splice(index,1);
						this.mapList(tagId);
					}
				}
			},
			mapList(tagId) {
			    this.list.forEach((item) => {
			        if(item.tagId == tagId){
						item.isActived = !item.isActived;
					}
				})
			},
			pageSizeChange(size) {
				this.page.pageSize = size;
				this.getTagList();
				this.matchTagList();
			},
			currentPageChange(page) {
				this.page.currentPage = page;
				this.getTagList();
				this.matchTagList();
			},
			getTagList(obj) {
				Http.get('/api/tags',{
					params:{
						keyword: this.search.name,
						page: this.page.currentPage,
						number: this.page.pageSize
					}
				}).then((res) => {
					this.list = [];
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						res.data.data.list.forEach((item,index) => {
							let obj = {};
							obj.tagId = item.tagId;
							obj.name = item.name;
							obj.isActived = false;
							this.list.push(obj);
						})
						this.page.totalCount = res.data.data.totalCount;
						if(this.list.length == 0 && obj =='search'){
							this.noContentMsg = '无查询结果';
						}
						this.list.forEach((items,index) => {
						    this.formData.list.forEach((item) => {
						        if(items.tagId == item.tagId){
						            items.isActived = !items.isActived;
								}
							})
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})

			},
			newTagPage() {
			    this.drawTagShow = true;
				actions.controlDmpDrawer(this.$store, {
					show: true,
					type: 'template',
					action: 'new',
					config: CONST.DRAWDMP
				});
			},
			matchTagList() {
				let list = copyObj(this.formData.list);
				list.forEach((item) => {
				    this.list.forEach((tagList) => {
				        if(item.tagId == tagList.tagId){
							tagList.isActived = !tagList.isActived;
						}
					})
				})
			}
		},
		watch:{
			'formData.list':{
			    handler:function(value,oldvalue) {
			        let list = copyObj(this.formData.list);
			        let tagList = this.list;
			        list.forEach((item) => {
						tagList.forEach((tagitem) => {
						    if(item.tagId == tagitem.tagId){
								tagitem.isActived = true;
							}
						})
					})
				},
				deep:true
			},
			'list':{
			    handler:function(){
					/*let tagList = this.list;
					let list = this.formData.list;
					tagList.forEach((tagItem) => {
						if(tagItem.isActived && list.indexOf(tagItem) == -1){
						    list.push(tagItem);
						}
					})*/
				},
				deep:true
			}
		}
	}
</script>
<style lang="less" scoped>
	.table .body-row.actived{
		background: #f2faff;
	}
	.el-tag{
		margin-left: 10px;
	}
	.selectTable{
		table tbody {
			display:block;
			height:195px;
			overflow-y:scroll;
		}
		table thead, tbody tr {
			display:table;
			width:100%;
			table-layout:fixed;
		}
		table thead {
			width: calc( 100% - 1em )
		}
	}
	.amp-form{
		width:880px;
		.table{
			min-width:100%;
			margin-top: 20px;
			text-align: center;
			th{
				text-align: center;
			}
		}
	}
	.fn-plan-new{
		float:right
	}
	.errorTag{
		color:#d30312;
		font-size: 12px;
		line-height: 3;
	}

</style>
