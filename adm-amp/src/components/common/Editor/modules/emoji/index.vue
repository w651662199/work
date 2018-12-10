<template>
	<div class="emoji-container">
		<div class="box-arrow"></div>
		<div class="emoji-page" :class="{'current-page': index === currentPage}" v-for="(pageItems, index) in emojiList">
			<div class="emoji-item" v-for="item in pageItems" :date-face="item.name" :title="item.name" @click="addEmoji(item.name)">
				<img :src="item.icon">
			</div>
		</div>
		<div class="emoji-page-nation">
			<span class="page-nation-item" :class="{'current': index === currentPage}" v-for="(pageItems, index) in emojiList" @click="changePage(index)">{{index + 1}}</span>
		</div>
	</div>
</template>
<script>
import EMOJILIST from './emoji.js';
export default {
	name: 'module-emoji',
	data() {
		return {
			emojiList: [],
			currentPage: 0
		};
	},
	created() {
		for (let i = 0; i < EMOJILIST.length; i = i + 23) {
			this.emojiList.push(EMOJILIST.slice(i, i + 24));
		}
	},
	methods: {
		addEmoji(emojiText) {
			this.$parent.execCommand('insertHTML', '<span>' + emojiText + '</span>');
		},
		changePage(index) {
			this.currentPage = index;
		}
	}
};
</script>
<style lang="less">
.emoji-container {
	position: absolute;
	width: 332px;
	height: 190px;
	border: 1px solid #D3DCE6;
	background: #fff;
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
	.box-arrow, .box-arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
	}
	.box-arrow {
		top: -6px;
		left: 50%;
		margin-left: -6px;
		border-width: 6px;
		border-top-width: 0;
		border-bottom-color: #d1dbe5;
		&:after {
			content: " ";
			border-width: 6px;
			top: 1px;
			margin-left: -6px;
			border-top-width: 0;
			border-bottom-color: #fff;
		}
	}
	.emoji-page {
		width: 100%;
		height: 130px;
		padding: 5px;
		box-sizing: border-box;
		display: none;
		&.current-page {
			display: block;
		}
		.emoji-item {
			width: 30px;
			height: 30px;
			margin: 5px;
			font-size: 0;
			float: left;
			cursor: pointer;
			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
	.emoji-page-nation {
		width: 100%;
		height: 55px;
		text-align: center;
		.page-nation-item {
			display: inline-block;
			cursor: pointer;
			width: 24px;
			height: 24px;
			margin: 0 4px;
			font-size: 16px;
			line-height: 24px;
			color: #898e97;
			&.current, &:hover {
				color: #fff;
				background: #d30312;
				border-radius: 4px;
			}
		}
	}
}
</style>