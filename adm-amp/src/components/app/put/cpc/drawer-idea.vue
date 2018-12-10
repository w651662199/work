<template>
	<div class="amp-form amp-form03">
		<div class="form-column">
			<el-form :model="formData" :rules="formRules" ref="formData" label-width="124px">
				<el-form-item label="创意名称：" prop="name">
					<el-input v-model="formData.name" placeholder="请输入创意名称" :disabled="actionType === 'modify'"></el-input>
				</el-form-item>
				<el-form-item v-if="isShop || isVideo || isWebpage" label="URL地址：" prop="landingPage">
					<el-col>
						<el-col :span="16">
							<el-input v-model="formData.landingPage" placeholder="请从自建页面选择url" :readonly="true" style="width:100%;display:inline-block;margin-right:20px;" :title="formData.landingPage" :disabled="isUrlModifyDisabled || formData.landingPage.length > 0"></el-input>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="7">
							<el-button type="primary" class='URLbtn' @click="isShowAddUrl = true" :disabled="isUrlModifyDisabled">从自建页面获取</el-button>
						</el-col>
					</el-col>
				</el-form-item>
				<div v-if="isShop" data-type="好店">
					<div class="Content" v-if="formData.landingPage.length > 0">
						<label class="el-form-item__label" style="width: 124px;"></label>
						<div class="GoodContent">
							<el-form-item v-if="formData.landingPage.length > 0" label="店铺名称：" prop="title">
								<el-input v-model="formData.title" placeholder="店铺名称" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item v-if="formData.landingPage.length > 0" label="店铺文案：" prop="description">
								<el-input v-model="formData.description" type="textarea" :autosize="{minRows: 3}" placeholder="店铺文案" :disabled="true" resize="none"></el-input>
							</el-form-item>
						</div>
					</div>
					<el-form-item label="图片:" prop="image" :required="true">
						<div class="row-photo-s" style="width: 100%;">
							<input id="shopPicture" type="file" @change="shop_imageChange" accept="image/jpg,image/jpeg,image/png" >
							<div class="imgupload"  @click="shop_selectImage" style="display: inline-block">上传图片</div>
							<span style="margin-left: 10px"><em :style="{color:shopImageList.length==9?'#d9444b':'#596069'}">{{shopImageList.length}}</em>/9</span>
							<div class="el-upload__tip" style="width:100%">只能上传宽高比为1:1的图片文件</div>
							<div class="SKUerror" v-if="validateMsg.Img.isError">{{validateMsg.Img.errorMsg}}</div>
						</div>
						<div class="shopImageList" v-if="shopImageList.length > 0">
							<ul>
								<li v-for="(item,index) in shopImageList">
									<img :src="item.url">
									<em class="iconbg"></em>
									<em class="icon icon-shut" @click="shop_remove(index)"></em>
								</li>
							</ul>
						</div>
					</el-form-item>
				</div>
				<div v-if="isVideo" data-type="视频">
					<div class="Content" v-if="formData.landingPage.length > 0">
						<label class="el-form-item__label" style="width: 124px;"></label>
						<div class="GoodContent">
							<el-form-item v-if="formData.landingPage.length > 0" label="广告标题：" prop="title">
								<el-input v-model="formData.title" placeholder="广告标题" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item v-if="formData.landingPage.length > 0" label="封面图片：" prop="image" :required="true">
								<div class="content-box">
									<img class="material-image" :src="formData.image.length > 0 ? formData.image[0] : ''">
								</div>
							</el-form-item>
						</div>
					</div>
				</div>
				<div v-if="isWebpage" data-type="清单">
					<div class="Content" v-if="formData.landingPage.length > 0">
						<label class="el-form-item__label" style="width: 124px;"></label>
						<div class="GoodContent">
							<el-form-item v-if="formData.landingPage.length > 0" label="清单名称：" prop="title">
								<el-input v-model="formData.title" placeholder="清单名称" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item v-if="formData.landingPage.length > 0" label="创意图片：" prop="image">
								<div class="content-box">
									<img class="material-image" :src="formData.image[0]">
								</div>
							</el-form-item>
						</div>
					</div>
				</div>
				<div v-if="isBothTopicAndWebpage || isGood || isTopic" data-type="精选、有腔调和好东西合集">
					<el-form-item label="链接类型：">
						<el-select v-model="formData.linkType" :disabled="isLinkTypeModifyDisabled">
							<el-option v-for="item in linkType" :label="item.name" :value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
					<!-- 链接类型选了话题时显示此项 -->
					<el-form-item v-if="formData.linkType === 4" label="搜索话题：" prop="topicName" :disabled="actionType === 'modify'">
						<el-select v-model="formData.topicName" style="display: inline-block; width:400px; margin: 0 5px 0 0;" :disabled="actionType === 'modify'" remote filterable clearable placeholder="请输入话题名称"
								   :remote-method="topic_remoteMethod" no-match-text="未找到结果"  id="topicNameSelect" popper-class="optionList"
								   ref="select" @change="topic_selectChange" v-enter @enter.native="topic_log">
							<el-option  v-for="item in topicUseData.topicList" :key="item.value" :label="item.label +'-- '+ item.author"
										:value="item.label +'-- '+ item.author"  >
								<span @click="topic_optionChange(item.value,item.label)" class="optionSPAN" style="display: inline-block; width: 100%;">
									{{item.label.length > 12 ? item.label.substring(0,12) + '...' : item.label }} -- {{item.author}}
								</span>
							</el-option>
						</el-select>
						<div class="seeTopic"><a :disabled="topicUseData.previewUrl === ''" target="_blank" id="seeTopic"  >预览</a></div>
					</el-form-item>
					<!-- 链接类型选了url后显示此项 -->
					<!-- <el-form-item v-if="formData.linkType === 2" label="URL地址：" prop="name">
						<el-input v-model="formData.landingPage" placeholder="请输入url地址"></el-input>
					</el-form-item> -->
					<el-form-item v-if="formData.linkType === 2" label="URL地址：" prop="landingPage">
						<el-row>
							<el-col :span="16">
								<el-input v-model="formData.landingPage" placeholder="请从自建页面选择url" :readonly="true" style="width:100%;display:inline-block;margin-right:20px;" :disabled="isUrlModifyDisabled"></el-input>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="7">
								<el-button  class='URLbtn' @click="isShowAddUrl = true" :disabled="isUrlModifyDisabled">从自建页面获取</el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<!-- 链接类型选了商品编号后显示此项 -->
					<div class="Content">
						<label class="el-form-item__label" style="width: 124px;">{{isGood == true? '商品：':''}}</label>
						<div class="GoodContent">
							<el-form-item v-if="isGood" label="SKU ID：" prop="promotionId" :rules="formRules.skuId">
								<el-input v-model="formData.promotionId" placeholder="SKU ID"  @blur="good_getProductWithSkuId"
										  :disabled="actionType === 'modify'"></el-input>
							</el-form-item>
							<el-form-item label="广告标题：" prop="title">
								<el-input v-model="formData.title" :placeholder="!isGood ? '广告标题' : '请输入正确的SKU ID后修改'" :readonly="formData.linkType === 2" :disabled="isGood && !goodUseData.isSkuIdVisible"></el-input>
								<div class="el-upload__tip">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
							</el-form-item>
							<el-form-item label="商品图片：" prop="image" v-if="isGood" class="SKUbox">
								<div v-if="!goodUseData.allImgList.length">
									<span class="noImage">暂无图片</span>
								</div>
								<div v-else class="uploade-show uploade-select">
									<m-image-scroll v-model="goodUseData.allImgList" :index="0"></m-image-scroll>
								</div>
							</el-form-item>
							<el-form-item v-if="isBothTopicAndWebpage || isTopic" label="创意图片：" prop="image">
								<div class="row-photo-s" style="width: 100%;" >
									<input id="topPicture" type="file" @change="material_imageChange" accept="image/jpg,image/jpeg,image/png" >
									<div class="btn btn-normal" @click="material_selectImage">点击上传</div>
									<span>{{validateMsg.Img.imgUrlName}}</span>
									<div class="el-upload__tip" style="width:100%">只能上传宽高比为2:1的图片文件</div>
									<div class="SKUerror" v-if="validateMsg.Img.isError">{{validateMsg.Img.errorMsg}}</div>
								</div>
								<img v-if="formData.image.length > 0 && formData.image[0].length > 0" class="material-image" :src="formData.image[0]" style="width: 100%;">
							</el-form-item>
							<el-form-item v-if="isGood || isTopic || isBothTopicAndWebpage" label="广告文案：" prop="description">
								<el-input v-model="formData.description" type="textarea" :autosize="{minRows: 4}" placeholder="广告文案" :disabled="!goodUseData.isSkuIdVisible && isGood"></el-input>
							</el-form-item>
						</div>
						</div>
				</div>
				<el-form-item label="创意品牌">
					<el-tooltip style="float: left;" placement="right" effect="light">
						<div slot="content">您可以选择该创意关联的品牌，正确的选择创意的品牌有利于品牌的传播。</div>
						<div style="margin-right: 20px;"><em class="icon icon-doubt"></em></div>
					</el-tooltip>
					<el-checkbox-group style="width:410px;float: left;" v-model="gomeBrandIds">
						<template v-for="(item, index) in brandCheckbox">
					    	<el-checkbox class="brand" :checked="actionType === 'modify'?false:true" :label="item.gomeBrandId">{{item.name}}</el-checkbox>
					   </template>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item v-if="!isGood" label="跟单商品" prop="isSelectProducts">
					<el-tooltip placement="right" effect="light">
						<div slot="content">若您在跳转后的链接内也输入了跟单商品，<br/>则在统计效果时，此页面和在跳转后的链接<br/>内输入的商品SKU都会被统计到。</div>
						<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
					</el-tooltip>
					<el-checkbox v-model="isSelectProducts" :label="true" :disabled="isProModifyDisabled">
						添加跟单商品
					</el-checkbox>
				</el-form-item>
				<el-form-item v-if="isSelectProducts || (isGood && isRebate)" :label="isGood ? '联合推广商品：' : ''" >
					<el-col :span="8" v-for="(product, index) in formData.products" style="padding: 0 5px 20px;">
						<el-form-item
							:key="index"
							:prop="'products.' + index + '.skuId'"
							:rules="formRules.formDataProductSkuRules"
							label-width="0">
							<el-input v-model="product.skuId" placeholder="请输入商品SKU" :disabled="isProModifyDisabled"></el-input>
						</el-form-item>
					</el-col>
					<div class="detail-row detail-row-mr add-fn" v-if="selectProductCount < 9" @click="normal_addProducts"><span class="btn btn-normal"></span><span>添加</span></div>
					<template v-if="isGood && isRebate">
						<div class="detail-row detail-row-mr">
							<el-checkbox v-model="goodUseData.isAutoAddProduct.category">允许自动填充本店铺同类目商品</el-checkbox>
						</div>
						<div class="detail-row detail-row-mr">
							<el-checkbox v-model="goodUseData.isAutoAddProduct.shop">允许自动填充本店铺商品</el-checkbox>
						</div>
					</template>
				</el-form-item>
			</el-form>
		</div>
		<transition name="drawer">
			<m-add-url v-if="isShowAddUrl" :templateId="formData.templateId"></m-add-url>
		</transition>
	</div>
</template>
<script>
	import Vue from "vue";
	import apiConfig from '../../../../config/api.config.js';
	import {copyObj, isEmptyObj, getImgSize, mixin,limitLen} from 'utils/common';
	import Http from 'http';
	import Event from 'event';
	import store from 'store';
	import DrawerAddUrl from './drawer-add-url.vue';
	import ImageScroll from '../../../common/imageScroll.vue';

	Vue.directive('enter', {
		bind: function(el) {
			const Input = el.getElementsByTagName('input')[0];
			Input.addEventListener('keyup',function(e){
				if(e.keyCode == 40 || e.keyCode == 38) {
					el.dispatchEvent(new Event('enter'));
				}
			});
		}
	});
	export default {
		name: 'app-put-idea-new',
		data() {
			return {
				validateMsg:{
					Img:{
						isError:false,
						errorMsg:'',
						imgUrlName:''
					}
				},
				formData: {},
				products: [],
				brandCheckbox: [],
				gomeBrandIds: [],
				isShowAddUrl: false,
				isSelectProducts: false,
				httpMethodMap: {
					new: 'post',
					copy: 'post',
					modify: 'put'
				},
				webpageId: '',
				goodUseData: {
					shopId: '',
					categoryId: '',
					allImgList: '',
					isSkuIdVisible: false,
					isAutoAddProduct: {
						category: true,
						shop: true
					},
					visibleProducts: []
				},
				productError: {
					isError: false,
					errorMsg: ''
				},
				topicUseData: {
					topicList: [],
					previewUrl: '',
					isLoading: false,
					canRemote: true,
					skuIds: [],
					topicCount: 0,
					page: 1,
					selectQuery: ''
				},
				isUseDefaultImage: 0,
				isUploadImage: false,
				isShowTooltip: false,
				uploadUrl: `${$CONFIG['domain']}/api/image/upload`,
				shopImageList: [],
				advertId: 1,
				adverts: [],
				selectProductCount: 0,
				linkType: [{
					value: 1,
					name: '商品编号',
					disabled: false
				}, {
					value: 0,
					name: '店铺ID',
					disabled: true
				}, {
					value: 3,
					name: '圈子ID',
					disabled: true
				}, {
					value: 4,
					name: '话题ID',
					disabled: false
				}, {
					value: 2,
					name: 'URL',
					disabled: false
				}],
				formRules: {
					name: [{
						required: true,
						message: '请输入创意名称',
						trigger: 'blur'
					}, {validator: function(rule, value, callback) {
						if(limitLen(value, 30)){
							callback();
						}else{
							callback(new Error('最大长度不超过15个汉字'));
						}
					}, trigger: 'blur' }],
					title: [{
						required: true,
						message: '请输入广告标题',
						trigger: 'change'
					}],
					image: [{
						validator: (rule, value, callback) => {
							if (this.isVideo) {
								if (this.isUseDefaultImage !== 0 && this.formData.image.length === 0) {
									callback(new Error('请上传创意图片'));
								} else {
									callback();
								}
							} else if (this.formData.image.length === 0) {
								callback(new Error('请上传创意图片'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}],
					skuId: [{
						required: true,
						message: '请输入商品SKU ID',
						trigger: 'blur'
					},{
					    validator:(rule,val,callback) => {
							if(this.formData.title == '' && this.goodUseData.allImgList.length==0 && this.formData.description=='' ) {
								callback(new Error('未查询到与SKU ID相关的商品'));
							}else {
							    callback();
							}
						},
						trigger:'blur'
					}],
					landingPage: [{
						required: true,
						message: '请从自建页选取',
						trigger: 'blur'
					}],
					topicName: [{
						required: true,
						message: '请选择话题',
						trigger: 'blur'
					}],
					formDataProductSkuRules: [{
						validator: (rule, value, callback) => {
							let index = Number(rule.field.split('.')[1]);
							if (this.productError.isError) {
								callback(new Error(this.productError.errorMsg));
							} else {
								let res = this.normal_checkSkuIdVisible(value, index);
								if (res.isError) {
									callback(new Error(res.errorMsg));
								} else {
									callback();
								}
							}
						},
						trigger: 'blur'
					}],
					'description':[{validator: (rule, value, callback) => {
						if(!limitLen(value, 100) && (this.isTopic || (this.isBothTopicAndWebpage && this.formData.linkType === 4))){
							callback(new Error('最大长度不超过50个汉字'));
						} else {
							callback();
						}
					}, trigger: 'blur' }]
				}
			};
		},
		components: {
			'm-add-url': DrawerAddUrl,
			'm-image-scroll': ImageScroll
		},
		computed: {
			drawerData: () => store.state.drawerCtrl.config, // from store
			isRebate: () => store.state.drawerCtrl.isRebate, // 是否返利，从 state 中来 如果被复写掉了为 false 达到知晓上一级是否返利的目的
			actionType: () => store.state.drawerCtrl.action,
			flightLinkType() {
				return this.formData.flightLinkType;
			},
			//类型区分
			isShop() {  //好店
				return this.flightLinkType.length === 1 && this.flightLinkType[0] === 0 //店铺
			},
			isVideo() {  //视频
				return this.flightLinkType.length === 1 && this.flightLinkType[0] === 9 //视频
			},
			isWebpage() {  //清单
				return this.flightLinkType.length === 1 && this.flightLinkType[0] === 2 //自定义URL
			},
			isTopic() {  //精选
				return this.flightLinkType.length === 1 && this.flightLinkType[0] === 4 //话题
			},
			isGood() { //好东西、好物
				return this.flightLinkType.length === 1 && this.flightLinkType[0] === 1 //商品推广
			},
			isBothTopicAndWebpage() {
				let isContainTopic = this.flightLinkType.find((type) => {
					return type === 4;  //有腔调->话题
				});
				let isContainWebpage = this.flightLinkType.find((type) => {
					return type === 2;  //有腔调->自定义URL
				});
				return !!isContainTopic && !!isContainWebpage;
			},
			good_visibleProducts() {
				let products = [];
				this.formData.products.forEach((product) => {
					if (!!product.skuId && (product.hasOwnProperty('shopId') || product.hasOwnProperty('productId'))) {
						products.push(product);
					}
				});
				return products;
			},
			isProModifyDisabled() {
				return this.actionType === 'modify' && !this.isGood;
			},
			isUrlModifyDisabled() {
				return this.actionType === 'modify';
			},
			isLinkTypeModifyDisabled() {
				return this.actionType === 'modify';
			},
			relatedItemStrategy() {
				//联合推广商品自动拉取策略
				if (this.goodUseData.isAutoAddProduct.category && this.goodUseData.isAutoAddProduct.shop) {
					return 3;
				} else if (this.goodUseData.isAutoAddProduct.category && !this.goodUseData.isAutoAddProduct.shop) {
					return 1;
				} else if (!this.goodUseData.isAutoAddProduct.category && this.goodUseData.isAutoAddProduct.shop) {
					return 2;
				}
				return 0;
			}
		},
		created() {
			this.formData = copyObj(this.drawerData);
			if (this.actionType === 'modify') {
				// this.formData.flightLinkType = [this.formData.linkType];
				if (this.isShop) {
					this.formData.image.forEach((item) => {
						this.shopImageList.push({name: item, url: item});
					});
				}
				if (this.isGood) {
					// Vue.set(this.formData, "prodcuts", this.formData.relatedItems);
					let remainder = this.formData.products.length % 3;
					let integer = Math.floor(this.formData.products.length / 3);
					this.selectProductCount = integer * 3;
					if (remainder !== 0) {
						this.selectProductCount += 3;
						let subNumber = 3 - (this.formData.products.length % 3);
						for(let i = 0; i < subNumber; i++) {
							this.formData.products.push({skuId: ''});
						}
					}
					this.goodUseData.isAutoAddProduct.category = this.formData.relatedItemStrategy === 3 || this.formData.relatedItemStrategy === 1;
					this.goodUseData.isAutoAddProduct.shop = this.formData.relatedItemStrategy === 3 || this.formData.relatedItemStrategy === 2;
				}
				this.formData.products.forEach((product) => {
					if (!product.skuId && product.itemId) {
						Vue.set(product, 'skuId', product.itemId);
					}
				});
			}
			if (this.isGood) {
				if (!this.isRebate) {
					this.goodUseData.isAutoAddProduct.shop = false;
					this.goodUseData.isAutoAddProduct.category = false;
				} else {
					this.isSelectProducts = true;
				}
			}
			if (this.isBothTopicAndWebpage || this.isTopic) {
				this.formData.linkType = this.actionType !== 'modify' ? 4 : this.formData.linkType;
				this.linkType.forEach((type) => {
					type.disabled = type.value !== 4 && type.value !== 2;
				});
			} else {
				this.formData.linkType = this.flightLinkType[0];
				this.linkType.forEach((type) => {
					type.disabled = type.value !== this.flightLinkType[0];
				});
			}
			if (this.actionType == 'modify') {
				this.formData.brands.forEach((item) => {
					this.gomeBrandIds.push(item.gomeBrandId);
				});
			}
			this.getBrand();
			// this.normal_getAdverts();
		},
		mounted() {
			if(this.formData.linkType === 4 && this.actionType === 'modify'){
				this.topicUseData.skuIds = [];
				this.formData.products = [];
				this.formData.relatedItems.forEach((item) => {
					if (item.type === 0) {
						this.formData.products.push(item);
					} else if (item.type === 1) {
						this.topicUseData.skuIds.push(item);
					}
				});
				Http.get("/api/topic", {
					params: {
						hideLoading: true,
						topicId: this.formData.promotionId
					}
				}).then(res=> {
					if (res.data.code === 200) {
						this.formData.topicName = res.data.data.name + '--' + res.data.data.user.nickname;
					}else{
						this.$message({
							message: "此话题已删除或审核未通过!",
							type: 'error'
						});
					}
				})
					.catch(function(error) {
						console.log(error);
					});
			};
			if (this.actionType === 'modify' && this.isGood && this.formData.promotionId !== '') {
				Http.get('api/material/sku', {
					params: {
						skuId: this.formData.promotionId
					}
				}).then((res) => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						this.goodUseData.shopId = res.data.data.shopId;
						this.goodUseData.categoryId = res.data.data.categoryId;
						this.formData.productId = res.data.data.productId;
						this.goodUseData.allImgList = [];
						res.data.data.images.forEach((item) => {
							this.goodUseData.allImgList.push({
								url: item,
								checked: item === this.formData.image[0]
							});
						});
						this.len = Math.ceil(this.goodUseData.allImgList.length/3);
					}
				});
			}
			// 隐藏添加广告位
			Event.$off('drawer-hide-add-url');
			Event.$on('drawer-hide-add-url', () => {
				this.isShowAddUrl = false;
			});
			// 保存广告位
			Event.$off('drawer-save-add-url');
			Event.$on('drawer-save-add-url', (result) => {
				// this.formData.advertisements = result;
				if (result) {
					this.formData.landingPage = result.landingPage;
					this.formData.image = !!result.image && !this.isShop ? [result.image] : [];
					if (this.isShop) {
						this.formData.promotionId = result.shopId;
					} else if (this.isVideo) {
						this.formData.promotionId = result.videoId;
						this.isUseDefaultImage = result.useDefaultImage;
					}
					this.webpageId = result.webpageId;
					this.formData.title = result.title;
					this.formData.description = result.description;
					this.$refs.formData.validateField('landingPage');
				}
				this.isShowAddUrl = false;
			});
			//保存创意
			Event.$off('put-save');
			Event.$on('put-save', () => {
				this.validateMsg.Img.isError = false;
				this.$refs.formData.validate((result) => {
					if (result) {
						if (this.isGood && this.good_visibleProducts.length < this.selectProductCount && (this.goodUseData.isAutoAddProduct.category || this.goodUseData.isAutoAddProduct.shop)) {
							Http.get('api/material/items', { //根据店铺ID和类目ID获取商品信息
								params: this.goodUseData.isAutoAddProduct.category ? {
									shopId: this.goodUseData.shopId,
									categoryId: this.goodUseData.categoryId,
									skuId: this.formData.promotionId,
									relatedItemStrategy: this.relatedItemStrategy
								} : {
									shopId: this.goodUseData.shopId,
									skuId: this.formData.promotionId,
									relatedItemStrategy: this.relatedItemStrategy
								}
							}).then((res) => {
								if(res.status === 200 && res.data.code === 200 && res.data.iserror === 0){
									let lackLen = this.selectProductCount - this.good_visibleProducts.length;
									let list = res.data.data.list;
									this.formData.relatedItems = [...this.good_visibleProducts];
									let addNumber = 0;
									list.forEach((item) => {
										let isCon = this.formData.relatedItems.find((seleItem) => {
											return seleItem.skuId == item.itemId;
										});
										if (!isCon && addNumber < lackLen) {
											item.skuId = item.itemId;
											delete item.itemId;
											this.formData.relatedItems.push(item);
											addNumber++;
										}
									});
									this.normal_saveMaterial();
								}
							});
						} else {
							this.formData.relatedItems = this.good_visibleProducts;
							this.normal_saveMaterial();
						}
					} else {
						Event.$emit('put-save-result', {
							error: 1,
							res: null
						});
					}
				});
			});
		},
		methods: {
			getBrand() {
				Http.get('/api/advertiser/brand')
				.then((res) => {
					if (res.data.code === 200) {
						if (this.actionType == 'modify') {
							let brands = [...this.formData.brands, ...res.data.data];
							let obj = {};
							brands.forEach((item) => {
								if (!obj[item.gomeBrandId]) {
									this.brandCheckbox.push(item);
									obj[item.gomeBrandId] = 1;
								}
							});
						} else {
							this.brandCheckbox = res.data.data;
						}
					}
				})
				.catch((error) => {
					console.log(error);
				})
			},
			normal_getAdverts() {
				Http.get('api/adverts', {
					params: {
						advertId: this.advertId
					}
				}).then((res) => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						let data = res.data.data;
						let adverts= data.adverts;
						adverts.forEach((item) => {
							item.value = '';
							if (item.type === 0) {
								item.advertText = '图片：';
							} else if (item.type === 1) {
								item.advertText = '文案：';
							} else if (item.type === 2) {
								item.advertText = '视频：';
							}
						});
						this.formData.adverts = adverts;
					}
				})
			},
			normal_addProducts() {
				this.selectProductCount = this.selectProductCount === 9 ? this.selectProductCount : this.selectProductCount + 3;
				for(let i = 0; i < 3; i++) {
					this.formData.products.push({skuId: ''});
				}
			},
			normal_checkSkuIdVisible(skuId, index) {
				if (skuId === '') {
					this.formData.products[index] = {skuId: ''};
					return {isError: false, errorMsg: ''};
				}
				let isError = false;
				let product = this.formData.products.find((product, i) => {
					return i !== index && product.skuId === skuId;
				});
				let errorMsg = '';
				if (this.isGood && skuId === this.formData.promotionId) {
					return {isError: true, errorMsg: '不能与创意主商品相同'};
				} else if (!!product) {
					return {isError: true, errorMsg: '已添加了该商品，请勿重复添加'};
				} else {
					Http.get('api/material/sku', {
						hideLoading: true,
						params: { skuId: skuId }
					}).then((res) => {
						if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
							if (isEmptyObj(res.data.data)) {
								isError = true;
								errorMsg = '请填写有效的商品编号';
								this.productError.isError = isError;
								this.productError.errorMsg = errorMsg;
								this.$refs.formData.validateField('products.' + index + '.skuId');
							} else {
								this.formData.products[index] = Object.assign({}, res.data.data, this.formData.products[index], {type: 0});
							}
						} else {
							this.productError.isError = true;
							this.productError.errorMsg = res.data.msg;
							this.$refs.formData.validateField('products.' + index + '.skuId');
						}
					});
					return {isError: false, errorMsg: ''};
				}
			},
			normal_saveMaterial() {
				if (this.isUploadImage) {
					this.$message({
						message: '有图片正在上传',
						type: 'warning'
					});
					return false;
				}
				let size = getImgSize(this.formData.image[0]);
				let params = {
					name: this.formData.name,
					promotionId: this.formData.promotionId,
					productId : this.formData.productId,
					type: this.formData.type,
					linkType: this.formData.linkType,
					landingPage: this.formData.landingPage,
					title: this.formData.title,
					image: this.formData.image,
					description: this.formData.description,
					relatedItems: this.formData.linkType === 4 ? [...this.topicUseData.skuIds, ...this.formData.relatedItems] : this.formData.relatedItems,
					width: size.width,
					height: size.height,
					productLine: 2,
					webpageId: this.webpageId !== '' ? this.webpageId : this.formData.webpageId,
					relatedItemStrategy: this.relatedItemStrategy,
					gomeBrandIds: this.gomeBrandIds,
				};
				Http({
					url: 'api/material',
					method: this.httpMethodMap[this.actionType],
					data: this.actionType === 'modify' ? mixin({
						// 修改 创意ID
						materialId: this.formData.materialId
					}, params) : mixin({
						// 新建复制 单元ID
						flightId: this.formData.flightId
					}, params)
				}).then((res) => {
					if (!res.data.iserror) {
						Event.$emit('put-save-result', {
							error: 0,
							res: res.data,
							isRebate: this.isRebate
						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error',
							duration: 3000
						});
						Event.$emit('put-save-result', {
							error: 1,
							res: null
						});
					}
				}).catch((e) => {
					Event.$emit('put-save-result', {
						error: 1,
						res: null
					});
				});
			},
			shop_selectImage() {
				let input = document.getElementById('shopPicture');
				input.click();
			},
			shop_imageChange(eve) {
				let files= eve.target.files;
				this.shop_loadFile(files[0]);
			},
			shop_loadFile(file) {
				if (this.formData.image.length === 9) {
					this.validateMsg.Img.isError = true;
					this.validateMsg.Img.errorMsg = '最多只能上传9张图片'
				}
				if (file.size > 500 *1024) {
					this.validateMsg.Img.isError = true;
					this.validateMsg.Img.errorMsg = '图片大小最大为500K'
					return false;
				}
				let that = this;
				let imageData = new FormData();
				let reader = new FileReader();
				reader.onload = function(e) {
					let data = e.target.result;
					let image = new Image();
					image.onload=function(){
						let width = image.width;
						let height = image.height;
						let scale = width / height;
						if(scale !== 1) {
							that.validateMsg.Img.isError = true;
							that.validateMsg.Img.errorMsg = '请上传宽高比为1:1的图片'
						} else {
							imageData.append('file', file);
							that.shop_imageUpload(imageData);
							that.validateMsg.Img.isError = false;
							that.validateMsg.Img.errorMsg = ''
						}
					};
					image.src= data;
				};
				reader.readAsDataURL(file);
			},
			shop_imageUpload(data) {
				Http.post(this.uploadUrl, data)
					.then((res) => {
						if (res.data.code === 200) {
							let imageUrl = res.data.data.imageUrl;
							this.formData.image.push(imageUrl);
							this.shopImageList.push({name: imageUrl, url: imageUrl});
							this.$refs.formData.validateField('image');
							// this.formData.image = [res.data.data.imageUrl];
						}
					}).catch((error) => {
					that.validateMsg.Img.isError = true;
					that.validateMsg.Img.errorMsg = '上传失败'
				});
			},
			material_selectImage() {
				let input = document.getElementById('topPicture');
				input.click();
			},
			material_imageChange(eve) {
				let files= eve.target.files;
				this.material_loadFile(files[0]);
			},
			material_loadFile(file) {
				if (file.size > 500 *1024) {
					this.validateMsg.Img.isError = true;
					this.validateMsg.Img.errorMsg = '图片大小最大为500K'
					return false;
				}
				let that = this;
				let imageData = new FormData();
				let reader = new FileReader();
				reader.onload = function(e) {
					let data = e.target.result;
					let image = new Image();
					image.onload=function(){
						let width = image.width;
						let height = image.height;
						let scale = width / height;
						if(scale !== 2) {
							that.validateMsg.Img.isError = true;
							that.validateMsg.Img.errorMsg = '请上传宽高比例为2:1的图片'
						} else {
							imageData.append('file', file);
							that.material_imageUpload(imageData);
							that.validateMsg.Img.isError = false;
							that.validateMsg.Img.errorMsg = '';
							that.validateMsg.Img.imgUrlName = file.name;
						}
					};
					image.src= data;
				};
				reader.readAsDataURL(file);
			},
			material_imageUpload(data) {
				Http.post(this.uploadUrl, data)
					.then((res) => {
						if (res.data.code === 200) {
							this.formData.image = [res.data.data.imageUrl];
						}
					}).catch((error) => {
					this.validateMsg.Img.isError = true;
					this.validateMsg.Img.errorMsg = '上传失败'
				});
			},
			shop_uploadSuccess(response) {
				this.isUploadImage = false;
				if (response.code === 200 && response.iserror === 0) {
					this.formData.image.push(response.data.imageUrl);
					this.$refs.formData.validateField('image');
				}
			},
			shop_uploadProgress() {
				this.isUploadImage = true;
			},
			shop_beforeUpload(file) {
				if (this.formData.image.length === 9) {
					this.$message({
						message: '最多只能上传9张图片',
						type: 'warning'
					});
					return false;
				}
			},
			shop_remove(index) {
				this.shopImageList.splice(index,1);
				this.formData.image.splice(index,1);
			},
			topic_log(){
				this.formData.topicName = "";
				this.topicUseData.topicList = [];
			},
			//话题搜索
			topic_remoteMethod(query) {
				if (!this.topicUseData.canRemote || this.topicUseData.isLoading) return;
				this.topicUseData.isLoading = true;
				console.log(query);
				let wrap = document.getElementsByClassName('optionList')[0].getElementsByClassName('el-select-dropdown__list')[0];
				if (query !== '') {
					if (this.selectQuery != query) {
						this.topicUseData.page = 1;
						wrap.scrollTop = 0;
						this.topicUseData.topicList = [];
					};
					this.topicUseData.selectQuery = query;
					Http.get("/api/topics", {
						params: {
							keyword: query,
							pageNum: this.topicUseData.page,
							pageSize: 8
						}
					}).then((res)=> {
						let list = [];
						if (res.data.code == 200) {
							this.topicUseData.isLoading = false;
							this.topicUseData.topicCount = Math.ceil(res.data.data.totalCount/8) ;
							list = res.data.data.topics.map(item => {
								return {value: item.topic.id, label: item.topic.name, author:item.user.nickname};
							});
							this.topicUseData.topicList = this.mergeJson(this.topicUseData.topicList, list);
							if (this.topicUseData.page === 1 ) {
								wrap.addEventListener('scroll', () => {
									if (wrap.scrollTop == (wrap.scrollHeight - wrap.offsetHeight) && this.topicUseData.page < this.topicUseData.topicCount ) {
										if (!this.topicUseData.isLoading) {
											this.topicUseData.page++;
											this.topic_remoteMethod(this.topicUseData.selectQuery);
										}
									};

								});
							}
						}
					}).catch(function(error) {
						console.log(error);
					});
				} else {
					this.topicUseData.previewUrl='';
					document.getElementById('seeTopic').removeAttribute('href');
					this.topicUseData.page = 1;
					this.topicUseData.topicList=[];
					this.topicUseData.isLoading = false;
				}
			},
			//合并2个json对象
			mergeJson(str1, str2) {
				var str3 = [];

				for (var i = 0; i < str1.length; i++) {
					str3.push(str1[i]);
				}

				for (var i = 0; i < str2.length; i++) {
					str3.push(str2[i]);
				}
				return str3;
			},
			//话题名称改变 获取话题详情
			topic_selectChange(value, oldValue) {
				this.topicUseData.canRemote = false;
				if(this.formData.topicName == ""){
					this.topicUseData.canRemote = true;
				}
			},
			topic_optionChange(topicId, topicName) {
				this.topicUseData.page = 1;
				this.topicUseData.topicList = [];
				this.formData.promotionId = topicId;
				this.formData.title = topicName;
				if(topicId != ''){
					Http.get("/api/topic", {
						params: {
							topicId: topicId
						}
					}).then(res=> {
						if (res.data.code === 200) {
							this.topicUseData.previewUrl = res.data.data.previewUrl;
							document.getElementById('seeTopic').setAttribute('href', this.topicUseData.previewUrl);
							this.topicUseData.skuIds = [];
							if (res.data.data.skuIds) {
								res.data.data.skuIds.forEach((item) => {
									this.topicUseData.skuIds.push({skuId: item, type: 1});
								});
							}
							this.formData.title = res.data.data.name;
							this.topicUseData.canRemote = true;
						}
					}).catch((error) => {
						console.log(error);
						this.topicUseData.canRemote = true;
					});
				}else{
					this.topicUseData.previewUrl = '';
				}
			},
			good_getProductWithSkuId(event) {
				if (this.formData.promotionId === '') {
					return;
				}
				Http.get('api/material/sku', {
					params: {
						skuId: this.formData.promotionId
					}
				}).then((res) => {
					if (res.data.iserror) {
						this.goodUseData.isSkuIdVisible = false;
						this.formData.title = '';
						this.formData.description = '';
						this.goodUseData.shopId = '';
						this.goodUseData.categoryId = '';
						this.goodUseData.allImgList = [];
						this.formData.image = [];
						this.itemIdError = res.data.msg;
						this.$refs.formData.validateField('promotionId');
					} else {
						this.formData.title = res.data.data.name;
						this.formData.description = res.data.data.description;
						this.formData.productId = res.data.data.productId;
						this.goodUseData.shopId = res.data.data.shopId;
						this.goodUseData.categoryId = res.data.data.categoryId;
						this.goodUseData.allImgList = [];
						res.data.data.images.forEach((item) => {
							this.goodUseData.allImgList.push({
								url: item,
								checked: false
							});
						});
						this.goodUseData.allImgList[0].checked = true;
						this.formData.image = [this.goodUseData.allImgList[0].url];
						this.goodUseData.isSkuIdVisible = true;
						this.itemIdError = '';
						this.$refs.formData.validateField('promotionId');
					}
				});
			},
		},
		watch: {
			'isSelectProducts': {
				handler: function(val, oldVal) {
					if (this.actionType !== 'modify') {
						if (val) {
							this.normal_addProducts();
						} else {
							this.selectProductCount = 0;
							this.formData.products = [];
						}
					}
				},
				deep: true
			},
			'goodUseData.allImgList': {
			    handler: function (val, oldVal) {
			        if(val.length == 0) return;
					this.formData.image =  [];
					let selectImgItem = val.find((item) => {
					    return item.checked === true;
					});
					if (selectImgItem) {
						this.formData.image.push(selectImgItem.url);
					}
				},
				deep: true
			}
		}
	};
</script>
<style lang="less" scoped>
	.SKUerror{
		font-size: 12px;
		color: #ff4949;
	}
	.shopImageList{
		width: 300px;
		display:block;
		height:90px;
		margin: 10px 0 0 0;
		ul li{
			float: left;
			margin: 0px 10px 10px 0px;
			width: 90px;
			height: 90px;
			position: relative;
			&:hover{
			  em{
				  display: block;
			  }
			}
			img{
				border:1px solid #d9dbde;
				box-sizing:border-box;
				border-radius:6px;
				width:100%;
				height:100%;
			}
			em{
				display: none;
				position: absolute;
				right: -6px;
				top: -4px;
			    &:nth-of-type(2):hover{
					 color:#c6171e;
				}
				&:nth-of-type(1){
					 top:-2px;
					 background: #fff;
					 width: 15px;
					 height: 15px;
					 border-radius: 100%;
				}
			}
		}
	}
	.SKUtipicon{
		margin-right: 16px;
	}
	.URLbtn{
		width: 120px;
		height: 36px;
		text-align: center;
		color: #23272c;
		border: 1px solid #d9dbde;
		padding: 0;
		box-sizing: border-box;
		background: linear-gradient(to bottom, #fefefe 0%, #ebebeb 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fefefe', endColorstr='#ebebeb', GradientType=0);
		&:hover{
			 color: #23272c;
			 border-color: #d9dbde;
			 background: linear-gradient(to bottom, #fefefe 0%, #ebebeb 100%);
			 filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fefefe', endColorstr='#ebebeb', GradientType=0);
		}
	}
	.el-upload__tip{
		line-height: 1.5;
	}
	.Content{
		margin-bottom: 22px;
		.GoodContent{
			background: #f9fbfc;
			padding:20px 30px 20px 0px;
			margin-left: 124px;
			.el-textarea{
				width:290px;
			}
			.el-input{
				width:290px;
			}
			.noImage{
				display: block;
				width:90px;
				height:90px;
				background:#ebeef1;
				line-height: 90px;
				border:1px solid #d9dbde;
				box-sizing: border-box;
				text-align: center;
				color:#89919c;
				font-size: 14px;
				border-radius: 6px;
			}
		}
	}
	.SKUbox{
		height: 90px;
		overflow: hidden;
		.uploade-show{
			height: 90px;
			padding-top: 0;
			width:290px;
			.show-img img{
				border: 1px solid #d9dbde;
				box-sizing: border-box;
			}
			.photoBox{
				width: 100%;
				height: 90px;
				position: relative;
				overflow: hidden;
				button{
					width: 20px;
					height: 40px;
					position: absolute;
					top:25px;
					background-color: rgba(0,0,0,0.3);
					border:none;
					border-radius: 0px;
					z-index:2;
				    em{
						position: absolute;
						position: absolute;
						top: 12px;
						left: 7px;
						color:#fff;
					}
					&:hover{
						background-color: rgba(0,0,0,0.5);
						em{
							color:#fff;
						}
					}
					&:nth-of-type(1){
						 left:0;
					 }
					&:nth-of-type(2){
						 right:0;
					 }
				}
				.photoContent{
					overflow: hidden;
					width: 100%;
					height:90px;
				}
			}
			ul li {
				float: left;
				margin: 0px 10px 0px 0px;
				width: 90px;
				height: 90px;
			}
		}
	}
	.photoContentLi{
		float: left;
		width: 50px;
		height: 50px;
		margin-left: 5px;
	}
	.photoContent ul{
		position: absolute;
		left:0;
		top:0
	}
	.photoContent img{
		width:50px;
		height:50px
	}
	.content-box{
		position: relative;
		width: 160px;
		height: 80px;
		text-align: center;
		background: #eee;
		.material-image{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: auto;
			width: 100%;
			height: 100%;
			margin: auto;
			vertical-align: middle;
		}
	}
	.add-fn{
		cursor: pointer;
		border-radius: 6px;
		clear: both;
		background-color:#d9dbde;
		border:none;
		text-align:center;
		line-height: 34px;
		font-size: 16px;
		vertical-align: middle;
		.btn{
			padding:0 15px;
			display:inline;
			border:none;
			border-radius:0;
			background:none;
		}
	}
	.el-upload{
		width: 100%;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100%;
		height: 100%;
		line-height: 250px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	.seeTopic{
		float: right;
		height: 36px;
		line-height: 36px;
	}
	a[disabled]{
		color: #bfcbd9;
		cursor: not-allowed;
	}
	.topicName{
		width: 355px;
		display: inline-block;

	}
	.topicName input[type='text']{
		width: 355px;
		display: inline-block;
	}
	.imgupload{
		background-image: none;
		text-align: center;
		font-size: 14px;
		border-radius: 6px;
		color: #23272c;
		border:1px solid #d9dbde;
		box-sizing: border-box;
		width:100px;
		height:34px;
		line-height: 34px;
		cursor: pointer;
		background:-moz-linear-gradient(top, #fefefe, #ececec);
		background:-webkit-gradient(linear, 0 0, 0 bottom, from(#fefefe), to(#ececec));
		background:-o-linear-gradient(top, #fefefe, #ececec);
		background:#ececec;
	}
	#topPicture, #shopPicture{
		width: 146px;
		height: 100px;
		display:block;
		position:absolute;
		visibility: hidden;
	}
	.brand {
		margin-left: 0!important;
		margin-right: 15px;
	}
</style>
