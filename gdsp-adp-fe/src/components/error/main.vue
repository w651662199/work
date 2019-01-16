<template>
	<div class="error-main">
		<div class="login-header"><span class="header-login"><a href="#">gomeplus</a></span></div>
		<div class="error-body">
			<div class="body-scaffold" :class="errorClass"></div>
		</div>
		<div class="error-footer" v-show="type === 403">
			<p class="error-title">哎呀抱歉！服务器拒绝了您的请求</p>
			<p class="error-detail">请确认您拥有所需的访问权限</p>
			<router-link :to="{name: 'index'}" class="action-back" tag="a">回到首页</router-link><a @click="goBack">返回上一页</a>
		</div>
		<div class="error-footer" v-show="type === 500">
			<p class="error-title">哎呀出错了！</p>
			<p class="error-detail">服务器出现内部错误，我们正在努力修复</p>
			<router-link :to="{name: 'index'}" class="action-back" tag="a">回到首页</router-link><a @click="goBack">返回上一页</a><a @click="refresh">尝试刷新</a>
		</div>
	</div>
</template>
<script>
import router from '../../route.js';
import store from 'store';
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
	methods:{
		goBack(){
			router.go(-1);
		},
		refresh(){
			window.location.reload();
		}
	}
};
</script>
