<template>
	<div class="scrollload-container inventory_list" :class="{'error': isError}">
		<div class="index-page scrollload-content">
			<div class="nav-bar bg-white" v-if="!isInGome">
				<div class="nav-item nav-left"><span class="co-primary" v-show="userAmount > 0">已赚{{userAmount}}</span></div>
				<div class="nav-item nav-title"><span class="co-main">精选</span></div>
				<div class="nav-item nav-right"><a href="https://mevent.meixincdn.com/mm/rebate-rule.html" target="_blank" @click="openRebateRule"><span class="co-grey">赚钱规则</span></a></div>
			</div>
			<div class="active-bar" v-if="false">
				<img src="https://gfs13.gomein.net.cn/T1.gJgBCCT1RCvBVdK.jpg">
			</div>
			<div class="swiper" v-if="!isError">
				<div class="msg-bar" v-if="!isInGome && scrollMsg">
					<span>{{scrollMsg}}</span>
				</div>
				<div class="swiper-con" v-if="topSwipeList.length > 0">
					<swiper :options="swiperOption"  ref="topSwiper">
						<swiper-slide v-for='ad in topSwipeList' :key="ad.adId">
							<a :href="ad.clickUrl" @click="topClick(ad, $event)">
								<img class=" lazy-image" v-lazy="ad.resourceUrl">
							</a>
						</swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
					</swiper>
				</div>
				<div class="open-bar" v-if="false">
					<span>在App内打开</span>
				</div>
			</div>
			<div class="list-con" :class="{'not-top': topSwipeList.length == 0}">
				<template v-for="item in dataList">
					<topic-item
						v-if="item.contentObject.link_type == '46'"
						:item="item"
						:key="item.adId"
						:click-impression="itemClick">
					</topic-item>
					<shop-item
						v-if="item.contentObject.link_type == '48'"
						:item="item"
						:key="item.adId"
						:click-impression="itemClick">
					</shop-item>
					<item-item
						v-if="item.contentObject.link_type == '45'"
						:item="item"
						:key="item.adId"
						:click-impression="itemClick">
					</item-item>
					<video-item
						v-if="item.contentObject.link_type == '47'"
						:item="item"
						:key="item.adId"
						:click-impression="itemClick">
					</video-item>
					<product-item
						v-if="item.contentObject.link_type == '44'"
						:item="item"
						:key="item.adId"
						:click-impression="itemClick">
					</product-item>
				</template>
			</div>
		</div>
		<m-nav></m-nav>
		<div class="err-con" v-if="isError">
			<div class="err-icon"></div>
			<p class="err-msg">加载失败</p>
			<div class="err-load" @click="reLoad">重新加载</div>
		</div>
		<div class="cover-share" v-if="isShowCover">
			<div class="share-wap-con">
				<p class="title first">在美媒榜APP内分享可获得返利哦~</p>
				<p class="title">赶快去下载吧~</p>
				<div class="btn">
					<a class="cancel" href="javascript:" @click.prevent="isShowCover = false">取消</a>
					<a class="login-link" :href="downLink">去下载</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Event from 'utils/event';
import actions from 'actions';
import store from 'store';
import Http from 'utils/http';
import jsonp from 'jsonp';
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import ShopItem from './shopItem.vue';
import TopicItem from './topicItem.vue';
import ItemItem from './itemItem.vue';
import VideoItem from './videoItem.vue';
import ProductItem from './productItem.vue';
import {getAppVersion, setStyles, getRandomInt, getHeaderA} from 'utils/common';
import Scrollload from 'scrollload';
import {traditionalMovingHtml, traditionalLoadingHtml, noMoreDataHtml} from 'utils/initScrollload';
import Nav from '../common/nav.vue';
import UserData from 'utils/userData.js';
export default {
	name: 'main',
	data() {
		return {
			isError: false,
			isShowCover: false,
			topSwipeList: [],
			dataList: [],
			cScrollload: {},
			loading: false,
			ids: [],
			pageSize: 20,
			swiperOption: {
				notNextTick: true,
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				autoplay: 3000,
				noSwiping: false,
				freeMode: false,
				loop: false,
				onSlideChangeEnd: swiper => {
					// console.log(swiper.realIndex);
					this.doTopListImpression(swiper.realIndex);
				}
			},
			timeIndex: null,
			scrollMsg: '',
			index: 1,
			userAmount: ''
		};
	},
	computed: {
		isInGome() {
			return /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent);
		},
		userId: () => store.state.userId,
		platform() {
			return this.isInGome ? 4 : 2;
		},
		downLink() {
			let isWx = /MicroMessenger/ig.test(navigator.userAgent);
			return isWx ? 'http://sj.qq.com/myapp/detail.htm?apkName=com.gome.mx.MMBoard' : 'http://meimeibang.gome.com.cn/mindex.html';
		}
	},
	components: {
		swiper,
		swiperSlide,
		TopicItem,
		ShopItem,
		ItemItem,
		VideoItem,
		ProductItem,
		'm-nav': Nav
	},
	created() {
	},
	mounted() {
		let that = this;
		actions.setAppVersion(that.$store, getAppVersion());
		that.cScrollload = new Scrollload({
			loadingHtml: traditionalLoadingHtml,
			notEnoughRefreshPortHtml: traditionalMovingHtml,
			overRefreshPortHtml: traditionalMovingHtml,
			refreshingHtml: traditionalLoadingHtml,
			noMoreDataHtml: noMoreDataHtml,
			container: document.querySelector('.scrollload-container'),
			content: document.querySelector('.scrollload-content'),
			window: window,
			threshold: 50,
			enableLoadMore: true,
			loadMore: that.infinite,
			isInitLock: true,
			useLocalScrollFix: true,
			enablePullRefresh: true,
			pullRefresh: that.refresh,
			arrivedRefreshPortHandler(sl) {
				// 强制浏览器重绘
				const scrollloadMovingDom1 = sl.notEnoughRefreshPortDom.querySelector('.scrollload-movingHtml');
				const scrollloadMovingDom2 = sl.overRefreshPortDom.querySelector('.scrollload-movingHtml');
				if (sl.isMovingDown) {
					setStyles([scrollloadMovingDom1, scrollloadMovingDom2], {transform: 'rotate(180deg) translate3d(0,0,0)'});
				} else {
					setStyles([scrollloadMovingDom1, scrollloadMovingDom2], {transform: 'rotate(0deg) translate3d(0,0,0)'});
				}
			},
			touchEnd(sl) {
				const scrollloadMovingDom1 = sl.notEnoughRefreshPortDom.querySelector('.scrollload-movingHtml');
				const scrollloadMovingDom2 = sl.overRefreshPortDom.querySelector('.scrollload-movingHtml');
				setStyles([scrollloadMovingDom1, scrollloadMovingDom2], {transform: 'rotate(0deg) translate3d(0,0,0)'});
			}
		});
		if (that.isInGome) {
			if (store.state.appVersion < 90) {
				AppInterface.call('/common/getLoginStatus', function(data) {
					if (data.success) {
						actions.setUserId(that.$store, data.data.userId);
						// that.getMissionEntry();
					}
					that.cScrollload.triggerPullResfresh();
				});
			} else {
				GomeJSBridge.ready(function() {
					GomeJSBridge.isLogin(function(data) {
						if (data.isLogined == 'Y') {
							GomeJSBridge.getUserInfo(function(data) {
								actions.setUserId(that.$store, data.profileId);
								that.cScrollload.triggerPullResfresh();
							});
						} else {
							that.cScrollload.triggerPullResfresh();
						}
					});
				});
			}
		} else {
			that.cScrollload.triggerPullResfresh();
			that.getWapUserId();
			that.getGMCoin();
		}
		document.querySelector('.inventory_list').addEventListener('scroll', function(ev) {
			that.checkItemPosition(ev.target);
		});
		if (!that.isInGome) {
			that.timerHandler();
			Event.$off('triggerCover');
			Event.$on('triggerCover', () => {
				that.isShowCover = !that.isShowCover;
			});
		}
	},
	updated() {
		if (this.cScrollload.lock) {
			this.cScrollload.unLock();
		}
		if (this.loading) {
			this.loading = false;
		}
		if (this.ids.length > 0 && !this.cScrollload.hasMoreData) {
			this.cScrollload.refreshData();
		}
		this.checkItemPosition(document.querySelector('.inventory_list'));
	},
	destroyed() {
		clearInterval(this.timeIndex);
	},
	methods: {
		timerHandler() {
			this.timeIndex = setInterval(() => {
				let nameIndex = getRandomInt(0, UserData.names.length);
				let typeIndex = getRandomInt(0, UserData.type.length);
				let amount = Math.random() * 2 + 3;
				this.scrollMsg = UserData.names[nameIndex] + ' 通过' + UserData.type[typeIndex] + '获得' + amount.toFixed(2) + '元返利';
			}, 3000);
		},
		getWapUserId() {
			Http.get($CONFIG['mdomain'] + 'api/mm/userId').then(res => {
				if (res.data.code == 200 && res.data.data.userId) {
					actions.setUserId(this.$store, res.data.data.userId);
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getGMCoin() {
			Http.get($CONFIG['mdomain'] + 'api/mm/account').then(res => {
				if (res.data.code == 200) {
					this.userAmount = res.data.data.resultY;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getTopSwipe() {
			let url = $CONFIG['mmBoardDomain'] + '/api/mm/pickListTop?p=' + this.platform;
			Http.get(url).then(res => {
				if (res.data.code == 200 && res.data.data.adContents) {
					let ads = [], topList = [];
					for (let ad of res.data.data.adContents) {
						let content = JSON.parse(ad.content);
						topList.push(Object.assign({}, {adId: ad.adId, isImpression: false}, content));
					}
					this.topSwipeList = topList;
					this.doTopListImpression(0);
				}
			}).catch(err => {
				console.log(err);
			});
		},
		doTopListImpression(index) {
			let topObj = this.topSwipeList[index];
			if (!topObj.isImpression) {
				topObj.isImpression = true;
				jsonp(topObj.impressionUrl, null, function(err, data) {});
			}
		},
		refresh() {
			this.getTopSwipe();
			this.getList(this.pageSize);
		},
		infinite() {
			if (!this.loading && this.ids.length > 0) {
				this.getListLoading();
			} else {
				this.cScrollload.noMoreData();
				return;
			}
		},
		reLoad() {
			this.cScrollload.triggerPullResfresh();
		},
		getList() {
			let url = $CONFIG['mmBoardDomain'] + '/api/mm/pickV3?p=' + this.platform;
			let reqData = {
				url: url,
				method: 'get'
			};
			if (this.isInGome) {
				reqData.headers = {
					a: getHeaderA(this.userId)
				};
			}
			Http(reqData).then(res => {
				if (res.data.code == 200) {
					this.isError = false;
					this.setItem(res.data.data.adContents, true);
					this.ids = res.data.data.ids;
				} else {
					this.isError = true;
				}
				this.cScrollload.refreshComplete();
			}).catch(err => {
				this.isError = true;
				this.cScrollload.refreshComplete();
				console.log(err);
			});
		},
		getListLoading() {
			let vm = this;
			vm.cScrollload.lock();
			if (vm.loading) return;
			vm.loading = true;
			let loadingIds = vm.ids.splice(0, 10);
			let url = $CONFIG['mmBoardDomain'] + '/api/mm/pickV3?p=' + vm.platform + '&adIds=' + loadingIds.join();
			let reqData = {
				url: url,
				method: 'get'
			};
			if (vm.isInGome) {
				reqData.headers = {
					a: getHeaderA(vm.userId)
				};
			}
			Http(reqData).then(res => {
				if (res.data.code == 200) {
					vm.setItem(res.data.data.adContents, false);
				}
				vm.cScrollload.unLock();
			}).catch(err => {
				console.log(err);
			});
		},
		setItem(items, isRefresh) {
			if (isRefresh) {
				this.dataList = [];
			}
			for (let item of items) {
				this.dataList.push(item);
			}
		},
		checkItemPosition(target) {
			let items = document.getElementsByClassName('list-item');
			let scrollTop = target.scrollTop;
			for(let i = 0; i < items.length; i++) {
				let dataVisible = items[i].getAttribute('data-visible');
				if (dataVisible) {
					let offsetTop = items[i].offsetTop;
					let offsetBottom = offsetTop + 20;
					if (i === 0 || offsetTop >= scrollTop && offsetBottom < (scrollTop + window.screen.height)) {
						jsonp(items[i].getAttribute('data-url'), null, function(err, data) {});
						items[i].removeAttribute('data-visible');
					}
				}
			}
		},
		itemClick(clickUrl, landingUrl, e) {
			if (this.isInGome) {
				e.preventDefault();
				jsonp(clickUrl + '&contentType=3', null, function(err, data) {
					if (store.state.appVersion < 90) {
						AppInterface.call('/common/localJump', {url: window.btoa(landingUrl)});
					} else {
						GomeJSBridge.ready(function() {
							GomeJSBridge.pushWindow(null, null, landingUrl);
						});
					}
				});
				return false;
			} else {
				jsonp(clickUrl + '&contentType=3', null, function(err, data) {
					window.location.href = landingUrl;
				});
			}
		},
		topClick(ad, e) {
			if (this.isInGome) {
				e.preventDefault();
				jsonp(ad.clickUrl + '&contentType=3', null, function(err, data) {});
				if (store.state.appVersion < 90) {
					AppInterface.call('/common/localJump', {url: window.btoa(ad.landPage)});
				} else {
					GomeJSBridge.ready(function() {
						GomeJSBridge.pushWindow(null, null, ad.landPage);
					});
				}
				return false;
			}
		},
		openRebateRule(e) {
			if (this.isInGome) {
				e.preventDefault();
				let rebateUrl = 'https://mevent.meixincdn.com/mm/rebate-rule.html';
				if (store.state.appVersion < 90) {
					AppInterface.call('/common/localJump', {url: window.btoa(rebateUrl)});
				} else {
					GomeJSBridge.ready(function() {
						GomeJSBridge.pushWindow(null, null, rebateUrl);
					});
				}
				return false;
			}
		}
	}
};

</script>
