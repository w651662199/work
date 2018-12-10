<template>
	<div class="scrollload-container inventory_list" :style="{'padding-top': isScroll ? '.88rem' : '1.18rem'}">
		<div id="J_list" class="scrollload-content" :class="{'padding-around': type === 'product'}">
			<div :class="classList" v-for='(item, index) in items' :key="item.key" :data-url='item.impression_url' data-visible='visible'>
				<slot name="item-slot" :item="item" :listItemIndex="index"></slot>
				<div class="footer-box clearfix" v-if="type !== 'product'">
					<slot name="footer-left" :item="item"></slot>
					<m-upvote v-if="isInGome" :praise-status='item.praiseStatus' :id="item.ad_id" :parise-num='item.pariseNum' :request-id='item.requestId' :log-param="item.logParam" :flight-job-id="item.flight_job_id" :slot-id="slotId"></m-upvote>
					<m-share v-if="isInGome" :slotId="slotId" :item="item"></m-share>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import jsonp from 'jsonp';
import Share from './share.vue';
import Upvote from './upvote.vue';
import store from 'store';
import Scrollload from 'scrollload';
import {getUrlInfoWithDeviceId, setStyles, getDeviceIdFromAgent} from 'utils/common';
import {traditionalMovingHtml, traditionalLoadingHtml, noMoreDataHtml} from 'utils/initScrollload';
export default {
	name: 'common-list',
	props: {
		type: {
			type: String,
			required: true
		},
		slotId: {
			required: true
		},
		isScroll: {
			required: true
		}
	},
	data() {
		return {
			items: {},
			loading: false,
			ids: [],
			pageSize: 20,
			cScrollload: {}
		};
	},
	computed: {
		classList() {
			if (this.type === 'topic') {
				return 'list_item topic-item';
			} else if (this.type === 'shop') {
				return 'list_item shop-item';
			} else if (this.type === 'item') {
				return 'list_item item-item inventory_item';
			} else if (this.type === 'video') {
				return 'list_item video-item';
			} else if (this.type === 'product') {
				return 'list_item product-item';
			}
			return '';
		},
		userId: () => store.state.userId,
		isInGome() {
			return /gomeplus/g.test(navigator.userAgent);
		}
	},
	components: {
		'm-upvote': Upvote,
		'm-share': Share
	},
	mounted() {
		let vm = this;
		document.querySelector('.inventory_list').addEventListener('scroll', function(ev) {
			vm.checkItemPosition(ev.target);
		});
		vm.cScrollload = new Scrollload({
			loadingHtml: traditionalLoadingHtml,
			notEnoughRefreshPortHtml: traditionalMovingHtml,
			overRefreshPortHtml: traditionalMovingHtml,
			refreshingHtml: traditionalLoadingHtml,
			noMoreDataHtml: noMoreDataHtml,
			container: document.querySelector('.scrollload-container'),
			content: document.querySelector('.scrollload-content'),
			window: document.querySelector('.inventory_list'),
			threshold: 50,
			enableLoadMore: true,
			loadMore: vm.infinite,
			isInitLock: true,
			useLocalScrollFix: true,
			enablePullRefresh: true,
			pullRefresh: vm.refresh,
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
		vm.cScrollload.triggerPullResfresh();
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
	methods: {
		refresh() {
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
		getList(count) {
			var vm = this;
			let url = $CONFIG['adRequestApi'] + '?slotId=' + vm.slotId + '&requestType=3&count=' + count;
			if (vm.isInGome) {
				url += '&deviceId=' + getDeviceIdFromAgent();
			}
			jsonp(url, null, function(err, data) {
				if (!err && data) {
					vm.items = {};
					vm.itemsCheck({data: data}, true);
				}
				vm.cScrollload.refreshComplete();
				// vm.cScrollload.refreshData();
			});
		},
		itemsCheck(res, isRefresh) {
			let vm = this;
			let arr = res.data.datas[0].adContents;
			let adIds = [];

			// 点赞次数/点赞状态，分享次数查询参数
			let flightAdIds = [];
			let videoIds = [];
			let productIdSkuIds = [];

			for (let i = 0; i < arr.length; i++) {
				let item = JSON.parse(arr[i].content);
				item.landing_url = decodeURIComponent(item.landing_url);
				let urlObj = vm.getQueryObject(item.landing_url);

				let flightAdId = item.flight_job_id + ":" + item.ad_id;
				flightAdIds.push(flightAdId);
				if (vm.type === 'video') {
					let videoId = item.promotion_id;
					videoIds.push(videoId);
					item.watchCount = 0;
				}
				if (vm.type === 'product') {
					let productIdSkuId = item.promotion_id;
					productIdSkuIds.push(productIdSkuId);
					item.commentCount = 0;
				}
				if (vm.type === 'shop') {
					item.shop_logo = item.shop_logo.replace(/^http:\/\//, 'https://');
				}
				item.key = new Date().getTime();
				item.logParam = urlObj.logParam;
				item.requestId = urlObj.requestId;
				item.adId = urlObj.adId;
				item.shareNum = 0;
				item.pariseNum = 0;
				item.praiseStatus = 0;
				item.rebateStatus = 0;
				item.shareRebateBid = 0;
				item.promotion_title = decodeURIComponent(item.promotion_title);
				item.promotion_description = decodeURIComponent(item.promotion_description);
				if (vm.isInGome) {
					item.click_url = getUrlInfoWithDeviceId(item.click_url);
					item.impression_url = getUrlInfoWithDeviceId(item.impression_url);
				}

				Vue.set(vm.items, 'id' + item.adId, item);
				adIds.push(item.adId);
			}
			if (isRefresh) {
				vm.ids = res.data.ids;
			}
			if (vm.ids.length === 0) {
				// document.getElementsByClassName('no-data-text')[0].style.opacity = 1;
			}
			if (vm.type === 'video') {
				// 视频计数
				jsonp($CONFIG['videoGetCount'] +  videoIds.join(",") + '/callback', {'name': 'callback'}, function(err, data) {
					let videoCounts = data.data;
					for (let videoId in videoCounts) {
						for (let id in vm.items) {
							if (vm.items[id].promotion_id == videoId) {
								vm.items[id].watchCount = videoCounts[videoId];
								break;
							}
						}
					}
				});
			}
			if (vm.type === 'product') {
				vm.setProductsComments(productIdSkuIds);
			}
			if (vm.isInGome) {
				let pariseShareBatchUrl;
				if (vm.userId != '') {
					pariseShareBatchUrl = $CONFIG['pariseShareBatch'] + '?userId=' + vm.userId + '&flightAdId=' + flightAdIds.join(",");
				} else {
					pariseShareBatchUrl = $CONFIG['pariseShareBatch'] + '?flightAdId=' + flightAdIds.join(",");
				}
				pariseShareBatchUrl += '&slotId=' + vm.slotId;
				jsonp(pariseShareBatchUrl, null, function(err, data) {
					if(data.message == 'success') {
						let dat = data.data;
						for(let i = 0; i < dat.length; i++) {
							vm.items['id' + dat[i].ad_id].shareNum = dat[i].share_num;
							vm.items['id' + dat[i].ad_id].praiseStatus = dat[i].parise_status;
							vm.items['id' + dat[i].ad_id].pariseNum = dat[i].parise_num;
							let rebateStatus = dat[i].rebate_status == '1' && (dat[i].share_rebate_bid > 0 || dat[i].research_rebate_bid > 0 || dat[i].watch_rebate_bid > 0);
							vm.items['id' + dat[i].ad_id].rebateStatus = rebateStatus;
							vm.items['id' + dat[i].ad_id].shareRebateBid = dat[i].share_rebate_bid;
						}
					}
				});
			}
		},
		setProductsComments(productIdSkuIds) {
			let vm = this;
			for(let i = 0; i < productIdSkuIds.length; i = i + 10) {
				let productArr = productIdSkuIds.slice(i, i + 10);
				jsonp($CONFIG['mdomain'] + 'api/comments?ids=' +  productArr.join(","), null, function(err, data) {
					let productComments = data.data;
					if (productComments) {
						for (let j = 0; j < productComments.length; j++) {
							let productIdSkuId = productComments[j].productId + ':' + productComments[j].skuId;
							for (let id in vm.items) {
								if (vm.items[id].promotion_id == productIdSkuId) {
									vm.items[id].commentCount = productComments[j].appraisal;
									break;
								}
							}
						}
					}
				});
			}
		},
		getQueryObject(url) {
			let search = url.substring(url.lastIndexOf("?") + 1);
			let obj = {};
			let reg = /([^?&=]+)=([^?&=]*)/g;
			search.replace(reg, function(rs, $1, $2) {
				let name = decodeURIComponent($1);
				let val = decodeURIComponent($2);
				val = String(val);
				obj[name] = val;
				return rs;
			});
			return obj;
		},
		getListLoading() {
			let vm = this;
			vm.cScrollload.lock();
			if (vm.loading) return;
			vm.loading = true;
			let loadingIds = vm.ids.splice(0, 10);
			let url = $CONFIG['adRequestApi'] + '?slotId=' + vm.slotId + '&requestType=3&ids=' + loadingIds.join();
			if (vm.isInGome) {
				url += '&deviceId=' + getDeviceIdFromAgent();
			}
			jsonp(url, null, function(err, data) {
				if (!err && data) {
					vm.itemsCheck({data: data}, false);
				}
				// vm.loading = false;
				vm.cScrollload.unLock();
			});
		},
		checkItemPosition(target) {
			let items = document.getElementsByClassName('list_item');
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
		}
	}
};
</script>
<style lang="less">
	@import '../../assets/css/common.less';
</style>
