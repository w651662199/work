<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>我的账户</el-breadcrumb-item>
			<el-breadcrumb-item>账户管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="route-tab">
			<div class="tab-list">
				<div class="tab-item"><router-link :to="{name: 'fund'}" :class="{'active': isRouteActive('fund')}">资金管理</router-link></div>
				<div class="tab-item"><router-link :to="{name: 'detail'}" :class="{'active': isRouteActive('detail')}">账户明细</router-link></div>
				<div class="tab-item"><router-link :to="{name: 'invoice'}" :class="{'active': isRouteActive('invoice')}">开具发票</router-link></div>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
export default {
	name: 'account-main',
	methods: {
		isRouteActive(routeName) {
			let route = this.$route;
			return route.name == routeName;
		}
	}
};
</script>
<style lang="less">
@import '../../../../assets/css/ampNew.less';
</style>