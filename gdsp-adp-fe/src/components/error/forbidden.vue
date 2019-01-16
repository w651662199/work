<template>
	<div class="error-main">
		<m-head></m-head>
		<div class="error-body">
			<div class="body-scaffold error-403"></div>
		</div>
		<div class="error-footer">
			<p class="error-title">哎呀抱歉！服务器拒绝了您的请求</p>
			<p class="error-detail">请确认您拥有所需的访问权限</p>
			<!-- <router-link :to="{name: 'index'}" class="action-back" tag="a">回到首页</router-link><a @click="goBack">返回上一页</a> -->
		</div>
	</div>
</template>
<script>
import Head from '../common/head.vue';
export default {
	name: 'error-forbidden',
	methods:{
		goBack(){
			router.go(-1);
		},
		refresh(){
			window.location.reload();
		}
	},
	components: {
		'm-head': Head
	}
};
</script>
