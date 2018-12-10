<template>
	<div>
		<div class="page-tab">
			<div class="tab-item" :class="{'active': detailType === 1}" @click="changeType(1)">消费记录</div>
			<div class="tab-item" :class="{'active': detailType === 2}" @click="changeType(2)">充值记录</div>
			<div class="tab-item" :class="{'active': detailType === 3}" @click="changeType(3)">划拨记录</div>
		</div>
		<div class="page-content">
			<expense-list v-if="detailType === 1"></expense-list>
			<income-list v-if="detailType === 2"></income-list>
			<transfer-list v-if="detailType === 3"></transfer-list>
		</div>
	</div>
</template>
<script>
import ExpenseList from './expenseList.vue';
import IncomeList from './incomeList.vue';
import TransferList from './transferList.vue';
export default {
	name: 'accountManageDetailMain',
	data() {
		return {
			detailType: 1
		};
	},
	components: {
		ExpenseList,
		IncomeList,
		TransferList
	},
	created() {
		if (this.$route.params && this.$route.params.type) {
			this.detailType = this.$route.params.type;
		}
	},
	methods: {
		changeType(type) {
			if (this.detailType !== type) {
				this.detailType = type;
			}
		}
	}
};
</script>