<template>
	<div class="page-content">
		<div class="page-title show-menu">站内信</div>
		<div class="content">
			<div class="message-list">
				<ol>
					<li v-if="messages.length == 0"><span class="list-infor">暂无内容</span></li>
					<li v-for="message in messages" :class="{actived: message.isRead == 0}">
						<em class="icon icon-letter"></em>
						<span class="list-infor"><router-link :to="{name: 'mdetail', params:{id: message.messageId}}" target="_blank">{{message.title}}</router-link></span>
						<span class="list-time">{{message.createTime | moment('YYYY/MM/DD')}}</span>
					</li>
				</ol>
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
	</div>
</template>
<script>
import http from "http";
export default {
	name: 'AccountMessageList',
	data() {
		return {
			messages: {},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList(){
			http.get("/api/messages", {
				params: {
					type: 2,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then((res) => {
				if (res.data.code == 200) {
					this.messages = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		pageSizeChange(size) {
			this.page.pageSize = size;
			this.getList();
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		}
	}
};
</script>