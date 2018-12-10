<template>
	<div class="page-content">
		<div class="content">
			<div class="register-page succeed">
				<div class="msg-item">
					<div class="msg-img"></div>
				</div>
				<div class="msg-item">
					<p class="title">申请资料已成功提交!</p>
					<p>信息进入审核序列，请您耐心等待。</p>
					<p>审核结果将以邮件形式通知您</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import store from 'store';
export default {
	name: 'app-register-succeed',
	computed:{
	    userInfo: () => store.state.userInfo
	},
	created() {
		if (this.userInfo.isRegistered && this.userInfo.isApproved) {
			this.$router.push({name: 'index'});
		}
	}
};
</script>
