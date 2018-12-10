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
	import TagList from './tagList.vue';
	export default {
		name: 'app-account-account-overview',
		data() {
			return {
				breadcrumbConfig: {
					msg: '标签管理',
					showBack: false
				}
			};
		},
		components: {
			'm-breadcrumb': Breadcrumb,
			'm-list': TagList
		},
		methods: {
			showNew(obj) {
				actions.controlDrawer(this.$store, obj);
			}
		}
	};
</script>
