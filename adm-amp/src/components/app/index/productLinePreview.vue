<template>
	<div style="position: relative;margin-top:30px;">
		<div class="set-tab">
			<span :class="{'active': productLine === 2}" @click="changeProductLine(2)">国美众达</span>
			<span :class="{'active': productLine === 3}" @click="changeProductLine(3)">国美点效</span>
		</div>
		<div class="preview-content">
			<m-preview :productLine="productLine"></m-preview>
		</div>
	</div>
</template>
<script>
import ProductPreview from '../put/preview.vue';
export default {
	name: 'index-product-preview',
	components: {
		'm-preview': ProductPreview
	},
	data() {
		return {
			productLine: 2
		};
	},
	methods: {
		changeProductLine(productLine) {
			if (this.productLine !== productLine) {
				this.productLine = productLine;
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../assets/css/ampNew.less';
</style>