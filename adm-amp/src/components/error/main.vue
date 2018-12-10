<template>
	<div class="error-main">
		<m-head></m-head>
		<div class="error-body">
			<div class="body-scaffold" :class="errorClass"></div>
		</div>
		<div class="error-footer" v-show="type === 403">
			<p class="error-title">哎呀抱歉！服务器拒绝了您的请求</p>
			<p class="error-detail">请确认您拥有所需的访问权限</p>
			<a class="action-back" @click.prevent="goIndex">回到首页</a><a @click.prevent="goBack">返回上一页</a>
		</div>
		<div class="error-footer" v-show="type === 500">
			<p class="error-title">哎呀出错了！</p>
			<p class="error-detail">服务器出现内部错误，我们正在努力修复</p>
			<a class="action-back" @click.prevent="goIndex">回到首页</a><a @click.prevent="goBack">返回上一页</a><a @click.prevent="refresh">尝试刷新</a>
		</div>
	</div>
</template>
<script>
import router from '../../route.js';
import store from 'store';
import Head from '../common/head.vue';
import actions from 'actions';
export default {
	name:'error',
	data(){
		return{
			msg:''
		};
	},
	computed:{
		type(){
			return store.state.errorCode;
		},
		errorClass(){
			return store.state.errorCode === 403 ? 'error-403' : 'error-500';
		}
	},
	components: {
		'm-head': Head
	},
	methods:{
		goIndex() {
			actions.error(store, 0);
			router.push({
				name: 'index'
			});
		},
		goBack(){
			actions.error(store, 0);
			router.go(-1);
		},
		refresh(){
			window.location.reload();
		}
	}
};
</script>
