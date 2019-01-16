<template>
	<div class="menu">
		<ul>
			<li v-for="(item, index) in routeConfig" @click="emitRoute(index)" :class="{'actived': checkNavActive(item.link)}" v-privilege="item.permission">
				<div class="menu-header"><a :href="item.link" title="" @click="navClick(item, $event)"><em v-if="item.sub.length" class="icon icon-arrow"></em><em class="icon" :class="item.icon"></em><span class="header-text">{{item.msg}}</span></a></div>
				<div class="menu-second" v-bind:class="{'menu-second-new':item.msg == '用户协议'}">
					<a v-for="(subItem, subIndex) in item.sub" :class="{'actived': checkIsActive(subItem.link.replace('/#', ''))}" :href="subItem.link" title="" v-privilege="subItem.permission" @click="navClick(subItem, $event)">{{subItem.msg}}</a>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import {
	copyObj
} from 'utils/common';
export default {
	name: 'app-accout-nav',
	props: ['config'],
	data() {
		return {
			routeConfig: []
		};
	},
	mounted() {
		this.routeConfig = copyObj(this.config);
	},
	methods: {
		navClick(route, e) {
			let currentPath = route.link.replace('/#', '');
			if (currentPath == this.$route.path) {
				e.preventDefault();
				return false;
			}
		},
		emitRoute(index) {
			this.routeConfig.forEach((item) => {
				item.checked = false;
			});
			this.routeConfig[index].checked = true;
		},
		checkNavActive(url) {
			let path = url.replace('/#', '');
			return this.$route.path.indexOf(path) > -1;
		},
		checkIsActive(url) {
			let path = this.$route.matched[this.$route.matched.length - 1].path;

			Object.keys(this.$route.params).forEach((item) => {
				let regx = new RegExp(`/:${item}`, 'g');
				path = path.replace(regx, '');
			});
			return url === path;
		}
	}
};
</script>
