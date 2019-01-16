<template>
	<div>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-if="config.show"></div>
		</transition>
		<transition name="drawer">
			<div class="drawer" v-if="config.show">
				<div class="drawer-part">
					<h2 class="part-header">
						<span class="header-text">{{actionMap[config.action] + typeMap[config.type]}}</span>
						<span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span>
					</h2>
					<div class="step-con" :class="'step-con0' + (orderKey.indexOf(config.type) + 1)" v-show="config.action === 'new'">
						<span class="step-item step01">
							<b class="step-text">新建推广计划</b>
							<b class="step-number">1</b>
						</span>
						<span class="step-item step02">
							<b class="step-text">新建推广单元</b>
							<b class="step-number">2</b>
						</span>
						<span class="step-item step03">
							<b class="step-text">设置创意</b>
							<b class="step-number">3</b>
						</span>
						<span class="step-percent"></span>
					</div>
					<campaign-drawer key="1" v-if="config.show && config.type === 'campaign'"></campaign-drawer>
					<flight-drawer key="2" v-if="config.show && config.type === 'flight'"></flight-drawer>
					<material-drawer key="3" v-if="config.show && config.type === 'material'"></material-drawer>
				</div>
				<div class="drawer-btn">
					<button class="btn btn-blue" @click.prevent="save">保存</button>
					<button class="btn btn-blue" v-show="config.type !== 'material' && config.action === 'new'" @click.prevent="saveAndNext">保存并下一步</button>
					<button type="button" @click.prevent="closeDrawer" class="btn btn-gray">取消</button>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import store from 'store';
import actions from 'actions';

import Event from 'event';
import {
	objType,
	mixin,
	copyObj
} from 'utils/common';
import CampaignDrawer from './campaign/campaignDrawer.vue';
import FlightDrawer from './flight/FlightDrawer.vue';
import MaterialDrawer from './material/MaterialDrawer.vue';
export default {
	name: 'MainPutDrawer',
	data() {
		return {
			typeMap: {
				campaign: '推广计划',
				flight: '推广单元',
				material: '创意'
			},
			orderKey: ['campaign', 'flight', 'material'],
			orderMsg: ['推广计划', '推广单元', '创意'],
			actionMap: {
				new: '新建',
				copy: '复制',
				modify: '修改'
			},
			campaignId: 0
		};
	},
	computed: {
		config: () => store.state.putDrawerCtr
	},
	components: {
		CampaignDrawer,
		FlightDrawer,
		MaterialDrawer
	},
	methods: {
		closeDrawer() {
			actions.controlDrawer(this.$store, {
				show: false,
				config: {}
			});
		},
		save(cb) {
			Event.$off('put-save-result');
			Event.$on('put-save-result', (params) => {
				Event.$emit('put-save-success');
				if (cb && objType(cb) === 'Function') {
					cb(params);
				} else {
					actions.controlDrawer(store, {
						show: false,
						config: {}
					});
				}
			});
			Event.$emit('put-save');
		},
		saveAndNext() {
			this.save((params) => {
				let next = '';
				if (this.config.type === 'campaign') {
					next = 'flight';
				} else if (this.config.type === 'flight') {
					next = 'material';
				}
				actions.controlDrawer(this.$store, {
					show: true,
					type: next,
					action: 'new',
					config: params
				});
			});
		}
	}
};
</script>