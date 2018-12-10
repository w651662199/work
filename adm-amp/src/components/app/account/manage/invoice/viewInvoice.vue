<template>
	<div class="page-content">
		<div class="content">
			<div class="amp-form">
				<div class="form-column">
					<el-form :model="formData" ref="formData" label-width="180px">
						<div style="font-size:20px">发票详情</div>
						<el-form-item label="公司抬头：">
								<span>{{formData.companyName}}</span>
						</el-form-item>
						<el-form-item label="发票内容：">
							<span>{{formData.content}}</span>
						</el-form-item>
						<el-form-item label="发票类型：">
							<span>{{changeType(formData.type)}}</span>
						</el-form-item>
						<el-form-item label="发票金额：">
							<span>{{formData.amount/100}} 元</span>
						</el-form-item>
						<div style="font-size:20px">收件信息</div>
						<el-form-item label="地址信息：" prop="legalReprName">
								<span>{{formData.invoiceRecipient.province}}{{formData.invoiceRecipient.city}}{{formData.invoiceRecipient.district}}{{formData.invoiceRecipient.address}}</span>
						</el-form-item>
						<el-form-item label="收件人：" prop="legalReprIdNumber">
							<span>{{formData.invoiceRecipient.name}}</span>
						</el-form-item>
						<el-form-item label="联系电话：">
							<span>{{formData.invoiceRecipient.phone}}</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Http from 'http';
import { copyObj} from 'utils/common';
export default {
	name: 'ViewInvoicer',
	data() {
		return {
			formData: {
				invoiceRecipient: {}
			},
		};
	},
	computed: {
		invoiceId() {
			return this.$route.params.id;
		}
	},
	created() {
		this.getData();
	},
	methods: {
		changeType(num) {
			let map = {
				1: '增值税普通发票',
				2: '增值税专用发票',
			};
			return map[num];
		},
		getData() {
			Http.get('/api/invoice', {
				params: {
					invoiceId: this.invoiceId
				}
			}).then((res) => {
				if (res.data.code == 200) {
					this.formData = Object.assign({}, res.data.data);
					this.formData.identify = this.changeType(this.formData.type);
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}
};
</script>