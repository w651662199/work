<template>
	<div class="share" @click="share">
		<img src="../../assets/images/icon_share_2x_normal.png"/><span>{{item.shareNum | formatCount}}</span>
	</div>
</template>

<script>
import actions from 'actions';
import store from 'store';
import jsonp from 'jsonp';
import http from '../../utils/http.js';
import md5 from 'md5';
import {isNewAppVersion, getDeviceIdFromAgent, urlEncode, getAppVersion, encrypt} from '../../utils/common.js';
require('../../assets/js/appInterface.js');
export default {
	name: 'share',
	props: ['slotId', 'item'],
	data() {
		return {
			cardTitle: '',
			cardDescription: '',
			cardImge: ''
		};
	},
	computed: {
		isGome() {
			return /gomeplus/g.test(navigator.userAgent);
		},
		isIos() {
			return /iPhone/g.test(navigator.userAgent);
		},
		isAndroid() {
			return /Android/g.test(navigator.userAgent);
		},
		userId: () => store.state.userId
	},
	methods: {
		share() {
			var vm = this;
			if (/gomeplus/g.test(navigator.userAgent)) {
				if (isNewAppVersion()) {
					jsonp('/api/card?adId=' + vm.item.adId, null, function(err, result) {
						if (err == null && result.msg == 'success') {
							vm.cardTitle = result.data.cardTitle;
							vm.cardDescription = result.data.cardDescription;
							vm.cardImage = result.data.cardImage;
						}
						if (vm.userId) {
							vm.doShareAction();
						} else {
							if (store.state.appVersion < 90) {//旧版JSBridge
								AppInterface.call('/common/getLoginStatus', function(data) {
									if (data.success) {
										actions.setUserId(vm.$store, data.data.userId);
										vm.doShareAction();
									} else {
										AppInterface.call('/common/logout', function(data) {
											if (data.success) {
												AppInterface.call('/common/login', function(data) {
													if (data.success) {
														actions.setUserId(vm.$store, data.data.userId);
														vm.doShareAction();
													}
												});
											}
										});
									}
								});
							} else {//新JSBridge
								GomeJSBridge.ready(function() {
									GomeJSBridge.isLogin(function(data) {
										if (data.isLogined == 'Y') {
											GomeJSBridge.getUserInfo(function(data) {
												actions.setUserId(vm.$store, data.profileId);
												vm.doShareAction();
											});
										} else {
											GomeJSBridge.login(function(data) {
												if (data.isLogined == 'Y') {
													GomeJSBridge.getUserInfo(function(data) {
														actions.setUserId(vm.$store, data.profileId);
														vm.doShareAction();
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
					});
				} else {
					actions.setH5Share(vm.$store, {
						show: true,
						slotId: vm.slotId,
						isShareRebate: 0,
						shareItem: vm.item
					});
				}
			}else{
				if (/MicroMessenger/g.test(navigator.userAgent) || /QQ/g.test(navigator.userAgent) || /Weibo/g.test(navigator.userAgent)) {
					//commonShare.showWrapShareMessage('请点击右上角使用自带分享功能分享');
				} else {
					//commonShare.showWrapShareMessage('请用浏览器自带分享功能分享');
				}
			}
		},
		doShareAction() {
			let vm = this;
			let date = new Date().getTime();
			//Android分享卡图片默认会去掉最后一个下滑线后的内容，为了保证完整性末尾添加下划线
			let shareOptions = {
				title: vm.cardTitle ? vm.cardTitle : vm.item.promotion_title,
				desc: vm.cardDescription ? vm.cardDescription : vm.item.promotion_description,
				link: vm.item.landing_url,
				imgUrl: vm.cardImage ? window.btoa(vm.cardImage) : (/.jpg$|.png$/g.test(vm.item.promotion_images[0]) ? window.btoa(vm.item.promotion_images[0]) : window.btoa(vm.item.promotion_images[0] + '.jpg')),
				type: 'default',
				btnType: '2,10,11,12'
			};
			shareOptions.title = shareOptions.title.replace(/[<>@# {}\[\]^`\\%~|]/g, '');
			shareOptions.desc = shareOptions.desc.replace(/[<>@# {}\[\]^`\\%~|]/g, '');
			let doShareOptions = {
				relationId: vm.userId + ',' + 0,
				slotId: vm.slotId,
				deviceId: getDeviceIdFromAgent(),
				shareId: md5(date + vm.userId),
				shareTime: date,
				slotType: 1,
				requestId: vm.item.requestId,
				adId: vm.item.adId,
				flightJobId: vm.item.flight_job_id,
				uniqueId: vm.userId + '_' + vm.item.adId + '_' + date
			};
			let logparams = {logParam: vm.item.logParam};
			let encryptUrlParamP = encrypt(urlEncode(doShareOptions).slice(1));
			let encryptUrlParamQ = encrypt(urlEncode(logparams).slice(1));
			// let paramStr = '?' + urlEncode(doShareOptions).slice(1);
			let paramStr = '?p=' + encryptUrlParamP + '&q=' + encryptUrlParamQ;
			let discoveryShareUrl = $CONFIG['discoveryShare'] + paramStr;
			jsonp(discoveryShareUrl, null, function(err, data) {});
			let landingUrlArr = shareOptions.link.split('?');
			let sUrl = landingUrlArr[0] + paramStr;
			http({
				url: 'https://goawall.gome.com.cn/short/get',
				method: 'post',
				data: sUrl
			}).then(function(res) {
				if (store.state.appVersion < 90) {
					shareOptions.link = window.btoa(res.data);
					AppInterface.call('/common/share', shareOptions);
				} else {
					let param = {
						title: shareOptions.title,
						shareDesc: shareOptions.desc,
						shareImageUrl: vm.cardImage ? vm.cardImage : (/.jpg$|.png$/g.test(vm.item.promotion_images[0]) ? vm.item.promotion_images[0] : vm.item.promotion_images[0] + '.jpg'),
						shareUrl: res.data,
						channel:'link',
						platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'CopyLink']
					};
					GomeJSBridge.callShareComp(null, null, param);
				}
			});
		}
	}
};
</script>

<style lang="less">
	.share{
		width:1.1rem;
		height: .4rem;
		line-height: .43rem;
		float: right;
		font-size: .22rem;
		text-align: center;
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
	}
	.share::after {
		content: '';
		width:200%;
		height:200%;
		position: absolute;
		top: 0;
		left: 0;
		border: 1px solid #999;
		border-radius: .4rem;
		-webkit-transform: scale(0.5,0.5);
		transform: scale(0.5,0.5);
		-webkit-transform-origin: top left;
	}
</style>
