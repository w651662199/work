<template>
	<div class="amp-form amp-form03">
		<div class="form-column">
			<el-form  label-width="124px" :model="formData" ref="formData" :rules="rules">
				<template>
					<el-row class="spliTitle">基本信息</el-row>
					<el-form-item label="标题：" prop="title" >
						<el-input  placeholder="请输入标题" style="width:400px;" v-model="formData.title"></el-input>
						<div class="el-upload__tip">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
					</el-form-item>
				</template>
				<!-- 页面滚动时顶部浮动操作栏 -->
				<el-form-item label-width="0" :class='{scroll: isScroll}' v-show="isScroll" style="width: 690px;">
					<button class="webpage-item-button" type="button" @click="addWords">添加文字</button>
					<button class="webpage-item-button" type="button" @click="addImages">添加图片</button>
					<button id="J_webpage_flash_fix" type="button" class="webpage-item-button" @click="addVideos">
						<span>添加视频</span>
						<div id="J_flash_pic_fix"></div>
					</button>
					<!-- <el-button id="flashContent" @click="addVideos" style="margin: 0 5px 0 0;float: left">添加视频 -->
					<!-- </el-button> -->
					<button class="webpage-item-button" type="button" @click="addProducts" :title="isProductCountFull ? '最多添加9个商品' : '添加商品'" >添加商品</button>
					<transition name="el-zoom-in-top">
						<span class="error-message error-right" v-show="isNumberError">{{numberErrorMessage}}</span>
					</transition>
					<transition name="el-zoom-in-top">
						<div class="product-inline-box el-popover" x-placement="bottom" v-show="isShowProductCard">
							<div x-arrow="" class="popper__arrow" style="left: 130px;"></div>
							<el-form-item label-width="90px" label="SKU ID：" prop="addSkuId" class="is-required">
								<el-input placeholder="请输入商品SkuId" v-model="formData.addSkuId" @blur="checkProduct"></el-input>
								<transition name="el-zoom-in-top">
									<span class="error-message" v-show="isError">{{errorMessage}}</span>
								</transition>
							</el-form-item>
							<div class="clearfix" style="text-align: center;" :style="{marginTop: isError ? '0px' : '20px'}">
								<el-button @click="addProductSureHandler" ref="product-sure" type="primary" size="small" style="margin: 0 5px 0 0;background: #d30312;border-color: #d30312">确认</el-button>
								<el-button @click="addProductCancelHandler" size="small" style="width: auto; margin: 0 5px 0 0;">取消</el-button>
							</div>
						</div>
					</transition>
				</el-form-item>
				<template>
					<el-row class="spliTitle">内容</el-row>
					<el-form-item label-width="0" style="position: relative;width: 800px;">
						<button class="webpage-item-button" type="button" @click="addWords">添加文字</button>
						<button class="webpage-item-button" type="button" @click="addImages">添加图片</button>
						<button id="J_webpage_flash" type="button" class="webpage-item-button" @click="addVideos">
							<span>添加视频</span>
							<div id="J_flash_pic"></div>
						</button>
						<!-- <el-button id="flashContent" @click="addVideos" style="margin: 0 5px 0 0;float: left">添加视频 -->
						<!-- </el-button> -->
						<button class="webpage-item-button" type="button" @click="addProducts" :title="isProductCountFull ? '最多添加9个商品' : '添加商品'">添加商品</button>
						<transition name="el-zoom-in-top">
							<span class="error-message error-right" v-show="isNumberError">{{numberErrorMessage}}</span>
						</transition>
						<input id="J_upload_image" type="file" style="display:none;position:absolute;" @change="uploadImageChange" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="multiple">
						<transition name="el-zoom-in-top">
							<div class="product-inline-box el-popover" x-placement="bottom" v-show="isShowProductCard && !isScroll">
								<div x-arrow="" class="popper__arrow" style="left: 243px;"></div>
								<el-form-item label-width="90px" label="SKU ID：" prop="addSkuId" class="is-required">
									<el-input placeholder="请输入商品SkuId" v-model="formData.addSkuId" @blur="checkProduct"></el-input>
									<transition name="el-zoom-in-top">
										<span class="error-message" v-show="isError">{{errorMessage}}</span>
									</transition>
								</el-form-item>
								<div class="clearfix" style="text-align: center;" :style="{marginTop: isError ? '0px' : '20px'}">
									<el-button @click="addProductSureHandler" ref="product-sure" type="primary" size="small" style="margin: 0 5px 0 0;background: #d30312;border-color: #d30312">确认</el-button>
									<el-button @click="addProductCancelHandler" size="small" style="width: auto; margin: 0 5px 0 0;">取消</el-button>
								</div>
							</div>
						</transition>
					</el-form-item>
					<div class="webpage-content" id="J_webpage_content">
						<template v-for="(item, index) in formData.webpageItems">
							<div class="webpage-item-box draggable-box" :class="{'editor-box': item.type === 'rich_text', 'webpage-item-error': item.isError}" :key="item.sequence" @drop="domElementAllowDrop" :id="'webpage_item_' + item.sequence">
								<em class="icon icon-close" @click="showDeleteDialog(index)"></em>
								<template v-if="item.type === 'product'">
									<div class="webpage-product">
										<div class="product-image">
											<img :src="item.image">
										</div>
										<div class="product-info">
											<p class="product-title" style="-webkit-box-orient: vertical;">{{item.name}}</p>
											<p class="product-price">{{item.price | currency('¥', 2)}}</p>
										</div>
									</div>
								</template>
								<template v-if="item.type === 'image'">
									<div class="webpage-image">
										<p class="image-name"><em class="icon imageIcon"></em>{{item.name}}</p>
										<!-- <span>上传中：</span><el-progress v-show="item.progress < 100" :percentage="item.progress" style="display:inline-block;"></el-progress> -->
										<div class="progress-box" v-show="item.progress < 100 && item.description.length == 0">
											<span class="progress-state">上传中：</span>
											<div class="progress-bar">
												<div class="progress-value" :style="{width: Math.ceil(item.progress) + '%'}"></div>
											</div>
											<span class="progress-state">{{Math.ceil(item.progress)}}%</span>
										</div>
										<img v-if="item.image" :src="item.image">
										<p v-if="item.description.length > 0" class="error-message"><em class="icon" :class="{'uploadFail': item.isError, 'icon-right': !item.isError}"></em>{{item.description}}</p>
									</div>
								</template>
								<template v-if="item.type === 'video'">
									<div class="webpage-video">
										<p class="video-name"><em class="icon videoIcon"></em>{{item.name}}</p>
										<div class="progress-box" v-show="item.progress < 100 && item.description.length == 0">
											<span class="progress-state">上传中：</span>
											<div class="progress-bar">
												<div class="progress-value" :style="{width: Math.ceil(item.progress) + '%'}"></div>
											</div>
											<span class="progress-state">{{item.progress}}%</span>
										</div>
										<img v-if="item.image" :src="item.image">
										<p v-if="item.description.length > 0" class="error-message" :style="{'color': item.isError ? '#ff0000' : '#1bb169'}"><em class="icon" :class="{'uploadFail': item.isError, 'icon-right': !item.isError}"></em>{{item.description}}</p>
									</div>
								</template>
								<template v-if="item.type === 'rich_text'">
									<html-editor v-model="item.words"></html-editor>
									<p class="error-message" v-show="item.description.length > 0">{{item.description}}</p>
								</template>
							</div>
						</template>
					</div>
				</template>
				<template style="clear:both">
					<el-row class="spliTitle">分享卡</el-row>
					<el-form-item label="分享卡图片：" prop="cardImage">
						<div class="detail-row">
							<div class="photo-box">
								<div class="btn btn-normal" @click="changeShareFile">上传图片</div>
								<span>{{validateMsg.cardImg.cardImgName}}</span>
								<div class="el-upload__tip" style="font-size:14px;color:#89919c;">建议上传尺寸为150*150px的图片</div>
								<input id="sharePicture" type="file" style="display:none;position:absolute;"
									   @change="sharePictureChange" accept="image/jpg,image/jpeg,image/png">
								<div class="share-image-box" v-show="formData.cardImage"><img :src="formData.cardImage"></div>
							</div>
						</div>
						<div class="error-message" v-if="validateMsg.cardImg.isError">{{validateMsg.cardImg.errorMsg}}</div>
					</el-form-item>
					<el-form-item label="分享卡名称：" prop="cardTitle">
						<el-input style="width:400px;" v-model="formData.cardTitle"></el-input>
					</el-form-item>
					<el-form-item label="分享卡文案：" prop="cardDescription">
						<el-input type="textarea" v-model="formData.cardDescription" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" style="width:400px;"></el-input>
					</el-form-item>
				</template>
				<!-- 删除提示对话框 -->
				<transition name="fade">
					<div class="con-dialog-wapper" v-show="isDeleteDialogShow">
						<div class="dialog-content">
							<div class="dialog-header">
								<span>提示</span>
								<em class="icon icon-close" @click="isDeleteDialogShow = false"></em>
							</div>
							<div class="dialog-body">
								<span>确定要删除该条内容吗？</span>
							</div>
							<div class="dialog-footer">
								<button class="dialog-btn dialog-btn-normal" type="button" @click="isDeleteDialogShow = false">取消</button>
								<button class="dialog-btn dialog-btn-primary" type="button" @click="deleteWebpageItem">确定</button>
							</div>
						</div>
					</div>
				</transition>
			</el-form>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import Http from 'http';
import Event from 'event';
import {copyObj, objType, formatDate, mixin, debounce, getImgSize, isEmptyObj, limitLen, subStringName} from 'utils/common';
import HtmlEditor from '../../../common/Editor/index.vue';
import Sortable from 'sortablejs';
import moment from 'moment';
require('../../../../utils/uploadVideo.js');
export default {
	name: 'tools-webpage-template5',
	data() {
		return {
			isScroll: false,
			formData: {},
			webpageItem: {
				'webpageItemId': '',
				'name': '',
				'type': '',
				'productId': '',
				'skuId': '',
				'shopId': '',
				'videoId': 0,
				'description': '',
				'words': '',
				'image': '',
				'price': 0,
				'sequence': 0,
				'isError': false
			},
			uploadImageUrl: `${$CONFIG['domain']}/api/image/upload`,
			rules: {
				'title': [{
					required: true,
					message: '请输入标题',
					trigger: 'blur'
				}, {validator: (rule, value, callback) => {
					if (value.trim().length === 0) {
						callback(new Error('请输入标题'));
					} else if (limitLen(value, 30)) {
						callback();
					} else {
						callback(new Error('最大长度不超过30个字符'));
					}
				}, trigger: 'blur' }],
				'addSkuId': [{
					validator: (rule, value, callback) => {
						if (this.isShowProductCard && value.length === 0) {
							this.isError = false;
							this.errorMessage = '';
							callback(new Error('请输入SKU ID'));
						} else if (this.isShowProductCard && value.trim().length === 0) {
							callback(new Error('请输入SKU ID'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				'cardImage': [{
					required: true,
					message: '请上传分享卡图片',
					trigger: 'blur'
				}],
				'cardTitle': [{
					required: true,
					message: '请输入分享卡名称',
					trigger: 'blur'
				}],
				'cardDescription': [{
					required: true,
					message: '请输入分享卡文案',
					trigger: 'blur'
				}]
			},
			isError: false,
			errorMessage: '',
			productItem: {},
			isShowProductCard: false,
			isClickProductSure: false,
			isNumberError: false,
			isDeleteDialogShow: false,
			deleteItemIndex: '',
			numberErrorMessage: '',
			validateMsg: {
				cardImg: { //分享图片
		            cardImgName: '',
					isError: false,
					errorMsg: ''
				}
			},
			httpMethodMap: {
				new: 'post',
				copy: 'post',
				modify: 'put'
			},
			webpageId: '',
			dragObject: null
		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action,
		isProductCountFull() {
			let products =  this.formData.webpageItems.filter((item) => {
				return item.type === 'product';
			});
			return products.length >= 9;
		},
		webpageItemsVideoNum() {
			let videoArr = this.formData.webpageItems.filter((item) => {
				return item.type === 'video';
			});
			return videoArr.length;
		}
	},
	components: {
		HtmlEditor
	},
	created() {
		this.formData = copyObj(this.drawerData);
		if (this.formData.webpageId) {
			this.webpageId = this.formData.webpageId;
		}
		if (this.drawerCtrlAction === 'modify') {
			this.formData.webpageItems.forEach((item) => {
				Vue.set(item, 'isError', false);
			});
			this.modifyGetProductPrice();
		}
		this.resetWebpageItemSequence();
	},
	mounted() {
		let that = this;
		let productSure = that.$refs['product-sure'].$el;
		let flashPic = document.getElementById('J_flash_pic');
		let pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
		let innerHtml = "<a href='http://www.adobe.com/go/getflashplayer'><img src='"
			+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' target='_blank' /></a>";
		flashPic.innerHTML = innerHtml;
		that.uploadVideo();
		Event.$off('preparingUploadVideo');
		Event.$on('preparingUploadVideo', (data) => {
			let webpageItem = that.formData.webpageItems.find((item) => {
				return item.videoIndex === data.index;
			});
			if (!webpageItem) {
				if (that.webpageItemsVideoNum < 9) {
					let item = copyObj(that.webpageItem);
					item.type = 'video';
					item.progress = 0;
					item.videoIndex = data.index;
					item.isError = false;
					that.formData.webpageItems.push(item);
					that.resetWebpageItemSequence();
					that.domDraw();
				} else {
					that.isNumberError = true;
					that.numberErrorMessage = '最多上传9个视频';
				}
			}
		});
		Event.$off('startUploadVideo');
		Event.$on('startUploadVideo', (data) => {
			let webpageItem = that.formData.webpageItems.find((item) => {
				return item.videoIndex === data.index;
			});
			if (webpageItem) {
				webpageItem.name = subStringName(data.videoName);
			}
		});
		Event.$off('uploadVideoProgress');
		Event.$on('uploadVideoProgress', (data) => {
			let item = that.formData.webpageItems.find((item) => {
				return item.videoIndex === data.index;
			});
			if (item) {
				item.progress = data.progress;
			}
		});
		Event.$off('uploadVideoSuccess');
		Event.$on('uploadVideoSuccess', (data) => {
			let item = that.formData.webpageItems.find((item) => {
				return item.videoIndex === data.index;
			});
			if (item) {
				item.progress = data.progress;
				item.description = '上传成功!';
				item.isError = false;
				item.videoId = data.videoId;
				window.webpageUploadVideoIndex++;
			}
		});
		Event.$off('uploadVideoFail');
		Event.$on('uploadVideoFail', (data) => {
			let item = that.formData.webpageItems.find((item) => {
				return item.videoIndex === data.index;
			});
			if (item) {
				item.description = '上传失败';
				item.isError = true;
			}
			// window.webpageUploadVideoIndex--;
		});
		Event.$off('page-save');
		Event.$on('page-save', (avg) => {
			that.webpageId = that.webpageId ? that.webpageId : avg.pId;
			if (avg.publish) {
				that.$refs.formData.validate((result) => {
					if (result) {
						that.saveWebpage(false, false);
					}
				});
			} else {
				that.saveWebpage(true, avg.isAutoSave);
			}
		});
		Event.$off('page-publish');
		Event.$on('page-publish', (argv) => {
			Http.put("/api/webpage/publish", {
					webpageId: that.webpageId
				}
			).then((res) => {
				if (!res.data.iserror) {
					Event.$emit('page-publish-result', {
						error: 0,
						res: res.data
					});
				} else {
					let wordsError = res.data.data.sensitiveWordErrors;
					if (wordsError) {
						that.formData.webpageItems.forEach((item) => {
							if (item.type == 'rich_text') {
								item.isError = false;
								item.description = '';
							}
						});
						wordsError.forEach((item) => {
							let webpageItem = that.formData.webpageItems.find((webpageItem) => {
								return webpageItem.sequence == item.sequence;
							});
							if (webpageItem) {
								webpageItem.isError = true;
								webpageItem.description = '内容包含敏感词，' + item.word.join('，') + ' 请修改后重新发布';
							}
						})
					}
					let message = '';
					if (isEmptyObj(res.data.data)) {
						message = res.data.msg;
					} else {
						message = res.data.data.pageErrors;
					}
					Event.$emit('page-publish-result', {
						error: 1,
						res: {msg: message}
					});
				}
			}).catch((e) => {
				console.log(e);
				Event.$emit('page-publish-result', {
					error: 1,
					res: e
				});
			});
		});
		let scrollContent = that.$parent.$refs.scrollContainer;
		scrollContent.addEventListener('scroll', (e) => {
			let videoUpload = document.getElementById("video-upload");
			if (scrollContent.scrollTop >= 380) {
				that.isScroll = true;
				if (videoUpload) {
					videoUpload.style.cssText = 'position: fixed; top: 10px; right: 410px; z-index: 5; width: 136px; vertical-align: top; height: 40px;';
				}
			} else {
				that.isScroll = false;
				if (videoUpload) {
					videoUpload.style.cssText = 'float: left; width: 136px; vertical-align: top; height: 40px; border-radius: 4px; margin-right: 5px;';
				}
			}
		});
		window.boundFn = that.addVideos;
		that.webpageItemsSortableFn();
	},
	methods: {
		resetWebpageItemSequence() {
			this.formData.webpageItems.forEach((item, index) => {
				item.sequence = index + 1;
			});
		},
		domDraw(){
			let scrollContent = this.$parent.$refs.scrollContainer;
			this.$nextTick(function() {
				scrollContent.scrollTop = scrollContent.scrollHeight - 800;
				if(scrollContent.scrollTop >= 350){
					this.isScroll = true;
				}else{
					this.isScroll = false;
				}
			});
		},
		webpageItemsSortableFn() {
	        const that = this;
			that.dragObject = Sortable.create(document.getElementById('J_webpage_content'), {
				animation: 300,//动画参数
				draggable: '.draggable-box',
				onEnd: function (evt) { //拖拽完毕之后发生该事件
					that.exchangeWebpageItems(evt.oldIndex, evt.newIndex);
				}
			})
		},
		exchangeWebpageItems(oldIndex, newIndex) {
			let that = this;
			let webpageItems = that.formData.webpageItems;
			let oldValue = copyObj(webpageItems[oldIndex]);
			let newValue = copyObj(webpageItems[newIndex]);
			webpageItems.splice(oldIndex, 1);
			webpageItems.splice(newIndex, 0, oldValue);
		},
		domElementAllowDrop(ev){
			ev.stopPropagation();
			ev.preventDefault();
		},
		saveWebpage(isHideLoading, isAutoSave) {
			let that = this;
			let params = copyObj(that.formData);
			params.webpageItems = [];
			that.formData.webpageItems.forEach((item) => {
				let webpageItem = copyObj(item);
				if (webpageItem.type === 'video' || webpageItem.type === 'image') {
					if (!webpageItem.isError) {
						if (webpageItem.progress != undefined) {
							if (webpageItem.progress >= 100) {
								delete webpageItem.progress;
								delete webpageItem.videoIndex;
								delete webpageItem.webpageItemId;
								delete webpageItem.isError;
								webpageItem.description = '';
								params.webpageItems.push(webpageItem);
							}
						} else {
							delete webpageItem.videoIndex;
							delete webpageItem.webpageItemId;
							delete webpageItem.isError;
							webpageItem.description = '';
							params.webpageItems.push(webpageItem);
						}
					}
				} else if (webpageItem.type === 'rich_text') {
					delete webpageItem.webpageItemId;
					delete webpageItem.isError;
					webpageItem.description = '';
					webpageItem.words = webpageItem.words.replace(/font-size: large/g, 'font-size: 18px');
					webpageItem.words = webpageItem.words.replace(/font-size: medium/g, 'font-size: 16px');
					webpageItem.words = webpageItem.words.replace(/<font size="4">/g, '<span style="font-size: 18px;">');
					webpageItem.words = webpageItem.words.replace(/<font size="3">/g, '<span style="font-size: 16px;">');
					webpageItem.words = webpageItem.words.replace(/<\/font>/g, '</span>');
					params.webpageItems.push(webpageItem);
				} else {
					delete webpageItem.webpageItemId;
					delete webpageItem.isError;
					params.webpageItems.push(webpageItem);
				}
			});
			delete params.addSkuId;
			let method = that.webpageId ? 'modify' : 'new';
			Http({
				url: '/api/webpage',
				method: that.httpMethodMap[method],
				hideLoading: isHideLoading,
				data: method === 'modify' ? mixin({webpageId: that.webpageId}, params) : params
			}).then((res) => {
				if (!res.data.iserror) {
					if (!that.webpageId) {
						that.webpageId = res.data.data.webpageId;
					}
					if (isAutoSave) {
						that.$message({
							message: '已自动保存成功',
							type: 'success',
							duration: 3000,
							customClass: 'template-auto-save'
						});
					} else {
						Event.$emit('page-save-result', {
							error: 0,
							res: mixin(res.data, {webpageId: that.webpageId})
						});
					}
				} else {
					if (!isAutoSave) {
						Event.$emit('page-save-result', {
							error: 1,
							res: res.data
						});
					}
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		addWords() {
			let item = copyObj(this.webpageItem);
			item.type = 'rich_text';
			this.formData.webpageItems.push(item);
			this.resetWebpageItemSequence();
			this.domDraw();
		},
		addImages() {
			let input = document.getElementById("J_upload_image");
			input.click();
		},
		addVideos() {
			console.log('8888');
			// let videoUpload = document.getElementById("video-upload");
			// console.log(videoUpload);
			// videoUpload.click();
		},
		addProducts() {
			this.isShowProductCard = true;
		},
		addProductCancelHandler() {
			this.isShowProductCard = false;
		},
		checkProduct() {
			let that = this;
			if (!that.formData.addSkuId) return;
			if (that.formData.addSkuId.trim().length == 0) return;
			Http.get('/api/mall/skus?skuIds=' + that.formData.addSkuId, {hideLoading: true}).then((res) => {
				if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
					if (res.data.data[0].skuId == null) {
						that.isError = true;
						that.errorMessage = '未找到该商品';
					}
				}
			});
		},
		addProductSureHandler() {
			let that = this;
			if (!that.formData.addSkuId) return;
			if (that.formData.addSkuId.trim().length == 0) return;
			if (that.isProductCountFull) {
				that.isError = true;
				that.errorMessage = '最多可添加9个SKU';
				return;
			}
			let productItem = that.formData.webpageItems.find((item) => {
				return item.type == 'product' && item.skuId == that.formData.addSkuId;
			});
			if (productItem) {
				that.isError = true;
				that.errorMessage = '请不要输入重复商品';
				return;
			}
			Http.get('/api/mall/skus?skuIds=' + that.formData.addSkuId).then((res) => {
				if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
					if (res.data.data[0].skuId == null) {
						that.isError = true;
						that.errorMessage = '未找到该商品';
					} else {
						let data = res.data.data[0];
						let item = copyObj(that.webpageItem);
						item.name = data.name;
						item.type = 'product';
						item.productId = data.productId;
						item.skuId = data.skuId;
						item.description = data.description;
						item.image = data.images[0];
						item.price = data.price;
						that.formData.webpageItems.push(item);
						that.isShowProductCard = false;
						that.formData.addSkuId = '';
						that.isError = false;
						that.errorMessage = '';
						that.resetWebpageItemSequence();
						that.domDraw();
					}
				}
			});
		},
		modifyGetProductPrice() {
			let skuIds = [];
			this.formData.webpageItems.forEach((item) => {
				if (item.type === 'product') {
					skuIds.push(item.skuId);
					Vue.set(item, 'price', 0);
				}
			});
			if (skuIds.length == 0) return;
			Http.get('/api/mall/skus?skuIds=' + skuIds.join(',')).then((res) => {
				let priceSkus = res.data.data;
				this.formData.webpageItems.forEach((item) => {
					if (item.type === 'product') {
						let priceItem = priceSkus.find((pitem) => {
							return pitem.skuId === item.skuId;
						});
						if (priceItem) {
							item.price = priceItem.price;
						}
					}
				});
			}).catch((error) => {
				console.log(error);
			});
		},
		deleteWebpageItem() {
			this.formData.webpageItems.splice(this.deleteItemIndex, 1);
			this.deleteItemIndex = '';
			this.isDeleteDialogShow = false;
			this.resetWebpageItemSequence();
		},
		showDeleteDialog(index) {
			this.isDeleteDialogShow = true;
			this.deleteItemIndex = index;
		},
		uploadImageChange(event) {
			let files = event.target.files;
			for (let i = 0; i < files.length; i++) {
				let item = copyObj(this.webpageItem);
				item.type = 'image';
				item.name = subStringName(files[i].name);
				item.progress = 0;
				let index = this.formData.webpageItems.push(item);
				this.loadImageFile(files[i], index - 1);
				this.resetWebpageItemSequence();
				this.domDraw();
			}
			let imageInput = document.getElementById("J_upload_image");
			imageInput.value = '';
		},
		loadImageFile(file, index) {
			let that = this;
			if (!/jpg|png|jpeg|gif/g.test(file.type)) {
				that.isNumberError = true;
				that.numberErrorMessage = '图片格式仅支持jpg, png, gif';
				that.formData.webpageItems.splice(index, 1);
				setTimeout(function() {
					that.isNumberError = false;
					that.numberErrorMessage = '';
				}, 5000);
				return false;
			}
			if (file.size > 10 * 1024 * 1024) {
				that.isNumberError = true;
				that.numberErrorMessage = '图片大小最大为10MB';
				that.formData.webpageItems.splice(index, 1);
				setTimeout(function() {
					that.isNumberError = false;
					that.numberErrorMessage = '';
				}, 5000);
				return false;
			}
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload=function(){
					imageData.append('file', file);
					that.imageUpload(imageData, index);
				};
				image.src= data;
			};
			reader.readAsDataURL(file);
		},
		imageUpload(data, index) {
			let that = this;
			Http({
				url: '/api/image/upload',
				method: 'post',
				data: data,
				hideLoading: true,
				onUploadProgress: function(event) {
					that.formData.webpageItems[index].progress = (event.loaded / event.total) * 100;
				}
			}).then((res) => {
				if (res.data.code === 200 && res.data.data.imageUrl) {
					that.formData.webpageItems[index].image = res.data.data.imageUrl;
					that.formData.webpageItems[index].isError = false;
					that.formData.webpageItems[index].description = '';
				} else {
					that.formData.webpageItems[index].isError = true;
					that.formData.webpageItems[index].description = '上传失败';
				}
			}).catch((error) => {
				that.formData.webpageItems[index].isError = true;
				that.formData.webpageItems[index].description = '上传失败';
			});
		},
		uploadVideo() {
			let flashContent = document.getElementById('J_webpage_flash');
			let swfVersionStr = "11.4.0";
			let xiSwfUrlStr = "expressInstall.swf";
			var flashvars = {
				icon: 'https://mevent.meixincdn.com/common/image/videoIcon.png'
			};
			var params = {};
			params.quality = "high";
			params.bgcolor = "#fff";
			params.allowscriptaccess = "always";
			params.allowfullscreen = "true";
			var attributes = {};
			attributes.id = "video-upload";
			attributes.name = "video-upload";
			attributes.align = "middle";
			attributes.bgcolor="#fff";
			attributes.style = 'float: left; width: 136px;border: 1px solid #c0ccda;border-radius: 4px; vertical-align: top; height: 40px;margin-right: 5px;'
			swfobject.embedSWF(
				"https://js.meixincdn.com/gvs-player/dist/utils/video-upload.swf?t=" + new Date().getTime(),
				"J_webpage_flash",
				"136", "40",
				swfVersionStr, xiSwfUrlStr,
				flashvars, params, attributes);
			swfobject.createCSS(flashContent, "display:block;text-align:left;");
		},
		changeShareFile(){
			let input = document.getElementById("sharePicture");
			input.click();
		},
		sharePictureChange(eve) {
			let files = eve.target.files;
			this.loadShareImage(files[0]);

		},
		loadShareImage(file) {
			let that = this;
			if (file.size > 15 * 1024) {
				that.validateMsg.cardImg.isError = true;
				that.validateMsg.cardImg.errorMsg = '图片大小最大为15KB';
				return false;
			}
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload = function(){
					let width = image.width;
					let height = image.height;
					if(width !== height) {
						that.validateMsg.cardImg.isError = true;
						that.validateMsg.cardImg.errorMsg = '请上传宽高比例为1:1的图片'
					} else {
						imageData.append('file', file);
						that.shareImageUpload(imageData);
						that.validateMsg.cardImg.cardImgName = file.name;
						that.validateMsg.cardImg.isError = false;
						that.validateMsg.cardImg.errorMsg = ''
					}
				};
				image.src= data;
			};
		   reader.readAsDataURL(file);
		},
		shareImageUpload(data) {
			Http.post('/api/image/upload', data).then((res) => {
				if (res.data.code === 200) {
					this.formData.cardImage = res.data.data.imageUrl;
					this.validateMsg.cardImg.isError = false;
					this.validateMsg.cardImg.errorMsg = '';
					this.$refs.formData.validateField('cardImage');
				}
			}).catch((error) => {
				console.log(error);
				this.validateMsg.cardImg.isError = true;
				this.validateMsg.cardImg.errorMsg = '上传失败，请重新上传!';
			});
		}
	}
};
</script>
<style lang="less" scoped>
	.con-dialog-wapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1200;
		background: rgba(0, 0, 0, .6);
		.dialog-content {
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translateX(-50%);
			width: 500px;
			padding: 20px;
			border: 1px solid #ddd;
			box-shadow: 0 3px 3px 1px rgba(0, 0, 0, .3);
			background: #fff;
			.dialog-header {
				position: relative;
				height: 30px;
				span {
					font-size: 18px;
				}
				.icon {
					position: absolute;
					top: 0;
					right: 0;
					cursor: pointer;
					&:hover {
						color: #d30312;
					}
				}
			}
			.dialog-body {
				padding: 15px;
			}
			.dialog-footer {
				text-align: right;
				.dialog-btn {
					padding: 6px 15px;
					background: #fff;
					border: 1px solid #ddd;
					border-radius: 4px;
					color: #333;
					cursor: pointer;
					&.dialog-btn-primary {
						background: #d30312;
						color: #fff;
						border-color: #d30312;
					}
				}
			}
		}
	}
	.scroll{
		position: fixed;
		top: 0;
		z-index: 5;
		background: #fff;
		height: 60px;
		padding: 10px 0;
		-webkit-transition: top .5s;
		-moz-transition: top .5s;
		-o-transition: top .5s;
		transition: top .5s;
		-webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
		-moz-box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
		box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
	}
	.spliTitle {
		font-size: 30px;
		color:#3e4044;
	    clear:both;
		span{
			color:#89919c;
			font-size: 14px;
			margin-left: 4px;
		}
	}
	.product-inline-box {
		position: absolute;
		top: 42px;
		right: 240px;
		width: 300px;
	}
	.el-popover[x-placement^="bottom"] {
		margin-top: 5px;
	}
	.webpage-content {
		.webpage-item-box {
			position: relative;
			transition: all 1s;
			border: 1px solid #c0ccda;
			box-sizing: border-box;
			width: 350px;
			padding: 30px 20px 20px;
			border-radius: 8px;
			-webkit-border-radius: 8px;
			-moz-border-radius: 8px;
			margin-bottom: 20px;
			&:hover {
				background: #fafafa;
				cursor: move;
		 		border-style: dashed;
			}
			.plusBtn {
				display: block;
				width: 345px;
				margin-left: 67px;
				border: 1px dashed;
				margin-bottom: 20px;
			}
			.icon-close {
				position: absolute;
				padding: 8px;
				right: 10px;
				top: 5px;
				z-index: 4;
				&:hover {
					color: #d30312;
					cursor: pointer;
				}
			}
			&.editor-box {
				width: 690px;
				padding: 0;
				border: 0;
				.icon-close {
					top: 8px;
				}
				&:hover {
					background: #fff;
				}
			}
			&.webpage-item-error {
				border-color: #ff0000;
			}
			.webpage-product {
				display: flex;
				width: 100%;
				box-sizing: border-box;
				.product-image {
					width: 90px;
					height: 90px;
					max-width: 90px;
					min-width: 90px;
					-webkit-box-flex: 0;
					-ms-flex-positive: 0;
					flex-grow: 0;
					img {
						width: 90px;
						height: 90px;
					}
				}
				.product-info {
					-webkit-box-flex: 1;
					-ms-flex-positive: 1;
					flex-grow: 1;
					position: relative;
					width: 218px;
					box-sizing: border-box;
					padding-left: 15px;
					.product-title {
						width: 100%;
						height: 40px;
						font-size: 16px;
						line-height: 20px;
						color: #333;
						text-overflow: ellipsis;
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					.product-desc {
						width: 100%;
						font-size: 14px;
						line-height: 20px;
						color: #666;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
					}
					.product-price {
						position: absolute;
						bottom: 0;
						left: 15px;
					}
				}
			}
			.webpage-image {
				width: 100%;
				text-align: center;
				.image-name {
					box-sizing: border-box;
					word-wrap: normal;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 14px;
					margin: 0 auto 5px;
					.icon {
						color: #16b163;
						font-size: 14px;
						margin-top: -4px;
						margin-right: 4px;
						width: 16px;
						height: 16px;
					}
				}
				img {
					max-width: 310px;
					max-height: 310px;
				}
			}
			.webpage-video {
				width: 100%;
				text-align: center;
				.video-name, .video-finish {
					font-size: 14px;
					margin-bottom: 5px;
				}
				.video-name {
					margin: 0 auto 5px;
					box-sizing: border-box;
					word-wrap: normal;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					.icon {
						color: #ff2888;
						font-size: 14px;
						margin-right: 4px;
						margin-top: -4px;
						width: 16px;
						height: 16px;
					}
				}
				img {
					max-width: 310px;
					max-height: 310px;
				}
				.error-message {
					.icon {
						&.icon-right {
							font-size: 12px;
							background: #1bb169;
							color: #fff;
							border-radius: 50%;
							line-height: 16px;
						}
					}
				}
			}
			.progress-box {
				width: 100%;
				height: 20px;
				padding: 0 20px;
				box-sizing: border-box;
				text-align: center;
				.progress-state {
					font-size: 14px;
				}
				.progress-bar {
					position: relative;
					display: inline-block;
					border: 1px solid #ddd;
					width: 160px;
					height: 10px;
					.progress-value {
						position: absolute;
						left: 0;
						top: 0;
						width: 50%;
						height: 100%;
						background: #1bb169;
					}
				}
			}
		}
		.el-icon-delete {
			display: table-cell;
			float: right;
			font-size: 19px;
			height: 36px;
			line-height: 36px;
			margin-right: 14px;
			padding: 0;
			vertical-align: middle;
			width: 30px;
		}
	}
	.share-image-box {
		max-width: 200px;
		max-height: 200px;
		img {
			margin: 0 auto;
			max-width: 200px;
			max-height: 200px;
		}
	}
	#video-upload {
		float: left;
		margin-right: 5px;
		vertical-align: top;
		border-radius: 5px;
	}
	.error-message {
		&.error-right {
			position: absolute;
			top: 4px;
			left: 570px;
			width: 100%;
		}
	}
	.webpage-item-button {
		display: inline-block;
		width: 136px;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #c0ccda;
		color: #1F2D3D;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		padding: 12px 15px;
		font-size: 14px;
		border-radius: 4px;
		margin: 0 5px 0 0;
		float: left;
		&:hover {
			background: #d30312;
			color: #fff;
			border-color: #d30312;
		}
		&.btn-disabled {
			color: #bfcbd9;
			cursor: not-allowed;
			background-image: none;
			background-color: #eef1f6;
			border-color: #d1dbe5;
		}
	}
	#J_webpage_flash {
		position: relative;
		#J_flash_pic {
			position: absolute;
			top: 2px;
		}
	}
</style>