<template>
	<div class="upvote" :class="cPraiseStatus == '1' ? 'parised' : 'normal' " @click="upvote">
		<img v-if="cPraiseStatus == '0'" src="../../assets/images/icon_like_2x_normal.png"/>
		<img v-else src="../../assets/images/icon_like_2x_press.png"/><span>{{cPariseNumber | formatCount}}</span>
	</div>
</template>

<script>
require('../../assets/js/appInterface');
import jsonp from 'jsonp';
import actions from 'actions';
import store from 'store';
import {encrypt} from '../../utils/common.js';
export default {
	name: 'upvote',
	data() {
		return {
			cPariseNumber: 0,
			cPraiseStatus: 0
		};
	},
	props: ['pariseNum', 'praiseStatus', 'requestId', 'logParam', 'flightJobId', 'id', 'slotId'],
	computed: {
		userId: () => store.state.userId
	},
	created() {
		this.cPariseNumber = this.pariseNum;
		this.cPraiseStatus = this.praiseStatus;
	},
	methods: {
		upvote() {
			let vm = this;
			if (/gomeplus/g.test(navigator.userAgent)) {
				if (vm.userId) {
					vm.doUpvote();
				} else {
					if (store.state.appVersion < 90) {
						AppInterface.call('/common/getLoginStatus', function(data) {
							if (data.success) {
								actions.setUserId(vm.$store, data.data.userId);
								vm.doUpvote();
							} else {
								AppInterface.call('/common/logout', function(data) {
									if (data.success) {
										AppInterface.call('/common/login', function(data) {
											if (data.success) {
												actions.setUserId(vm.$store, data.data.userId);
												vm.doUpvote();
											}
										});
									}
								});
							}
						});
					} else {
						GomeJSBridge.ready(function() {
							GomeJSBridge.isLogin(function(data) {
								if (data.isLogined == 'Y') {
									GomeJSBridge.getUserInfo(function(data) {
										actions.setUserId(vm.$store, data.profileId);
										vm.doUpvote();
									});
								} else {
									GomeJSBridge.login(function(data) {
										if (data.isLogined == 'Y') {
											GomeJSBridge.getUserInfo(function(data) {
												actions.setUserId(vm.$store, data.profileId);
												vm.doUpvote();
											});
										}
									}, null, {refresh: false});
								}
							}, function(data) {
								console.log('error');
							});
						});
					}
				}
			}
		},
		doUpvote() {
			if (this.cPraiseStatus != 0) {
				return;
			}
			let vm = this;
			vm.cPariseNumber = +vm.cPariseNumber + 1;
			vm.cPraiseStatus = 1;
			let encryptUrlParamP = encrypt('userId=' + vm.userId + '&adId=' + vm.id + '&requestId=' + vm.requestId + '&slotId=' + vm.slotId);
			let encryptUrlParamQ = encrypt('logParam=' + vm.logParam);
			// jsonp($CONFIG['parise'] + '?logParam=' + vm.logParam + '&userId=' + vm.userId + '&adId=' + vm.id + '&requestId=' + vm.requestId + '&slotId=' + vm.slotId, null, function(err, data) {});
			jsonp($CONFIG['parise'] + '?p=' + encryptUrlParamP + '&q=' + encryptUrlParamQ, null, function(err, data) {});
		}
	},
	watch: {
		pariseNum: function(value, oldValue) {
			this.cPariseNumber = this.pariseNum;
		},
		praiseStatus: function(value, oldValue) {
			this.cPraiseStatus = this.praiseStatus;
		}
	}
};
</script>

<style lang="less">
	.upvote{
		width:1.1rem;
		height: .4rem;
		float: right;
		line-height: .42rem;
		font-size: .22rem;
		text-align: center;
		margin-left: .18rem;
		position: relative;
		color: #666;
		img{
			width:.22rem;
			height: .22rem;
			margin-right: .06rem;
			vertical-align: middle;
		}
		span{
			vertical-align: middle;
			line-height: .44rem;
			font-size: .24rem;
		}
		&.normal:after {
		    content: '';
		    width:200%;
		    height:200%;
		    position: absolute;
		    top: 0;
		    left: 0;
		    border: 1px solid #999;
		    border-radius: 20px;
		    -webkit-transform: scale(0.5,0.5);
		    transform: scale(0.5,0.5);
		    -webkit-transform-origin: top left;
		}
		&.parised{
			color: #f20c59;
		}
		&.parised:after{
			content: '';
		    width:200%;
		    height:200%;
		    position: absolute;
		    top: 0;
		    left: 0;
		    border-radius: .4rem;
		    -webkit-transform: scale(0.5,0.5);
		    transform: scale(0.5,0.5);
		    -webkit-transform-origin: top left;
			border: 1px solid #f20c59;
		}
	}
</style>
