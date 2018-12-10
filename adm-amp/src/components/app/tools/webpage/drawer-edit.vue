<template>
	<div class="amp-form amp-form03">
		<div class="form-column">
			<el-form  label-width="124px" :model="editData" ref="editData" :rules="rules">
				<!--模板1 默认-->
				<input id="imageInput" ref="imageInput" type="file" hidden="hidden" @change="imageInputChange" accept="image/jpg,image/jpeg,image/png">
				<template v-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.ITEM">
					<el-row class="spliTitle">基本信息</el-row>
					<el-form-item label="名称：" prop="title" >
						<el-input  placeholder="请输入名称" style="width:400px;" v-model="editData.title"></el-input>
						<div class="el-upload__tip" v-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.ITEM">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
					</el-form-item>
					<el-form-item label="顶部大图：" ref="topImg" prop="image">
						<div class="detail-row">
							<div class="photo-box">
								<div class="btn btn-normal" @click="uploadImage('item')">上传图片</div>
								<div class="el-upload__tip" style="font-size:14px;color:#89919c;">仅支持宽高比为2:1的图片</div>
								<div v-show="editData.image"><img :src="editData.image" style="width: 300px;"></div>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="文案区：" prop="description">
						<el-input type="textarea" v-model="editData.description" :autosize="{ minRows: 2, maxRows: 4}"
								  placeholder="" style="width:400px;">
						</el-input>
					</el-form-item>
				</template>
				<!--模板2 店铺-->
				<template v-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.SHOP">
					<el-row class="spliTitle">基本信息</el-row>
					<el-form-item label="店铺ID：" prop="shopId">
						<el-input  placeholder="请输入店铺ID" style="width:400px;" v-model="editData.shopId" id="shopIdReadOnly" @blur="shopIdChange('shop')">
						</el-input>
					</el-form-item>
					<el-form-item label="店铺文案：" prop="description" :rules="rules.description">
						<el-input type="textarea" v-model="editData.description" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入店铺文案" style="width:400px;">
						</el-input>
					</el-form-item>
				</template>
				<!--模板3 视频-->
				<template v-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDEO">
					<template>
						<el-row class="spliTitle">基本信息</el-row>
						<el-form-item label="广告标题：" prop="title">
							<el-input style="width:400px;" v-model="editData.title" placeholder="请输入广告标题"></el-input>
							<div class="el-upload__tip">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
						</el-form-item>
						<el-form-item label="视频：" prop="videoId">
							<div class="row-photo-s" style="width: 100%;">
								<div id="flashContent">
									<div id="flashPic"></div>
								</div>
								<span id="videoName">{{videoMsg.name}}</span>
								<input type="hidden" id="videoIds" v-model="editData.videoId">
								<div id="progressBox" v-show="videoMsg.isShowProgress">
									<span>上传中</span>
									<progress id="progress" :value="videoMsg.progerss" max="100"></progress>
									<span id="progressCode">{{videoMsg.progerss + '%'}}</span>
								</div>
								<div class="el-form-item__error" v-show="videoMsg.msg">
									<div class="icon" :class="{'icon-selecton': editData.videoId, 'icon-shut': videoMsg.isError}">{{videoMsg.msg}}</div>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="封面图：" prop="image">
							<el-radio-group v-model="editData.useDefaultImage" @change="videoImageTypeChange">
								<el-radio :label="0">默认图片</el-radio>
								<el-radio :label="1">自定义图片</el-radio>
							</el-radio-group>
							<div v-if="editData.useDefaultImage == 1">
								<div class="photo-box">
									<div class="btn btn-normal" @click="uploadImage('video')">上传图片</div>
									<div class="el-upload__tip" style="width:100%">只能上传宽高比为2:1的图片</div>
									<div v-show="editData.image"><img :src="editData.image" style="width: 300px;"></div>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="视频描述：" prop="description">
							<el-input style="width:400px;" v-model="editData.description" type="textarea"
									  :autosize="{ minRows: 2, maxRows: 4}"
									  :rules = 'rules.description'
									  placeholder="请输入视频描述"></el-input>
						</el-form-item>
					</template>
					<template>
						<el-row class="spliTitle">推广内容</el-row>
						<el-form-item label="内容类型：" label-width="90px" prop="promotionType">
							<el-radio-group v-model="editData.promotionType" @change="promoteDetailChange">
								<el-radio class="radio" :label="PROMOTION_TYPE.SHOP" style="margin-left: 0px">店铺</el-radio>
								<el-radio class="radio" :label="PROMOTION_TYPE.PRODUCT">商品</el-radio>
							</el-radio-group>
						</el-form-item>
					</template>
				</template>
				<!-- 商品公共区 -->
				<el-row class="spliTitle" v-if="[WEB_PAGETEMPLATE_TYPE.SHOP, WEB_PAGETEMPLATE_TYPE.ITEM].indexOf(editData.webpageTemplateId) > -1">
					商品
					<span v-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.SHOP">最少添加4个，最多添加10个</span>
					<span v-else-if="editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.ITEM">必须添加10个商品</span>
				</el-row>
				<div class="clearfix">
					<template v-for="(item, index) in editData.webpageItems">
						<div v-if="item.type == 'product'" class="SKUbox" :key="index">
							<el-form-item
								label="SKU ID："
								label-width="85px"
								:prop="'webpageItems.' + index + '.skuId'"
								:rules="rules.formDataProductSkuRules">
								<el-input v-model="item.skuId" placeholder="请输入SKU ID"></el-input>
							</el-form-item>
							<el-form-item label="商品区：" label-width="85px">
								<div v-if="!item.image.length">
									<span class="noImage">暂无图片</span>
								</div>
								<div v-else class="uploade-show uploade-select">
									<m-image-scroll v-model="item.images" :index="index"></m-image-scroll>
								</div>
							</el-form-item>
							<el-form-item label="广告文案：" label-width="85px">
								<el-input type="textarea" v-model="item.description" resize="none" :rows="4" placeholder=""></el-input>
							</el-form-item>
						</div>
						<div v-if="item.type == 'shop'">
							<el-form-item
								label="店铺ID："
								:prop="'webpageItems.' + index + '.shopId'"
								:rules="rules.shopId">
								<el-input style="width:400px;" v-model="item.shopId" type="text"
										  placeholder="请输入店铺ID" id="shopId" @blur="shopIdChange('item')"></el-input>
							</el-form-item>
							<el-form-item label="店铺名称：" v-show="item.name">
								<el-input style="width:400px;" v-model="item.name" type="text"
										  :disabled="item.name.length > 0"></el-input>
							</el-form-item>
							<el-form-item label="店铺LOGO：" v-show="item.image">
								<div class="photo-add photo-add-b">
									<img :src="item.image" style="width:160px;">
								</div>
							</el-form-item>
							<el-form-item
								label="店铺文案："
								:prop="'webpageItems.' + index + '.description'"
								:rules="rules.webpageItemDescription">
								<el-input style="width:400px;" v-model="item.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入店铺文案"></el-input>
							</el-form-item>
						</div>
					</template>
				</div>
				<div>
					<div class="btn btn-normal" @click="addWebpageItem" v-if="editData.webpageItems.length < 10 && editData.promotionType == PROMOTION_TYPE.PRODUCT">新增商品</div>
					<el-form-item prop="webpageItems" label-width="0"></el-form-item>
				</div>
				<template style="clear:both">
					<el-row class="spliTitle" style="margin-top: 30px;">分享卡</el-row>
					<el-form-item label="分享卡图片：" prop="cardImage">
						<div class="detail-row">
							<div class="photo-box">
								<div class="btn btn-normal" @click="uploadImage('share')">上传图片</div>
								<div class="el-upload__tip" style="font-size:14px;color:#89919c;">建议上传尺寸为150*150的图片</div>
								<div class="photo-add"  v-show="editData.cardImage"><img :src="editData.cardImage" style="width: 150px;"></div>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="分享卡名称：" prop="cardTitle">
						<el-input style="width:400px;" v-model="editData.cardTitle"></el-input>
					</el-form-item>
					<el-form-item label="分享卡文案：" prop="cardDescription" >
						<el-input type="textarea" v-model="editData.cardDescription" :autosize="{ minRows: 2, maxRows: 4}"
								   placeholder="" style="width:400px;"></el-input>
					</el-form-item>
				</template>
			</el-form>
		</div>
	</div>
</template>
<script>
import store from 'store';
import {
	copyObj,
	mixin,
	isEmptyObj,
	limitLen
} from 'utils/common.js';
import Event from 'event';
import Http from 'http';
import ImageScroll from '../../../common/imageScroll.vue';
import {WEB_PAGETEMPLATE_TYPE, PROMOTION_TYPE} from 'help/CONST_ENUM.js';
require('../../../../utils/uploadVideo.js');
export default {
	name: 'app-page-edit',
	data() {
		return {
			WEB_PAGETEMPLATE_TYPE: WEB_PAGETEMPLATE_TYPE,
			PROMOTION_TYPE: PROMOTION_TYPE,
			webpageItem: {
				webpageItemId: '',
				name: '',
				type: '',
				productId: '',
				skuId: '',
				shopId: '',
				videoId: 0,
				description: '',
				words: '',
				image: '',
				images: [],
				price: 0,
				sequence: 0
			},
			httpMethodMap: {
				new: 'post',
				copy: 'post',
				modify: 'put'
			},
			uploadImageType: '',
			uploadImageMessage: '',
			editData: {},
			videoMsg: {
				name: '',
				isShowProgerss: false,
				progress: 0,
				msg: '',
				isError: false
			},
			rules: {
				shopId: [{
					validator: (rule, value, callback) => {
						if (value.trim() == '') {
							callback(new Error('请输入店铺ID'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
				videoId: [{
					validator: (rule, value, callback) => {
						if (value == '' || !value) {
							callback(new Error('请上传视频'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
				promotionType:  [{
					validator: (rule, value, callback) => {
						if (this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDEO && value == 0) {
							callback(new Error('请选择推广内容'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
		        cardDescription: [{
					validator: (rule, value, callback) =>{
						if (value.trim() == '') {
							callback(new Error('请输入分享卡文案'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
		        cardTitle: [{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入分享卡名称'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
				title: [{
					validator: (rule, value, callback) => {
						if (value.trim() == '') {
							callback(new Error('请输入名称'));
						} else if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.VIDEO && !limitLen(value, 30)) {
							allback(new Error('最大长度不超过15个汉字'));
						} else {
						    callback();
						}
					}, trigger: 'blur'
				}],
		        webpageItemDescription:[{validator: function(rule, value, callback) {
					if(limitLen(value, 100)){
						callback();
					}else{
						callback(new Error('最大长度不超过50个汉字'));
					}
				}, trigger: 'blur' }],
		        description:[{validator: function(rule, value, callback) {
					if(limitLen(value, 200)){
						callback();
					}else{
						callback(new Error('最大长度不超过100个汉字'));
					}
					}, trigger: 'blur' }],
				cardImage: [{validator: (rule, value, callback) => {
					if (value == '' && !this.uploadImageMessage) {
						callback(new Error('请上传图片'));
					} else if (this.uploadImageMessage && this.uploadImageType === 'share') {
						callback(new Error(this.uploadImageMessage));
					} else {
						callback();
					}
				}, trigger: 'blur'}],
				image: [{validator: (rule, value, callback) => {
					if (value == '' && !this.uploadImageMessage) {
						if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.ITEM || (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.VIDEO && this.editData.useDefaultImage === 1)) {
							callback(new Error('请上传图片'));
						} else {
							callback();
						}
					} else if (this.uploadImageMessage && this.uploadImageType !== 'share') {
						callback(new Error(this.uploadImageMessage));
					} else {
						callback();
					}
				}, trigger: 'blur'}],
				formDataProductSkuRules: [{
					validator: (rule, value, callback) => {
						let index = Number(rule.field.split('.')[1]);
						let item = this.editData.webpageItems[index];
						if ((value == '' || value.trim() == '') && this.effectSkuLength < this.skuLength) {
							callback(new Error('请输入SKU ID'));
						} else {
							if (value) {
								this.normal_checkSkuIdVisible(value, index, callback);
							} else {
								callback();
							}
						}
					},
					trigger: 'blur'
				}],
				webpageItems: [{
					validator: (rule, value, callback) => {
						if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.SHOP && this.effectSkuLength < 4) {
							callback(new Error('至少添加4个SKU'));
						} else if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.VIDEO) {
							if (this.editData.promotionType === PROMOTION_TYPE.PRODUCT && this.effectSkuLength < 1) {
								callback(new Error('至少添加1个SKU'));
							} else {
								callback();
							}
						} else if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.ITEM && this.effectSkuLength < 10) {
							callback(new Error('SKU数量必须为10个'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			}
		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action,
		effectSkuLength() {
			let skuLength = 0;
			this.editData.webpageItems.forEach(item => {
				if (item.skuId) {
					skuLength++;
				}
			});
			return skuLength;
		},
		skuLength() {
			let skuLength = 0;
			if (this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.SHOP) {
				skuLength = 4;
			} else if (this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.ITEM) {
				skuLength = 10;
			} else if (this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDOE && this.editData.promotionType === PROMOTION_TYPE.PRODUCT) {
				skuLength = 1;
			}
			return skuLength;
		}
	},
	components: {
		'm-image-scroll': ImageScroll
	},
	created() {
	    this.editData = copyObj(this.drawerData);
	    let webpageItemsLength = 0;
		if (store.state.drawerCtrl.action === 'modify') {
			let skuIds = [];
			if(this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDEO) { //视频
				if(this.editData.videoId !== 0) {
					this.videoMsg.msg = '上传成功！';
				}
			}
			this.editData.webpageItems.forEach((item, index) => {
				skuIds.push(item.skuId);
				this.$set(item, 'images', []);
			});
			webpageItemsLength = this.editData.webpageItems.length;
			this.getSkus(skuIds);
		} else {
			//除视频自建页推广内容需要选择外，其他类型都默认为商品
			if (this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDEO) {
				this.editData.promotionType = 0;
			}
		}
		for (let i = webpageItemsLength; i < this.skuLength; i++) {
			let item = copyObj(this.webpageItem);
			item.type = 'product';
			this.editData.webpageItems.push(item);
		}
	},
	mounted() {
		Event.$off('page-save');
		Event.$on('page-save', (avg) =>{
		    if(avg.publish == 'publish'){
				this.$refs.editData.validate((result) => {
					if (result) {
						this.saveWebpage();
					}
				});
			} else {
				this.saveWebpage();
			}
		});
		Event.$off('page-publish');
		Event.$on('page-publish', (argv) => {
			Http.put("/api/webpage/publish", {
					webpageId: argv.res.webpageId
				}
			).then((res) => {
				if (!res.data.iserror) {
					Event.$emit('page-publish-result', {
						error: 0,
						res: res.data
					});
				} else {
					this.$message({
						message: res.data.msg,
						type: 'error',
						duration: 3000
					});
					Event.$emit('page-publish-result', {
						error: 1,
						res: res.data
					});
				}
			}).catch((e) => {
				console.log(e);
				Event.$emit('page-publish-result', {
					error: 1,
					res: ''
				});
			});
		});
		//视频渲染
		if(this.editData.webpageTemplateId == WEB_PAGETEMPLATE_TYPE.VIDEO){
			let flashPic = document.getElementById('flashPic');
			let pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
			flashPic.innerHTML = "<a href='http://www.adobe.com/go/getflashplayer'><img src='"
				+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' target='_blank' /></a>";
			uploadVideo();
		}

		Event.$off('startUploadVideo');
		Event.$on('startUploadVideo', (data) => {
			this.videoMsg.name = data.videoName;
			this.videoMsg.isError = false;
			this.videoMsg.isShowProgerss = false;
		})

		Event.$off('uploadVideoProgress');
		Event.$on('uploadVideoProgress', (data) => {
			this.videoMsg.isShowProgerss = true;
			this.videoMsg.progress = data.progress;
		});

		Event.$off('uploadVideoSuccess');
		Event.$on('uploadVideoSuccess', (data) => {
			this.videoMsg.isShowProgerss = false;
			this.videoMsg.msg = '上传成功！';
			this.editData.videoId = data.videoId;
		});

		Event.$off('uploadVideoFail');
		Event.$on('uploadVideoFail', (data) => {
			this.videoMsg.isError = true;
			this.videoMsg.msg = '上传失败！';
			this.videoMsg.isShowProgerss = false;
		});

	},
	methods: {
		saveWebpage() {
			let params = copyObj(this.editData);
			params.webpageItems = [];
			this.editData.webpageItems.forEach((item) => {
				if (item.skuId || item.shopId) {
					let webpageItem = copyObj(item);
					delete webpageItem.webpageItemId;
					delete webpageItem.images;
					params.webpageItems.push(webpageItem);
				}
			});
			delete params.addSkuId;
			let method = this.editData.webpageId ? 'modify' : 'new';
			Http({
				url: '/api/webpage',
				method: this.httpMethodMap[method],
				data: params
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					let data = res.data.data;
					if (method === 'new') {
						this.$set(this.editData, 'webpageId', data.webpageId);
					}
					if (this.editData.webpageTemplateId === WEB_PAGETEMPLATE_TYPE.VIDEO) {
						data.videoId = this.editData.videoId;
					}
					if (method === 'modify') {
						data.webpageId = this.editData.webpageId;
					}
					Event.$emit('page-save-result', {
						error: 0,
						res: data
					});
				} else {
					Event.$emit('page-save-result', {
						error: 1,
						res: res.data
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		normal_checkSkuIdVisible(skuId, index, cb) {
			let isError = false;
			let product = this.editData.webpageItems.find((product, i) => {
				return i !== index && product.skuId === skuId;
			});
			let errorMsg = '';
			if (!!product) {
				cb(new Error('已添加了该商品，请勿重复添加'));
			} else {
				Http.get('api/material/sku', {
					hideLoading: true,
					params: { skuId: skuId }
				}).then((res) => {
					let webpageItem = this.editData.webpageItems[index];
					if (res.data.code === 200 && res.data.iserror === 0) {
						if (isEmptyObj(res.data.data)) {
							this.clearWebpageItem(webpageItem);
							cb(new Error('未找到该商品'));
						} else if (this.editData.shopId !== '' && res.data.data.shopId !== this.editData.shopId) {
							this.clearWebpageItem(webpageItem);
							cb(new Error('请填写店铺内的SKU ID'));
						} else {
							webpageItem.description = res.data.data.description;
							webpageItem.productId = res.data.data.productId;
							webpageItem.name = res.data.data.name;
							res.data.data.images.forEach((item) => {
								this.editData.webpageItems[index].images.push({
									url: item,
									checked: false
								});
							});
							this.editData.webpageItems[index].error = '';
							this.editData.webpageItems[index].images[0].checked = true;
							this.editData.webpageItems[index].image = this.editData.webpageItems[index].images[0].url;
							cb();
						}
					} else {
						this.clearWebpageItem(webpageItem);
						cb(new Error(this.productError.errorMsg));
					}
				}).catch(err => {
					console.log(err);
					cb(new Error('获取商品信息失败，请稍后重试'));
				});
			}
		},
		clearWebpageItem(webpageItem) {
			webpageItem.description = '';
			webpageItem.productId = '';
			webpageItem.name = '';
			webpageItem.image = '';
			webpageItem.skuId = '';
			webpageItem.images = [];
		},
		getSkus(skus) {
			if (skus.length === 0) return;
			Http.get("/api/material/skus?skuIds=" + skus).then((res) => {
			    res.data.data.skus.forEach((skus,i) => {
					this.editData.webpageItems.forEach((items,index) => {
						if(skus.skuId == items.skuId) {
							skus.images.forEach((sku,j) => {
								items.images.push({
									url:sku,
									checked:items.image == sku
								})
							})
						}
					})
				})
			}).catch(res => {
				console.log(res);
			})
		},
		videoImageTypeChange(){
			this.editData.image = '';
		},
		promoteDetailChange() {
			this.$refs.editData.validateField('promotionType');
			let webpageItem = copyObj(this.webpageItem);
			if (this.editData.promotionType == PROMOTION_TYPE.SHOP) {
				webpageItem.type = 'shop';
			} else {
				webpageItem.type = 'product';
			}
			this.editData.webpageItems = [webpageItem];
		},
	    //店铺
		shopIdChange(type) {
			let shopId = this.editData.shopId;
			if (type == 'item') {
				shopId = this.editData.webpageItems.length ? this.editData.webpageItems[0].shopId : '';
			}
		    if(shopId == '') return;
			Http.get("/api/webpage/shop?shopId=" + shopId).then(res=> {
				if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
					let data = res.data.data;
					if (type == 'item') {
						let webpageItem = this.editData.webpageItems[0];
						webpageItem.image = data.icon;
						webpageItem.name = data.name;
						webpageItem.description = data.description;
					} else {
						this.editData.title = data.name;
						this.editData.image = data.icon;
						this.editData.description = data.description;
					}
				} else {
					this.$message({
						message: '店铺ID填写错误!',
						type: 'error'
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		addWebpageItem(){
			let webpageItem = copyObj(this.webpageItem);
			webpageItem.type = 'product';
			this.editData.webpageItems.push(webpageItem);
		},
		uploadImage(type) {
			this.uploadImageType = type;
			let input = document.getElementById("imageInput");
			input.click();
		},
		imageInputChange(eve) {
			let files = eve.target.files;
			if (files[0]) {
				this.loadImage(files[0]);
			}
		},
		loadImage(file) {
			let imageSize = 500 * 1024; //顶部大图限制500KB
			if (this.uploadImageType === 'share') {
				imageSize = 15 * 1024; //分享卡图片限制15KB
			}
			if (file.size > imageSize) {
				if (this.uploadImageType === 'share') {
					this.uploadImageMessage = '图片大小最大为15KB';
					this.$refs.editData.validateField('cardImage');
				} else {
					this.uploadImageMessage = '图片大小最大为500KB';
					this.$refs.editData.validateField('image');
				}
				this.$refs['imageInput'].value = '';
				return false;
			}
			let that = this;
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload = function(){
					let width = image.width;
					let height = image.height;
					let scale = width / height;
					if (that.uploadImageType === 'share' && width !== height) {
						that.uploadImageMessage = '请上传宽高比例为1:1的图片';
						that.$refs.editData.validateField('cardImage');
						that.$refs['imageInput'].value = '';
					} else if (that.uploadImageType !== 'share' && scale !== 2) {
						that.uploadImageMessage = '请上传宽高比例为2:1的图片';
						that.$refs.editData.validateField('image');
						that.$refs['imageInput'].value = '';
					} else {
						that.uploadImageMessage = '';
						that.$refs['imageInput'].value = '';
						imageData.append('file', file);
						that.doImageUpload(imageData);
					}
				};
				image.src = data;
			};
		   reader.readAsDataURL(file);
		},
		doImageUpload(data) {
			Http.post('/api/image/upload', data).then((res) => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					if (this.uploadImageType === 'share') {
						this.editData.cardImage = res.data.data.imageUrl;
					} else {
						this.editData.image = res.data.data.imageUrl;
					}
				} else {
					this.uploadImageMessage = '上传失败，请重新上传';
				}
				if (this.uploadImageType === 'share') {
					this.$refs.editData.validateField('cardImage');
				} else {
					this.$refs.editData.validateField('image');
				}
				this.uploadImageType = '';
				this.$refs['imageInput'].value = '';
			}).catch((error) => {
				this.uploadImageMessage = '上传失败，请重新上传';
				if (this.uploadImageType === 'share') {
					this.$refs.editData.validateField('cardImage');
				} else {
					this.$refs.editData.validateField('image');
				}
				this.$refs['imageInput'].value = '';
				console.log(error);
			});
		}
	}
};
</script>
<style scoped lang="less">

	.el-upload__tip{
		line-height: 1.5;
	}
	.uploade-show{
		padding-top: 0px;
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
	.amp-form03 {
		padding: 0px 0px 0px 140px;
		width: auto;
	}
	.SKUbox{
		background:#f4f7f9;
		width:405px;
		padding: 20px 20px 20px 15px;
		float: left;
		margin: 0 10px 10px 0;
	}
	.SKUerror{
		color: #ff4949;
		margin-bottom: 10px;
		clear:both;
	}
	.spliTitle{
		font-size: 30px;
		color:#3e4044;
	    clear:both;
		span{
			color:#89919c;
			font-size: 14px;
			margin-left: 4px;
		}
	}
	.photo-add {
		cursor: pointer;
	}

	.el-input input[readonly='readonly'] {
		border: none;
	}
	#progress {
		width: 125px;
		background-color: #dfe3e6;
		color: #d30312;
		height: 10px;
		margin: 0 4px;
		vertical-align: middle;
		&::-webkit-progress-bar{
			 background-color: #dfe3e6;
		}
	}
	#progressBox{
		width:262px;
		height:44px;
		background:#f4f7f9;
		margin: 11px 0 20px 0;
		padding:2px 20px;
		span{
			display: inline-block;
			height: 44px;
			line-height: 44px;
		}

	}
	.icon-selecton {
		color: #1bb169;
		font-size: 14px !important;
	}
	.icon-shut {
		color: #d30312;
		font-size: 14px !important;
	}
</style>
