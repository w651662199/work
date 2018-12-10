<template>
	<div class="mmb-con">
		<div class="tab-bar">
			<div class="tab-item" :class="{'actived': tabIndex == 1}" @click="changeTab(1)"><span>创意排行榜</span></div>
			<div class="tab-item" :class="{'actived': tabIndex == 2}" @click="changeTab(2)"><span>最受关注品牌</span></div>
			<div class="tab-item" :class="{'actived': tabIndex == 3}" @click="changeTab(3)"><span>品牌进步榜</span></div>
		</div>
		<div class="list-con">
			<div class="list rank-material" v-show="tabIndex == 1">
				<div class="list-item" v-for="(rank, index) in rankMaterials" :key="index">
					<div class="left">
						<p>
							<span class="item-index">{{index + 1}}</span>
							<span class="item-type">{{rank.label}}</span>
							<span class="item-title">{{rank.name}}</span>
						</p>
					</div>
					<div class="right">
						<span class="item-count">{{formatCount(rank.amount)}}</span>
						<span class="item-icon hot"></span>
					</div>
				</div>
			</div>
			<div class="list rank-brand" v-show="tabIndex == 2">
				<div class="list-item" v-for="(rank, index) in rankBrands" :key="index">
					<div class="left">
						<p>
							<span class="item-index">{{index + 1}}</span>
							<span class="item-title">{{rank.name}}</span>
						</p>
					</div>
					<div class="right">
						<span class="item-count">{{formatCount(rank.follow)}}</span>
						<span class="item-icon tend"></span>
					</div>
				</div>
			</div>
			<div class="list rank-brandUp" v-show="tabIndex == 3">
				<div class="list-item" v-for="(rank, index) in rankBrandUps" :key="index">
					<div class="left">
						<p>
							<span class="item-index">{{index + 1}}</span>
							<span class="item-title">{{rank.name}}</span>
						</p>
					</div>
					<div class="right">
						<span class="item-count">{{formatCount(rank.follow)}}</span>
						<span class="item-icon tend"></span>
					</div>
				</div>
			</div>
		</div>
		<m-nav v-if="!isInGome"></m-nav>
	</div>
</template>
<script>
import Http from 'utils/http';
import Nav from '../../common/nav.vue';
export default {
	name: 'mmbMain',
	data() {
		return {
			tabIndex: 1,
			rankMaterials: [],
			rankBrands: [],
			rankBrandUps: [],
		};
	},
	computed: {
		isInGome() {
			return /gomeplus|GomeBackup|GomePlus/ig.test(navigator.userAgent);
		},
	},
	components: {
		'm-nav': Nav
	},
	created() {
		this.getRankMaterials();
		this.getRankBrands();
		this.getRankBrandUps();
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
		},
		getRankMaterials() {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/rank/material').then(res => {
				if (res.data.code == 200) {
					this.rankMaterials = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getRankBrands() {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/rank/brand').then(res => {
				if (res.data.code == 200) {
					this.rankBrands = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getRankBrandUps() {
			Http.get($CONFIG['mmBoardDomain'] + '/api/mm/rank/brandUp').then(res => {
				if (res.data.code == 200) {
					this.rankBrandUps = res.data.data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		formatCount(count) {
			let str = '';
			if (count > 10000) {
				str = (count / 1000).toFixed(2) + 'w';
			} else if (count == 1000) {
				str = '1w';
			} else {
				str = '' + count;
			}
			return str;
		}
	}
};
</script>
<style lang="less">
@import './mmb.less';
</style>