<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">新建推广组</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form">
				<div class="form-column">
					<el-form :model="groupData" ref="groupForm" :rules="formRules" label-width="155px">
						<el-form-item label="推广组名称：" prop="name" class="is-required">
							<el-input v-model="groupData.name" placeholder="请输入推广组名称"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-blue-simple" type="button" @click.prevent="saveAndNext">保存并下一步</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
		</div>
	</div>
</template>
<script>
import {objType} from 'utils/common';
import Event from 'event';
import actions from 'actions';
import Http from 'http';
export default {
	name: 'GroupDrawer',
	data() {
		return {
			groupData: {
				groupId: 0,
				name: ''
			},
			formRules: {
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('请输入推广组名称'));
						} else if (value.length > 30) {
							callback(new Error('填写的内容不得超过30个字符'));
						} else {
							/*
							Http.get('/api/group/exist?name=' + value, {
								hideLoading: true
							}).then((res) => {
								if (res.data.code == 200 && res.data.iserror === 0) {
									if (res.data.data.exist == 1) {
										callback(new Error('推广组名称已存在'));
									} else {
										callback();
									}
								} else {
									callback();
								}
							}).catch((error) => {
								callback();
							});*/
							callback();
						}
					},
					trigger: 'blur'
				}]
			}
		};
	},
	props: ['groupId', "name"],
	created() {
		if (this.groupId) {
			this.groupData.groupId = this.groupId;
			this.groupData.name = this.name;
		}
	},
	methods: {
		closeDrawer() {
			Event.$emit('closeGroupDrawer');
		},
		save(cb) {
			this.$refs['groupForm'].validate((valid) => {
				if (valid) {
					Http({
						url: '/api/group',
						method: this.groupId == 0 ? 'post' : 'put',
						data: this.groupData
					}).then((res) => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							if (cb && objType(cb) === 'Function') {
								let data = {
									name: this.groupData.name,
									groupId: res.data.data.groupId
								};
								cb(data);
							}
							this.closeDrawer();
						} else {
							this.$message({
								type: 'error',
								message: res.data.msg,
								duration: 3000
							});
						}
					}).catch((error) => {
						console.log(error);
					});
				}
			});
		},
		saveAndNext() {
			this.save((groudData) => {
				actions.controlDrawer(this.$store, {
					show: true,
					action: 'new',
					type: 'campaign',
					config: groudData
				});
			});
		}
	}
};
</script>