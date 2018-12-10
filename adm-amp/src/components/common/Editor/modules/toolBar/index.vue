<template>
	<ul class="toolbar-container">
		<li class="toolbar-item" v-for="item in barItems" :data-dash="item.isHaveDashboard" :data-type="item.name" @click="activeHandler(item.command)">
			<em class="icon" :class="item.class"></em>
		</li>
	</ul>
</template>
<script>
import {addEvent} from '../../utils/common.js';
export default {
	name: 'modult-tool-bar',
	data() {
		return {
			barItems: [
				{name: 'size', title: '字体大小', class: 'icon-font-size', isHaveDashboard: true, command: null},
				{name: 'bold', title: '字体加重', class: 'icon-font-bold', isHaveDashboard: false, command: 'bold'},
				{name: 'italic', title: '字体倾斜', class: 'icon-italic', isHaveDashboard: false, command: 'italic'},
				{name: 'color', title: '字体颜色', class: 'icon-painter', isHaveDashboard: true, command: null},
				{name: 'emoji', title: '表情', class: 'icon-face', isHaveDashboard: true, command: null}
				// {name: 'link', title: '超链接', class: 'icon-link', isHaveDashboard: true, command: null}
			]
		}
	},
	mounted() {
		let items = this.$parent.$refs.editor.getElementsByClassName('toolbar-item');
		addEvent(items, 'mouseenter', (event) => {
			let target = event.target;
			let attributes = target.attributes;
			if (attributes['data-dash']) {
				let centerX = target.offsetLeft + target.offsetWidth * 0.5;
				this.$parent.showDashboard(attributes['data-type'].value, centerX);
			}
		});
		addEvent(items, 'mouseleave', (event) => {
			let target = event.target;
			let attributes = target.attributes;
			if (attributes['data-dash']) {
				this.$parent.hideDashboard(attributes['data-type'].value);
			}
		});
	},
	methods: {
		activeHandler(command) {
			if (command) {
				this.$parent.execCommand(command);
			}
		}
	}
}
</script>
<style lang="less" scoped>
.toolbar-container {
	li {
		float: left;
	}
	&:after {
		content: " ";
		display: block;
		clear: both;
		height: 0;
	}
}
</style>