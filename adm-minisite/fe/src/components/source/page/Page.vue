<template>
	<div class="pageMain" style="height: 100%;overflow: auto">
		<!--轮播图-->
		<div class="page-banner-pic" id="swiperWapper" v-show="sildeArr.length > 0">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide v-for="(item,index) in sildeArr" :key="index" class="topSlide">
					<div :data-url="item.impression_url" data-visible="visible" :data-id="item.adId"
						 @click="light(item.click_url, item.landing_url)" class="topSlideBox">
						<a :href="isInGome ? 'javascript:void(0)' : item.click_url">
							<img v-lazy="item.resource_url">
						</a>
					</div>
				</swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
		<!--精选活动-->
		<h3 class="page-title topic-title" v-show="topicArr.length > 0">精选活动</h3>
		<div class="item-list page-topic page-banner" v-for="(item,index) in topicArr"
			 @click="light(item.click_url, item.landing_url)" :data-id="item.adId"
			 :data-url="item.impression_url" data-visible="visible">
			<a :href="isInGome ? 'javascript:void(0)' :item.clickUrl">
				<img v-lazy="item.resource_url" alt="">
			</a>
		</div>
		<!--猜你喜欢-->
		<div class="page-like page-banner" v-show="likeArr.length > 0">
			<h3 class="page-title">猜你喜欢</h3>
			<div class="like-list">
				<swiper :options="swiperOptionList" ref="mySwiperList">
					<swiper-slide v-for="(item,index) in likeArr" class="likeSlide">
						<div :data-id="item.adId" :data-url="item.impression_url" data-visible="visible"
							 @click="light(item.click_url, item.landing_url)" class="likeSlideBox">
							<a :href="isInGome ? 'javascript:void(0)' :item.clickUrl">
								<img v-lazy="item.resource_url" alt="">
								<p class="like-price">&yen;{{item.price}}</p>
							</a>
						</div>
					</swiper-slide>
				</swiper>
			</div>
		</div>
		<!--清单-->
		<h3 class="page-title webpage-title" v-show="webpageArr.length > 0">清单</h3>
		<div :data-id="item.adId" class="item-list page-webpage page-banner" v-for="(item,index) in webpageArr"
			 :data-url="item.impression_url" data-visible="visible"
			 @click="light(item.click_url, item.landing_url)">
			<a :href="isInGome ? 'javascript:void(0)' : item.click_url">
				<img v-lazy="item.promotion_images[0]">
				<p class="webpage-desc" v-show="item.promotion_title.length > 0">{{ item.promotion_title }}</p>
			</a>
		</div>
		<!--好物-->
		<h3 class="page-title good-title" v-show="goodArr.length > 0">好物</h3>
		<div :data-id="item.adId" class="item-list page-good page-banner" v-for="(item,index) in goodArr"
			 :data-url="item.impression_url" data-visible="visible"
			 @click="light(item.click_url, item.landing_url)">
			<a :href="isInGome ? 'javascript:void(0)' : item.click_url">
				<img v-lazy="item.promotion_images[0]">
				<div class="goodBox">
					<span class="good-title">{{item.promotion_title}}</span>
					<span class="good-desc" v-show="item.promotion_description.length > 0">{{ item.promotion_description }}</span>
				</div>
			</a>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import http from 'utils/http';
	import jsonp from 'jsonp';
	import actions from 'actions';
	import Event from 'event';
	import {getUrlInfoWithDeviceId, setStyles, getThumbnails, getCookie, getDeviceIdFromAgent, getAppVersion} from 'utils/common';
	import {swiper, swiperSlide} from 'vue-awesome-swiper';
	require('../../../assets/js/appInterface.js');
	export default {
		name: 'app-active-page',
		data() {
			return {
				swiperOption: {
					notNextTick: true,
					pagination: '.swiper-pagination',
					slidesPerView: 1,
					loop: false,
					paginationClickable: true,
					freeMode:false,
					autoplay:3000,
					speed:1000,
					onSlideNextStart: (swiper) => {
						if (this.scroll <= 130) {
							this.slidesImpression(swiper.activeIndex);
						}
					}
				},
				swiperOptionList: {
					notNextTick: true,
					slidesPerView: 4.5,
					loop: false,
					freeMode: true,
					loopAdditionalSlides: 5,
					slidesOffsetAfter: 35,
					onTouchStart: (swiper) => {
						if (swiper.activeIndex == this.likeArr.length - 4) {
							return false;
						};
						this.likeImpression(swiper.activeIndex, swiper.activeIndex + 4);
					},
					onSlideChangeEnd: swiper => {
						this.page = swiper.realIndex + 1;
						this.index = swiper.realIndex;
					}
				},
				slidSlotId: $CONFIG['slidSlotId'],
				topicSlotId: $CONFIG['topicSlotId'],
				likeSlotId: $CONFIG['likeSlotId'],
				webpageSlotId: $CONFIG['webpageSlotId'],
				goodSlotId: $CONFIG['goodSlotId'],
				webpageCount: $CONFIG['webpageCount'],
				goodCount: $CONFIG['goodCount'],
				sildeArr: [],   //轮播图
				topicArr: [],   //精选
				likeArr: [],    //猜你喜欢
				webpageArr: [], //清单
				goodArr: [],    //好物
				scroll:0

			};
		},
		components: {
			swiper,
			swiperSlide
		},
		created() {
			this.initSlide(this.slidSlotId, this.sildeArr);
			this.initSlide(this.topicSlotId, this.topicArr);
			this.initLike();
			this.initBothWebpageAndGood(this.webpageSlotId, this.webpageArr, this.webpageCount);
			this.initBothWebpageAndGood(this.goodSlotId, this.goodArr, this.goodCount);
		},
		mounted() {
			let vm = this;
			let like = document.querySelector('.page-like');
			document.querySelector('.pageMain').addEventListener('scroll', function(ev) {
			    vm.scroll =  ev.target.scrollTop;
			    //猜你喜欢首次曝光
				let scrollTop = ev.target.scrollTop;
				vm.setLikeImpression(like, scrollTop);
				//其他item-list曝光
				vm.checkItemPosition(ev.target);
			});
		},
		updated() {
			let like = document.querySelector('.page-like');
			this.checkItemPosition(document.querySelector('.pageMain'));
			this.setLikeImpression(like, 0);
		},
		computed: {
			isInGome() {
				return /gomeplus/g.test(navigator.userAgent);
			},
			version() {
				return getAppVersion();
			},
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
			deviceId() {
			    return getDeviceIdFromAgent();
			}
		},
		methods: {
			//抽取猜你喜欢曝光
			setLikeImpression(like, scrollTop) {
				let vm = this;
				let top = like.offsetTop;
				let bottom = like.offsetTop + 50;
				if(top >= scrollTop && bottom < (scrollTop + window.screen.height)) {
					vm.likeImpression(0, 4);
				}
			},
			//轮播图初始化  精选初始化
			initSlide(slotId, arr) {
				let vm = this;
				let url = $CONFIG['domain'] + '?slotId=' + slotId.join(',') + '&requestType=3&distId=' + vm.areaId + '&deviceId=' + vm.deviceId;
				jsonp(url, null, function(err, data) {
					if(data) {
						for (let i = 0; i < data.length; i++) {
							let item = {};
							let adContent = data[i].adContents[0];
							let content = JSON.parse(adContent.content);
							item.impression_url = getUrlInfoWithDeviceId(content.impressionUrl);
							item.click_url = getUrlInfoWithDeviceId(content.clickUrl);
							item.landing_url = decodeURIComponent(content.landPage); //新增的
							item.resource_url = content.resourceUrl;
							item.adId = data[i].adContents[0].adId;
							arr.push(item);
						}
						if (slotId == vm.slidSlotId && arr.length > 1) {
							jsonp(arr[0].impression_url, null, function(err, data) {});
						}
					}
				});
				/*http.get('http://10.112.178.90:9090/mock/591557dd194690783cf08128/page/slide', {
					params: {
						slotId: slotId.join(','),
						requestType: 3
					}
				}).then((res) => {
					let data = res.data;
					console.log(data.length);
					for (let i = 0; i < data.length; i++) {
						let item = {};
						let adContent = data[i].adContents[0];
						let content = JSON.parse(adContent.content);
						item.impression_url = content.impressionUrl;
						item.click_url = content.clickUrl;
						item.landing_url = content.landPage;
						item.resource_url = content.resourceUrl;
						item.adId = content.adId;
						arr.push(item);
					}
				}).catch((error) => {
					console.log(error);
				});*/
			},
			//猜你喜欢
			initLike() {
				let vm = this;
			    let url = $CONFIG['domain'] + '?slotId=' + this.likeSlotId + '&requestType=3&width_height=210-210&area=' + vm.areaId + '&deviceId=' + vm.deviceId;
				jsonp(url, null, function(err, data) {
					if(data) {
						for (let i = 0; i < data.length; i++) {
							let item = {};
							item.resource_url = data[i].src;
							item.impression_url = getUrlInfoWithDeviceId(data[i].pm);
							item.click_url = getUrlInfoWithDeviceId(data[i].ldp);
							item.landing_url = decodeURIComponent(data[i].dest); //新增的
							item.price = parseInt(data[i].pr);
							item.adId = data[i].aid;
							vm.likeArr.push(item);
						}
					}
				});
			},
			//清单、好物
			initBothWebpageAndGood(sloatId, arr, count) {
				let vm = this;
				let url = $CONFIG['domain'] + '?slotId=' + sloatId + '&requestType=3&count=' + count + '&deviceId=' + vm.deviceId;
				jsonp(url, null, function(err, data) {
					if(data) {
						let Arr = data.datas[0].adContents;
						for (let i = 0; i < Arr.length; i++) {
							let item = JSON.parse(Arr[i].content);
							item.landing_url = decodeURIComponent(item.landing_url);
							let urlObj = vm.getQueryObject(item.landing_url);
							item.adId = urlObj.adId;
							item.promotion_title = decodeURIComponent(item.promotion_title);
							item.promotion_description = decodeURIComponent(item.promotion_description);
							item.click_url = getUrlInfoWithDeviceId(item.click_url);
							item.impression_url = getUrlInfoWithDeviceId(item.impression_url);
							arr.push(item);
						}
					}
				});
			},
			//页面跳转 好物 清单
			light(url, landingUrl) {
				if (!this.isInGome) {
					return false;
				};
				let vm = this;
				jsonp(url + '&contentType=3', null, function(err, data) {
					if (vm.version < 90) {
						if(landingUrl.indexOf('discovery') > -1) {
							AppInterface.call('/common/localJump', {url: window.btoa(landingUrl)});
						} else {
							window.location.href = landingUrl;
						}
					} else {
						GomeJSBridge.ready(function() {
							GomeJSBridge.pushWindow(null, null, landingUrl);
						});
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
			//曝光
			checkItemPosition(target) {
				let items = document.getElementsByClassName('item-list');
				let scrollTop = target.scrollTop;
				for (let i = 0; i < items.length; i++) {
					let dataVisible = items[i].getAttribute('data-visible');
					if (dataVisible) {
						let offsetTop = items[i].offsetTop;
						let offsetBottom = offsetTop + 20;
						if (i === 0 || offsetTop >= scrollTop && offsetBottom < (scrollTop + window.screen.height)) {
							jsonp(items[i].getAttribute('data-url'), null, function(err, data) {
							});
							items[i].removeAttribute('data-visible');
						}
					}
				}
			},
			//轮播图曝光
			slidesImpression(index) {
			    let vm = this;
			    if(vm.sildeArr.length == 0) {
			    	return false;
			    };
				let slide = document.getElementsByClassName('topSlide')[index].getElementsByClassName('topSlideBox')[0];
				let url = slide.getAttribute('data-url');
				let dataVisible = slide.getAttribute('data-visible');
				if (dataVisible) {
					jsonp(url, null, function(err, data) {});
					slide.removeAttribute('data-visible');
				}
			},
			//猜你喜欢轮播图曝光
			likeImpression(startIndex, endIndex) {
			    let vm = this;
				if(vm.likeArr.length == 0) {
					return false;
				};
				for (let i = startIndex; i < endIndex + 1; i++) {
					if(document.getElementsByClassName('likeSlide')[i]) {
						let slide = document.getElementsByClassName('likeSlide')[i].getElementsByClassName('likeSlideBox')[0];
						let url = slide.getAttribute('data-url');
						let dataVisible = slide.getAttribute('data-visible');
						if (dataVisible) {
							jsonp(url, null, function(err, data) {
							});
							slide.removeAttribute('data-visible');
						}
					}
				}
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
	@import '../../../assets/css/activePage.less';
</style>
