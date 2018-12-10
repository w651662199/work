<template>
	<div class="page-content">
		<div class="page-title show-menu">站内信</div>
		<div class="msg-detail content">
			<h2 class="detail-header">{{message.title}}</h2>
			<div class="detail-time" style="display: none;">{{message.createTime | moment('YYYY/MM/DD HH:mm:ss')}}</div>
			<div v-html="message.content" class="detail-infor">
				{{message.content}}
			</div>
		</div>
	</div>
</template>
<script>
import http from "http";
export default {
	name: 'AccountMessageDetail',
	data(){
		return {
			messageId: this.$route.params.id,
			message: {}
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList() {
			http.get("/api/message", {
				params: {
					messageId: this.messageId
				}
			}).then((res) => {
				if (res.data.code == 200) {
					this.message = res.data.data;
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
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