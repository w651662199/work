<template>
	<div class="msg-con">
		<span class="item-type">{{getType()}}</span>
		<span class="item-msg">{{item.sharePraiseNum.rebateGotUserNum ? item.sharePraiseNum.rebateGotUserNum : 0}}位用户已获得佣金</span>
		<span class="icon" @click="share"><img src="../../assets/images/common_share.png"></span>
	</div>
</template>
<script>
import Event from 'utils/event';
import actions from 'actions';
import store from 'store';
import jsonp from 'jsonp';
import http from '../../utils/http.js';
import md5 from 'md5';
import {isNewAppVersion, getDeviceIdFromAgent, urlEncode, getAppVersion, encrypt, decrypt, getKeyValueFromUrl, getHeaderA} from '../../utils/common.js';
export default {
	name: 'ACTION_BAR',
	props: ['item'],
	data() {
		return {
			cardTitle: '',
			cardDescription: '',
			cardImge: ''
		};
	},
	computed: {
		isGome() {
			return /gomeplus/ig.test(navigator.userAgent);
		},
		isMobile() {
			return /iPhone|Android|iPod|iPad/ig.test(navigator.userAgent);
		},
		userId: () => store.state.userId
	},
	methods: {
		getType() {
			if (this.item.contentObject.link_type == '44') {
				return '好物';
			} else if (this.item.contentObject.link_type == '45') {
				return '清单';
			} else if (this.item.contentObject.link_type == '46') {
				return '发现';
			} else if (this.item.contentObject.link_type == '47') {
				return '视频';
			} else if (this.item.contentObject.link_type == '48') {
				return '好店';
			} else {
				return '';
			}
		},
		share() {
			let vm = this;
			if (vm.isGome) {
				if (isNewAppVersion()) {
					jsonp($CONFIG['mdomain'] + 'api/card?adId=' + vm.item.adId, null, function(err, result) {
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
				}
			} else {
				Event.$emit('triggerCover');
				// window.location.href = this.isMobile ? $CONFIG['mmbDomain'] + '/mindex.html' : $CONFIG['mmbDomain'];
			}
		},
		doShareAction() {
			let vm = this;
			let date = new Date().getTime();
			//Android分享卡图片默认会去掉最后一个下滑线后的内容，为了保证完整性末尾添加下划线
			let shareOptions = {
				title: vm.cardTitle ? vm.cardTitle : vm.item.contentObject.promotion_title,
				desc: vm.cardDescription ? vm.cardDescription : vm.item.contentObject.promotion_description,
				link: vm.item.contentObject.landing_url,
				imgUrl: vm.cardImage ? window.btoa(vm.cardImage) : (/.jpg$|.png$/g.test(vm.item.contentObject.promotion_images[0]) ? window.btoa(vm.item.contentObject.promotion_images[0]) : window.btoa(vm.item.contentObject.promotion_images[0] + '.jpg')),
				type: 'default',
				btnType: '2,10,11,12'
			};
			shareOptions.title = shareOptions.title.replace(/[<>@# {}\[\]^`\\%~|]/g, '');
			shareOptions.desc = shareOptions.desc.replace(/[<>@# {}\[\]^`\\%~|]/g, '');

			vm.shareImpression();
			let reqData = {
				url: $CONFIG['mdomain'] + 'api/mm/gs',
				method: 'get',
				params: {
					url: vm.item.contentObject.landing_url,
					q: vm.item.q,
					p: 1
				}
			};
			if (vm.isGome) {
				reqData.headers = {
					a: getHeaderA(vm.userId)
				};
			}
			http(reqData).then(function(res) {
				if (store.state.appVersion < 90) {
					shareOptions.link = window.btoa(res.data.data.url);
					AppInterface.call('/common/share', shareOptions);
				} else {
					let param = {
						title: shareOptions.title,
						shareDesc: shareOptions.desc,
						shareImageUrl: vm.cardImage ? vm.cardImage : (/.jpg$|.png$/g.test(vm.item.promotion_images[0]) ? vm.item.promotion_images[0] : vm.item.promotion_images[0] + '.jpg'),
						shareUrl: res.data.data.url,
						channel:'link',
						platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'CopyLink']
					};
					GomeJSBridge.callShareComp(null, null, param);
				}
			});
		},
		shareImpression() {
			let reqData = {
				url: $CONFIG['mdomain'] + 'api/mm/sr',
				method: 'get',
				params: {
					q: this.item.q,
					p: 1
				}
			};
			if (this.isGome) {
				reqData.headers = {
					a: getHeaderA(this.userId)
				};
			}
			http(reqData);
		}
	}
};
</script>
<style lang="less">

</style>