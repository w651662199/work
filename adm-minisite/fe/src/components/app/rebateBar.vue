<template>
	<div class="rebate-con" v-if="isShowRebate">
		<div class="rebate-item share" :class="{'actived': rebate.shareRebateGotFlg == 1}" v-show="rebate.shareRebateBid > 0">分享赚{{rebate.shareRebateBid}}</div>
		<div class="rebate-item survey" :class="{'actived': rebate.researchRebateGotFlg == 1}" v-show="rebate.researchRebateBid > 0">调研赚{{rebate.researchRebateBid}}</div>
		<div class="rebate-item video" :class="{'actived': rebate.watchRebateGotFlg == 1}" v-show="rebate.watchRebateBid > 0">视频赚{{rebate.watchRebateBid}}</div>
	</div>
</template>
<script>
export default {
	name: 'REBATE_BAR',
	props: ['rebate'],
	computed: {
		isShowRebate() {
			return this.rebate.rebateStatus == 1 && ( this.rebate.shareRebateBid > 0 || this.rebate.researchRebateBid > 0 || this.rebate.watchRebateBid > 0);
		}
	}
};
</script>