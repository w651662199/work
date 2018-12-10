<template>
	<div>
		<router-view v-if="error == 0"></router-view>
		<m-loading></m-loading>
		<m-agree v-if="isAgree"></m-agree>
		<m-error v-if="error != 0"></m-error>
	</div>
</template>
<script>
import Loading from './components/common/loading.vue';
import ErrorView from './components/error/main.vue';
import Agree from './components/common/agree.vue';
import store from 'store';
export default {
	name: 'app',
	components: {
		'm-loading': Loading,
		'm-error': ErrorView,
		'm-agree': Agree
	},
	computed:{
		error(){
			return store.state.errorCode;
		},
		isAgree() {
			return store.state.userInfo.isRegistered === 1 && store.state.userInfo.isApproved === 1 && store.state.userInfo.isAgree === 0;
		}
	}
};
</script>
<style lang="less">
@import './assets/css/public.less';
@import './assets/css/amp.less';
@import './assets/css/transition.less';
@import './assets/css/table.less';
@import './assets/css/common.less';
@import './assets/css/dialog.less';
</style>
