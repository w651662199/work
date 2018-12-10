<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">{{typeMap[config.type]}}标签</span><span class="header-fn"><em
				@click="closeDrawer()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form03">
				<el-form label-width="124px" :model="formData" ref="formData" :rules="rules">
					<el-form-item label="标签名称：" prop="name">
						<el-input v-model="formData.name" placeholder="请输入标签名称"></el-input>
					</el-form-item>
					<el-form-item label="SKU ID：" prop="SKUlist" class="is-required">
						<!--<el-input v-model="formData.sku" placeholder="请输入SKU ID" type="textarea" :rows = 4  resize="none">
						</el-input>-->
						<div :contentEditable="true"  user-modify="read-write-plaintext-only"  class="SKUBox" @keyup="getSKUhtml" ref="SKUbox"></div>
						<div class="el-upload__tip">多个SKU ID之间，请以逗号、分号、句号、空格或者换行分隔</div>
					</el-form-item>
					<el-form-item label-width="124px">
						<button class="btn btn-normal" @click="getSKU" type="button">获取SKU</button>
						<div class="SKUerror" v-show="validateMsg.sku.isError">{{validateMsg.sku.errorMsg}}</div>
						<table class="table main-table" style="min-width: 150%; margin-top:20px;" v-show="formData.skus.length > 0">
							<thead>
							<tr class="list-header">
								<th class="span-col-5">SKU ID</th>
								<th class="span-col-4">商品名称</th>
								<th class="span-col-4">品牌</th>
								<th class="span-col-4">店铺</th>
								<th class="span-col-4">品类</th>
								<th class="span-col-4">操作</th>
							</tr>
							</thead>
							<tbody>
							<tr class="body-row" v-for="(item,index) in formData.skus">
								<td><span>{{item.skuId}}</span></td>
								<td><span>{{item.skuName}}</span></td>
								<td><span>{{item.brandName}}</span></td>
								<td><span>{{item.shopName}}</span></td>
								<td><span>{{item.thirdCategoryName}}</span></td>
								<td><span><a @click="delSKU(index)" href="javascript:void(0)">删除</a></span></td>
							</tr>
							</tbody>
						</table>
					</el-form-item>
					<el-form-item label="SKU扩展" label-width="120px">
						<el-tooltip placement="right" effect="light">
							<div slot="content">
								同品牌：扩展至标签内所有SKU所属品牌的所有SKU商品。<br/>
								同三级类目：扩展至标签内所有SKU所属三级类目下所有SKU商品。<br/>
								同店铺：扩展至标签内所有SKU所属店铺下的所有SKU商品；如果SKU没有所属店铺，则无法扩展至店铺。
							</div>
							<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
						</el-tooltip>
						<el-checkbox v-model="isSameBrand">同品牌</el-checkbox>
						<el-checkbox v-model="isSameThirdCategory">同三级类目</el-checkbox>
						<el-checkbox v-model="isSameShop">同店铺</el-checkbox>
					</el-form-item>
					<el-form-item label="用户行为" label-width="120px" class="is-required">
						<el-tooltip placement="right" effect="light">
							<div slot="content">
								购买：所选时间周期内购买过SKU及扩展SKU的用户。<br/>
								添加过购物车（未购买）：所选时间周期内将SKU及扩展SKU添加至购物车的用户。<br/>
								收藏：所选时间周期内收藏过SKU及扩展SKU的用户。<br/>
								浏览：所选时间周期内浏览过SKU及扩展SKU的用户。
							</div>
							<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
						</el-tooltip>
						<div class="behaveContent">
							<div v-for="(item,index) in hehave" class="behaveBox">
								<el-checkbox v-model="behavior[index].type"></el-checkbox>
								<el-select  v-model="behavior[index].optionIndex">
									<el-option v-for="i in item.options" :label="i.label" :value="i.value">
										{{i.label}}
									</el-option>
								</el-select>
								{{item.title}}
							</div>
							<div class="SKUerror" v-show="validateMsg.behave.isError">{{validateMsg.behave.errorMsg}}</div>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="drawer-btn">
			<button @click="saveDrawer()" class="btn btn-primary" type="button">保存</button>
			<button @click="closeDrawer()" class="btn btn-gray" type="button">取消</button>
		</div>
		<el-dialog v-model="dialogVisible" :modal-append-to-body = "false" :show-close ="false" :close-on-click-modal="false">
			<span><h3>{{dialogMsg}}</h3></span>
			<span slot="footer" class="dialog-footer">
        		<button class="btn btn-gray" @click="closeDialog()" type="button">取消</button>
        		<button class="btn btn-primary" @click="comfirDialog()" type="button">确定</button>
      		</span>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import Http from 'utils/http';
	import {
		objType,
		mixin,
		copyObj,
		isEmptyObj,
		limitLen
	} from 'utils/common';
	export default {
		name:'app-tag-template',
		props:['tagId','entry'],
		data(){
			return {
				typeMap: {
					template: '新建',
					edit: '修改',
					preview: '查看'
				},
				formData:{},
				isSameBrand:false, //同品牌
				isSameThirdCategory:false, //三级类目
				isSameShop:false,   //同店铺
				behaviors:[],
				validateMsg:{
				    behave:{
				        isError:false,
						errorMsg:''
					},
					sku:{
				        isError:false,
				        errorMsg:''
					}
				},
				SKUhtml:'',
				tagcrowd:false, //是否被人群引用
				dialogVisible:false,
				dialogMsg:'',
				behavior:[{
					type: false,
					option:'最近30天',
					optionIndex:1
				},{
					type: false,
					option:'最近7天',
					optionIndex:1
				},{
					type: false,
					option:'最近7天',
					optionIndex:1
				},{
					type: false,
					option:'最近7天',
					optionIndex:1
				}],
				rules:{
					'name': [{
						required: true,
						message: '请输入标签名称',
						trigger: 'blur',
					}, {
						validator: (rule, value, callback) => {
							if (!limitLen(value, 60)) {
								callback(new Error('字数不超过30个汉字'));
							} else if (value.trim() == '') {
								callback(new Error('请输入标签名称'));
							} else {
								Http.get('api/tag/tagName', {
									params: {
										tagName: this.formData.name.trim(),
										tagId : this.tagId ? this.tagId : 0,
									}
								}).then((res) => {
									if (res.data.code == 200) {
										if (res.data.data.tagName) {
											callback(new Error('标签名称已存在'));
										} else {
											callback();
										}
									}
								}).catch((error) => {
									console.log(error);
								})
							}
						}, trigger: 'blur'
					}],
					'behaviors':[{
						validator: (rule, value, callback) => {
							if(this.behaviors.length == 0){
							    callback(new Error('请选择用户行为'));
							}else {
							    callback();
							}
						}, trigger: 'change'
					}]
				},
				hehave:[{
				    title:'内购买过商品',
					options:[{
				        value:1,
						label:'最近30天'
					},{
						value:2,
						label:'最近3个月'
					},{
						value:3,
						label:'最近6个月'
					},{
						value:4,
						label:'最近一年'
					}]
				},{
					title:'内将商品添加到购物车',
					options:[{
						value:1,
						label:'最近7天'
					},{
						value:2,
						label:'最近15天'
					},{
						value:3,
						label:'最近30天'
					},{
						value:4,
						label:'最近3个月'
					}]
				},{
					title:'内收藏过商品',
					options:[{
						value:1,
						label:'最近7天'
					},{
						value:2,
						label:'最近15天'
					},{
						value:3,
						label:'最近30天'
					},{
						value:4,
						label:'最近3个月'
					},{
						value:5,
						label:'最近6个月'
					}]
				},{
					title:'内浏览过商品',
					options:[{
						value:1,
						label:'最近7天'
					},{
						value:2,
						label:'最近15天'
					},{
						value:3,
						label:'最近30天'
					},{
						value:4,
						label:'最近3个月'
					}]
				}],
			}
		},
		computed: {
			drawerData: () => store.state.drawerDmpCtrl.config, // from store
			actionType: () => store.state.drawerDmpCtrl.action,
			config: () => store.state.drawerDmpCtrl,
		},
		created(){
			this.formData = copyObj(this.drawerData);
			if(this.actionType == 'modify'){
			   this.formData.behaviors.forEach((item,index) => {
			       let i = item.behaviorType-1;
				   this.behavior[i].type = true;
				   this.behavior[i].optionIndex = item.behaviorOptionIndex
			   });
			   this.isSameBrand = this.formData.isSameBrand == 1;
			   this.isSameShop = this.formData.isSameShop == 1;
			   this.isSameThirdCategory = this.formData.isSameThirdCategory == 1;
			   //查看是否被人群引用
				this.tagCrowd();
			}
		},
		methods:{
			comfirDialog(){
				Http.put('/api/tag',{
					tagId:this.tagId,
					name:this.formData.name,
					skus:this.formData.skus,
					isSameBrand:this.isSameBrand ? 1 : 0,
					isSameThirdCategory:this.isSameThirdCategory ? 1 : 0,
					isSameShop:this.isSameShop ? 1: 0,
					behaviors:this.behaviors,
					type:1,
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.closeDrawer();
					}else{
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})
			},
			closeDialog(){
			    this.dialogVisible = false;
			},
		    //查看是否是被人群引用
			tagCrowd(){
				Http.get('api/tag/crowd',{
					params:{
						tagIds: this.tagId
					}
				}).then((res) => {
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						this.tagcrowd = res.data.data.quote;  // true => 被引用  false => 没有被引用
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})
			},
		    getSKU(){
				let newArr = this.SKUhtml.replace(/&nbsp|，|;|；|,|\.|。|\s|\n|<[^>]+>/g,'&nbsp;').split('&nbsp;');
			    let skuRepeat = false;
				let errorArr = [];
				let errorSKUhtml = '';
				let Arr = [];
				newArr = newArr.filter((item) => {
				    if(item !== ''){
						return item
					}
				});
				if(newArr.length == 0){
					this.validateMsg.sku.isError = true;
					this.validateMsg.sku.errorMsg = '请输入SKU ID';
					return false;
				}else if(newArr.length > (5 - this.formData.skus.length)){
				    this.validateMsg.sku.isError = true;
				    this.validateMsg.sku.errorMsg = '最多可添加5个SKU';
				    return false;
				}else{
					this.validateMsg.sku.isError = false;
				};
			/*	newArr.forEach((item,index) => {
				    if(newArr.indexOf(item) !== index){  //数组内不重复
				        if(errorIndexArr.indexOf(newArr.indexOf(item)) == -1){
							errorIndexArr.push(newArr.indexOf(item));
						}
						if(errorIndexArr.indexOf(index) == -1){
							errorIndexArr.push(index);
						}
					}else{ //看是否和table内重复
						this.formData.skus.find((list,i) => {
							if(item === list.skuId && errorIndexArr.indexOf(index) == -1){
								errorIndexArr.push(index);
								tableRepeat = true;
							}else{
								tableRepeat = false;
							}
						});
					}
				});
				newArr.forEach((item,index) => {
					let error = errorIndexArr.indexOf(index) > -1 ? 'style="color:#d30312"' : 'style="color:#596069"' ;
					errorSKUhtml += `<span ${error}>${item}</span>;`;
				});
				if(errorIndexArr.length > 0){
					this.validateMsg.sku.isError = true;
					this.validateMsg.sku.errorMsg = '已添加了相同的SKU,相同的SKU ID 已标为红色。';
					this.$refs.SKUbox.innerHTML = errorSKUhtml;
				}else{
					this.validateMsg.sku.isError = false;
					this.$refs.SKUbox.innerHTML = '';
				}
				console.log('3');
				console.log(errorSKUhtml);
                if(tableRepeat) return false;*/
			    //去重
				newArr = this.delRepeatArr(newArr);
				newArr.forEach((item,index) => {
					if(!this.getSelFilterList(this.formData.skus,item)) {
						Arr.push(item);
					}
				})
				newArr = Arr;
				console.log(newArr);
				if(newArr.length == 0) {
					this.$refs.SKUbox.innerHTML = '';
					return false;
				}
				Http.get('/api/mall/skus',{
				    params:{
						skuIds:newArr.join(',')
					}
				}).then((res) => {
				    if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
                        let data = res.data.data;
                        data.forEach((item) => {
                            if(item.skuId == null) return false;
                            let obj = {};
                            obj.skuId = item.skuId;
                            obj.skuName = item.name ? item.name : '';
                            obj.brandId = item.brandId ? item.brandId : '';
                            obj.brandName = item.brandName ? item.brandName : '';
                            obj.thirdCategoryId = item.thirdCategoryId ? item.thirdCategoryId : '';
                            obj.thirdCategoryName = item.thirdCategoryName ? item.thirdCategoryName : '';
                            obj.shopId = item.shopId ? item.shopId : '';
                            obj.shopName = item.shopName ? item.shopName : '';
							this.formData.skus.push(obj);
						})
						//获得的sku为空
						let SKUlistId = []; //正常不为空的SKUlist ID
						errorSKUhtml = '';
						data.filter((item) => {
						    return item.skuId !== null
						}).forEach((item) => {
						    if(SKUlistId.indexOf(item.skuId) == -1){
								SKUlistId.push(item.skuId);
							}
						});
						console.log('能获取到的SKU')
						console.log(SKUlistId);
						console.log('错误的');
						console.log(errorArr);
						newArr.forEach((item,index) => {
							if(SKUlistId.indexOf(item) == -1){
								errorArr.push(item);
							}
						})
						if(errorArr.length > 0){
							this.validateMsg.sku.isError = true;
							this.validateMsg.sku.errorMsg = '未找到SKU ID对应的商品';
							errorArr.forEach((item) => {
								errorSKUhtml += `<span>${item};</span>`
							})
							this.$refs.SKUbox.innerHTML = errorSKUhtml;
						}else{
							this.validateMsg.sku.isError = false;
							this.$refs.SKUbox.innerHTML = '';
						}

					}else{
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})
			},
			getSKUhtml(e) {
				this.SKUhtml = this.$refs.SKUbox.innerHTML.replace('/<[^>]+>/g', '');
			},
			//数组去重
			delRepeatArr(arr){
		        let Arr = [];
		        for (let i = 0; i < arr.length; i++) {
		            if(Arr.indexOf(arr[i]) == -1){
		                Arr.push(arr[i])
					}
				}
				return Arr;
			},
			delSKU(index){
		        this.formData.skus.splice(index,1);
			},
			saveDrawer(){
			    this.$refs.formData.validate((result) => {
					if(this.behaviors.length == 0){
						this.validateMsg.behave.isError = true;
						this.validateMsg.behave.errorMsg = '请选择用户行为';
					}
					if(this.formData.skus.length == 0){
						this.validateMsg.sku.isError = true;
						this.validateMsg.sku.errorMsg = '请输入SKU ID';
					}
					if(this.behaviors.length == 0 || this.formData.skus.length == 0) return false;
			        if(result){
			            if(this.tagId){ //修改
							if(this.tagcrowd){
							    this.dialogVisible = true;
							    this.dialogMsg = '确定保存标签信息吗?保存后，添加了该标签的人群需重新运算';
							    return false;
							}
							Http.put('/api/tag',{
								tagId:this.tagId,
								name:this.formData.name,
								skus:this.formData.skus,
								isSameBrand:this.isSameBrand ? 1 : 0,
								isSameThirdCategory:this.isSameThirdCategory ? 1 : 0,
								isSameShop:this.isSameShop ? 1: 0,
								behaviors:this.behaviors,
								type:1,
							}).then((res) => {
								if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.closeDrawer();
									Event.$emit('get-list');
								}else{
									this.$message({
										message: res.data.msg,
										type: 'error'
									});
								}
							})
						}else{
							Http.post('/api/tag',{
								name:this.formData.name,
								skus:this.formData.skus,
								isSameBrand:this.isSameBrand ? 1 : 0,
								isSameThirdCategory:this.isSameThirdCategory ? 1 : 0,
								isSameShop:this.isSameShop ? 1: 0,
								behaviors:this.behaviors,
								type:1,
							}).then((res) => {
								if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.closeDrawer();
									Event.$emit('get-list');
								}else{
									this.$message({
										message: res.data.msg,
										type: 'error'
									});
								}
							})
						}
					}
				})
			},
			closeDrawer(){
			    if(this.entry == 'crowd') {
					Event.$emit('close-tagTemplate')
				} else {
					actions.controlDmpDrawer(this.$store, {
						show: false,
						config:{}
					});
				}
			},
			getSelFilterList(arrList,id) {
				let isHave = false;
				let arr = [];
				arrList.forEach((item) => {
					arr.push(item.skuId)
				});
				return arr.indexOf(id) > -1  //true => 有
			}
		},
		watch:{
		    'behavior': {
				handler:function(value){
					this.behaviors = [];
				    this.behavior.forEach((item,index) => {
				        let obj = {};
				        if(item.type) {
				            obj.behaviorType = index+1;
				            obj.behaviorOptionIndex = item.optionIndex;
				            this.behaviors.push(obj)
						}
					})
					this.validateMsg.behave.isError = this.behaviors.length == 0;
				},
				deep:true
			},
			'SKUhtml':{
		        handler:function(){},
				deep:true
			}
		}
	}
</script>
<style lang="less" scoped>
	/*.SKUBox .skuError{*/
		/*color:#ff4949;*/
	/*}*/
	.el-tooltip{
		float: left;
		margin-right: 15px;
	}
	.SKUBox{
		width: 100%;
		height:200px;
		border:1px solid #c0ccda;
		border-radius: 4px;
		overflow: auto;
		.skuError{
			color:#d30312
		}
	}
	.behaveContent{
		margin-left: 31px;
	}
	.behaveBox{
		margin-bottom: 20px;
		.el-select{
			display: inline-block;
			margin: 0 10px 0;
		}

	}
</style>
