<template>
	<div class="error-main">
		<div class="amp-header">
			<div class="header-logo"><router-link to="/app">gomeplus</router-link></div>
			<div @click="controlLogoutStatus()" class="header-login">
	        	<a href="javascript:void(0)" title="" class="login-after">
	        		<span class="after-face">
	        			<img :src="userInfo.avatar !== '' ? userInfo.avatar : avatar" width="30" height="30" alt="">
	        		</span>
	        		<span class="after-username">{{userInfo.loginName}}</span>
	        		<em class="icon icon-arrow"></em>
	        	</a>
	            <div v-show="logoutStatus" class="dialog dialog-black arrow arrow-black">
	                <ul>
	                    <li @click="logout()"><a href="javascript:void(0)" title="" style="text-align: center;">退出</a></li>
	                </ul>
	            </div>
	        </div>
		</div>
		<div class="error-body">
			<div class="body-scaffold error-testing"></div>
		</div>
		<div class="error-footer">
			<p class="error-title">商业内测已结束，系统调整中……</p>
			<p class="error-detail">有任何疑问请联系国美广告平台部：E-mail地址ad-service@gomeplus.com</p>
			<p class="error-detail">商业内测交流QQ群号：627727624</p>
		</div>
	</div>
</template>
<script>
import store from 'store';
import actions from 'actions';
import Http from 'http';
import router from '../../route.js';
import Head from '../common/head.vue';

export default {
	name:'test',
	components: {
		'm-head': Head
	},
	data() {
		return {
			logoutStatus: false,
			avatar:require('../../assets/img/user-face.png')
		};
	},
	computed: {
		userInfo: () => store.state.userInfo
	},
	mounted() {
		document.body.addEventListener('click', (e) => {
			let event = e || window.event;
			let ele = event.target || event.srcElement;
			while (ele) {
				if (ele.classList && ([...ele.classList].indexOf('header-login') !== -1 || [...ele.classList].indexOf('head-nav-item') !== -1)) {
					return;
				}
				ele = ele.parentNode;
			}
			this.logoutStatus = false;
		});
	},
	methods: {
		controlLogoutStatus() {
			this.logoutStatus = !this.logoutStatus;
		},
		logout() {
			// 登出
			Http.post('api/logout')
				.then((res) => {
					if (!res.data.iserror) {
						// 跳转到登陆页
						actions.setUserInfo(this.$store, {});
						/*router.push({
							name: 'login'
						});*/
						window.location.href = '/api/index'
					}
				});
		}
	}
};
</script>
<style scoped>
.error-main .body-scaffold{
	width: 230px;
	height: 240px;
	margin-top: 80px;
}
.amp-header{
	height: 60px;
}
</style>
