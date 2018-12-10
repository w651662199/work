<template>
	<div class="link-container select-list">
		<div class="link-item">
			<i class="group-tip">*</i>链接文字：<input class="url-input" type="text" placeholder="链接文字" v-model="linkTextStr">
			<span class="message-error" v-show="isError && errorType === 0">{{errorMsg}}</span>
		</div>
		<div class="link-item">
			<i class="group-tip">*</i>链接地址：<input class="url-input" type="text" placeholder="http://..." v-model="url">
			<span class="message-error" v-show="isError && errorType === 1">{{errorMsg}}</span>
		</div>
		<div class="link-item">
			<button class="button" type="button" @click="addLink">确认</button>
			<button class="button cancel" type="button" @click="cancelHandle">取消</button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'module-link',
	props: ['linkText'],
	data() {
		return {
			url: '',
			errorType: 0,
			isError: false,
			errorMsg: '',
			linkTextStr: ''
		};
	},
	methods: {
		addLink() {
			let urlReg = /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/g;
			if (this.linkTextStr.length === 0) {
				this.errorType = 0;
				this.isError = true;
				this.errorMsg = '请输入链接文字';
			} else if (this.url.length === 0) {
				this.errorType = 1;
				this.isError = true;
				this.errorMsg = '请输入url';
			} else {
				if (this.linkText === this.linkTextStr) {
					this.$parent.execCommand('createLink', this.url);
				} else {
					this.$parent.execCommand('insertHTML', '<a href="' + this.url + '">' + this.linkTextStr + '</a>');
					this.url = '';
				}
			}
		},
		cancelHandle() {
			this.linkTextStr = '';
			this.url = '';
			this.isError = false;
			this.errorMsg = '';
		}
	},
	watch: {
		linkText: function(val, oldVal) {
			this.linkTextStr = val;
		}
	}
};
</script>
<style lang="less" scoped>
.link-container {
	width: 332px;
	padding: 15px;
	box-sizing: border-box;
	cursor: auto;
	.link-item {
		color: #333;
		padding: 0 20px;
		text-align: center;
		.url-input {
			padding: 6px 12px;
			border: 1px solid #ddd;
			border-radius: 5px;
			line-height: 18px;
			margin-left: 5px;
		}
	}
	.button {
		color: #fff;
		background-color: inherit;
		padding: 6px 12px;
		white-space: nowrap;
		vertical-align: middle;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		border: 1px solid #d30312;
		border-radius: 5px;
		margin-right: 4px;
		background: #d30312;
		&.cancel {
			border: 1px solid #c0ccda;
			background: #fff;
			color: #1F2D3D;
		}
	}
	.message-error {
		line-height: 10px;
 		font-size: 14px;
		display: block;
		color: #ff0000;
	}
}
</style>