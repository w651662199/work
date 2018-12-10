<template>
	<div class="nav">
		<div class="icon-con" @click="triggerNav">
			<img class="icon" src="../../assets/images/nav-icon.png">
			<span>导航</span>
		</div>
		<div class="nav-bar" v-show="isShowNav">
			<div class="nav-item nav-item-nav">
				<a :href="isInGome ? 'javascript:' : '/'" @click="openNewPage('')">
					<img class="icon" src="../../assets/images/topic-icon.png">
					<span>精选</span>
				</a>
			</div>
			<div class="nav-item nav-item-nav">
				<a :href="isInGome ? 'javascript:' : '/mmb'" @click="openNewPage('mmb')">
					<img class="icon" src="../../assets/images/mmb-icon.png">
					<span>美媒榜</span>
				</a>
			</div>
			<div class="nav-item nav-item-nav" v-if="!isInGome">
				<a href="/profile">
					<img class="icon" src="../../assets/images/profile-icon.png">
					<span>我的</span>
				</a>
			</div>
		</div>
	</div>
</template>
<script>
import {getAppVersion} from 'utils/common';
export default {
	name: 'nav',
	data() {
		return {
			isShowNav: false,
			appVersion: 0,
		};
	},
	computed: {
		isInGome() {
			return /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent);
		}
	},
	mounted() {
		if (this.isInGome) {
			this.appVersion = getAppVersion();
		}
		document.body.addEventListener('click', (e) => {
			let event = e || window.event;
			let ele = event.target || event.srcElement;
			while (ele) {
				if (ele.classList && ([...ele.classList].indexOf('nav') !== -1 || [...ele.classList].indexOf('nav-item-nav') !== -1)) {
					return;
				}
				ele = ele.parentNode;
			}
			this.isShowNav = false;
		});
	},
	methods: {
		triggerNav() {
			this.isShowNav = !this.isShowNav;
		},
		openNewPage(path) {
			if (!this.isInGome) return false;
			let goUrl = path == '' ? $CONFIG['mdomain'] : $CONFIG['mdomain'] + path;
			if (window.location.href == goUrl) {
				return false;
			} else {
				this.triggerNav();
				if (this.appVersion < 90) {
					AppInterface.call('/common/localJump', {url: window.btoa(goUrl)});
				} else {
					GomeJSBridge.ready(function() {
						GomeJSBridge.pushWindow(null, null, goUrl);
					});
				}
			}
		}
	}
};
</script>
<style lang="less">
.nav {
	position: fixed;
	bottom: .8rem;
	right: .3rem;
	width: .8rem;
	height: .8rem;
	background: rgba(0, 0, 0, .8);
	border-radius: 1rem;
	z-index: 100;
	box-shadow: 0 2px 3px 0;
	.icon-con {
		text-align: center;
		font-size: .16rem;
		color: #fff;
		.icon {
			display: block;
			margin: 0.16rem auto 0;
			width: .32rem;
			height: .32rem;
		}
	}
	.nav-bar {
		position: absolute;
		display: flex;
		height: .96rem;
		right: 1.2rem;
		bottom: -.08rem;
		background: #fff;
		font-size: 0;
		border-radius: 4px;
		box-shadow: -2px 4px .15rem 0 rgba(0 ,0, 0, 0.2);
		a {
			color: #666;
			outline: none;
			text-decoration: none;
		}
		.nav-item {
			display: inline-block;
			width: 1.2rem;
			font-size: .22rem;
			color: #666;
			text-align: center;
			.icon {
				display: block;
				width: .44rem;
				height: .44rem;
				margin: 0.1rem auto 0;
			}
		}
		&:after {
			display: block;
			content: " ";
			position: absolute;
			right: -.1rem;
			top: .3rem;
			width: 0;
			height: 0;
			border-style: solid;
            border-color: transparent;
			border-width: .2rem;
			border-right-width: 0;
			border-left-color: #fff;
		}
	}
}
</style>