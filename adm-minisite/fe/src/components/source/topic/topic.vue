<template>
	<div style="background: #F6F6F6;padding-bottom: 1.28rem;">
		<div class="mmb-topic-details">
			<div class="not-pass-reason" v-if="content.approveStatus==-1">
				<div class="reason-content">
					{{content.rejectReasons}}
				</div>
			</div>
			<div class="details-main">
				<div class="header">
					<div class="author">
						<div class="image">
							<img :src="content.userImage"/>
						</div>
						<div class="nickName">
							<div class="wrap">
								<h2>{{content.nickName}}</h2>
								<div class="enp" v-if="content.isVerifiedEnp == 1">
									{{content.enpName}}
								</div>
							</div>
						</div>
						<div class="date">
							{{content.publishTime}}
						</div>
					</div>
					<div class="title" v-show="!!content.title">
						{{content.title}}
					</div>
				</div>
				<div class="content">
					<div class="content-text">
						{{content.content}}
					</div>
					<div class="content-url" v-show="content.linkUrl">
						<a :href="content.linkUrl">网页链接</a>
					</div>
					<div class="content-image" v-for="item in content.contentImages">
						<img :src="item"/>
					</div>
					<div class="content-video" v-show="content.videoId">
						<div class="video-box videoContainer" :id="'videoContainer_'+content.videoId" style="width:100%;"></div>
					</div>
				</div>
				<div class="location" v-show="appVersion && content.poiName">
					<h2 class="main" @click="toMap">
						{{content.poiName}}
					</h2>
				</div>
				<div class="tag">
					{{content.tag}}
				</div>
			</div>
			<div class="bottom_tools" v-show="urlParams.s==1||urlParams.s==2||(urlParams.s==3&&urlParams.ce==1)">
				<div class="toolsItem" v-show="urlParams.s==1||urlParams.s==2" @click.prevent="share">
					<span><em class="tool_icon share">分享</em></span>
				</div>
				<div class="toolsItem" v-show="urlParams.s==3&&urlParams.ce==1" @click.prevnet="contentEdit">
					<span>编辑</span>
				</div>
			</div>
			<div class="cover-share" v-show="showCoverShare">
				<div class="share-wap-con">
					<p class="title">99.9%的人都选择先登录再分享</p>
					<div class="btn"><a class="login-link" :href="loginUrl">点我登录</a></div>
					<p class="msg" @click.prevent="showCoverShare=false;showShareGuide=true">下次再说，直接分享</p>
				</div>
			</div>
			<div class="share-guide" v-show="showShareGuide" @click.prevent="showShareGuide=false">
				<img class="guide-top" src="https://m-discovery.gome.com.cn/resource/images/guide_top.png">
				<img class="guide-bottom" src="https://m-discovery.gome.com.cn/resource/images/guide_bottom.png">
			</div>
			<div class="cover-common" v-show="showCoverCommon">
				<div class="share-wap-con">
					<p class="title first share">在美媒榜APP内<span class="cover-text">发起分享</span>可获得返利哦~快去下载APP吧</p>
					<div class="btn">
						<a class="cancel" href="javascript:" @click.prevent="showCoverCommon=false">取消</a>
						<a class="down-load-link down-link" :href="isWeiXin?appUrl:mmbUrl">去下载</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'utils/http';
import {getKeyValueFromUrl} from 'utils/common';
require('../../../assets/js/dsbridge.js');
export default {
	name: 'topicMain',
	data() {
		return {
			content: {},
			userId: '',
			showCoverShare: false,
			showShareGuide: false,
			showCoverCommon: false,
			appUrl: 'http://sj.qq.com/myapp/detail.htm?apkName=com.gome.mx.MMBoard',
			mmbUrl: 'http://meimeibang.gome.com.cn/mindex.html',
			weixinSDKUrl: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
			openId: '',
			weixinShareUrl: '',
		};
	},
	computed: {
		shareOptions() {
			let shareOptions = { 
				title: this.content.title ? this.content.title.replace(/[<>@# {}\[\]^`\\%~|]/g, '') : (this.content.content ? this.content.content.substr(0, 20).replace(/[<>@# {}\[\]^`\\%~|]/g, '') : '来自美媒榜的分享'),
				desc: !this.content.title ? '' : (this.content.content ? this.content.content.substr(0, 20) : ''),
				imgUrl: this.content.image ? window.btoa(this.content.image) : window.btoa("https://gfs12.gomein.net.cn/T1ghWbBTYv1RCvBVdK.jpg"),
				link: '',
				type: 'default',
				btnType: '2,10,11,12'
			};
			return shareOptions;
		},
		loginUrl() {
			return 'https://login.m.gome.com.cn/login.html?return_url=' + window.btoa(window.location.href);
		},
		contentId() {
			let subReg = /content[^\/|\.]*\/([^\/|\.]+)/;
			return window.location.href.match(subReg)[1];
		},
		urlParams() {
			return getKeyValueFromUrl(window.location.href);
		},
		isAndroid() {
			return /Android/ig.test(navigator.userAgent);
		},
		isIos() {
			return /iPhone/ig.test(navigator.userAgent);
		},
		isMMBoard() {
			return /GomeMMBoard/ig.test(navigator.userAgent);
		},
		isWeiXin() {
			return /MicroMessenger/ig.test(navigator.userAgent);
		},
		appVersion() {
			let subReg = /GomeMMBoard\/([\d|\.]+)\//;
			let currentVersion = navigator.userAgent.match(subReg)[1];
			return this.toNum(currentVersion) >= this.toNum('2.3.0');
		},
	},
	components: {
		
	},
	created() {
		this.getContent();
		this.impression();
		this.getUserId();
	},
	methods: {
		toNum(a) {
		    var a = a.toString();
		    var c = a.split(/\./);
		    var num_place = ['', '0', '00', '000', '0000'];
		    var r = num_place.reverse();
		    for (var i = 0; i < c.length; i++) { 
		        var len = c[i].length;       
		        c[i] = r[len] + c[i];  
		    };
		    var res = c.join(''); 
		    return res; 
		},
		toMap() {
			let paramData = {
				latitude: this.content.latitude,
				longitude: this.content.longitude,
				locName: this.content.poiName,
				city: this.content.city
			};
			dsBridge.call('jump2MapNav', paramData);
		},
		contentEdit() {
			dsBridge.call('jump2ContentEdit', this.contentId);
		},
		share() {
			if (this.isMMBoard) {
				this.shareInMMBoard();
			} else {
				this.shareInWarp();
			}
		},
		shareInMMBoard() {
			var paramData = {
				shareUrl: window.location.href.split('?')[0],
				s: this.urlParams['s'],
				ce: this.urlParams['ce'],
				p: this.urlParams['p'],
				q: this.urlParams['q'],
				title: this.shareOptions.title,
				desc: this.shareOptions.desc,
				imageUrl: 'https://gfs12.gomein.net.cn/T1ghWbBTYv1RCvBVdK.jpg',
				type: 2,
			};
			dsBridge.call('openShare', paramData);
		},
		shareInWarp() {
			if (this.isWeiXin) {
				if (!this.userId) {
					this.showCoverShare = true;
				} else {
					this.showShareGuide = true;
				}
			} else {
				this.showCoverCommon = true;
			}
		},
		getContent() {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/content', {
				params: {
					id: this.contentId,
					requestType: 2,
				}
			}).then(res => {
				if (res.data.code == 200) {
					this.content = res.data.data;
					if (this.isWeiXin) {
						this.weixin();
					}
					if (this.content.videoId) {
						this.videoInit();
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		videoInit() {
			let v = new MeixinPlayer();
			let config = {
				autoplay: 0,
				autoSize: 1,
				env: 'pre',
				poster: this.content.videoCover,
			};
			v.init(this.content.videoId, 'videoContainer_' + this.content.videoId, config);
		},
		impression() {
			Http.get($CONFIG['impression'], {
				params: {
					operationType: 12,
					targetId: this.contentId,
					source: this.isAndroid ? 1 : (this.isIos ? 2 : 4),
					timestamp: new Date().getTime()
				}
			}).then(() => {});
		},
		getUserId() {
			if (this.isMMBoard) {
				this.userId = dsBridge.call('getUID');
			} else {
				this.getWapUserId();
			}
		},
		getWapUserId() {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/userId').then((res) => {
				if (res.data.code == 200) {
					this.userId = res.data.data['userId'];
				}
			}).catch(err => {
				console.log(err);
			});
		},
		weixin() {
			let script = document.createElement('script');
			let parentNode = document.getElementsByTagName('head')[0] || document.body;
			script.async = true;
			script.src = this.weixinSDKUrl;
			script.onload = this.getWeixinConfigInfor;
			parentNode.appendChild(script);
		},
		getWeixinConfigInfor() {
			let data = {
				shareUrl: encodeURIComponent(window.location.href.split('#')[0])
			};
			Http.get($CONFIG['mmBoardDomain'] + '/api/weixin', {
				params: data
			}).then(result => {
				let data = result['data']['data'];
				this.openId = data['openId'] ? data['openId'] : '';
				var ajaxParams = {
					url: window.location.href.split('?')[0],
					o: this.openId,
					s: this.urlParams['s'],
					ce: this.urlParams['ce'],
					ot: 0,
					p: 2
				};
				this.getShareUrl(ajaxParams, null, data);
			}).catch(err => {
				console.log(err);
			});
		},
		getShareUrl(params, appShareOptions, wxConfig) {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/gs', {
				params: params
			})
			.then((res) => {
				if (this.isWeiXin) {
					this.weixinShareUrl = res.data.url;
					this.initWeixin(wxConfig);
				}
			});
		},
		initWeixin(result) {
			wx.config({
				debug: false,
				appId: result['wx_appid'],
				timestamp: result['wx_timestamp'],
				nonceStr: result['wx_noncestr'],
				signature: result['wx_signature'],
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareQZone'
				]
			});
			let that = this;
			wx.ready(function() {
				wx.onMenuShareTimeline({
					title: that.shareOptions.title,
					link: that.weixinShareUrl,
					imgUrl: window.atob(that.shareOptions.imgUrl),
					success: function() {
						var ajaxParams = {
							s: that.urlParams['s'],
							ce: that.urlParams['ce'],
							o: that.openId,
							ot: 0,
							p: 2
						};
						that.noticeShare(ajaxParams);
					}
				});
				wx.onMenuShareAppMessage({
					title: that.shareOptions.title,
					desc: that.shareOptions.desc,
					link: that.weixinShareUrl,
					imgUrl: window.atob(that.shareOptions.imgUrl),
					success: function() {
						var ajaxParams = {
							s: that.urlParams['s'],
							ce: that.urlParams['ce'],
							o: that.openId,
							ot: 0,
							p: 2
						};
						that.noticeShare(ajaxParams);
					}
				});
				wx.onMenuShareQQ({
					title: that.shareOptions.title,
					desc: that.shareOptions.desc,
					link: that.weixinShareUrl,
					imgUrl: window.atob(that.shareOptions.imgUrl),
				});
				wx.onMenuShareQZone({
					title: that.shareOptions.title,
					desc: that.shareOptions.desc,
					link: that.weixinShareUrl,
					imgUrl: window.atob(that.shareOptions.imgUrl),
				});
			});
		},
		noticeShare(params) {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/sr', {
				params: params
			}).then(() => {});
		}
	},
	watch: {
		showCoverShare: function(val, oldVal) {
			document.body.style.overflow = val ? 'hidden' : 'auto';
		},
		showShareGuide: function(val, oldVal) {
			document.body.style.overflow = val ? 'hidden' : 'auto';
		},
		showCoverCommon: function(val, oldVal) {
			document.body.style.overflow = val ? 'hidden' : 'auto';
		},
	}
};
</script>
<style lang="less">
@import './topic.less';
</style>