<template>
	<div class="dialog-mask" v-if="value">
		<div class="dialog-container">
			<h1 class="dialog-title">
				<span class="title-text" v-if="isShowTitle">{{title}}</span>
				<span class="title-action" v-if="isShowClose" @click="close">
					<em class="icon icon-close"></em>
				</span>
			</h1>
			<div class="dialog-content">
				<slot></slot>
			</div>
			<div class="dialog-action-bar">
				<button class="btn btn-primary" v-if="isShowSure" @click="sureHandler">确定</button>
				<button class="btn btn-simple" v-if="isShowCancel" @click="cancelHandler">取消</button>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'common-dialog',
	props: {
		value: {
			required: true,
			type: Boolean,
			default: false
		},
		isShowTitle: {
			type: Boolean,
			default: true
		},
		isShowCancel: {
			type: Boolean,
			default: true
		},
		isShowSure: {
			type: Boolean,
			default: true
		},
		isShowClose: {
			type: Boolean,
			default: true
		},
		title: {
			type: String,
			default: '提示信息'
		}
	},
	data() {
		return {}
	},
	methods: {
		sureHandler() {
			this.$emit('sure');
		},
		cancelHandler() {
			this.$emit('cancel');
			this.$emit('input', false);
		},
		close() {
			this.$emit('input', false);
		}
	}
};
</script>
<style lang="less">
@import '../../assets/css/dialog.less';
</style>