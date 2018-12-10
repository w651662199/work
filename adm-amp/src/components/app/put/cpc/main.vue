<template>
    <div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item>国美众达</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="route-tab">
			<div class="tab-list">
				<div class="tab-item"><router-link :to="{name: 'fund'}" :class="{'active': isRouteActive('fund')}">投放管理</router-link></div>
				<div class="tab-item"><router-link :to="{name: 'detail'}" :class="{'active': isRouteActive('detail')}">数据报表</router-link></div>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
export default {
	name: 'PutCpcMain',
	methods: {
		isRouteActive(routeName) {
			let route = this.$route;
			return route.name == routeName;
		}
	}
};
</script>
