<template>
	<div class="dialog-mask">
		<div class="dialog-container" v-if="!isDisagree">
			<h1 class="dialog-title">
				<span class="title-text">为了提供更完善的服务，我们对《平台服务协议》进行了变更，请阅读并同意后，再继续使用AMP平台。</span>
			</h1>
			<div class="dialog-content">
				<m-agreement></m-agreement>
			</div>
			<div class="dialog-action-bar">
				<button class="btn btn-gray" @click="cancelHandler" style="margin-right: 20px;">不同意</button>
				<button class="btn btn-primary" @click="agreeHandler">同意</button>
			</div>
		</div>
		<div class="dialog-container disagree" v-if="isDisagree">
			<div class="dialog-content">
				<p>同意协议后，<br />才可继续使用AMP平台。</p>
				<div class="dialog-action-bar">
					<button class="btn btn-primary" @click="sureHandler">知道了</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Agreement from '../app/register/register-agreement.vue';
import Http from 'http';
import actions from 'actions';
export default {
	name: 'agreement-dialog',
	data() {
		return {
			isDisagree: false
		};
	},
	components: {
		'm-agreement': Agreement
	},
	methods: {
		sureHandler() {
			this.isDisagree = false;
		},
		cancelHandler() {
			this.isDisagree = true;
		},
		agreeHandler() {
			Http.get('/api/agree').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					actions.setUserAgree(store, 1);
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}
};
</script>
<style lang="less" scoped>
	.dialog-title {
		padding-bottom: 10px;
		.title-text {
			text-align: center;
			font-weight: bold;
			color: #000;
		}
	}
	.dialog-content {
		width: 560px;
		height: 220px;
		overflow: auto;
		box-sizing: border-box;
		padding: 15px 25px;
		border-radius: 10px;
		background: #f0f0f0;
		.dialog-agreement {
			width: 100%;
			position: inherit;
			margin-left: 0;
			.agreement-header {
				padding: 10px;
				padding-top: 0;
				span {
					font-size: 16px;
					font-weight: bold;
				}
			}
			.standard {
				padding: 0;
				font-size: 12px;
			}
		}
	}
	.disagree {
		.dialog-content {
			height: 360px;
			background: none;
			text-align: center;
			p {
				padding-top: 105px;
				font-size: 18px;
				font-weight: bold;
				color: #525252;
			}
		}
	}
</style>