<template>
	<div class="page-content">
		<p class="page-title show-menu">上传商家资质</p>
		<div class="content">
			<el-form :model="formData" :rules="rules" ref="createForm" label-width="110px" style="margin-bottom: 60px;">
				<el-form-item label="资质名称：" prop="name">
					<el-input v-model="formData.name"></el-input>
					<p class="gray-text">请注意根据资质内容修改资质名称。若资质名称不明确，将延长审核时间</p>
				</el-form-item>
				<el-form-item label="资质图片：" prop="images" class="is-required" v-if="!this.certificateId">
					<el-upload
						:action="uploadurl"
						:accept="filetype"
						:default-file-list="formData.images"
						:on-success="upSuccess"
						:on-remove="upRemove"
						style="width: 400px;">
						<el-button size="small" type="primary" style="margin-right: 10px;">点击上传</el-button>
						<span class="gray-text">图片大小不超过500k，仅支持jpg、png格式</span>
					</el-upload>
				</el-form-item>
				<el-form-item  label="资质图片：" prop="images" class="is-required" v-if="this.certificateId">
					<div class="image-list">
						<img :src="image" v-for="image in formData.images.split(',')">
					</div>
				</el-form-item>
				<el-form-item label="资质类型：" prop="type">
					<el-select v-model="formData.type" :disabled="!!this.certificateId">
						<el-option label="商家资质" :value="1"></el-option>
						<el-option label="品牌权限" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="资质有效期：" class="is-required">
					<el-row>
						<el-col :span="6">
							<el-form-item prop="startTime">
								<el-date-picker v-model="formData.startTime" type="date" :editable="false" placeholder="开始日期" :disabled="!!this.certificateId">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<span class="el-col-" style="margin: 0 15px 0 5px;">-</span>
						<el-col :span="8">
							<el-form-item prop="endTime">
								<el-date-picker v-model="formData.endTime" type="date" :editable="false" placeholder="开始日期" :disabled="!!this.certificateId">
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<div class="page-footer">
				<a href="#" class="btn btn-primary w120" @click.prevent="save">保存</a>
			</div>
		</div>
	</div>
</template>
<script>
import http from 'http';
import router from '../../../../route.js';
export default {
	name: 'AccountCertificateCreate',
	data() {
		return {
			uploadurl: `${$CONFIG['domain']}api/image/upload`,
			filetype: "image/jpg,image/jpeg,image/png",
			images: {
				length: 0,
				list:{}
			},
			isup: 0,
			formData: {
				name: '',
				images: '',
				type: 1,
				startTime: '',
				endTime: ''
			},
			rules: {
				name: [{
					required: true, message: '请输入资质名称', trigger: 'blur'
				}],
				startTime: [{
					validator: function(rule, value, callback) {
						if (!value) {
							callback(new Error('请选择开始时间'));
						} else {
							callback();
						}
					}
				}],
				endTime: [{
					validator: (rule, value, callback) => {
						if (!value) {
							callback();
						} else {
							let certificate = this.formData;
							if (+certificate.endTime != 0 && +certificate.startTime > +certificate.endTime) {
								callback(new Error("结束时间不能早于开始时间"));
							} else {
								callback();
							}
						}
					},
					trigger: "change"
				}],
				images: [{
					validator: (rule, value, callback) => {
						if (this.images.length == 0 && !this.certificateId) {
							callback(new Error('请上传资质图片'));
						} else {
							callback();
						}
					}
				}]
			}
		};
	},
	computed: {
		certificateId() {
			return +this.$route.params.id;
		}
	},
	created() {
		if (this.certificateId) {
			this.getCertificate();
		}
	},
	methods: {
		upSuccess(response, file, fileList) {
			this.images.list[file.name] = response.data.imageUrl;
			this.images.length++;
		},
		upRemove(file, fileList) {
			for (let key in this.images.list) {
				if (key == file.name) {
					delete this.images.list[key];
					this.images.length--;
				}
			}
		},
		getCertificate() {
			http.get('/api/certificate?certificateId=' + this.certificateId).then(res => {
				if (res.data.code == 200) {
					this.formData = Object.assign({}, this.formData, res.data.data);
				} else {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		save() {
			this.$refs.createForm.validate((valid) => {
				if (!valid) {
					return;
				}

				let saveData = {
					name: this.formData.name,
					startTime: +this.formData.startTime,
					endTime: this.formData.endTime ? +this.formData.endTime : 2145888000000,
					type: this.formData.type,
					images: this.formData.images
				}
				if (this.certificateId) {
					saveData.certificateId = this.certificateId;
				} else {
					let images = [];
					for (let key in this.images.list) {
						images.push(this.images.list[key]);
					}
					saveData.images = images;
				}
				http({
					url: '/api/certificate',
					method: this.certificateId ? 'put' : 'post',
					data: saveData
				}).then((res) => {
					if(res.data.code == 200){
						router.push({name: 'certificate'});
					} else if (res.data.code >= 500) {
						this.$message({
							type: 'error',
							duration: 300,
							message: '服务器异常，请稍后再试。'
						});
					} else {
						this.$message({
							type: 'error',
							duration: 300,
							message: '操作失败，请检查网络设置或稍后再试。'
						});
					}
				}).catch(function(error){
					console.log(error);
				});
			});
		}
	}
};
</script>