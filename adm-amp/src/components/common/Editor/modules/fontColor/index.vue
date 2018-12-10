<template>
	<ul class="select-list">
		<li class="list-item" v-for="color in fontColorList" :style="{'background': color}" @click="setColor(color)"></li>
	</ul>
</template>
<script>
export default {
	name: 'module-color',
	data() {
		return {
			command: 'foreColor',
			fontColorList: [
				'#000000', '#003399', '#333366', '#660000', '#663300', '#666600', '#666633',
				'#666666', '#666699', '#990000', '#ff0000', '#990033', '#9900CC', '#996600',
				'#FFCC00', '#FFCCCC', '#FFCC99', '#FFFF00', '#FF9900', '#CCFFCC', '#CCFF99'
			]
		}
	},
	methods: {
		setColor(color) {
			this.$parent.execCommand(this.command, color);
		}
	}
}
</script>
<style lang="less" scoped>
.select-list {
	width: 90px;
	.list-item {
		float: left;
		width: 25px;
		height: 25px;
		margin: 2px;
	}
	&:after {
		content: " ";
		display: block;
		clear: both;
		height: 0;
	}
}
</style>