<template>
	<div class="list-item product" :data-url='item.contentObject.impression_url' data-visible='visible'>
		<a href="javascript:void(0)" target="_blank" @click="adClick">
			<div class="product-img">
				<img class="lazy-image" v-lazy="getThumbnailsUrl(item.contentObject.promotion_images[0], 360, 360)">
			</div>
		</a>
		<div class="product-info">
			<a href="javascript:void(0)" target="_blank" @click="adClick">
				<p class="title">{{item.contentObject.promotion_title}}</p>
				<rebate-bar :rebate="item.sharePraiseNum"></rebate-bar>
			</a>
			<action-bar :item="item"></action-bar>
		</div>
	</div>
</template>
<script>
import RebateBar from './rebateBar.vue';
import ActionBar from './actionBar.vue';
import {getThumbnails} from '../../utils/common.js';
export default {
	name: 'MMB_PRODUCT_ITEM',
	props: ['item', 'clickImpression'],
	computed: {
		isInGome() {
			return /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent);
		}
	},
	components: {
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