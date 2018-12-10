<!--suppress ALL, JSAnnotator -->
<template>
	<div>
		<transition name="fade">
			<div class="common-share-tips" v-show="h5Share.show" @click="closeShare"></div>
		</transition>
		<div class="share-container" :class="{'slide-in': h5Share.show}">
			<div class="share-main">
				<span class="main-text">分享<span class="rebateBudget" id="J_rebateBudget" v-show="shareItem.rebateStatus == 1">成功得￥{{formatCurrency(shareItem.shareRebateBid)}}</span></span>
			</div>
			<div class="share-text-info rebateBudget" v-show="shareItem.rebateStatus == 1">
				<p>1.分享后，内容被打开才有机会获得返利</p>
				<p>2.一条内容每天最多可获得十次返利，一次分享每天最多可获得一次返利</p>
			</div>
			<div class="share-common" id="shareCon">
				<div class="share-item" data-type="weixin" @click="shareItemClick('weixin')">
					<img class="share-icon" src="../../assets/images/tencent_wechat.png">
					<p class="share-item-name">微信</p>
				</div>
				<div class="share-item" data-type="pengyouquan" @click="shareItemClick('pengyouquan')">
					<img class="share-icon" src="../../assets/images/tencent_wechat_friend.png">
					<p class="share-item-name">朋友圈</p>
				</div>
				<div class="share-item" data-type="qq" @click="shareItemClick('qq')">
					<img class="share-icon" src="../../assets/images/tencent_QQ.png">
					<p class="share-item-name">QQ</p>
				</div>
				<div class="share-item" data-type="qqzone" @click="shareItemClick('qqzone')">
					<img class="share-icon" src="../../assets/images/tencent_qzone.png">
					<p class="share-item-name">QQ空间</p>
				</div>
			</div>
			<div class="share-cancel" @click="closeShare">
				<p>取消</p>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store';
import actions from 'actions';
import jsonp from 'jsonp';
import http from '../../utils/http.js';
import md5 from 'md5';
import qs from 'qs';
import {getDeviceIdFromAgent, urlEncode} from '../../utils/common.js';
require('../../assets/js/appInterface.js');
export default {
	name: 'common-h5-share',
	data() {
		return {
			msg: ''
		};
	},
	computed: {
		h5Share: () => store.state.h5Share,
		shareItem: () => store.state.h5Share.shareItem,
		isGome() {
			return /gomeplus/g.test(navigator.userAgent);
		},
		isIos() {
			return /iPhone/g.test(navigator.userAgent);
		},
		isAndroid() {
			return /Android/g.test(navigator.userAgent);
		}
	},
	methods: {
		closeShare() {
			actions.setH5Share(this.$store, {
				show: false,
				isShareRebate: 0,
				slotId: 0,
				shareItem: {}
			});
		},
		formatCurrency(currency) {
			var result = parseInt(currency, 10) * 0.01;
			return result.toFixed(2);
		},
		shareItemClick(type) {
			let vm = this;
			AppInterface.call('/common/getLoginStatus', function(data) {
				if (data.success) {
					vm.doShareAction(data, type);
				} else {
					AppInterface.call('/common/logout', function(data) {
						if (data.success) {
							AppInterface.call('/common/login', function(data) {
								if (data.success) {
									vm.doShareAction(data, type);
								}
							});
						}
					});
				}
			});
		},
		doShareAction(data, type) {
			let vm = this;
			let date = new Date().getTime();
			let shareOptions = {
				title: vm.h5Share.shareItem.promotion_title,
				desc: vm.h5Share.shareItem.promotion_description,
				link: vm.h5Share.shareItem.landing_url,
				imgUrl: window.btoa(vm.h5Share.shareItem.promotion_images[0]),
				type: type
			};
			let doShareOptions = {
				relationId: data.data.userId + ',' + 0,
				slotId: vm.h5Share.shareItem.slotId,
				deviceId: getDeviceIdFromAgent(),
				shareId: md5(date + data.data.userId),
				slotType: 1,
				requestId: vm.h5Share.shareItem.requestId,
				adId: vm.h5Share.shareItem.adId,
				logParam: vm.h5Share.shareItem.logParam,
				flightJobId: vm.h5Share.shareItem.flight_job_id
			};
			let paramStr = '?' + urlEncode(doShareOptions).slice(1);
			let discoveryShareUrl = $CONFIG['discoveryShare'] + paramStr;
			jsonp(discoveryShareUrl, null, function(err, data) {});
			let landingUrlArr = shareOptions.link.split('?');
			let landingUrlParam = landingUrlArr[1].split('&');
			let sUrl = landingUrlArr[0] + '?' + landingUrlParam[0] + urlEncode(doShareOptions);
			let requestData = qs.stringify({
				url: sUrl
			});
			http({
				url: 'https://m-awall.gomeplus.com/shorturl/get',
				method: 'post',
				data: requestData
			}).then(function(res) {
				shareOptions.link = window.btoa(res.data);
				AppInterface.call('/common/share', shareOptions);
			});
		}
	}
};
</script>
<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s
}
.fade-enter, .fade-leave-to {
	opacity: 0
}
.common-share-tips{
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(0,0,0,0.6);
	z-index: 10;
}
.share-container{
	position: fixed;
	left:0;
	bottom: -100%;
	z-index:12;
	width: 100%;
	background: #ffffff;
	-webkit-transition: all .5s ease-out;
	-moz-transition: all .5s ease-out;
	transition: all .5s ease-out;
	&.slide-in{
		bottom: 0;
	}
	.share-main{
		position: relative;
		text-align: center;
		margin: 0 0.4rem;
		font-size: 0.32rem;
		&:after{
			content: "";
			display: block;
			position: absolute;
			overflow: hidden;
			left: 0;
			right: 0;
			top: 50%;
			margin-top: -1px;
			height: 1px;
			background: #b9b9b9;
		}
		.main-text{
			position: relative;
			display: inline-block;
			background: #ffffff;
			z-index: 10;
			color: #ee2f2f;
			padding: 0 0.2rem;
			margin: 0.38rem 0 0.45rem;
		}
	}
	.share-common{
		width: 100%;
		margin-bottom:0.42rem;
		&:after{
			content: " ";
			display: block;
			visibility: hidden;
			clear: both;
			height: 0;
		}
		.share-item{
			width: 25%;
			float: left;
			text-align: center
		}
	}
	.share-icon{
		width: 1rem;
		height: 1rem;
		margin: 0 auto;
	}
	.share-item-name{
		font-size:0.28rem;
		color: #424242;
	}
	.share-cancel{
		padding: 0.32rem 0;
		font-size: 0.32rem;
		color: #434343;
		text-align: center;
		border-top: 1px solid #d6d6d6
	}
	.share-text-info{
		margin-bottom: .4rem;
		p{
			color: #808080;
			padding: 0 0.3rem;
			line-height: 1.4;
			margin-bottom: 0.2rem;
			font-size: 0.28rem;
		}
	}
}
</style>
