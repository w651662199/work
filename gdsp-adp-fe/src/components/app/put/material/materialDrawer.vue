<template>
	<div class="part-form" style="width: 850px;">
		<div class="form-column">
			<el-form :model="materialData" ref="materialForm" :rules="formRules" label-width="155px">
				<el-form-item label="创意类型：" prop="formatCategoryId" class="is-required">
					<el-radio-group v-model="materialData.formatCategoryId" :disabled="actionType === 'modify'" @change="formatCategoryChange">
						<el-radio :label="CONST.FORMAT_CATEGORY.NATIVE">原生</el-radio>
						<el-radio :label="CONST.FORMAT_CATEGORY.DOWNLOAD" :disabled="true">应用下载</el-radio>
						<el-radio :label="CONST.FORMAT_CATEGORY.VIDEO" :disabled="true">视频</el-radio>
						<el-radio :label="CONST.FORMAT_CATEGORY.IMAGE">图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="创意形式：" prop="formatId" class="is-required">
					<el-radio-group v-model="materialData.formatId" @change="formatChange" :disabled="actionType === 'modify'">
						<el-radio v-for="item in materialData.formats" :label="item.formatId" style="margin: 0 10px 10px 0;" v-if="item.isAppendMaterial !== 1">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item
					v-for="(item, fIndex) in materialData.formatElements"
					:label="getFormatName(item)"
					:prop="'formatElements.' + fIndex + '.value'"
					:rules="getRules(item)"
					:class="{'is-required': getStandard(item.standards, 'isNull') == 1 || item.type === 'image'}"
				>
					<template v-if="item.type === 'image'">
						<input type="file"
							:ref="'FIMAGE_' + item.formatElementId"
							:id="item.formatElementId"
							:accept="getImageAccept(item.standards)"
							@change="imageChange(item, $event)">
						<button class="btn btn-blue-simple" type="button" @click.prevent="selectImage(item.formatElementId)">选择文件</button>
						<span>{{item.value.length}}/{{getStandard(item.standards, 'imageNumber')}}</span>
						<span class="error-message">{{imageError}}</span>
						<ul class="image-list">
							<li class="img-item" v-for="(img, i) in item.value">
								<img class="hor-img" :src="img">
								<em class="icon icon-shut" @click="removeImg(item.value, i, item.formatElementId)"></em>
							</li>
						</ul>
					</template>
					<el-input v-if="item.type === 'text' && item.subType === 'input'" v-model="item.value" style="width: 300px;"></el-input>
					<p v-if="item.variable === 'creative.lp_open_url'">Deeplink的链接只支持“首页”、“活动页”、“搜索页”、“品类页”、“详情页”</p>
				</el-form-item>

				<el-form-item label="创意名称：" prop="name" class="is-required">
					<el-input v-model="materialData.name" style="width: 300px;" placeholder="请输入创意名称"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import CONST from 'help/CONST.js';
import Http from 'http';
import Event from 'event';
import store from 'store';
import Axios from 'axios';
import {mixin, getCNLength} from 'utils/common';
import gify from 'utils/gify/gify.js';
const ELEMENTNAMES = {
	'creative.title': '创意标题',
	'creative.source': '创意来源',
	'creative.external_url': '跳转URL',
	'creative.lp_open_url': 'DEEPLINK',
	'app.app_name': '应用名称',
	'app_type': '应用类型',
	'app.download_url': '下载链接',
	'image_banner.description': '应用描述',
	'image_banner': '图片',
};
export default {
	name: 'materialDrawer',
	data() {
		return {
			CONST: CONST,
			materialData: {
				formatCategoryId: '',
				name: '',
				formatId: '',
				landingPage: '',
				skuId: '',
				productId: '',
				deepLink: '',
				formats: [],
				formatElements: [],
				materialComponents: []
			},
			magerialImage: '',
			imageError: '',
			allFormats: [],
			formRules: {
				formatCategoryId: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择创意类型'));
						}
						callback();
					},
					trigger: 'blur'
				}],
				formatId: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择创意创意形式'));
						}
						callback();
					},
					trigger: 'blur'
				}],
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('请输入创意名称'));
						} else if (value.length > 30) {
							callback(new Error('填写的内容不得超过30个字符'));
						} else {
							/*
							Http.get('/api/material/exist?name=' + value, {
								hideLoading: true
							}).then((res) => {
								if (res.data.code == 200 && res.data.iserror === 0) {
									if (res.data.data.exist == 1) {
										callback(new Error('创意名称已存在'));
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
				}],
				text: [{
					required: false,
					validator: (rule, value, callback) => {
						let index = Number(rule.field.split('.')[1]);
						let format = this.materialData.formatElements[index];
						let standardsMap = this.transStandardsToMap(format.standards);
						let isNull = standardsMap['S_isNull'] ? standardsMap['S_isNull'].value : false;

						let minLength = standardsMap['S_min'] ? standardsMap['S_min'].value : 0;
						let maxLength = standardsMap['S_max'] ? standardsMap['S_max'].value : 0;

						let isUrl = standardsMap['S_isUrl'] ? standardsMap['S_isUrl'].value : false;
						let regUrl = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
						if (!value || value.trim() === '') {
							if (isNull == 1) {
								callback(new Error('请输入' + format.name));
							}
							callback();
						} else {
							if (minLength && maxLength) {
								if (getCNLength(value) < minLength * 2) {
									callback(new Error('输入的内容不得少于' + minLength + '个字符'));
								} else if (getCNLength(value) > maxLength * 2) {
									callback(new Error('输入的内容不得超过' + maxLength + '个字符'));
								} else {
									callback();
								}
							} else {
								if (!!isUrl && isUrl == 1) {
									if (regUrl.test(value)) {
										callback(new Error('不允许输入URL地址'));
									} else {
										callback();
									}
								} else if (!!isUrl && isUrl == 0) {
									if (!regUrl.test(value)) {
										callback(new Error('请输入有效的URL地址'));
									} else {
										callback();
									}
								}
							}
						}
					},
					trigger: 'blur'
				}],
				image: [{
					required: true,
					validator: (rule, value, callback) => {
						let index = Number(rule.field.split('.')[1]);
						let format = this.materialData.formatElements[index];
						let standardsMap = this.transStandardsToMap(format.standards);
						let imageNumber = standardsMap['S_imageNumber'].value;
						let imageNumberOperator = this.getOperator(standardsMap['S_imageNumber'].operator);
						let operatorText = this.getOperatorText(standardsMap['S_imageNumber'].operator);
						if (eval(format.value.length + imageNumberOperator + imageNumber)) {
							callback();
						} else {
							callback(new Error('上传的图片数量应该' + operatorText + imageNumber));
						}
					},
					trigger: 'blur'
				}],
				landingPage: [{
					required: false,
					validator: (rule, value, callback) => {
						let checkUrl = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
						if (!value || value.length === 0) {
							callback(new Error('请输入跳转URL'));
						} else if (!checkUrl.test(value) || value.indexOf('gome') == -1) {
							callback(new Error('请输入正确的跳转URL'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				deepLink: [{
					required: false,
					validator: (rule, value, callback) => {
						if (value.length > 0) {
							if (value.trim() == '') {
								callback(new Error('请输入合法的deeplink地址'));
							} else {
								let regUrl = /([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
								if (regUrl.test(value) && value.indexOf('gome') > -1) {
									callback();
								} else {
									callback(new Error('请输入合法的URL'));
								}
							}
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
		actionType() {
			return store.state.putDrawerCtr.action;
		},
		putConfig() {
			return store.state.putDrawerCtr.config;
		}
 	},
	created() {
		if (this.actionType === 'modify') {
			this.getData();
		} else {
			this.getAllFormats();
		}
	},
	mounted() {
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.saveMaterial();
		});
	},
	methods: {
		isFormatDisabled(formatName) {
			return formatName.indexOf('附加') > -1;
		},
		getAllFormats() {
			let url = '/api/formats';
			if (this.putConfig.campaignId) {
				url += '?campaignId=' + this.putConfig.campaignId;
			}
			Http.get(url).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					for (let format of res.data.data) {
						if (format.formatElements) {
							for (let element of format.formatElements) {
								if (element.type === 'text') {
									this.$set(element, 'value', '');
								} else if (element.type === 'image') {
									this.$set(element, 'value', []);
								}
							}
						}
						let fcKey = 'FC_' + format.formatCategoryId;
						if (this.allFormats[fcKey] != undefined) {
							this.allFormats[fcKey].formats.push(format);
						} else {
							this.allFormats[fcKey] = {formatCategoryId: format.formatCategoryId, formats: [format]};
						}
					}
					if (this.actionType === 'modify') {
						this.formatCategoryChange();
						this.formatChange();
						this.setFormatValue();
					}
				}
			}).catch(err => {
				console.log(err);
			});
		},
		saveMaterial() {
			this.$refs['materialForm'].validate(valid => {
				if (valid) {
					let material = {
						name: this.materialData.name,
						formatCategoryId: this.materialData.formatCategoryId,
						formatId: this.materialData.formatId,
						materialComponents: this.getComponents(),
						landingPage: this.materialData.landingPage,
						deepLink: this.materialData.deepLink,
						productId: this.materialData.productId,
						skuId: this.materialData.skuId
					};
					let flightMaterial;
					let url = '/api/material';
					if (this.putConfig.flightId && this.actionType === 'new') {
						url = '/api/flight/material';
						flightMaterial = {
							material: material,
							flightId: this.putConfig.flightId
						};
					}
					if (this.actionType === 'modify') {
						material.materialId = this.putConfig.materialId;
					}
					Http({
						url: url,
						method: this.actionType === 'new' ? 'post' : 'put',
						data: this.putConfig.flightId ? flightMaterial : material
					}).then(res => {
						if (res.data.code === 200 && res.data.iserror === 0) {
							Event.$emit('put-save-result', {
								isError: false,
								data: res.data.data
							});
						} else {
							this.$message({
								type: 'error',
								message: res.data.msg,
								duration: 3000
							});
						}
					}).catch(err => {
						console.log(err);
					});
				}
			});
		},
		getRules(format) {
			if (format.variable === 'creative.external_url') {
				return this.formRules.landingPage;
			} else if (format.variable === 'creative.lp_open_url') {
				return this.formRules.deepLink;
			} else {
				if (format.type === 'image') {
					return this.formRules.image;
				} else {
					return this.formRules.text;
				}
			}
		},
		getComponents() {
			let components = [];
			for (let format of this.materialData.formatElements) {
				if (format.value || format.value.length > 0) {
					if (format.variable !== 'creative.external_url' && format.variable !== 'creative.lp_open_url') {
						let component = {
							formatId: format.formatId,
							name: format.name,
							type: format.type,
							variable: format.variable
						};
						if (format.type === 'image') {
							component.url = format.value.join(',');
							component.width = format.width;
							component.height = format.height;
						} else {
							component.textWords = format.value;
						}
						components.push(component);
					}
				}
				if (format.variable === 'creative.external_url') {
					this.materialData.landingPage = format.value;
					this.setProductAndSku(format.value);
				} else if (format.variable === 'creative.lp_open_url') {
					this.materialData.deepLink = this.getDeepLink(format.value);
				}
			}
			return components;
		},
		getDeepLink(link) {
			let deepLink = link.trim();
			deepLink = deepLink.replace(/^http(s)?:\/\/|^gome:\/\//ig, '');
			deepLink = deepLink.replace(/(^|&)intcmp=([^&]*)(&|$)/ig, '&');
			deepLink = deepLink.replace(/(^|\?)intcmp=([^&]*)(&|$)/ig, '?');
			deepLink = deepLink.replace(/(^|&)cmpid=([^&]*)(&|$)/ig, '&');
			deepLink = deepLink.replace(/(^|\?)cmpid=([^&]*)(&|$)/ig, '?');
			deepLink = deepLink.replace(/\?$|&$|\?&$|&\?$/g, '');
			return deepLink;
		},
		setProductAndSku(landingPage) {
			let reg = /\/(item.gome.com.cn|item.m.gome.com.cn|item.m.gomeplus.com)[^\/|\.]*\/([^\/|\.]+)/;
			if (reg.test(landingPage)) {
				let res = landingPage.match(reg)[2].indexOf('-') >= 0 ? landingPage.match(reg)[2].split('-') : [];
				this.materialData.productId = res[0] ? res[0] : '';
				this.materialData.skuId = res[1] ? res[1] : '';
			}
		},
		getData() {
			Http.get('/api/material?materialId=' + this.putConfig.materialId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.materialData = mixin(this.materialData, res.data.data);
					this.getAllFormats();
				} else {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				}
			}).catch(err => {
				console.log(err);
			});
		},
		formatCategoryChange() {
			if (this.allFormats['FC_' + this.materialData.formatCategoryId]) {
				this.materialData.formats = this.allFormats['FC_' + this.materialData.formatCategoryId].formats;
			} else {
				this.materialData.formats = [];
			}
			if (this.actionType !== 'modify') {
				this.materialData.formatId = '';
				this.materialData.formatElements = [];
			}
		},
		formatChange() {
			for (let format of this.materialData.formats) {
				if (format.formatId === this.materialData.formatId) {
					this.materialData.formatElements = format.formatElements;
					break;
				}
			}
		},
		setFormatValue() {
			let components = [];
			for (let component of this.materialData.materialComponents) {
				let key = 'F_' + component.variable;
				components[key] = component;
			}
			for (let format of this.materialData.formatElements) {
				let component = components['F_' + format.variable];
				if (component) {
					if (format.type === 'text') {
						format.value = component.textWords;
					} else if (format.type === 'image') {
						format.value = component.url.split(',');
						this.$set(format, 'width', component.width);
						this.$set(format, 'height', component.height);
					}
				} else {
					if (format.variable === 'creative.external_url') {
						format.value = this.materialData.landingPage;
					} else if (format.variable === 'creative.lp_open_url') {
						format.value = this.materialData.deepLink;
					}
				}
			}
		},
		getFormatName(format) {
			if (ELEMENTNAMES[format.variable]) {
				return ELEMENTNAMES[format.variable] + '：';
			}
			return format.name + '：';
		},
		getStandard(standards, name) {
			if (standards && standards.length > 0) {
				for (let standard of standards) {
					if (standard.variable === name) {
						return standard.value;
					}
				}
			}
			return '';
		},
		getImageAccept(standards) {
			if (standards && standards.length > 0) {
				let accept = this.getStandard(standards, 'suffix');
				let acceptArr = accept ? accept.split(',') : [];
				let result = [];
				for (let acc of acceptArr) {
					result.push('image/' + acc.toLowerCase());
				}
				if (acceptArr.indexOf('jpg') > -1 || acceptArr.indexOf('JPG') > -1) {
					result.push('image/jpeg');
				}
				return result.join(',');
			} else {
				return '';
			}
		},
		selectImage(formatElementId) {
			let input = this.$refs['FIMAGE_' + formatElementId][0];
			if (input) {
				input.click();
			}
		},
		imageChange(formatElement, event) {
			let files = event.target.files;
			if (files[0]) {
				this.loadImageFile(files[0], formatElement);
			}
		},
		transStandardsToMap(standards) {
			let standardsMap = [];
			for (let standard of standards) {
				let key = 'S_' + standard.variable;
				standardsMap[key] = standard;
			}
			return standardsMap;
		},
		loadImageFile(file, formatElement) {
			let standardsMap = this.transStandardsToMap(formatElement.standards);
			let imageAccept = this.getImageAccept(formatElement.standards);
			if (imageAccept.length > 0 && imageAccept.indexOf(file.type) === -1) {
				this.imageError = '只能上传' + standardsMap['S_suffix'].value + '格式的图片';
				return false;
			} else if (imageAccept.length === 0 && file.type.indexOf('image') === -1) {
				this.imageError = '只能上传图片文件';
				return false;
			}
			let isGif = file.type.indexOf('gif') > -1;
			let imageNumber = Number(standardsMap['S_imageNumber'].value);
			let imageNumberOperator = this.getOperator(standardsMap['S_imageNumber'].operator);
			if (eval(formatElement.value.length + imageNumberOperator + imageNumber)) {
				this.imageError = '图片数量应' + this.getOperatorText(standardsMap['S_imageNumber'].operator) + imageNumber;
				return false;
			}
			this.imageError = '';
			let imageSize = standardsMap['S_imageSize'].value;
			let limiteSize = this.getLimiteSize(imageSize);
			let imageWidth = Number(standardsMap['S_width'].value);
			let imageHeight = Number(standardsMap['S_height'].value);
			let imageResolutionWidth = Number(standardsMap['S_resolutionWidth'].value);
			let imageResolutionHeight = Number(standardsMap['S_resolutionHeight'].value);
			let gifDuration = standardsMap['S_duration'] ? Number(standardsMap['S_duration'].value) : 0;
			let operator = this.getOperator(standardsMap['S_imageSize'].operator);
			if (!eval(file.size + operator + limiteSize)) {
				this.imageError = '图片大小应' + this.getOperatorText(standardsMap['S_imageSize'].operator) + imageSize;
				return false;
			}
			this.imageError = '';
			let that = this;
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let blob = new Blob([e.target.result]);
				window.URL = window.URL || window.webkitURL;
				let blobURL = window.URL.createObjectURL(blob);
				let data = e.target.result;
				let image = new Image();
				image.onload = function() {
					let gifInfo, duration = 0;;
					if (isGif) {
						gifInfo = gify.getInfo(reader.result);
						duration = gifInfo.duration;
					}
					let width = isGif ? gifInfo.width : image.width;
					let height = isGif ? gifInfo.height : image.height;
					let scale = width / height;
					let minResolution = width * height;
					if (width != imageResolutionWidth || height != imageResolutionHeight) {
						that.imageError = '图片的分辨率应为' + imageResolutionWidth + 'x' + imageResolutionHeight;
						return false;
					} else if (scale !== imageWidth / imageHeight) {
						that.imageError = '请上传宽高比为' + imageWidth + ':' + imageHeight + '的图片';
						return false;
					} else if (isGif && duration >= gifDuration * 1000 ) {
						that.imageError = 'GIF图的时长不能大于' + gifDuration + '秒';
						return false;
					} else {
						that.imageError = '';
						that.$set(formatElement, 'width', width);
						that.$set(formatElement, 'height', height);
						imageData.append('file', file);
						that.imageUpload(imageData, formatElement);
					}
				};
				if (isGif) {
					image.src = blobURL;
				} else {
					image.src = data;
				}
			};
			if (isGif) {
				reader.readAsArrayBuffer(file);
			} else {
				reader.readAsDataURL(file);
			}
		},
		imageUpload(data, formatElement) {
			Http.post('/api/image/upload', data).then((res) => {
				if (res.data.code === 200) {
					formatElement.value.push(res.data.data.imageUrl);
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
		},
		getOperator(operator) {
			if (operator === CONST.OPERATOR.EQUAL) {
				return '===';
			} else if (operator === CONST.OPERATOR.LARGE) {
				return '>';
			} else if (operator === CONST.OPERATOR.LARGE_EQUAL) {
				return '>=';
			} else if (operator === CONST.OPERATOR.LESS) {
				return '<';
			} else if (operator === CONST.OPERATOR.LESS_EQUAL) {
				return '<=';
			}
		},
		getOperatorText(operator) {
			if (operator === CONST.OPERATOR.EQUAL) {
				return '等于';
			} else if (operator === CONST.OPERATOR.LARGE) {
				return '大于';
			} else if (operator === CONST.OPERATOR.LARGE_EQUAL) {
				return '大于或等于';
			} else if (operator === CONST.OPERATOR.LESS) {
				return '小于';
			} else if (operator === CONST.OPERATOR.LESS_EQUAL) {
				return '小于或等于';
			}
		},
		getLimiteSize(imageSize) {
			let imageSizeValue = Number(imageSize.substring(0, imageSize.length -2));
			let imageSizeUnit = imageSize.substring(imageSize.length -2);
			let size = 0;
			if (imageSizeUnit.toLowerCase() === 'kb') {
				size = 1024;
			} else if (imageSizeUnit.toLowerCase() === 'mb') {
				size = 1024 * 1024;
			} else if (imageSizeUnit.toLowerCase() === 'gb') {
				size = 1024 * 1024 * 1024;
			}
			return imageSizeValue * size;
		},
		removeImg(images, i, formatId) {
			this.$refs['FIMAGE_' + formatId][0].value = '';
			images.splice(i, 1);
		}
	}
};
</script>
<style lang="less" scoped>
	input[type='file'] {
		width: 146px;
		height: 100px;
		display:block;
		position:absolute;
		visibility: hidden;
	}
	.image-list {
		margin-top: 10px;
		.img-item {
			display: inline-block;
			position: relative;
			.icon {
				position: absolute;
				top: 5px;
				right: 15px;
				cursor: pointer;
				color: #ddd;
			}
		}
		.hor-img {
			width: 182px;
			margin-right: 10px;
		}
	}
</style>