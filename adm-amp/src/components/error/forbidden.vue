<template>
	<div>
		<div class="error-body">
			<div class="body-scaffold error-authority"></div>
		</div>
		<div class="error-footer">
			<p class="error-title">对不起，您没有访问权限</p>
			<p class="error-detail">有任何疑问请E-mail联系国美广告运营部：ad-service@gomeplus.com</p>
			<!-- <router-link :to="{name: 'index'}" class="action-back" tag="a">回到首页</router-link><a @click="goBack">返回上一页</a> -->
		</div>
	</div>
</template>
<script>
export default {
	name: 'error-forbidden',
	methods:{
		goBack(){
			router.go(-1);
		},
		refresh(){
			window.location.reload();
		}
	}
};
</script>
