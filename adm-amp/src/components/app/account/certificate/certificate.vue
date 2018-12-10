<template>
	<div class="page-content">
		<div class="page-title show-menu">商家资质</div>
		<div class="content">
			<div class="account-set">
				<div class="set-option">
				<!-- 选择文件-->
					<div class="set-fn">
						<router-link :to="{name: 'newcert'}" class="btn btn-primary">上传商家资质</router-link>
					</div>
				</div>
				<div class="set-fn">
					<div class="fn-plan"><span class="plan-title">资质名称</span>
						<el-input v-model="so.keyword" placeholder="请输入资质名称" style="width:170px;display:inline-block;">
						</el-input>
					</div>
					<div class="fn-search"><a href="#" class="btn btn-primary" @click.prevent="search">查询</a></div>
				</div>
			</div>
			<div class="shop-wrap">
				<table class="table">
					<tbody>
						<tr>
							<th :width="100"><span class="first-child">ID</span></th>
							<th :width="219"><span>资质名称</span></th>
							<th :width="219"><span>图片</span></th>
							<th :width="219"><span>有效期</span></th>
							<th :width="219"><span>操作</span></th>
						</tr>
						<tr class="body-row" v-if="list.length == 0">
							<td colspan="5" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
						</tr>
						<tr v-for="certificate in list">
							<td><span class="first-child">{{certificate.certificateId}}</span></td>
							<td><span>{{certificate.name}}</span></td>
							<td>
								<span class="table-imgs">
									<img :src="image" v-for="image in certificate.images.split(',')">
								</span>
							</td>
							<td><span>{{certificate.startTime | moment('YYYY/MM/DD')}} - {{certificate.endTime | formatTime('YYYY/MM/DD', maxTime, maxString)}}</span></td>
							<td><span>
								<b class="operat-link">
								<router-link :to="{name: 'modcert', params: {id: certificate.certificateId}}">修改</router-link>
								<a href="" @click.prevent="del(certificate.certificateId)">删除</a>
								</b>
							</span></td>
						</tr>
					</tbody>
				</table>
			</div>
			<el-pagination style="margin-top:20px;" v-show="Math.floor(page.totalCount/page.pageSize)>0"
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
	</div>
</template>
<script>
import http from "http";
import {formatDate,mixin} from 'utils/common';
import CONST from 'help/CONST';
import {TEXT_MESSAGE} from 'help/textMessage';

export default {
	name: 'AccountCertificate',
	data() {
		return {
			so: {
				keyword: "",
			},
			list: [],
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			noDataMessage: '无相关查询结果',
			maxTime: CONST.TIMESTAMP_2038_01_01,
			maxString: TEXT_MESSAGE.commonMessage.longTermEffective,
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList() {
			var so = this.so, that = this;
			http.get("/api/certificates", {
				params: {
					keyword: so.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			})
			.then((res) => {
				if (res.data.code == 200) {
					that.list = res.data.data.list;
					that.page.totalCount = res.data.data.totalCount;
					if (this.list.length === 0) {
						this.noDataMessage = '暂无结果';
					}
				} else if (res.data.code >= 500) {
					this.list = [];
					this.noDataMessage = '服务器异常，请稍后再试。';
				} else {
					this.list = [];
					this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		del(id){
			var that = this;
			http.delete("/api/certificate", {
				params: {
					certificateId: id
				}
			})
			.then(function(res) {
				if (res.data.code == 200) {
					that.getList();
				} else {
					that.$message({
						message: '操作失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			})
			.catch(function(error) {
				console.log(error);
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
		search() {
			if (this.page.currentPage > 1) {
				this.page.currentPage = 1;
			} else {
				this.getList();
			}
		}
	}
};
</script>
