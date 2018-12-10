<template>
	<div class="content-menu">
		<ul>
			<li :class="{'actived': isActive(menuItem.name)}" v-for="(menuItem, index) in menuList" :key="index">
				<div class="menu-header">
					<a :href="menuItem.link" title=""><em class="icon" :class="'nav-' + menuItem.icon"></em><span class="header-text">{{menuItem.title}}</span></a>
				</div>
				<div class="menu-second">
					<a :class="{'actived': isActive(subItem.name)}" v-for="(subItem, subIndex) in menuItem.sub" :href="subItem.link">{{subItem.title}}</a>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import RouterConfig from '../../config/router.config.js';
export default {
	name: 'SubMenu',
	data() {
		return {
			menuList: [{
				title: '首页',
				link: '#/app/index',
				name: 'index',
				checked: true,
				icon: 'home',
				sub: []
			}, {
				title: '产品线',
				name: 'line',
				link: '#/app/put',
				checked: false,
				icon: 'line',
				sub: [{
					title: '国美众达',
					name: 'cpc',
					link: '#/app/put/index',
					checked: false,
					icon: null,
				}, {
					title: '国美点效',
					name: 'bid',
					link: '#/app/bidcpc/index',
					checked: false,
					icon: null,
				}]
			}, {
				title: '我的账户',
				name: 'account',
				link: '#/app/account',
				checked: false,
				icon: 'account',
				sub: [{
					title: '账户管理',
					name: 'manage',
					link: '#/app/account/manage',
					checked: false,
					icon: null,
				}, {
					title: '联系方式',
					name: 'contact',
					link: '#/app/account/contact',
					checked: false,
					icon: null,
				}, {
					title: '余额提醒',
					name: 'balance',
					link: '#/app/account/balance',
					checked: false,
					icon: null,
				}, {
					title: '商家资质',
					name: 'certificate',
					link: '#/app/account/certificate',
					checked: false,
					icon: null,
				}]
			}, {
				title: '工具',
				name: 'tool',
				link: '#/app/tool',
				checked: false,
				icon: 'tool',
				sub: [{
					title: '自建页面',
					name: 'webpage',
					link: '#/app/tool/webpage',
					checked: false,
					icon: null,
				}, {
					title: '调查问卷',
					name: 'survey',
					link: '#/app/tool/survey',
					checked: false,
					icon: null,
				}, {
					title: 'DMP',
					name: 'dmp',
					link: '#/app/tool/dmp',
					checked: false,
					icon: null,
				}]
			}]
		};
	},
	methods: {
		isActive(routeName) {
			let route = this.$route;
			if (routeName == route.name) return true;
			let targetRoute = this.getRoute(routeName, RouterConfig);
			if (targetRoute && targetRoute.children && targetRoute.children.length > 0) {
				return this.isChildActive(targetRoute.children);
			} else {
				return false;
			}
		},
		getRoute(name, routes) {
			let targetRoute;
			for (let i = 0; i < routes.length; i++) {
				let route = routes[i];
				if (name == route.name) {
					targetRoute = route;
					break;
				} else if (route.children && route.children.length > 0) {
					targetRoute = this.getRoute(name, route.children);
					if (targetRoute) {
						break;
					}
				}
			}
			return targetRoute;
		},
		isChildActive(routes) {
			let isActive = false;
			let currentRoute = this.$route;
			for (let i = 0; i < routes.length; i++) {
				let route = routes[i];
				if (currentRoute.name == route.name) {
					isActive = true;
					break;
				} else if (route.children && route.children.length > 0) {
					isActive = this.isChildActive(route.children);
					if (isActive) {
						break;
					}
				}
			}
			return isActive;
		}
	}
};
</script>