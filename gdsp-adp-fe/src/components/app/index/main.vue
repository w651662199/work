<template>
	<div class="index-content">
		<dashboard></dashboard>
		<chart></chart>
	</div>
</template>
<script>
import Dashboard from './dashboard.vue';
import Chart from './IChart.vue';
export default {
	name: 'app-main',
	components: {
		Dashboard,
		Chart
	}
};
</script>
