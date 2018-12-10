<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span
				class="header-text">{{actionMap[config.action] + typeMap[config.type]}}</span><span
				class="header-fn"><em @click="closeDrawer()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form03">
				<p class="title titleIcon"><em class="icon icon-selecton"></em></p>
				<p class="title titleDes">已成功{{actionMap[config.action]}}人群</p>
				<p class="des" v-html="msg"></p>
				<p><button class="btn btn-primary" @click="closeDrawer()">完成</button></p>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import Http from 'http';
	import Event from 'event';
	export default {
		name: 'drawer-crowd-template',
		props: ['crowdId'],
		data() {
			return {
				typeMap: {
					template: '人群',
					edit: '人群',
					success: '人群'
				},
				orderKey: ['template', 'edit'],
				actionMap: {
					new: '新建',
					modify: '修改'
				}
			};
		},
		computed: {
			config: () => store.state.drawerDmpCtrl,
			msg() {
				let msg = this.config.action == 'new' ? '稍等一段时间，运算完成后，<br>可在投放单元引用人群。' : '稍等一段时间，运算完成后，<br>投放单元以修改后人群进行投放。'
			    return msg;
			}
		},
		methods:{
			closeDrawer(){
				Event.$emit('success-close');
				Event.$emit('get-list');
			}
		}
	}

</script>
<style scoped lang="less">
	p{
		text-align: center;
	}
	.title{
		color:#1bb169;
		em{
			font-size: 80px;
		}
	}
	.titleDes{
		font-size: 23px;
		line-height: 3;
	}
	.des{
		color:#535558;
		margin: 0 0 20px;
		font-size: 18px;
		line-height: 1.5;
	}
	.titleIcon{
		margin-top: 80px;
	}
</style>
