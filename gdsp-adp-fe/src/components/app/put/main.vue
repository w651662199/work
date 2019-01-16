<template>
	<div class="content">
		<m-nav :config="navMenu"></m-nav>
		<div class="content-main">
			<div class="content-main-data">
				<router-view></router-view>
				<put-drawer></put-drawer>
			</div>
		</div>
	</div>
</template>
<script>
import Nav from '../../common/nav.vue';
import PutDrawer from './putDrawer.vue';
export default {
	name: 'PutMain',
	data() {
		return {
			navMenu: [{
				msg: '推广组',
				link: '/#/app/put/group',
				icon: '',
				permission: '',
				checked: true,
				sub: []
			}, {
				msg: '推广计划',
				link: '/#/app/put/campaign',
				icon: '',
				permission: '',
				checked: false,
				sub: []
			}, {
				msg: '创意',
				link: '/#/app/put/material',
				icon: '',
				permission: '',
				checked: false,
				sub: []
			}]
		};
	},
	components: {
		'm-nav': Nav,
		PutDrawer
	}
};
</script>