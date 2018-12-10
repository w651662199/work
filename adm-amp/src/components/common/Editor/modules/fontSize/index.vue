<template>
	<ul class="select-list">
		<li class="list-item" v-for="item in fontSizeList" @click="setFontSize(item.value)">{{item.name}}</li>
	</ul>
</template>
<script>
export default {
	name: 'module-font-size',
	data() {
		return {
			command: 'fontSize',
			fontSizeList: [{
				name: '大号',
				value: '4'
			}, {
				name: '标准',
				value: '3'
			}]
		}
	},
	methods: {
		setFontSize(size) {
			this.$parent.execCommand(this.command, size);
		}
	}
}
</script>
<style lang="less" scoped>
.list-item {
	clear: both;
	background-color: #fff;
	float: none;
	height: 30px;
	line-height: 30px;
	padding: 0 6px;
	cursor: pointer;
	position: relative;
	box-sizing: border-box;
	border-bottom: 5px solid transparent;
	&:hover {
		background-color: #d1dbe5;
	}
}
</style>