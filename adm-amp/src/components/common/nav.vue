<template>
	<div class="content-menu">
		<div v-show='isShowNavTitle' class="content-menu-cpc">{{putType}}</div>
		<ul>
			<li v-for="(item, index) in routeConfig" @click="emitRoute(index)" :class="{'actived': item.checked}">
				<div class="menu-header"><a :href="item.link" title=""><em v-if="item.sub.length" class="icon icon-arrow"></em><em class="icon" :class="item.icon"></em><span class="header-text">{{item.msg}}</span></a></div>
				<div class="menu-second" v-bind:class="{'menu-second-new':item.msg == '用户协议'}">
					<a v-for="(subItem, subIndex) in item.sub" :class="{'actived': checkIsActive(subItem.link.replace('/#', ''))}" :href="subItem.link" title="">{{subItem.msg}}</a>
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
			routeConfig: [],
			routePath: this.$route.path.split('/')[2]
		};
	},
	computed: {
		isShowNavTitle() {
			return this.routePath == "put" || this.routePath == "bidcpc" || this.routePath == "newline"
		},
		putType() {
			if (this.routePath == 'put') {
				return '国美众达';
			} else if (this.routePath == 'bidcpc') {
				return '国美点效';
			} else if (this.routePath == 'newline') {
				return '站外';
			}
			return '';
		}
	},
	mounted() {
		this.routeConfig = copyObj(this.config);
	},
	methods: {
		emitRoute(index) {
			this.routeConfig.forEach((item) => {
				item.checked = false;
			});
			this.routeConfig[index].checked = true;
		},
		checkIsActive(url) {
			let path = this.$route.matched[this.$route.matched.length - 1].path;
			if (path.indexOf('account-detail') > -1) {
				let pathArr = path.split('/');
				pathArr = pathArr.slice(0, pathArr.length - 1);
				path = pathArr.join('/');
			} else if (path.indexOf('put/report/plan') > -1 || path.indexOf('put/report/effect') > -1 || path.indexOf('put/report/rebate') > -1) {
			    let pathArr = path.split('/');
				pathArr = pathArr.slice(0, pathArr.length - 1);
				path = pathArr.join('/');
				let urlArr = url.split('/');
				urlArr = urlArr.slice(0, urlArr.length - 1);
				url = urlArr.join('/');
			}
			Object.keys(this.$route.params).forEach((item) => {
				let regx = new RegExp(`/:${item}`, 'g');
				path = path.replace(regx, '');
			});
			return url === path;
		}
	}
};
</script>
<style lang="less">
	.content-menu-cpc{
		background: #f0f3f6;
		font-size: 16px;
		line-height: 40px;
		height: 40px;
		padding-left: 40px;
	}
</style>
