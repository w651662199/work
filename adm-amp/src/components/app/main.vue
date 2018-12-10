<template>
	<div>
		<m-head></m-head>
		<div class="amp-content">
			<sub-menu v-show="isShowSubMenu"></sub-menu>
			<div class="content-main">
				<router-view></router-view>
				<div class="common-footer" :class="{'pos-center': !isShowSubMenu}">
					<p>
						<a href="">关于国美营销平台</a>
						<router-link :to="{name: 'platform'}" target="_blank">服务协议</router-link>
						<router-link :to="{name: 'standard'}" target="_blank">广告审核规范</router-link>
						<a href="introduce.html">平台介绍</a>
						<a href="study.html">学习中心</a>
						<a href="faq.html">常见问题</a>
					</p>
					<p>
						Copyright &copy; 2012-2018 GOME. All Rights Reserved.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Head from '../common/head.vue';
import SubMenu from '../common/subMenu.vue';
export default {
	name: 'AppMain',
	components: {
		'm-head': Head,
		SubMenu
	},
	computed: {
		isShowSubMenu() {
			let isShowSubMenu = true;
			let route = this.$route;
			if (route.meta.hasOwnProperty('isShowSubMenu')) {
				isShowSubMenu = route.meta.isShowSubMenu;
			}
			return isShowSubMenu;
		}
	}
};
</script>
