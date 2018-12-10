<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">选择URL</span><span class="header-fn"><em @click="hide()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form02-1">
				<div class="set-fn">
					<el-form :model="urlData" label-position="left">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="页面名称：" label-width="96px">
									<el-input :on-icon-click="clearIconClick" v-model="urlData.keyword" placeholder="请输入页面名称" icon="circle-close"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">
								<el-form-item label="">
									<button class="btn btn-primary" @click.prevent="getUrlList">查询</button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="add-show">
					<table class="table">
						<tbody>
							<tr>
								<th width="47"><span></span></th>
								<th><span>ID</span></th>
								<th><span>页面名称</span></th>
								<th><span>创建时间</span></th>
							</tr>
							<tr v-if="urlData.list.length == 0">
								<td colspan="4" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr :class="{'actived': item.checked}" v-for="(item, index) in urlData.list">
								<td><span><el-radio v-model="selectPageId" :label="item.webpageId" class="no_lable"></el-radio></span></td>
								<td><span>{{item.webpageId}}</span></td>
								<td><span>{{item.name}}</span></td>
								<td><span>{{item.createTime}}</span></td>
							</tr>
						</tbody>
					</table>
					<div style="text-align: right;margin-top:18px;">
						<el-pagination  v-show="Math.floor(page.totalCount / page.pageSize) > 0"
							@size-change="pageSizeChange"
							@current-change="pageChange"
							:current-page="page.currentPage"
							:page-sizes="page.pageSizes"
							:page-size="page.pageSize"
							layout="total, sizes, prev, pager, next"
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
import {copyObj} from 'utils/common';
import Event from 'event';
import Http from 'http';
import moment from 'moment';
export default {
	name: 'app-put-new-add-url',
	data() {
		return {
			urlData: {
				keyword: '',
				list: []
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 20
			},
			selectPageId: '',
			noDataMessage: '无相关查询结果'
		};
	},
	props: ['templateId'],
	created() {
		this.getUrlList();
	},
	methods: {
		clearIconClick() {
			this.urlData.keyword = '';
		},
		getUrlList() {
			Http.get('/api/webpages/search', {
				params: {
					webpageTemplateId: this.templateId,
					name: this.urlData.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize,
					status: 1
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.urlData.list = res.data.data.list;
					if (this.urlData.list.length === 0) {
						this.noDataMessage = '无相关查询结果';
					} else {
						this.urlData.list.forEach((item) => {
							item.createTime = moment(item.createTime).format('YYYY年MM月DD日');
						});
						this.page.totalCount = res.data.data.totalCount;
					}
				} else {
					this.urlData.list = [];
					this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			}).catch(e => {
				console.log(e);
			});
		},
		pageChange(page) {
			this.page.currentPage = page;
			this.getUrlList();
		},
		pageSizeChange(size){
			this.page.pageSize = size;
			this.getUrlList();
		},
		save() {
			let selectItem = this.urlData.list.find((item) => {
				return item.webpageId === this.selectPageId;
			});
			Event.$emit('drawer-save-add-url', selectItem);
		},
		hide() {
			Event.$emit('drawer-hide-add-url');
		}
	}
};
</script>
