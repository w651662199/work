<template>
	<div>
		<m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
		<m-unit-list></m-unit-list>
	</div>
</template>
<script>
import Breadcrumb from '../../../common/breadcrumb.vue';
import unitList from "./unit-list";
export default {
	name: 'app-put-plan-unit-overview',
	data() {
		return {
			breadcrumbConfig: {
				msg: '投放单元',
		        link: '/#/app/put/plan',
		        showBack: true
			}
		};
	},
	components: {
		'm-breadcrumb': Breadcrumb,
		'm-unit-list': unitList
	}
};
</script>
