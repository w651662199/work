<template>
	<div class="crumbsUpdate">
		<span>{{config.msg}}</span>
		<a :href="config.link" v-show="config.showBack">返回</a>
	</div>
</template>
<script>
export default {
	name: 'breadcrumb',
	props: ['config']
};
</script>
<style lang="less">
	.crumbsUpdate{
		padding: 10px 0;
		color: #1f252c;
		span{
			font-size: 18px;
			line-height: 18px;
			margin-right: 20px;
		}
		a{
			font-size: 15px;
		}
	}
</style>
