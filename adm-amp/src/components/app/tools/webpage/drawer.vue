<template>
	<div>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="config.show" @click="closeDrawer()"></div>
		</transition>
		<transition name="drawer">
			<div class="amp-drawer webpage-drawer" v-if="config.show">
				<div class="drawer-part" ref="scrollContainer">
					<h2 class="part-header"><span class="header-text">{{actionMap[config.action] + typeMap[config.type]}}</span><span class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span></h2>
					<div class="part-guide" :class="'part-guide0' + step" >
						<span class="guide-step guide-step01">
							<b class="step-text">选择模板</b>
							<b class="step-number">1</b>
							<b class="step-icon">
								<em class="icon icon-right"></em>
							</b>
						</span>
						<span class="guide-step guide-step02">
							<b class="step-text">编辑页面</b>
							<b class="step-number">2</b>
							<b class="step-icon">
								<em class="icon icon-right"></em>
							</b>
						</span>
						<span class="guide-percent"></span>
					</div>
					<!-- <transition-group name="drawer-inner"> -->
						<m-newpage key="1" v-if="config.show && config.type === 'template'"></m-newpage>
						<m-editpage key="2" v-if="config.show && config.type === 'edit'"></m-editpage>
						<m-template5 key="3" v-if="config.show && config.type === 'template5'"></m-template5>
					<!-- </transition-group> -->
				</div>
				<div class="drawer-btn">
					<button class="btn btn-primary" v-show="config.type === 'template'" @click="next()">下一步</button>
					<button class="btn btn-gray" v-show="isShowPreBtn" @click="getDraft()">上一步</button>
					<button class="btn btn-primary" v-show="isShowCommonBtn" @click="saveDraft()">保存草稿</button>
					<button class="btn btn-primary" v-show="isShowCommonBtn" @click="publish()">发布</button>
					<button class="btn btn-primary" v-show="isShowCommonBtn" @click="preview()">预览</button>
					<button @click="closeDrawer()" class="btn btn-gray">取消</button>
				</div>
			</div>
		</transition>
		<m-preview v-if="showPreview" :pageId="tempWebpageId" :showPreview="showPreview" :isTemplate="isTemplate5"></m-preview>
	</div>
</template>
<script>
/*
 * 抽屉调用方法：调用 actions 的 controlDrawer 方法
 * 传入一个对象
 * 具体可看 vuex/state/drawer.js 列出的 key
 */
import store from 'store';
import actions from 'actions';
import Event from 'event';
import Http from 'http';
import {
	objType,
	mixin,
	copyObj
} from 'utils/common';

import CONST from '../../../../help/CONST.js';

import DrawerTemplate from './drawer-template.vue';
import DrawerEdit from './drawer-edit.vue';
import DrawerTemplate5 from './drawerTemplate5.vue';
import pagePreview from './pagePreview.vue';
export default {
	name: 'app-page-new',
	props: ['webpageId'],
	data() {
		return {
			typeMap: {
				template: '选择模板',
				edit: '编辑页面',
				template5: '自建页面'
			},
			orderKey: ['template', 'edit', 'template5'],
			orderMsg: ['选择模板', '编辑页面', '自建页面'],
			actionMap: {
				new: '新建',
				modify: '修改'
			},
			tempWebpageId: 0,
			showPreview: false,
			con : CONST.DRAWERPAGE,
			autoSaveInterval: 0,
			isTemplate5: false
		};
	},
	computed: {
		config: () => store.state.drawerCtrl,
		type: () => store.state.drawerCtrl.type,
		isShowCommonBtn() {
			return this.config.type === 'edit' || this.config.type === 'template5';
		},
		isShowPreBtn() {
			return this.config.action === 'new' && (this.config.type === 'edit' || this.config.type === 'template5');
		},
		step() {
			//(orderKey.indexOf(config.type) + 1)
			if (this.config.type === 'template5') {
				return 2;
			} else {
				return this.orderKey.indexOf(this.config.type) + 1
			}
		}
	},
	components: {
		'm-newpage': DrawerTemplate,
		'm-editpage': DrawerEdit,
		'm-preview': pagePreview,
		'm-template5': DrawerTemplate5
	},
	create() {
		this.tempWebpageId = this.webpageId;
	},
	mounted() {
		let vm = this;
		Event.$on('close-preview', () => {
			vm.showPreview = false;
		});
	},
	methods: {
		closeDrawer() {
			actions.controlDrawer(this.$store, {
				show: false,
				config: {}
			});
			this.tempWebpageId = 0;
			Event.$emit('get-list');
		},
		saveDraft() {
			// 将要保存
			Event.$emit('page-save', {pId: this.tempWebpageId, isAutoSave: false});
			Event.$off('page-save-result');
			Event.$once('page-save-result', (argv) => {
				if (argv.error) {
					return;
				}
				actions.controlDrawer(store, {
					show: false
				});
			this.tempWebpageId = 0;
				Event.$emit('clear-pageId');
				Event.$emit('get-list');
				this.$message({
					message: '保存成功',
					type: 'success',
					duration: 3000
				});
			});
		},
		publish() {
			Event.$emit('page-save' ,{pId: this.tempWebpageId, publish:'publish'});
			Event.$off('page-save-result');
			Event.$once('page-save-result', (argv) => {
				if (argv.error) {
					return;
				}
				// this.pageId = this.config.type != 'template5' ? argv.res.data.pageId : argv.res.data.webpageId;
				Event.$emit('page-publish', argv);
				Event.$off('page-publish-result');
				Event.$once('page-publish-result', (argv) => {
					if (argv.error) {
						if (argv.res.msg && argv.res.msg.length > 0) {
							this.$message({
								message: argv.res.msg,
								type: 'error',
								customClass: "message-mod"
							});
						}
						return;
					}
					actions.controlDrawer(store, {
						show: false
					});
					this.tempWebpageId = 0;
					this.$message({
						message: '发布成功',
						type: 'success',
						duration: 3000
					});
					Event.$emit('get-list');
					Event.$emit('clear-pageId');
				});
			});
		},
		preview() {
			this.isTemplate5 = this.config.type === 'template5';
			Event.$emit('page-save', {pId: this.tempWebpageId});
			Event.$off('page-save-result');
			Event.$once('page-save-result', (argv) => {
				if (argv.error) {
					return;
				}
				if (argv.res.webpageTemplateId == 3 && argv.res.videoId !== '0') {
					Http.get("/api/video/detail",{
						hideLoading: true,
						params: {
							videoId: argv.res.videoId,
						}
					}).then((res) => {
						if (res.data.code === 200 && res.data.data.convertStatus == -1) { //失败
							this.$message({
								message: '视频转码失败，请重新上传!',
								type: 'error'
							});
							setTimeout(()=>{
								this.tempWebpageId = argv.res.webpageId;
								this.showPreview = true;
							},3000)
						}else{
							this.tempWebpageId = argv.res.webpageId;
							this.showPreview = true;
						}
					}).catch(function (error) {
						console.log(error);
					});
				} else {
					if (!this.tempWebpageId) {
						this.tempWebpageId = argv.res.webpageId;
					}
					this.showPreview = true;
				}
			});
		},
		next() {
			Event.$off('template-save-result');
			Event.$once('template-save-result', (data) => {
				let	type = data.webpageTemplateId === 5 ? 'template5' : 'edit';
				let pageData = mixin(CONST.DRAWERTEMPLATE5, {name: data.name, webpageTemplateId: data.webpageTemplateId, platform: data.platform});
				actions.controlDrawer(this.$store, {
					show: true,
					type: type,
					action: this.config.action,
					config: pageData
				});
			});
			Event.$emit('template-save');
		},
		getDraft() {
			actions.controlDrawer(this.$store, {
				show: true,
				type: 'template',
				action: this.config.action,
				config: {}
			});
			this.tempWebpageId = 0;
		}
	},
	watch: {
		'config': {
			handler: function(val, oldVal) {
				if (val.type === 'template5' && val.show) {
					window.isWebpage5 = true;
					this.autoSaveInterval = setInterval(() => {
						Event.$emit('page-save', {pId: this.tempWebpageId, isAutoSave: true});
					}, 5 * 60 * 1000);
				} else {
					clearInterval(this.autoSaveInterval);
				}
				if (!val.show) {
					this.tempWebpageId = 0;
				}
				document.body.style.overflow = val.show ? 'hidden' : 'auto';
			},
			deep: true
		},
		'webpageId': function(val, oldVal) {
			this.tempWebpageId = val;
		}
	}
};
</script>
<style scoped>
.amp-drawer .drawer-part .part-guide{width: 225px;}
.amp-drawer .drawer-part .part-guide .guide-step02 {
	left: 100%;
}
</style>
