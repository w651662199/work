<template>
	<div class="amp-content">
		<m-nav :config="navMenu"></m-nav>
		<div class="content-main">
			<div class="amp-account" :class="{'amp-unit': /unit/.test($route.path), 'amp-originality': /idea/.test($route.path)}">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
import Nav from '../../../common/nav.vue';
export default {
	name: 'app-page-main',
	data() {
		return {
			navMenu: [{
				msg: '自建页面',
				link: '/#/app/tools/webpage',
				icon: 'icon-account',
				checked: true,
				sub: []
			},{
				msg: '调查问卷',
				link: '/#/app/tools/survey',
				icon: 'icon-survey',
				checked: false,
				sub: []
			},{
				msg: 'DMP',
				link: 'javascript:void(0)',
				icon: 'icon-DMP',
				checked: false,
				sub: [{
					msg: '标签管理',
					link: '/#/app/tools/tag'
				}, {
					msg: '人群管理',
					link: '/#/app/tools/crowd'
				}]
			}]
		};
	},
	components: {
		'm-nav': Nav
	},
	created(){
	    this.navMenu.map((item) => {
			item.checked = item.link.substring(2, item.link.length) == this.$route.path;
		})
	}
};
</script>
