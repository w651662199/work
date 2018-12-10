<template>
	<div class="amp-header">
		<div class="header-logo">
			<div class="logo">
				<img src="../../assets/img/logo.png">广告开放平台</div>
		</div>
		<div class="header-login">
			<a href="javascript:void(0)" title="" class="login-after">
				<router-link :to="{name: 'message'}"><span :class="{'dot-badge': userInfo.unReadCount > 0}"><em class="icon head-msg"></em></span></router-link>
				<el-dropdown @command="handleCommand">
					<span class="el-dropdown-link">
						<span class="after-face">
							<img :src="userInfo.avatar !== '' ? userInfo.avatar : avatar" width="30" height="30" alt="">
						</span>
						<span class="after-username">{{userInfo.loginName}}</span>
						<em class="icon icon-arrow"></em>
					</span>
					<el-dropdown-menu slot="dropdown" style="width: 160px;">
						<el-dropdown-item><router-link :to="{name: 'contact'}" tag="span">联系方式</router-link></el-dropdown-item>
						<el-dropdown-item command="logout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</a>
		</div>
	</div>
</template>
<script>
import Http from 'http';
import store from 'store';
import actions from 'actions';

export default {
	name: 'head',
	data() {
		return {
			avatar: require('../../assets/img/user-face.png'),
		};
	},
	computed: {
		userInfo: () => store.state.userInfo
	},
	methods: {
		handleCommand(command) {
			if (command == 'logout') {
				this.logout();
			}
		},
		logout() {
			// 登出
			Http.post('api/logout').then((res) => {
				if (!res.data.iserror) {
					// 跳转到登陆页
					actions.setUserInfo(this.$store, {});
					window.location.href = '';
				}
			});
		}
	}
};
</script>
