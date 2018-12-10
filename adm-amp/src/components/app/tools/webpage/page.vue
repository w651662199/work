<template>
	<div>
		<m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
		<m-list></m-list>
	</div>
</template>
<script>
import actions from 'actions';
import Event from 'event';
import Breadcrumb from '../../../common/breadcrumb.vue';
import PageList from './list.vue';
export default {
	name: 'app-account-account-overview',
	data() {
		return {
			breadcrumbConfig: {
				msg: '自建页面',
				showBack: false
			}
		};
	},
	components: {
		'm-breadcrumb': Breadcrumb,
		'm-list': PageList
	},
	methods: {
		showNew(obj) {
			actions.controlDrawer(this.$store, obj);
		}
	}
};
</script>
