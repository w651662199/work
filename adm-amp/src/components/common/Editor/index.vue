<template>
	<div class="html-editor" ref='editor'>
		<div class="editor-toolbar">
			<tool-bar></tool-bar>
			<transition name="zoom-in-top">
				<div class="editor-dashboard" ref="dashboard" v-show="isShowDashboard">
					<font-size v-show="currentDashBoard === 'size'"></font-size>
					<font-color v-show="currentDashBoard === 'color'"></font-color>
					<!-- <editor-link v-show="currentDashBoard === 'link'" :linkText="linkText"></editor-link> -->
					<editor-emoji v-show="currentDashBoard === 'emoji'"></editor-emoji>
				</div>
			</transition>
		</div>
		<div class="editor-content" ref="content" contenteditable="true" v-html="content"></div>
	</div>
</template>
<script>
import Event from 'event';
import RangeHandler from './range/handler';
import {addEvent} from './utils/common.js';
import ToolBar from './modules/toolBar/index.vue';
import FontSize from './modules/fontSize/index.vue';
import FontColor from './modules/fontColor/index.vue';
import EditorLink from './modules/link/index.vue';
import EditorEmoji from './modules/emoji/index.vue';
export default {
	name: 'html-editor',
	props: {
		value: {
			type: String,
			required: true,
			default: ''
		},
		options: {
			type: Object,
			default: null
		}
	},
	components: {
		ToolBar,
		FontSize,
		FontColor,
		EditorLink,
		EditorEmoji
	},
	data() {
		return {
			content: '',
			isShowDashboard: false,
			currentDashBoard: '',
			dashboardStyle: '',
			linkText: ''
		};
	},
	created() {
		this.content = this.value || '<p>&#8203;</p>';
	},
	mounted(){
		const content = this.$refs.content;
		content.innerHTML = this.content;
		content.addEventListener('mouseenter', () => {
			this.$refs.editor.parentNode.className = this.$refs.editor.parentNode.className.replace('draggable-box', '');
		});
		content.addEventListener('mousemove', () => {
			this.$refs.editor.parentNode.className = this.$refs.editor.parentNode.className.replace('draggable-box', '');
		});
		const dashboard = this.$refs.dashboard;
		dashboard.addEventListener('mouseenter', () => {
			this.$refs.editor.parentNode.className = this.$refs.editor.parentNode.className.replace('draggable-box', '');
		});
		dashboard.addEventListener('mousemove', () => {
			this.$refs.editor.parentNode.className = this.$refs.editor.parentNode.className.replace('draggable-box', '');
		});
		content.addEventListener('mouseup', this.saveCurrentRange, false);
		content.addEventListener('keyup', (e) => {
			if (e.keyCode === 13) {
				document.execCommand('formatBlock', false, '<p>');
			}
			this.$emit('input', content.innerHTML);
			this.saveCurrentRange();
		}, false)
		content.addEventListener('mouseout', (e) => {
			if (e.target === content) {
				this.saveCurrentRange();
				this.$refs.editor.parentNode.className = this.$refs.editor.parentNode.className + ' draggable-box';
			}
		}, false)
		content.addEventListener('paste', (e) => {
			e.preventDefault();
			let text = (e.originalEvent || e).clipboardData.getData('text/plain');
			this.execCommand('insertText', text);
		});
		this.touchHandler = (e) => {
			if (content.contains(e.target)) {
				this.saveCurrentRange();
			}
		}
		let listItems = this.$refs.editor.getElementsByClassName('editor-dashboard');
		addEvent(listItems, 'mouseenter', (event) => {
			this.isShowDashboard = true;
		});
		addEvent(listItems, 'mouseleave', (event) => {
			this.isShowDashboard = false;
		});
	},
	methods: {
		showDashboard(type, centerX) {
			this.isShowDashboard = true;
			this.currentDashBoard = type;
			if (centerX) {
				setTimeout(() => {
					if (type === 'link') {
						if (this.range) {
							this.linkText = '';
							const textNodes = new RangeHandler(this.range).getAllTextNodesInRange();
							if (this.range.startOffset === this.range.endOffset && textNodes.length ===  1) {
								this.linkText = '';
							} else {
								if (textNodes.length ===  1) {
									const textNode = textNodes[0];
									this.linkText = textNode.textContent.substring(this.range.startOffset, this.range.endOffset);
								} else {
									textNodes.forEach((node) => {
										if (node == this.range.startContainer) {
											this.linkText += node.textContent.substring(this.range.startOffset);
										} else if (node == this.range.endContainer) {
											this.linkText += node.textContent.substring(0, this.range.endOffset);
										} else {
											this.linkText += node.textContent
										}
									});
								}
							}
						}
					}
					this.$refs.dashboard.style.width = 'auto';
					let dashWidth = this.$refs.dashboard.offsetWidth;
					if (!dashWidth && type == 'emoji') {
						dashWidth = this.$refs.dashboard.getElementsByClassName('emoji-container')[0].offsetWidth;
					}
					this.$refs.dashboard.style.left = centerX - dashWidth * 0.5 + 'px';
				}, 1);
			}
		},
		hideDashboard(type) {
			this.isShowDashboard = false;
		},
		saveCurrentRange(){
			const selection = window.getSelection ? window.getSelection() : document.getSelection();
			if (!selection.rangeCount) {
				return
			}
			const content = this.$refs.content;
			for (let i = 0; i < selection.rangeCount; i++) {
				const range = selection.getRangeAt(0);
				let start = range.startContainer;
				let end = range.endContainer;
				start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start;
				end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end;
				if (content.contains(start) && content.contains(end)) {
					this.range = range;
					break
				}
			}
		},
		restoreSelection(){
			const selection = window.getSelection ? window.getSelection() : document.getSelection();
			selection.removeAllRanges();
			if (this.range) {
				selection.addRange(this.range);
			} else {
				const content = this.$refs.content;
				const p = document.createElement('p');
				const range = document.createRange();
				content.appendChild(p);
				range.setStart(p, 0);
				range.setEnd(p, 0);
				selection.addRange(range);
				this.range = range;
			}
		},
		execCommand(command, arg){
			this.restoreSelection();
			if (this.range) {
				new RangeHandler(this.range).execCommand(command, arg);
			}
			this.saveCurrentRange();
			this.$emit('input', this.$refs.content.innerHTML);
		}
	}
};
</script>
<style lang="less">
	div, p, ul, li {
		padding: 0;
		margin: 0;
	}
	ul, li {
		list-style: none;
	}
	.html-editor {
		width: 100%;
		height: 300px;
		border: 1px #ddd solid;
		border-radius: 10px;
		color: #000;
		.editor-toolbar {
			position: relative;
			width: 100%;
			height: 50px;
			border-bottom: 1px #ddd solid;
			box-sizing: border-box;
			line-height: 50px;
			text-align: left;
			background: #fff8e6;
			border-radius: 15px 15px 0 0;
			.icon {
				margin: 0 15px;
				cursor: pointer;
			}
		}
		.editor-dashboard {
			position: absolute;
			top: 100%;
			left: 0;
			font-size: 14px;
			background: #fff;
			.select-list {
				border: 1px solid #d1dbe5;
				padding: 5px 0;
				margin-left: 0 !important;
				background-color: #fff;
				z-index: 100;
				min-width: 100%;
				box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
				.list-item {
					cursor: pointer;
				}
			}
			&.isLink {
				border-top: 1px #ddd solid;
				border-bottom: 1px #ddd solid;
				left: 1px !important;
			}
		}
		.editor-content {
			width: 100%;
			height: 250px;
			padding: 20px;
			box-sizing: border-box;
			text-align: left;
			cursor: text;
			overflow: auto;
			font-size: 16px;
			a {
				text-decoration: underline;
				color: #0090ec;
			}
		}
	}
	.webpage-item-error {
		.html-editor {
			border-color: #ff0000;
		}
	}
</style>
