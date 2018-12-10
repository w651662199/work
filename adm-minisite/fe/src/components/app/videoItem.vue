<template>
	<div class="list-item video" :data-url='item.contentObject.impression_url' data-visible='visible'>
		<a href="javascript:void(0)" target="_blank" @click="adClick">
			<p class="title">{{item.contentObject.promotion_title}}</p>
			<rebate-bar :rebate="item.sharePraiseNum"></rebate-bar>
			<div class="img-con">
				<img class="video-icon" src="../../assets/images/shipin_icon.png">
				<img class="item-img lazy-image" v-lazy="item.contentObject.promotion_images[0]">
			</div>
		</a>
		<action-bar :item="item"></action-bar>
	</div>
</template>
<script>
import RebateBar from './rebateBar.vue';
import ActionBar from './actionBar.vue';
export default {
	name: 'MMB_VIDEO_ITEM',
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
		adClick(e) {
			let landUrl = this.item.contentObject.landing_url + '?q=' + this.item.q;
			this.clickImpression(this.item.contentObject.click_url, landUrl, e);
		}
	}
};
</script>