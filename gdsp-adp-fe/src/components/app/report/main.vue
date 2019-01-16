<template>
	<div class="content">
		<m-nav :config="navMenu"></m-nav>
		<div class="content-main">
			<div class="content-main-data">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
import Nav from '../../common/nav.vue';
export default {
	name: 'reportMain',
	data() {
		return {
			navMenu: [{
				msg: '推广组报表',
				link: '/#/app/report/group',
				icon: '',
				checked: true,
				permission: '',
				sub: []
			}, {
				msg: '计划报表',
				link: '/#/app/report/campaign',
				icon: '',
				checked: false,
				permission: '',
				sub: []
			}, {
				msg: '单元报表',
				link: '/#/app/report/flight',
				icon: '',
				checked: false,
				permission: '',
				sub: []
			}, {
				msg: '创意报表',
				link: '/#/app/report/material',
				icon: '',
				checked: false,
				permission: '',
				sub: []
			}]
		};
	},
	components: {
		'm-nav': Nav,
	}
};
</script>
