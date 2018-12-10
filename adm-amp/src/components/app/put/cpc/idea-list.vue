<template>
	<div>
		<div class="amp-path">
			<span class="path-col">单元名称：<b>{{summary.name}}</b></span>
			<span class="path-col">投放平台：<b>{{summary.plat}}</b></span>
			<span class="path-col">已选广告位：<b> <i>{{summary.adNum}}</i>个</b></span>
			<span class="path-col">状态：<b>{{summary.state}}</b></span>
		</div>
		<div class="account-set">
			<div class="set-option">
				<!--<router-link :to="{name: 'unit', params: {id: campaignId}}" class="btn btn-normal btn-back-up"><em
					class="icon icon-prev"></em>返回
				</router-link>-->
				<a href="" class="btn btn-normal" :class="{'btn-disabled': campaignState == 3}" @click.prevent="campaignState == 3 ? '' : newIdea()">新建创意</a>
				<a href="" class="btn btn-normal" @click.prevent="start">启用</a>
				<a href="" class="btn btn-normal" @click.prevent="stop">暂停</a>
				<a href="" class="btn btn-normal" @click.prevent="del">删除</a>
				<span class="set-option-hint" v-show='showOpationHint'>*请选择至少一项后，再进行操作。</span>
				<span class="set-option-hint" v-show='isActionError'>操作失败，请检查网络设置或稍后再试。</span>
			</div>
			<div class="set-fn">
				<div class="fn-plan"><span class="plan-title">创意名称：</span>
					<div class="ele-input ele-input-01">
						<input v-model="so.keyword" placeholder="请输入创意名称">
					</div>
				</div>

				<div class="fn-plan"><span class="plan-title">创意状态：</span>
					<el-select v-model="so.state.value" style="width:200px;display:inline-block;" placeholder="全部">
						<el-option v-for="item in so.state.options" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="fn-search" @click.prevent="search"><a href="" class="btn btn-primary"
																   style="width:76px;padding:0">查询</a></div>
			</div>
		</div>
		<div class="amp-data">
			<div class="data-table" id="mainDataTable">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
						<tr :class="{actived: isActived, 'list-header': true}">
							<th class="w50"><span><em class="icon icon-select select-all" @click="checkall"></em></span></th>
							<th class="w100"><span><i class="data-id">创意ID</i></span></th>
							<th class="w140"><span>创意名称</span></th>
							<th class="w80"><span>创意类型</span></th>
							<th class="w100"><span>创意预览</span></th>
							<th class="w80"><span>创意尺寸</span></th>
							<th class="w100"><span>链接类型</span></th>
							<th class="w220"><span>着陆页地址</span></th>
							<th class="w80"><span>状态</span></th>
							<th class="w80"><span>操作</span></th>
						</tr>
						</thead>
						<tbody>
						<tr class="body-row" v-if="list.length == 0">
							<td colspan="10" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
						</tr>
						<template v-for="item in list">
							<tr :class="{actived: item.isActived, 'body-row': true}">
								<td><span><em @click="checkbox(item.materialId)"
											  :class="'icon icon-select select-' + item.materialId"
											  :data-id="item.materialId"></em></span></td>
								<td><span><i class="data-id">{{item.materialId}}</i></span>
								</td>
								<td><span><i class="ellipsis">{{item.name}}</i></span></td>
								<td><span>{{item.type==1?"图片":(item.type==2?"文字":(item.type==3?"图文":"商品"))}}</span></td>
								<td><span><img :src="item.preview" :alt="item.name" class="imgIdea"></span></td>
								<td><span>{{item.width}}*{{item.height}}</span></td>
								<td><span>{{getLinkTypeText(item.linkType)}}</span></td>
								<td><span :title="item.landingPage"><i class="ellipsis">{{item.landingPage}}</i></span>
								</td>
								<td>
									<span>{{item.state==1?"审核中":(item.state==2?"有效":(item.state==3?"暂停":"审核拒绝"))}}</span>
								</td>
								<td><span><b class="operat-link"><a href="" :class="{'action-disabled': campaignState == 3}" @click.prevent="modify(item.materialId)">修改</a></b></span></td>
							</tr>
						</template>
						</tbody>
					</table>
				</div>
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
		<el-dialog :title="title" v-model="dialogVisible" size="tiny">
			<span v-html="body_html"></span>
			<span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" v-show='showCancel'>取 消</el-button>
        <el-button type="primary" @click="sureFn">确 定</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>

	import Vue from "vue";
	import actions from 'actions';
	import Event from 'event';
	import CONST from '../../../../help/CONST.js';
	import Api from "../../../../config/api.config";
	import http from "../../../../utils/http";
	import {formatDate, mixin} from 'utils/common';
	import {tableHandler, offWindowEvent, initWindowResize} from 'utils/table';

	export default {
		name: 'app-put-idea-list-overview',
		data() {
			return {
				isActionError: false,
				showCancel: true,
				showOpationHint: false,
				dialogVideoVisible: false,
				campaignId: '',
				campaignState: '',
				flightId: this.$route.params.id,
				summary: {
					name: "",
					plat: "",
					adNum: "",
					state: "",
					type: "",
					linkType: "",
					templateId: ""
				},
				so: {
					keyword: "",
					state: {
						options: [{
							label: "全部",
							value: "0"
						}, {
							label: "审核中",
							value: "1"
						}, {
							label: "有效",
							value: "2"
						}, {
							label: "暂停",
							value: "3"
						}, {
							label: "审核拒绝",
							value: "4"
						}],
						value: "0"
					}
				},
				list: [],
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 30
				},
				dialogVisible: false,
				title: '提示',
				noDataMessage: '无相关查询结果',
				body_html: '',
				btn_state: ''
			};
		},
		components: {},
		computed: {
			materialIds(){
				var materialIds = [], list = this.list, statusArr = [];
				for (var item of list) {
					if (item.isActived) {
						materialIds.push(item.materialId);
						statusArr.push(item.status);
					}
				}
				return materialIds;
			},
			isActived(){
				var isActived = true, list = this.list;
				for (var item of list) {
					if (item.isActived) {
						continue;
					}
					isActived = false;
					break;
				}
				return isActived;
			},
			stopStates(){
		    	var states = this.selectedIdea,num;
		        if (states.length == 1) {
		      		if (states[0] != 2) {
		      			num = 1;//其他
		      		} else {
		      			num = 2;//有效
		      		}
		      	} else {
		      		for(let i = 0; i < states.length; i++) {
			      		if (states[i] == 2) {
			      			num = 3;//全是有效
			      		} else {
			      			num = 4;//混合
			      			break;
			      		}
			      	}
		      	}
		      	return num;
		    },
    		startDelStates(){
    			var states = this.selectedIdea,num;
		     	if (states.length == 1) {
		      		if (states[0] == 3) {
		      			num = 1;//暂停
		      		} else {
		      			num = 2;//其他
		      		}
		    	} else {
		      		for(let i = 0; i < states.length; i++) {
			      		if (states[i] == 3) {
			      			num = 3;//全是暂停
			      		} else {
			      			num = 4;//混合
			      			break;
			      		}
			      	}
		      	}
		      	return num;
		    },
		    selectedIdea(){
		    	var states = [],list = this.list;
		      	for(var item of list){
		        	if(item.isActived){
		          		states.push(item.state);
		        	}
		      	}
		      	return states;
		    }
		},
		created(){
			var that = this;
			Event.$off("put-save-success");
			Event.$on("put-save-success", function () {
				that.getList();
			});
			this.getSummary();
			this.getList();
		},
		mounted() {
			initWindowResize('mainDataTable', true, 4);
		},
		updated() {
			tableHandler('mainDataTable', true, 4);
		},
		destroyed() {
			offWindowEvent('mainDataTable');
			actions.controlDrawer(this.$store, {
				show: false,
				action: '',
				type: '',
				config: {}
			});
		},
		methods: {
			getLinkTypeText(linkType) {
				let text = '';
				if (linkType === 0) {
					text = '店铺';
				} else if (linkType === 1) {
					text = '商品推广';
				} else if (linkType === 2) {
					text = '自建页';
				} else if (linkType === 4) {
					text = '话题';
				} else if (linkType === 9) {
					text = '视频';
				}
				return text;
			},
			checkbox(materialId){
				var list = this.list;
				for (var item of list) {
					if (item.materialId == materialId) {
						item.isActived = !item.isActived;
					}
				}
			},
			checkall(){
				var list = this.list, isActived = this.isActived;
				for (var item of list) {
					item.isActived = !isActived;
				}
			},
			getSummary(){
				var summary = this.summary;
				http.get("/api/flight/brief", {
					params: {
						flightId: this.flightId
					}
				}).then((res) => {
					if (res.data.code == 200) {
						var data = res.data.data;
						summary.name = data.name;
						summary.plat = data.platform == 1 ? "无线" : "PC";
						summary.adNum = data.adNumber;
						summary.state = data.state == 1 ? "暂停" : "有效";
						summary.type = data.type;
						summary.linkType = data.linkType;
						summary.templateId = data.templateId;
						this.campaignId = data.campaignId;
						Event.$emit('sendCampaignId', data.campaignId);
						var campaignIdTmp = data.campaignId;
				        http.get("/api/campaign/brief", {
				            params: {
				              campaignId: campaignIdTmp
				            }
				        }).then((res) => {
				        	if (res.data.code == 200) {
				        		this.campaignState = res.data.data.state;
				        	} else {
								this.$message({
									message: '获取数据失败，请检查网络设置或稍后再试',
									type: 'error',
									duration: 3000
								});
							}
				        }).catch((error) => {
				        	console.log(error);
				        })
					} else {
						this.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				}).catch(function (error) {
					console.log(error);
				});
			},
			search() {
				if (this.page.currentPage > 1) {
					this.page.currentPage = 1;
				} else {
					this.getList();
				}
			},
			getList(){
				var so = this.so, that = this;
				http.get("/api/materials", {
					params: {
						flightId: this.flightId,
						keyword: so.keyword,
						state: so.state.value,
						page: this.page.currentPage,
						number: this.page.pageSize,
						productLine: 2
					}
				})
					.then(function (res) {
						if (res.data.code == 200) {
							that.list = res.data.data.list;
							if (that.list.length === 0) {
								that.noDataMessage = '无相关查询结果';
							} else {
								that.page.totalCount = res.data.data.totalCount;
								for (var item of that.list) {
									Vue.set(item, "isActived", false);
									Vue.set(item, "timeMore", false);
									item.startTime = formatDate(item.startTime, "yyyy/MM/dd");
									item.endTime = formatDate(item.endTime, "yyyy/MM/dd");
									if (Array.isArray(item.schedule) && item.schedule.length) {
										var arr = [];
										for (var schedule of item.schedule) {
											var temp = [];
											for (var date of schedule) {
												temp.push(formatDate(+date, "yyyy/MM/dd"));
											}
											arr.push(temp.join("-"));
										}
										item.schedule = arr;
									}
								}
							}
						} else {
							that.list = [];
							that.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
						}
					}).catch(function (error) {
						console.log(error);
					});
			},
			sureFn(){
				if (this.btn_state == 'start') {
					var that = this, list = this.list;
					if (!this.materialIds.length) {
						return;
					}
					http.put("/api/materials/status", {
						materialIds: this.materialIds,
						status: 1
					}).then(function (res) {
						if (res.data.code == 200) {
							for (var id of that.materialIds) {
								for (var item of list) {
									if (id == item.materialId) {
										item.state = 2;
										break;
									}
								}
							}
							that.isActionError = false;
						} else {
							that.isActionError = true;
							// that.$message({
							// 	message: '操作失败，请检查网络设置或稍后再试',
							// 	type: 'error',
							// 	duration: 3000
							// });
						}
					}).catch(function (error) {
						console.log(error);
					});
				} else if (this.btn_state == 'stop') {
					var that = this, list = this.list;
					if (!this.materialIds.length) {
						return;
					}
					http.put("/api/materials/status", {
						materialIds: this.materialIds,
						status: 0
					}).then(function (res) {
						if (res.data.code == 200) {
							for (var id of that.materialIds) {
								for (var item of list) {
									if (id == item.materialId) {
										// item.state = 1;
										//暂停
										item.state = 3;
										break;
									}
								}
							}
							that.isActionError = false;
						} else {
							that.isActionError = true;
							// that.$message({
							// 	message: '操作失败，请检查网络设置或稍后再试',
							// 	type: 'error',
							// 	duration: 3000
							// });
						}
					}).catch(function (error) {
						console.log(error);
					});
				} else if (this.btn_state == 'delete') {
					var that = this, list = this.list, canDeleteList = [];
					if (!this.materialIds.length) {
						return;
					}
					// let hasNotDelete = false;
					// for(var i=0;i<this.materialIds.length;i++){
					//   console.log(list[i].status);
					//   if(this.statusArr[i].status == 3){
					//     hasNotDelete = true;
					//     this.materialIds.splice(i, 1);
					//     this.statusArr.splice(i, 1);
					//   }
					// }
					// if(hasNotDelete){
					//   this.btn_state = 'cannotDelete';
					// }

					// console.log(canDeleteList);
					http.delete("/api/materials", {
						data: {
							materialIds: this.materialIds
						}
					}).then(function (res) {
						if (res.data.code == 200 && res.data.iserror == 0) {
							that.isActionError = false;
							that.getList();
							// for(var id of that.materialIds){
							//   for(var i = 0, len = list.length; i < len; i++){
							//     if(id == list[i].materialId){
							//       list.splice(i, 1);
							//       break;
							//     }
							//   }
							// }
						} else {
							that.isActionError = true;
							// that.$message({
							// 	message: '操作失败，请检查网络设置或稍后再试',
							// 	type: 'error',
							// 	duration: 3000
							// });
						}
					}).catch(function (error) {
						console.log(error);
					});
				} else if (this.btn_state == 'cancel') {
			      	this.dialogVisible=false;
			    }
				this.dialogVisible = false;
			},
			toastChangeHint(condition, type) {
		    	var hintStr = '';
		    	if (condition == 1) {
		      		hintStr = type == 'start' ? `<h3>确定启动该创意吗？</h3>` : (type == 'stop' ? `<h3>仅“有效”状态的创意才可以暂停。</h3>` : (type == 'delete' ? `<h3>确定删除该创意吗？</h3>` : ''));
			      	this.btn_state = type == 'start' ? 'start' : (type == 'stop' ? 'cancel' : (type == 'delete' ? 'delete' : ''));
			      	this.showCancel = type == 'start' ? true : (type == 'stop' ? false : (type == 'delete' ? true : ''));
			  	} else if (condition == 2) {
			      	hintStr = type == 'start' ? `<h3>仅“暂停”状态的创意才可以启动。</h3>` : (type == 'stop' ? `<h3>确定暂停该创意吗？</h3>` : (type == 'delete' ? `<h3>仅“暂停”状态的创意才可以删除。</h3>` : ''));
			      	this.btn_state = type == 'start' ? 'cancel' : (type == 'stop' ? 'stop' : (type == 'delete' ? 'cancel' : ''));
			      	this.showCancel = type == 'start' ? false : (type == 'stop' ? true : (type == 'delete' ? false : ''));
			  	} else if (condition == 3) {
		  			hintStr = type == 'start' ? `<h3>已选择${this.materialIds.length}个创意，确定全部启动吗？</h3>` : (type == 'stop' ? `<h3>已选择${this.materialIds.length}个创意，确定全部暂停吗？</h3>` : (type == 'delete' ? `<h3>已选择${this.materialIds.length}个创意，确定全部删除吗？</h3>` : ''));
			      	this.btn_state = type == 'start' ? 'start' : (type == 'stop' ? 'stop' : (type == 'delete' ? 'delete' : ''));
			      	this.showCancel = type == 'start' ? true : (type == 'stop' ? true : (type == 'delete' ? true : ''));
			  	} else if (condition == 4) {
		  			hintStr = type == 'start' ? `<h3>已选择${this.materialIds.length}个创意，其中仅“暂停”状态的创意才可以启动。请重新选择。</h3>` : (type == 'stop' ? `<h3>已选择${this.materialIds.length}个创意，其中仅“有效”状态的创意才可以暂停。请重新选择。</h3>` : (type == 'delete' ? `<h3>已选择${this.materialIds.length}个创意，其中仅“暂停”状态的创意才可以删除。请重新选择。</h3>` : ''));
			     	this.btn_state = type == 'start' ? 'cancel' : (type == 'stop' ? 'cancel' : (type == 'delete' ? 'cancel' : ''));
			      	this.showCancel = type == 'start' ? false : (type == 'stop' ? false : (type == 'delete' ? false : ''));
			  	}
			  	this.dialogVisible = true;
				this.body_html = hintStr;
		    },
			start(){
				var that = this, list = this.list;
				if (!this.materialIds.length) {
					this.showOpationHint = true;
				} else {
					this.toastChangeHint(this.startDelStates, 'start');
				}
			},
			stop(){
				var that = this, list = this.list;
				if (!this.materialIds.length) {
					this.showOpationHint = true;
				} else {
					this.toastChangeHint(this.stopStates, 'stop');
				}
			},
			del(){
				var that = this, list = this.list;
				if (!this.materialIds.length) {
					this.showOpationHint = true;
				} else {
					this.toastChangeHint(this.startDelStates, 'delete');
				}
			},
			newIdea() {
				var that = this;
				if (this.page.totalCount == 50) {
					this.showCancel = false;
    				this.dialogVisible = true;
      				this.body_html = '<h3>一个投放单元下最多可创建50个创意。</h3>';
      				this.btn_state = 'cancel';
				} else {
					http.get("/api/campaign", {
					params: {
						campaignId: this.campaignId
					}
				}).then(res => {
					if (res.data.code == 200) {
						// if(this.summary.type == 1) {
						actions.controlDrawer(that.$store, {
							show: true,
							action: 'new',
							type: 'idea',
							config: mixin(CONST.DRAWERIDEA, {
								flightId: that.flightId,
								flightLinkType: that.summary.linkType,
								templateId: that.summary.templateId,
								brandIds: [],
							}),
							isRebate: res.data.data.isRebate
						});
						/*
						 } else if(this.summary.type == 2){
						 actions.controlDrawer(that.$store, {
						 show: true,
						 action: 'new',
						 type: 'idea_url',
						 config: mixin({
						 flightId: that.flightId
						 }, CONST.DRAWERIDEA),
						 isRebate: res.data.data.isRebate
						 });
						 }*/
					} else {
						that.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				}).catch(function (error) {
					console.log(error);
				});
				}
			},
			modify(id){
				this.getData(id, "modify");
			},
			/*copy(id){
			 this.getData(id, "copy");
			 },*/
			getData(id, type){
				var that = this;
				let isRebate;
				http.get("/api/campaign", {params: {campaignId: this.campaignId}}).then(res => {
					if (res.data.code == 200) {
						isRebate = res.data.data.isRebate;
						http.get("/api/material", {
							params: {materialId: id}
						}).then(res => {
							if (res.data.code == 200) {
								// if(res.data.data.linkType == 1) {
								// 链接类型为 商品
								actions.controlDrawer(that.$store, {
									show: true,
									action: type,
									type: 'idea',
									config: Object.assign({}, res.data.data, {
										"topicName": "",
										products: res.data.data.relatedItems,
										"flightLinkType": that.summary.linkType,
										"templateId": that.summary.templateId
									}),
									isRebate: isRebate
								});
								/*} else if(res.data.data.linkType == 2) {
								 //链接类型为 URL
								 actions.controlDrawer(that.$store, {
								 show: true,
								 action: type,
								 type: 'idea_url',
								 config: res.data.data,
								 isRebate: isRebate
								 });
								 }else if(res.data.data.linkType == 4) {
								 //链接类型为 话题
								 actions.controlDrawer(that.$store, {
								 show: true,
								 action: type,
								 type: 'idea_url',
								 config: Object.assign({},res.data.data,{"topicName":""}),
								 isRebate: isRebate
								 });
								 }*/
							} else {
								that.$message({
									message: '获取数据失败，请检查网络设置或稍后再试',
									type: 'error',
									duration: 3000
								});
							}
						}).catch(function (error) {
							console.log(error);
						});
					} else {
						that.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				});
			},
			pageSizeChange(size){
				this.page.pageSize = size;
				this.getList();
			},
			currentPageChange(page){
				this.page.currentPage = page;
				this.getList();
			},
			show(materialId){
				var list = this.list;
				for (var item of list) {
					if (item.materialId == materialId && item.schedule.length) {
						item.timeMore = true;
					}
				}
			},
			hide(materialId){
				var list = this.list;
				for (var item of list) {
					if (item.materialId == materialId) {
						item.timeMore = false;
					}
				}
			}
		},
		watch: {
	  		'materialIds' : function() {
				if (this.materialIds.length) {
					this.showOpationHint = false;
				}
			}
	    }
	};
</script>
<style>
	.el-dialog__wrapper .el-dialog {
		width: 500px;
	}

	.mask {
		position: absolute;
		cursor: pointer;
		left: 50%;
		z-index: 2;
		margin-left: -40px;
	}

	.mask:hover {
		opacity: 0.8;
	}

	.maskBox {
		position: relative;
	}

	.imgIdea {
		width: 80px;
		height: 53px;
	}
</style>
