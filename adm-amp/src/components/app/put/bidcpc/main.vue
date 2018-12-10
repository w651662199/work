<template>
    <div class="amp-content">
	    <div class="content-main">
	    	<div class="amp-account" :class="{'amp-unit': /unit/.test($route.path), 'amp-originality': /idea/.test($route.path)}">
				<router-view></router-view>
				<m-drawer></m-drawer>
			</div>
	    </div>
    </div>
</template>
<script>
import Drawer from './drawer.vue';
import Nav from '../../../common/nav.vue';
export default {
	name: 'app-plan-bidcpc-main',
	data() {
		return {
			navMenu: [{
				msg: '概览',
				link: '/#/app/bidcpc/index',
				icon: 'icon-preview',
				checked: true,
				sub: []
			}, {
				msg: '投放管理',
				link: '/#/app/bidcpc/plan',
				icon: 'icon-account',
				checked: false,
				sub: []
			}, {
				msg: '数据报表',
				link: '/#/app/bidcpc/report/plan/campaign',
				icon: 'icon-balance',
				checked: false,
				sub: []
			}]
		};
	},
	components: {
		'm-nav': Nav,
		'm-drawer': Drawer
	},
	created(){
		this.navMenu.map((item) => {
			item.checked = item.link.substring(2, item.link.length) == this.$route.path;
		})
	}
};
</script>
