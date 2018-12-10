<template>
	<div class="index-preview">
		<h1 class="preview-name">概览</h1>
		<m-preview :productLine="productLine"></m-preview>
	</div>
</template>
<script>
import Preview from '../preview.vue';
export default {
	name: 'put-bidcpc-index',
	components: {
		'm-preview': Preview
	},
	data() {
		return {
			productLine: 3
		};
	}
};
</script>