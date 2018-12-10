<template>
	<div class="profile-con">
		<active-bar v-if="false"></active-bar>
		<div class="user-bar">
			<div class="user-info">
				<img class="user-avator" :src="userInfo.imagePath">
				<span class="user-login" v-if="!userInfo.userId"><a :href="loginUrl">立即登录</a></span>
			</div>
			<div class="msg-con" v-if="userInfo.userId">
				<div class="user-msg" @click="showCover('消息详情')">
					<p>消息<span>{{userInfo.msgCount}}></span></p>
				</div>
				<div class="user-rebate" @click="showCover('返利金额详情')">
					<p>返利金额<span>{{userInfo.amount}}></span></p>
				</div>
			</div>
		</div>
		<div class="rebate-rank">
			<p class="title"><span>财富英雄榜</span></p>
			<p class="msg">今日累计返利最多的用户</p>
			<div class="rank-list">
				<div class="rank-item" v-for="(rank, index) in rankRebates" :key="index">
					<div class="left">
						<span class="item-index">
							<template v-if="index < 3">
								<img v-if="index == 0" src="../../../assets/images/rank_1.png">
								<img v-if="index == 1" src="../../../assets/images/rank_2.png">
								<img v-if="index == 2" src="../../../assets/images/rank_3.png">
							</template>
							<template v-else>
								{{index + 1}}
							</template>
						</span>
						// <span class="item-name">{{rank.name}}</span>
					</div>
					<div class="right">
						<span class="rebate-count">{{rank.amount}}</span><span class="rebate-name">国美币</span>
					</div>
				</div>
			</div>
		</div>
		<m-nav></m-nav>
		<div class="cover-share" v-if="isShowCover">
			<div class="share-wap-con">
				<p class="title first">{{coverText}}在美媒榜APP内才能查看哦~快去下载APP吧</p>
				<div class="btn">
					<a class="cancel" href="javascript:" @click.prevent="isShowCover = false">取消</a>
					<a class="login-link" href="http://meimeibang.gome.com.cn/mindex.html">去下载</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'utils/http';
import ActiveBar from '../../common/activeBar.vue';
import Nav from '../../common/nav.vue';
export default {
	name: 'mmbProfile',
	data() {
		return {
			isShowCover: false,
			coverText: '',
			userInfo: {
				userId: '',
				amount: '',
				msgCount: 0,
				avator: '',
				imagePath: '/resource/images/user_avator.png'
			},
			rankRebates: [],
		};
	},
	computed: {
		loginUrl() {
			let baseUrl = window.btoa(window.location.href);
			return 'https://login.m.gome.com.cn/login.html?return_url=' + baseUrl;
		},
		isMobile() {
			return /iPhone|Android|iPod|iPad/ig.test(navigator.userAgent);
		},
		downUrl() {
			return this.isMobile ? $CONFIG['mmbDomain'] + '/mindex.html' : $CONFIG['mmbDomain'];
		}
	},
	components: {
		'm-nav': Nav,
		ActiveBar
	},
	created() {
		this.getWapUserId();
		this.getRebateRankList();
	},
	methods: {
		showCover(text) {
			this.coverText = text;
			this.isShowCover = true;
		},
		getWapUserId() {
			Http.get($CONFIG['mdomain'] + 'api/mm/userId').then(res => {
				if (res.data.code == 200 && res.data.data.userId) {
					this.userInfo.userId = res.data.data.userId;
					this.getUserInfo();
					this.getGMCoin();
					this.getMsgCount();
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getUserInfo() {
			Http.get($CONFIG['mdomain'] + 'api/mm/userInfo').then(res => {
				if (res.data.code == 200) {
					this.userInfo.imagePath = res.data.data.imagePath;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getRebateRankList() {
			Http.get($CONFIG['mdomain'] + 'api/mm/rank/rebate').then(res => {
				if (res.data.code == 200) {
					this.rankRebates = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getGMCoin() {
			Http.get($CONFIG['mdomain'] + 'api/mm/account').then(res => {
				if (res.data.code == 200) {
					this.userInfo.amount = res.data.data.resultY;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getMsgCount() {
			Http.get($CONFIG['mdomain'] + 'api/mm/messageCount').then(res => {
				if (res.data.code == 200) {
					this.userInfo.msgCount = res.data.data.result;
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}
};
</script>
<style lang="less">
@import './profile.less';
</style>