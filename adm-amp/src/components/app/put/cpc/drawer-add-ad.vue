<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">添加广告位</span><span class="header-fn"><em @click="hide()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form02-1">
				<div class="set-fn">
					<el-form :model="anices" label-position="left">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="广告位名称：" label-width="96px">
									<el-input @click="anices.keyword = ''" ref="nameInput" v-model="anices.keyword" placeholder="请输入" icon="circle-close"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label="媒体：" label-width="54px">
									<el-select v-model="anices.checkedPublisher" clearable placeholder="请选择">
										<el-option v-for="item in anices.publishersList" :label="item.name" :value="item.publisherId"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="2">
								<el-form-item label="">
									<el-button @click="getAnicesList()">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="add-show">
					<table class="table">
						<tbody>
							<tr>
								<!-- <th width="47"><span><el-checkbox v-model="checkAllSelect" @change="selectAll()"></el-checkbox></span></th> -->
								<th width="47"><span></span></th>
								<th><span>媒体名称</span></th>
								<th><span>广告位名称</span></th>
								<th width="140"><span>刊例价</span></th>
							</tr>
							<tr v-if="anices.list.length == 0">
								<td colspan="4" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr :class="{'actived': item.checked}" v-for="(item, index) in anices.list"
								:style="{'background': selectAdvertisementId == item.advertisementId ? '#f2faff':''}"
							    @click="selectAd(item.advertisementId)">
								<!-- <td><span><el-checkbox v-model="item.checked"></el-checkbox></span></td> -->
								<td><span><el-radio v-model="selectAdvertisementId" :label="item.advertisementId" class="no_lable"></el-radio></span></td>
								<td><span>{{item.publisherName}}</span></td>
								<td><span>{{item.advertisementName}}</span></td>
								<td><span>{{item.adFloorBid/100}}</span></td>
							</tr>
						</tbody>
					</table>
					<div style="text-align: center;margin-top:18px;">
						<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
							@current-change="currentPageChange"
							:current-page="page.currentPage"
							:page-size="page.pageSize"
							layout="total, prev, pager, next"
							:class="{'el-pagination-reset': true}"
							:total="page.totalCount">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-primary" @click="save()">保存</button>
			<button class="btn btn-gray" @click="hide()">取消</button>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import {
	copyObj
} from 'utils/common';
import Event from 'event';
import Http from 'http';
export default {
	name: 'app-put-new-add-ad',
	data() {
		return {
			anices: {
				keyword: '',
				checkedPublisher: '',
				publishersList: [],
				list: []
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 20
			},
			trHover:false,
			selectAdvertisementId: NaN,
			checkAllSelect: false,
			noDataMessage: '无相关查询结果'
		};
	},
	props: ['formData'],
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		formDataCopy: function() {
			return this.formData;
		}
	},
	created() {
		this.getPublishersList();
		this.getAnicesList();
	},
	methods: {
		selectAd(Id) {
		    this.selectAdvertisementId = Id;
		},
		getPublishersList() {
			Http.get('api/publishers', {
				params: {
					platform: this.formDataCopy.platform,
					isInternal: 1
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.anices.publishersList = res.data.data.list;
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(e => {
				console.log(e);
			});
		},
		getAnicesList() {
			Http.get('/api/anices', {
				params: {
					keyword: this.anices.keyword,
					publisherId: this.anices.checkedPublisher,
					page: this.page.currentPage,
					number: this.page.pageSize,
					platform: this.formDataCopy.platform,
					saleMode: 1
				}
			})
			.then(res => {
				if (res.data.code === 200) {
					this.anices.list = res.data.data.list;
					if (this.anices.list.length === 0) {
						this.noDataMessage = '无相关查询结果';
					} else {
						this.page.totalCount = res.data.data.totalCount;
						let cur = this.formDataCopy.advertisements.map((item) => {
							return item.advertisementId;
						});
						this.anices.list.forEach((item) => {
							if (cur.indexOf(item.advertisementId) !== -1) {
								Vue.set(item, 'checked', true);
							} else {
								Vue.set(item, 'checked', false);
							}
						});
					}
				} else {
					this.anices.list = [];
					this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			}).catch(e => {
				console.log(e);
				this.anices.list = [];
				this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
			});
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getAnicesList();
		},
		checkAllSelectFunc() {
			this.checkAllSelect = true;
			this.anices.list.forEach((item) => {
				if (!item.checked) {
					this.checkAllSelect = false;
				}
			});
		},
		selectAll() {
			this.anices.list.forEach((item) => {
				item.checked = this.checkAllSelect;
			});
		},
		save() {
			let selectItem = this.anices.list.find((item) => {
				return item.advertisementId === this.selectAdvertisementId;
			});
			selectItem.adBid = selectItem.adFloorBid;
			let resArr = [selectItem];
			// this.anices.list.forEach((item) => {
			// 	if (item.checked) {
			// 		let cur = copyObj(item);
			// 		delete cur.checked;
			// 		result.push(cur);
			// 	}
			// });
			Event.$emit('drawer-save-add-ad', resArr);
		},
		hide() {
			Event.$emit('drawer-hide-add-ad');
		}
	},
	watch: {
		'anices.list': {
			handler: function() {
				this.checkAllSelectFunc();
			},
			deep: true
		}
	}
};
</script>
<style scoped>
	.el-button{
		background:#d30312;
		color:#fff;
		border-color:#d30312;
	}
	.el-radio .el-radio__label{
		display: none;
	}
</style>
