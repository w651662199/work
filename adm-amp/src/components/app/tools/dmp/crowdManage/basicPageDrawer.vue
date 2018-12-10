<template>
	<el-form :model="formData" ref="formData"  label-width="100px" :rules="formRules">
		<div class="amp-form">
			<div class="form-column">
				<el-form-item label="人群名称：" prop="name">
					<el-input v-model="formData.name" placeholder="请输入人群名称"></el-input>
				</el-form-item>
				<div>
					<table class="table main-table" style="min-width: 500px;">
						<thead>
						<tr class="list-header">
							<th class="span-col-5">标签名称</th>
						</tr>
						</thead>
						<tbody>
						<tr class="body-row" v-for="item in formData.list">
							<td><span>{{item.name}}</span></td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</el-form>
</template>
<script>
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import Http from 'http';
	import {
		objType,
		mixin,
		copyObj,
		limitLen
	} from 'utils/common';
	import CONST from '../../../../../help/CONST.js';

	export default {
		name: 'app-crowd-template',
		props:['crowdId'],
		computed: {
			drawerData: () => store.state.drawerDmpCtrl.config, // from store
			actionType: () => store.state.drawerDmpCtrl.action,
			config: () => store.state.drawerDmpCtrl,
		},
		mounted(){
			Event.$on('template-prev', () => {
				Event.$emit('template-prev-res',{data:this.formData});
			});
			Event.$off('template-corwd-save');
			Event.$on('template-corwd-save', () => {
			    this.$refs.formData.validate((result) => {
			        if(result){
			            console.log(result);
			            Event.$emit('template-corwd-save-res',{data:this.formData})
					}
				})
			})
		},
		data(){
			return {
				formData: {},
				formRules:{
				    'name':[{
				        required:true,
						message:'请输入人群名称',
						trigger:'blur'
					},{validator: (rule, value, callback) => {
						if (value.trim() == '') {
							callback(new Error('请输入人群名称'));
						} else if(!limitLen(value, 60)){
							callback(new Error('最大长度不超过30个汉字'));
						}else{
							Http.get('/api/crowd/checkName', {
								params: {
									name: this.formData.name.trim(),
									crowdId: this.crowdId ? this.crowdId : 0
								}
							}).then((res) => {
								if (res.data.data.existent) {
									callback(new Error('人群名称已存在'))
								} else {
									callback();
								}
							})
						}
						}, trigger: 'blur'
					}]
				}
			}
		},
		created(){
		    this.formData = copyObj(this.drawerData);
		}
	}
</script>
<style scoped>
	.table th{
		height:35px;
	}
</style>
