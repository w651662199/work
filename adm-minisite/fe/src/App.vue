<template>
	<div id="app">
		<m-main></m-main>
	</div>
</template>

<script>
import Main from './components/app/Main.vue';
export default {
	name: 'app',
	components: {
		'm-main': Main
	}
};
</script>

<style lang="less">
@import './assets/css/base.less';
@import './assets/css/index.less';
</style>
