<template>
	<div class="list-item item" :data-url='item.contentObject.impression_url' data-visible='visible'>
		<a href="javascript:void(0)" target="_blank" @click="adClick">
			<p class="title">{{item.contentObject.promotion_title}}</p>
			<rebate-bar :rebate="item.sharePraiseNum"></rebate-bar>
			<div class="item-swiper img-con">
				<swiper :options="swiperOption"  ref="mySwiper">
					<swiper-slide v-for='product in item.contentObject.products' :key="product.sku_id">
						<img class="lazy-image" v-lazy="getThumbnailsUrl(product.product_image, 260, 260)">
					</swiper-slide>
				</swiper>
			</div>
		</a>
		<action-bar :item="item"></action-bar>
	</div>
</template>
<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper';
import RebateBar from './rebateBar.vue';
import ActionBar from './actionBar.vue';
import {getThumbnails} from '../../utils/common.js';
export default {
	name: 'MMB_ITEM_ITEM',
	props: ['item', 'clickImpression'],
	data() {
		return {
			swiperOption: {
				notNextTick: true,
				slidesPerView: 3.24,
				paginationClickable: true,
				noSwiping: false,
				freeMode: true,
				loop: false,
				loopAdditionalSlides: 3,
				onSlideChangeEnd: swiper => {
					this.page = swiper.realIndex + 1;
					this.index = swiper.realIndex;
				}
			}
		};
	},
	computed: {
		isInGome() {
			return /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent);
		}
	},
	components: {
		swiper,
		swiperSlide,
		RebateBar,
		ActionBar
	},
	methods: {
		getThumbnailsUrl(imgUrl, width, height) {
			return getThumbnails(imgUrl, width, height);
		},
		adClick(e) {
			let landUrl = this.item.contentObject.landing_url + '?q=' + this.item.q;
			this.clickImpression(this.item.contentObject.click_url, landUrl, e);
		}
	}
};
</script>