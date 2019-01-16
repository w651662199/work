<template>
	<div class="error-main">
		<m-head></m-head>
		<!-- <div class="login-header"><span class="header-login"><a href="#">gomeplus</a></span></div> -->
		<div class="error-body">
			<div class="body-scaffold error-404"></div>
		</div>
		<div class="error-footer">
			<p class="error-title">哎呀糟糕！您访问的页面暂时没有找到</p>
			<p class="error-detail">您可能输入了错的网址，或者该网址已经删除和移动</p>
			<router-link :to="{name: 'index'}" class="action-back" tag="a">回到首页</router-link>
		</div>
	</div>
</template>
<script>
import Head from '../common/head.vue';
export default {
	name:'error',
	components: {
		'm-head': Head
	}
};
</script>
