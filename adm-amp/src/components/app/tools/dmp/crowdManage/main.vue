<template>
	<div>
		<m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
		<m-list></m-list>
	</div>
</template>
<script>
	import actions from 'actions';
	import Event from 'event';
	import Breadcrumb from '../../../../common/breadcrumb.vue';
	import CrowdList from './crowdList.vue';
	export default {
		name: 'app-account-account-overview',
		data() {
			return {
				breadcrumbConfig: {
					msg: '人群管理',
					showBack: false
				}
			};
		},
		components: {
			'm-breadcrumb': Breadcrumb,
			'm-list': CrowdList
		},
		methods: {
			showNew(obj) {
				actions.controlDrawer(this.$store, obj);
			}
		}
	};
</script>
