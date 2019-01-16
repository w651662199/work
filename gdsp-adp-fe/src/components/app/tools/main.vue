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
	name: 'PutMain',
	data() {
		return {
			navMenu: [{
				msg: '人群管理',
				link: '/#/app/tool/crowd',
				icon: '',
				permission: '',
				checked: true,
				sub: []
			}, {
				msg: '标签管理',
				link: '/#/app/tool/tag',
				icon: '',
				permission: '',
				checked: false,
				sub: []
			}]
		};
	},
	components: {
		'm-nav': Nav
	}
};
</script>