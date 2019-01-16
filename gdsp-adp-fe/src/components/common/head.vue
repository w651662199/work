<template>
	<div class="header">
		<div class="header-logo"><router-link to="/app">gomeplus</router-link></div>
		<div class="header-nav">
			<ul>
				<li class="header-nav-item" :class="{'actived': /^\/app\/index\/|^\/app\/index$/.test($route.path)}">
					<a href="/#/app/index">首页</a>
				</li>
				<li class="header-nav-item" :class="{'actived': /^\/app\/put\/|^\/app\/put$/.test($route.path)}">
					<a href="/#/app/put" @click="navClick('/#/app/put/group', $event)">推广管理</a>
				</li>
				<li class="header-nav-item" :class="{'actived': /^\/app\/report\/|^\/app\/report$/.test($route.path)}">
					<a href="/#/app/report" @click="navClick('/#/app/report/group', $event)">数据报告</a>
				</li>
				<li class="header-nav-item" :class="{'actived': /^\/app\/tool\/|^\/app\/tool$/.test($route.path)}">
					<a href="/#/app/tool">工具</a>
				</li>
			</ul>
		</div>
		<div @click="controlLogoutStatus()" class="header-login">
			<a href="javascript:void(0)" title="" class="login-after">
				<span class="after-face">
					<!-- <img src="../../assets/img/user-avator.png" style="width:100%;"> -->
					<img :src="!!accountInfo.avatar ? accountInfo.avatar : avatar" style="width: 100%;">
				</span>
				<span class="after-username">{{accountInfo.loginName}}</span>
				<em class="icon icon-arrow"></em>
			</a>
			<div v-show="logoutStatus" class="tooltip tooltip-orange arrow arrow-t-orange">
				<ul>
					<li @click="logout()"><a href="javascript:void(0)" title="" class="text-align-center">退出</a></li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'http';
import {mixin} from 'utils/common.js';
export default {
	name: 'head',
	data() {
		return {
			logoutStatus: false,
			accountInfo: {
				loginName: '',
				avatar: ''
			},
			avatar: require('../../assets/img/user-avator.png')
		};
	},
	mounted() {
		document.body.addEventListener('click', (e) => {
			let event = e || window.event;
			let ele = event.target || event.srcElement;
			while (ele) {
				if (ele.classList && [...ele.classList].indexOf('header-login') !== -1) {
					return;
				}
				ele = ele.parentNode;
			}
			this.logoutStatus = false;
		});
	},
	created() {
		this.getUserInfo();
	},
	methods: {
		navClick(route, e) {
			let currentPath = route.replace('/#', '');
			if (currentPath == this.$route.path) {
				e.preventDefault();
				return false;
			}
		},
		controlLogoutStatus() {
			this.logoutStatus = !this.logoutStatus;
		},
		getUserInfo() {
			Http.get('/api/user').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.accountInfo = mixin(this.accountInfo, res.data.data);
				}
			}).catch(err => {
				console.log(err);
			});
		},
		logout() {
			// 登出
			Http.post('logout')
				.then((res) => {
					if (!res.data.iserror) {
						// 跳转到登陆页
						window.location.href = '/login';
					}
				});
		}
	}
};
</script>
