<template>
	<div class="pcPageMain">
		<!--轮播图和图片广告-->
		<div class="page-banner top-banner" v-if="sildeArr.length > 0 || topSlotArr.length > 0">
			<div id="swiperWapper" class="topSwiper">
				<swiper :options="swiperOption" ref="mySwiper">
					<swiper-slide v-for="(item,index) in sildeArr" :key="index" class="topSlide">
						<div :data-url="item.impression_url" data-visible="visible" :data-id="item.adId"
							 class="topSlideBox">
							<a :href="item.click_url" target="_blank"><img :src="item.resource_url"></a>
						</div>
					</swiper-slide>
					<div class="swiper-button-prev" slot="button-prev"></div>
					<div class="swiper-button-next" slot="button-next"></div>
					<div class="swiper-pagination"  slot="pagination"></div>
				</swiper>
			</div>
			<div class="topSlotImg" v-for="(item,index) in topSlotArr">
				<div :data-url="item.impression_url" data-visible="visible"
					 :data-id="item.adId">
					<a :href="item.click_url" target="_blank"><img v-lazy="item.resource_url"></a>
				</div>
			</div>
		</div>
		<!--列表-->
		<p class="pc-page-title page-banner" v-if="listSlotArr.length > 0">
			大家都在买
		</p>
		<div class="page-banner list-banner" v-if="listSlotArr.length > 0">
			<div v-for="(item,index) in listSlotArr" :data-url="item.impression_url" data-visible="visible"
				 :data-id="item.adId"
				 :class="{'listItem':true, 'item-list': true, 'listItemLast': index%5 == 4}">
				<a :href="item.click_url" target="_blank" :title="item.description">
					<img v-lazy="item.resource_url" alt="">
					<p class="list-price">&yen;{{item.price}}</p>
					<p class="list-desc">
						{{item.description}}
					</p>
				</a>
			</div>
		</div>
		<div class="page-banner page-refresh "  v-if="listSlotArr.length == 0 && !isLoading" >
			<p class="refresh-desc">加载失败，请刷新后重试~</p>
			<p class="refresh-btn"><span @click="refresh">点击刷新</span></p>
		</div>
		<div class="page-banner page-loading "  v-if="listSlotArr.length == 0 && isLoading" >
			<p class="loading-btn"><span>正在加载...</span></p>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import http from 'utils/http';
	import jsonp from 'jsonp';
	import actions from 'actions';
	import Event from 'event';
	import {getCookie} from 'utils/common';
	import {swiper, swiperSlide} from 'vue-awesome-swiper';
	import Scrollload from 'scrollload';
	require('../../../assets/js/appInterface.js');
	export default {
		name: 'app-active-page',
		data() {
			return {
				swiperOption: {
					pagination: '.swiper-pagination',
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					slidesPerView: 1,
					initialSlide: 0,
					loop: true,
					onlyExternal: true,
					paginationClickable: true,
					autoplay:5000,
					speed:1000,
					onSlideNextStart: (swiper) => {
						if(this.scroll <= 550) {
							let index = swiper.activeIndex > this.sildeArr.length ? 1 : swiper.activeIndex;
							this.slidesPression(index);
						}
					}
				},
				slidSlotId: $CONFIG['pcSlidSlotId'],
				topSlotId: $CONFIG['pcTopSlotId'],
				listSlotId: $CONFIG['pcListSlotId'],
				sildeArr: [],
				topSlotArr: [],
				listSlotArr: [],
				scroll:0,
				isSlideLoading:true,
				isListLoading:true,
			};
		},
		components: {
			swiper,
			swiperSlide
		},
		created() {
			let arr = this.slidSlotId.concat(this.topSlotId);
			this.initSlide(arr);
			this.initList();
		},
		mounted() {
			let vm = this;
			window.addEventListener('scroll', function() {
				let t = document.documentElement.scrollTop || document.body.scrollTop;
				let page = document.getElementsByClassName("pcPageMain")[0];
				vm.scroll = t;
				vm.checkItemPosition(t);
			});
		},
		updated() {
			this.checkItemPosition(this.scroll);
		},
		computed: {
			areaId() {
				let URL = window.location.href;
				let obj = {};
				if (URL.indexOf('?') > -1) {
					let str = URL.substring(URL.indexOf('?') + 2, URL.length);
					let arr = str.split('&');
					arr.forEach((item) => {
						let start = item.substring(0, item.indexOf('='));
						let end = item.substring(item.indexOf('=') + 1, item.length);
						obj[start] = end;
					});
				}
				if(obj.hasOwnProperty('districtId')) {
					return obj['districtId'];
				} else if(getCookie('gps_districtid')) {
					return getCookie('gps_districtid');
				} else {
					return '11010200';
				}
			},
			isLoading() {
				return this.isSlideLoading && this.isListLoading;
			}
		},
		methods: {
			initSlide(slotId) {
				let vm = this;
				vm.topSlotArr = [];
				vm.sildeArr = [];
				vm.isSlideLoading = true;
				let url = $CONFIG['domain'] + '?slotId=' + slotId.join(',') + '&requestType=3&distId=' + vm.areaId;
				jsonp(url, {
					timeout: 3000
				}, function(err, data) {
					vm.isSlideLoading = false;
					if(data) {
						for (let i = 0; i < data.length; i++) {
							let item = {};
							let adContent = data[i].adContents[0];
							let content = JSON.parse(adContent.content);
							item.impression_url = content.impressionUrl;
							item.click_url = content.clickUrl;
							item.landing_url = content.landPage; //新增的
							item.resource_url = content.resourceUrl;
							item.adId = data[i].adContents[0].adId;
							if(data[i].slotId == vm.topSlotId[0]) {
								vm.topSlotArr.push(item);
							} else {
								vm.sildeArr.push(item);
							}
						}
						//曝光轮播图第一帧
						if(vm.sildeArr.length > 0) {
							jsonp(vm.sildeArr[0].impression_url, null, function(err, data) {});
						}
						//图片广告位曝光
						if(vm.topSlotArr.length > 0) {
							jsonp(vm.topSlotArr[0].impression_url, null, function(err, data) {});
						}
					}
				});
			},
			initList() {
				let vm = this;
				vm.isListLoading = true;
			    let url = $CONFIG['domain'] + '?slotId=' + this.listSlotId + '&requestType=3&width_height=210-210&area=' + vm.areaId + '&count=50';
				jsonp(url, {
					timeout: 3000
				}, function(err, data) {
					vm.isListLoading = false;
					if(data) {
						for (let i = 0; i < data.length; i++) {
							let item = {};
							item.resource_url = data[i].src;
							item.impression_url = data[i].pm;
							item.click_url = data[i].ldp;
							item.landing_url = data[i].dest; //新增的
							item.price = data[i].pr;
							item.adId = data[i].aid;
							item.description = data[i].ds;
							if(vm.listSlotArr.length < 50) {
								vm.listSlotArr.push(item);
							}
						}
					}
				});
			},
			getThumbnailsUrl(imgUrl, width, height) {
				return getThumbnails(imgUrl, width, height);
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
			//轮播图曝光
			slidesPression(index) {
				let vm = this;
				if(vm.sildeArr.length == 0) {return false;};
				let slide = document.getElementsByClassName('topSlide')[index].getElementsByClassName('topSlideBox')[0];
				let url = slide.getAttribute('data-url');
				let dataVisible = slide.getAttribute('data-visible');
				if (dataVisible && index > 1) {
					jsonp(url, null, function(err, data) {});
					slide.removeAttribute('data-visible');
				}
			},
			//曝光
			checkItemPosition(target) {
				let items = document.getElementsByClassName('item-list');
				if(items.length == 0) {return false;};
				let scrollTop = target;
				let offsetTop = items[0].offsetTop;
				let offsetBottom = offsetTop + 20;
				for (let i = 0; i < items.length; i++) {
					let dataVisible = items[i].getAttribute('data-visible');
					if (dataVisible) {
						let offsetTop = items[i].offsetTop;
						let offsetBottom = offsetTop + 130;
						if (offsetTop >= scrollTop && offsetBottom < (scrollTop + window.screen.height)) {
							jsonp(items[i].getAttribute('data-url'), null, function(err, data) {});
							items[i].removeAttribute('data-visible');
						}
					}
				}
			},
			//刷新
			refresh() {
				let arr = this.slidSlotId.concat(this.topSlotId);
				this.isSlideLoading = false;
				this.isListLoading = false;
				this.initSlide(arr);
				this.initList();
			}
		},
		watch: {
			'scroll': {
				handler: function(val) {},
				deep: true
			}
		}
	};
</script>
<style lang="less">
	@import '../../../assets/css/pcActivePage.less';
</style>
