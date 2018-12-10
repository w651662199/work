<template>
	<div class="amp-drawer">
		<div class="drawer-part" id="content">
			<h2 class="part-header"><span class="header-text">查看标签</span><span class="header-fn"><em
				@click="closeDrawer()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form03">
				<el-form label-width="124px" :model="formData" ref="formData">
					<el-form-item label="标签名称：" prop="name">
						<p>{{formData.name}}</p>
					</el-form-item>
					<el-form-item label="SKU ID：">
						<table class="table main-table" style="min-width: 150%; margin-top:20px;">
							<thead>
							<tr class="list-header">
								<th class="span-col-5">SKU ID</th>
								<th class="span-col-4">商品名称</th>
								<th class="span-col-4">品牌</th>
								<th class="span-col-4">店铺</th>
								<th class="span-col-4">品类</th>
							</tr>
							</thead>
							<tbody>
							<tr class="body-row" v-for="(item,index) in formData.skus">
								<td><span>{{item.skuId}}</span></td>
								<td><span>{{item.skuName}}</span></td>
								<td><span>{{item.brandName}}</span></td>
								<td><span>{{item.shopName}}</span></td>
								<td><span>{{item.thirdCategoryName}}</span></td>
							</tr>
							</tbody>
						</table>
					</el-form-item>
					<el-form-item label="SKU扩展：">
						<p>
							<span v-show='formData.isSameBrand == 1'>同品牌</span>
							<span v-show='formData.isSameShop == 1'>
								<span v-show='formData.isSameBrand == 1'>、</span>
								同店铺
							</span>
							<span v-show="formData.isSameThirdCategory">
								<span v-show='formData.isSameShop == 1 || formData.isSameBrand == 1'>、</span>
								同三级类目
							</span>
						</p>
					</el-form-item>
					<el-form-item label="用户行为：">
						<div class="behaveContent">
							<p v-for="(item,index) in behavior" v-show="item.type">
								{{item.options[item.optionIndex-1]}}{{item.title}}
							</p>
						</div>
					</el-form-item>
					<el-form-item label="被添加的人群：">
                       <!--<p v-for="item in crowds">
						   {{item.crowdName}}
					   </p>-->
						<div>
							<table class="table main-table" style="min-width: 500px; margin-top:20px;">
								<thead>
								<tr class="list-header">
									<th class="span-col-5">人群ID</th>
									<th class="span-col-4">人群名称</th>
								</tr>
								</thead>
								<tbody>
								<tr v-if="crowds.length == 0">
									<td :colspan="2" style="text-align: center; height: 100px;line-height: 100px;">暂无内容</td>
								</tr>
								<tr class="body-row" v-for="(item,index) in crowds">
									<td><span>{{item.crowdId}}</span></td>
									<td><span>{{item.crowdName}}</span></td>
								</tr>
								</tbody>
							</table>
							<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
										   @size-change="pageSizeChange"
										   @current-change="currentPageChange"
										   :current-page="page.currentPage"
										   :page-sizes="page.pageSizes"
										   :page-size="page.pageSize"
										   layout="total, sizes, prev, pager, next"
										   :class="{'el-pagination-reset': true}"
										   :total="page.totalCount">
							</el-pagination>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="drawer-btn">
			<button @click="closeDrawer()" class="btn btn-gray">关闭</button>
		</div>
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
		name:'app-tag-preview',
		props:['tagId'],
		data(){
			return {
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
				crowds:[],
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 20
				},
				behavior:[{
					type: false,
					title:'内购买过商品',
					options:['最近30天','最近3个月','最近6个月','最近一年'],
					optionIndex:0
				},{
					type: false,
					title:'内将商品添加到购物车',
					options:['最近7天','最近15天','最近30天','最近3个月'],
					optionIndex:0
				},{
					type: false,
					title:'内收藏过商品',
					options:['最近7天','最近15天','最近30天','最近3个月','最近6个月'],
					optionIndex:0
				},{
					type: false,
					title:'内浏览过商品',
					options:['最近7天','最近15天','最近30天','最近3个月'],
					optionIndex:0
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
			}
			this.getTagCrowds();
		},
		methods:{
			closeDrawer(){
				Event.$emit('close-preview');
				actions.controlDmpDrawer(this.$store, {
					show: false,
					config:{}
				});
			},
			pageSizeChange(size) {
				this.page.pageSize = size;
				this.getTagCrowds();
			},
			currentPageChange(page) {
				this.page.currentPage = page;
				this.getTagCrowds();
			},
			getTagCrowds() {
			    Http.get('api/tag/crowds',{
			        params:{
						tagId:this.tagId
					}
				}).then((res) => {
			        if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
			            this.crowds = copyObj(res.data.data.list);
						this.page.totalCount = res.data.data.totalCount;
					} else {
						this.$message({
							message: '获取数据失败，请检查网络设置或稍后再试',
							type: 'error',
							duration: 3000
						});
					}
				})
			},

			/*comfirDialog(){
				Http.put('/api/tag',{
					tagId:this.tagId,
					name:this.formData.name,
					skus:this.formData.skus,
					isSameBrand:this.isSameBrand ? 1 : 0,
					isSameThirdCategory:this.isSameThirdCategory ? 1 : 0,
					isSameShop:this.isSameShop ? 1: 0,
					behaviors:this.behaviors,
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
				let newArr = this.SKUhtml.replace(/;|；|\.|。|\s\s\s*|\n|<[^>]+>/g,'&nbsp;').split('&nbsp;');
				let skuRepeat = false;
				let errorIndexArr = [];
				let errorSKUhtml = '';
				let tableRepeat = false;
				newArr.filter((item) => {
					if(item){
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
				newArr.forEach((item,index) => {
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
					let error = errorIndexArr.indexOf(index) > -1 ? 'style="color:#d30312"' : '' ;
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
				if(tableRepeat) return false;
				Http.get('/api/mall/skus',{
					params:{
						skuId:this.delRepeatArr(newArr).join(',')
					}
				}).then((res) => {
					if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
						let data = res.data.data;
						data.forEach((item) => {
							if(item.skuId == null) return false;
							let obj = {};
							obj.skuId = item.skuId;
							obj.skuName = item.name;
							obj.brandId = item.brandId;
							obj.brandName = item.brandName;
							obj.thirdCategoryId = item.thirdCategoryId;
							obj.thirdCategoryName = item.thirdCategoryName;
							obj.shopId = item.shopId;
							obj.shopName = item.shopName;
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
						newArr.forEach((item,index) => {
							if(SKUlistId.indexOf(item) == -1 && errorIndexArr.indexOf(newArr.indexOf(item)) == -1){
								console.log(item);
								errorIndexArr.push(newArr.indexOf(item));
							}
						})
						newArr.forEach((item,index) => {
							let error = errorIndexArr.indexOf(index) > -1 ? 'style="color:#d30312"' : '' ;
							errorSKUhtml += `<span ${error}>${item}</span>;`;
						});
						console.log(errorIndexArr);
						console.log(errorSKUhtml);
						if(errorIndexArr.length > 0){
							this.validateMsg.sku.isError = true;
							this.validateMsg.sku.errorMsg = '未找到SKU ID对应的商品,错误的SKU ID 已标为红色';
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
				this.SKUhtml = this.$refs.SKUbox.innerHTML.replace('/<[^>]+>/g','');
			},
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
								this.dialogMsg = '确定保存标签信息吗?';
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
						}else{
							Http.post('/api/tag',{
								name:this.formData.name,
								skus:this.formData.skus,
								isSameBrand:this.isSameBrand ? 1 : 0,
								isSameThirdCategory:this.isSameThirdCategory ? 1 : 0,
								isSameShop:this.isSameShop ? 1: 0,
								behaviors:this.behaviors,
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
						}
					}
				})
			},
			closeDrawer(){
				actions.controlDrawer(this.$store, {
					show: false,
					config:{}
				});
			}*/
		}
	}
</script>
<style lang="less" scoped>
	.tagName.el-input.is-disabled .el-input__inner{
		background-color: none;
		color:none;
	}
	.behaveBox{
		margin-bottom: 20px;
		.el-select{
			display: inline-block;
			margin: 0 10px 0;
	    }
	}
</style>
