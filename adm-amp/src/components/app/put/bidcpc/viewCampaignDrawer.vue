<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">查看计划</span>
				<span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span>
			</h2>
			<div class="amp-form">
				<div class="form-column">
					<el-form :model="formData" ref="formData" label-width="140px">
						<el-form-item label="投放计划名称：" prop="name">
							<span>{{formData.name}}</span>
						</el-form-item>
						<el-form-item label="起止时间：" v-if="formData.isContinuous" label-width="140px">
							<span>{{startTime | moment('YYYY年MM月DD日')}}</span>-
							<span v-if="formData.isUnlimited == 1">不限</span>
							<span v-else>{{endTime | moment('YYYY年MM月DD日')}}</span>
						</el-form-item>
						<el-form-item label="计费方式：">
							CPC（竞价）
						</el-form-item>
						<el-form-item label="广告日预算：" prop="dailyAdBudget" class="daliyRebate">
							<span v-if="formData.adLimited == 0">不限</span>
							<span v-else>{{formData.dailyAdBudget}}元/天</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import {
	copyObj,
	objType,
	formatDate,
	mixin,
	formatTimeByUnit,
} from 'utils/common';

import Event from 'event';
import Http from 'http';

export default {
	name: 'app-put-view-plan',
	props: ['viewData'],
	data() {
		return {
			showHintSelectTime: false,
			formData: {},
			startTime: '',
			endTime: '',
		};
	},
	created() {
		this.formData = copyObj(this.viewData);
		// 分转元
		this.formData.dailyAdBudget = this.formData.dailyAdBudget / 100;
		this.startTime = this.formData.startTime || Date.now();
		this.endTime = this.formData.endTime || Date.now();
	},
	methods: {
		closeDrawer() {
			Event.$emit('close-view-drawer');
		}
	}
};
</script>
