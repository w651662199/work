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
	import QuestionList from './list.vue';
	export default {
		name: 'app-account-account-overview',
		data() {
			return {
				breadcrumbConfig: {
					msg: '调查问卷',
					showBack: false
				}
			};
		},
		components: {
			'm-breadcrumb': Breadcrumb,
			'm-list': QuestionList
		},
		methods: {
			showNew(obj) {
				actions.controlDrawer(this.$store, obj);
			}
		}
	};
</script>
