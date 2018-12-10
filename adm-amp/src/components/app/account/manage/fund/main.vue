<template>
	<div>
		<div class="page-tab">
			<div class="tab-item" :class="{'active': fundType === 1}" @click="changeFundType(1)">现金账户</div>
			<div v-if="oaIsShow == 1" class="tab-item" :class="{'active': fundType === 2}" @click="changeFundType(2)">内部流转金账户</div>
			<div class="tab-item" :class="{'active': fundType === 3}" @click="changeFundType(3)">虚拟金账户</div>
		</div>
		<div class="page-content">
			<m-cash v-if="fundType === 1"></m-cash>
			<m-oa v-if="fundType === 2"></m-oa>
			<m-virtual v-if="fundType === 3"></m-virtual>
		</div>
	</div>
</template>
<script>
import actions from 'actions';
import Http from 'utils/http';
import Event from 'event';
import Cash from './accountOverviewCash.vue';
import Oa from './accountOverviewOa.vue';
import Virtual from './accountOverviewVirtual.vue';
export default {
	name: 'accountManageFundMain',
	data() {
		return {
			fundType: 1,
			balance: 1,
			oaIsShow: 0
		};
	},
	components: {
		'm-cash': Cash,
		'm-oa': Oa,
		'm-virtual': Virtual,
	},
	created() {
		this.getOaIsShow();
	},
	methods: {
		changeFundType(type) {
			if (this.fundType !== type) {
				this.fundType = type;
			}
		},
		getOaIsShow() {
			Http.get('/api/account/all/balance').then((res) => {
				let data = res.data;
				if(res.data.code === 200 && res.data.iserror === 0) {
					this.oaIsShow = res.data.data.masterAccount.oaIsShow;
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}
};
</script>
