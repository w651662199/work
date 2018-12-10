<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span
				class="header-text">{{actionMap[config.action] + typeMap[config.type]}}</span><span
				class="header-fn"><em @click="beforeCloseDrawer()" class="icon icon-close"></em></span></h2>
			<div class="part-guide" :class="'part-guide0' + (orderKey.indexOf(config.type) + 1)">
				<span class="guide-step guide-step01">
					<b class="step-text">选择标签</b>
					<b class="step-number">1</b>
					<b class="step-icon">
						<em class="icon icon-right"></em>
					</b>
				</span>
				<span class="guide-step guide-step02">
					<b class="step-text">基本信息</b>
					<b class="step-number">2</b>
					<b class="step-icon">
						<em class="icon icon-right"></em>
					</b>
				</span>
				<span class="guide-percent"></span>
			</div>
			<m-newpage key="1" v-if="config.show && config.type === 'template'" :crowdId="crowdId"></m-newpage>
			<m-basicpage key="2" v-if="config.show && config.type === 'edit'" :crowdId="crowdId"></m-basicpage>
		</div>
		<div class="drawer-btn">
			<button type='button' class="btn btn-primary" v-show="(config.action === 'new' || config.action === 'modify') && config.type === 'template'" @click="next()">下一步</button>
			<button type='button' class="btn btn-primary" v-show="(config.action === 'new' || config.action === 'modify') && config.type === 'edit'"
					@click="getDraft()">上一步
			</button>
			<button type='button' class="btn btn-primary" v-show="config.type === 'edit'" @click="publish()">保存</button>
			<button type='button' @click="beforeCloseDrawer()" class="btn btn-gray">取消</button>
		</div>
		<el-dialog v-model="dialogVisible" :modal-append-to-body = "false" :show-close ="false" :close-on-click-modal="false">
			<span><h3>是否取消{{actionMap[config.action]}}人群</h3></span>
			<span slot="footer" class="dialog-footer">
				<button type='button' class="btn btn-gray"
						@click="closeDrawer()">取消{{actionMap[config.action]}}</button>
				<button type='button' class="btn btn-primary" @click="dialogVisible = false">继续{{actionMap[config.action]}}</button>
			</span>
		</el-dialog>
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

	import CONST from '../../../../../help/CONST.js';

	import DrawerTemplate from './crowdDrawer.vue';
	import BasicPage from './basicPageDrawer.vue';

	export default {
		name: 'app-dmp-crowd-new',
		props: ['crowdId'],
		data() {
			return {
				typeMap: {
					template: '人群',
					edit: '人群'
				},
				orderKey: ['template', 'edit', 'success'],
				orderMsg: ['选择模板', '编辑页面'],
				actionMap: {
					new: '新建',
					modify: '修改'
				},
				showPreview: false,
				dialogVisible: false
			};
		},
		computed: {
			config: () => store.state.drawerDmpCtrl
		},
		components: {
			'm-newpage': DrawerTemplate, //选择标签
			'm-basicpage': BasicPage, //基本信息
		},
		ceated(){
		    console.log(this.crowdId);
		},
		mounted() {
			let vm = this;
			Event.$on('close-preview', () => {
				vm.showPreview = false;
			});
			//下一步
			Event.$off('template-next-save-result');
			Event.$on('template-next-save-result',(data) => {
				actions.controlDmpDrawer(vm.$store, {
					show: true,
					type: 'edit',
					action: this.config.action,
					config: data.data
				});
			})
			//上一步
			Event.$off('template-prev-res');
			Event.$on('template-prev-res',(data) => {
				actions.controlDmpDrawer(vm.$store, {
					show: true,
					type: 'template',
					action: this.config.action,
					config: data.data
				});
			})
		},
		methods: {
			beforeCloseDrawer() {
			    this.dialogVisible = true;
			},
			closeDrawer() {
			    //投放单元那里关闭
			    Event.$emit('unit-close-crowd')
				this.dialogVisible = false;
				actions.controlDmpDrawer(this.$store, {
					show: false,
					config:{}
				});
			},
			publish() {
			    Event.$emit('template-corwd-save');
				//保存
				Event.$off('template-corwd-save-res');
				Event.$on('template-corwd-save-res',(data) => {
				    Event.$emit('crowd-save',{data:data.data})
				})
			},
			next() {
				Event.$emit('template-next-save');
			},
			getDraft() {
				Event.$emit('template-prev');
			},

		}
	};
</script>
<style scoped>
	.amp-drawer .drawer-part .part-guide{width: 225px;}
	.amp-drawer .drawer-part .part-guide .guide-step02 {
		left: 100%;
	}
	.amp-drawer .drawer-part .part-guide02 .guide-percent{
		width:100%;
	}
</style>
