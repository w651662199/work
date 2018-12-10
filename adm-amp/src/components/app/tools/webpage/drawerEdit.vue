<template>
	<div class="amp-form amp-form03">
		<div class="form-column">
			<el-form  label-width="124px" :model="editData" ref="editData" :rules="rules">
				<!--模板1 默认-->
				<template v-if="editData.pageTemplateId == 1 || editData.pageTemplateId == 4">
					<template>
						<el-row class="spliTitle">基本信息</el-row>
						<el-form-item label="名称：" prop="title" >
							<el-input  placeholder="请输入名称" style="width:400px;" v-model="editData.title"></el-input>
							<div class="el-upload__tip" v-if="editData.pageTemplateId == 4">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
						</el-form-item>
						<el-form-item label="顶部大图：" :rules="rules.topImg" ref="topImg">
							<div class="detail-row">
								<div class="photo-box">
									<div class="btn btn-normal" @click="changeTopFile">上传图片</div>
									<span>{{validateMsg.topImg.imgUrlName}}</span>
									<div class="el-upload__tip" style="font-size:14px;color:#89919c;">仅支持宽高比为2:1的图片</div>
									<input id="topPicture" type="file"
										   style="display:none;position:absolute;"
										   @change="topPictureChange" accept="image/jpg,image/jpeg,image/png">
									<div class="photo-add" v-show="imgUrl !== undefined"><img :src="imgUrl"></div>
								</div>
							</div>
							<div class="SKUerror" v-if="validateMsg.topImg.isError">{{validateMsg.topImg.errorMsg}}</div>
						</el-form-item>
						<el-form-item label="文案区：" prop="description">
							<el-input type="textarea" v-model="editData.description" :autosize="{ minRows: 2, maxRows: 4}"
									  placeholder="" style="width:400px;">
							</el-input>
						</el-form-item>
						<el-form-item label="页面背景色：" v-if="editData.pageTemplateId == 1">
							<!--<el-input style="width:400px;" :readonly="true" v-model="selectColor" @focus="handlePalette"></el-input>-->
							<div class="icon icon-selectColor" @click="handlePalette"></div>
							<div :style="{background:selectColor,width:'20px',height:'20px',float: 'left', margin: '10px 0 0 10px'}" v-show="selectColor !== undefined"></div>
							<sketch-picker v-model="colors" @input="onChange" v-if="showChildComponents.showPalette" :showPalette="showChildComponents.showPalette"></sketch-picker>
						</el-form-item>
					</template>
					<template>
						<el-row class="spliTitle">商品<span>必须添加10个商品</span></el-row>
							<div class="SKUbox" v-for="index in 10">
								<el-form-item label="SKU ID：" label-width="85px">
									<el-input v-model="editData.itemList[index-1].skuId" placeholder="请输入SKU ID"
											  @blur="queryItemId(index-1)"></el-input>
									<div class="el-form-item__error" v-if="videoShopSKUList[index-1].isError">
										{{videoShopSKUList[index-1].errorMsg }}
									</div>
								</el-form-item>
								<el-form-item label="商品区：" label-width="85px">
									<div v-if="!editData.itemList[index-1].image.length">
										<span class="noImage">暂无图片</span>
									</div>
									<div v-else class="uploade-show uploade-select">
										<m-image-scroll v-model="editData.itemList[index-1].images" :index="index-1"></m-image-scroll>
									</div>
								</el-form-item>
								<el-form-item label="广告文案：" label-width="85px">
									<el-input type="textarea" v-model="editData.itemList[index-1].description"
											  resize="none" :rows= 4 ></el-input>
								</el-form-item>
							</div>
						<div class="SKUerror" v-if="validateMsg.SKU.isSkuAll && SKUlen() < 10">{{validateMsg.SKU.errorMsg}}</div>
					</template>
				</template>
				<!--模板2 店铺-->
				<template v-if="editData.pageTemplateId == 2">
					<template>
						<el-row class="spliTitle">基本信息</el-row>
						<el-form-item label="店铺ID：" prop="shopId">
						<el-input  placeholder="请输入店铺ID" style="width:400px;" v-model="editData.shopId"
								   :disabled="shopIdReadOnly" id="shopIdReadOnly" @blur="shopIdChange">
						</el-input>
					</el-form-item>
						<el-form-item label="店铺文案：" prop="description" :rules="rules.description">
						<el-input type="textarea" v-model="editData.description"
								  :autosize="{ minRows: 2, maxRows: 4}"
								  placeholder="请输入店铺文案" style="width:400px;">
						</el-input>
					</el-form-item>
					</template>
				    <template>
						<el-row class="spliTitle">商品<span>最少添加4个，最多添加10个</span></el-row>
						<div class="SKUbox" v-for="(item,index) in editData.itemList">
							<el-form-item label="SKU ID：" label-width="85px">
								<el-input v-model="editData.itemList[index].skuId" placeholder="请输入SKU ID"
										  @blur="queryShopSKUId(index)"></el-input>
								<div class="el-form-item__error" v-if="videoShopSKUList[index].isError">
									{{videoShopSKUList[index].errorMsg }}
								</div>
							</el-form-item>
							<el-form-item label="商品区：" label-width="85px">
								<div v-if="!editData.itemList[index].image.length">
									<span class="noImage">暂无图片</span>
								</div>
								<div v-else class="uploade-show uploade-select">
									<m-image-scroll v-model="editData.itemList[index].images" :index="index"></m-image-scroll>
								</div>
							</el-form-item>
							<el-form-item label="广告文案：" label-width="85px">
								<el-input type="textarea" v-model="editData.itemList[index].description"
										  resize="none" :rows=4 placeholder=""></el-input>
							</el-form-item>
						</div>
					</template>
					<div class="btn btn-normal addbtn" @click="shopSkuCountAdd" v-show="editData.itemList.length!==10">新增商品</div>
					<div class="SKUerror" v-if="validateMsg.SKU.isSkuAll && SKUlen() < 4">{{validateMsg.SKU.errorMsg}}</div>
				</template>
				<!--模板3 视频-->
				<template v-if="editData.pageTemplateId == 3">
					<template>
						<el-row class="spliTitle">基本信息</el-row>
						<el-form-item label="广告标题：" prop="title" :rules="rules.videoTitle" >
							<el-input style="width:400px;" v-model="editData.title" placeholder="请输入广告标题"></el-input>
							<div class="el-upload__tip">前端自适应屏幕大小，超过一行时，超出的部分前端会用省略号截断。</div>
						</el-form-item>
						<el-form-item label="视频：" >
							<div class="row-photo-s" style="width: 100%;">
								<div id="flashContent">
									<div id="flashPic"></div>
								</div>
								<span id="videoName" v-show="validateMsg.video.videoNameShow">{{validateMsg.video.videoName}}</span>
								<input type="hidden" id="videoIds" v-model="editData.videoId">
								<div id="progressBox" v-show="validateMsg.video.processShow">
									<span>上传中</span>
									<progress id="progress" :value="validateMsg.video.pro" max="100"></progress>
									<span id="progressCode">{{validateMsg.video.proCode}}</span>
								</div>
								<div class="el-form-item__error" id="videoIdsTip" v-show="validateMsg.video.tip" v-html="validateMsg.video.tipMsg"></div>
								<div class="el-form-item__error" v-show="validateMsg.video.isError">{{validateMsg.video.errorMsg}}</div>
							</div>
						</el-form-item>
						<el-form-item label="封面图：">
							<el-radio-group v-model="editData.useDefaultImage" @change="videoImageTypeChange">
								<el-radio :label="0">默认图片</el-radio>
								<el-radio :label="1">自定义图片
									<span v-if="editData.useDefaultImage == 1" >
										<div  style="display: inline-block;">
											 <input id="videoImage" type="file"
													accept="image/jpg,image/jpeg,image/png"
													style="width: 68px; height: 28px;visibility: hidden; position: absolute; opacity: 0"
													@change="videoImageChange">
										</div>
									</span>
								</el-radio>
							</el-radio-group>
							<div v-if="editData.useDefaultImage == 1">
								<div class="photo-box">
									<div class="btn btn-normal" @click="changeFile">上传图片</div>
									<span>{{validateMsg.topImg.imgUrlName}}</span>
									<div class="el-upload__tip" style="width:100%">只能上传宽高比为2:1的图片</div>
									<div class="photo-add" v-show="imgUrl !== undefined"><img :src="imgUrl"></div>
								</div>
								<div class="SKUerror" v-if="validateMsg.topImg.isError">{{validateMsg.topImg.errorMsg}}</div>
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
						<div class="SKUerror" v-if="validateMsg.promote.isError && editData.promotionType ==0">{{validateMsg.promote.errorMsg}}</div>
						<el-form-item label="内容类型：" label-width="90px">
							<el-radio-group v-model="editData.promotionType" @change="promoteDetailChange">
								<el-radio class="radio" v-model="editData.promoteDetail" :label="0" style="display: none">店铺</el-radio>
								<el-radio class="radio" v-model="editData.promoteDetail" :label="2" style="margin-left: 0px">店铺</el-radio>
								<el-radio class="radio" v-model="editData.promoteDetail" :label="1">商品</el-radio>
							</el-radio-group>
						</el-form-item>
						<div v-if="editData.promotionType == 2">
							<el-form-item label="店铺ID：" v-show="videoShopIdShow" prop="shopId">
								<el-input style="width:400px;" v-model="editData.shopId" type="text"
										  placeholder="请输入店铺ID" id="shopId" @blur="videoShopId"></el-input>
							</el-form-item>
							<el-form-item label="店铺名称：" v-show="videoShopLogoShow">
								<el-input style="width:400px;" v-model="editData.videoShopName" type="text"
										  :disabled="shopIdReadOnly"></el-input>
							</el-form-item>
							<el-form-item label="店铺LOGO：" v-show="videoShopLogoShow">
								<div>
									<div class="photo-add photo-add-b">
										<img v-model="editData.shopLogo" :src="editData.videoShopLogo"
											 style="width:400px; height:247px;">
									</div>
								</div>
							</el-form-item>
							<el-form-item label="店铺文案：" prop="videoShopDescription" :rules="rules.videoDescription">
								<el-input style="width:400px;" v-model="editData.videoShopDescription" type="textarea"
										  :autosize="{ minRows: 2, maxRows: 4}"
										  placeholder="请输入店铺文案"></el-input>
							</el-form-item>
						</div>
						<div v-if="editData.promotionType == 1">
							<div class="SKUbox" v-for="(item,index) in editData.itemList">
								<el-form-item label="SKU ID：" label-width="85px">
									<el-input v-model="editData.itemList[index].skuId" placeholder="请输入SKU ID"
											  @blur="queryVideoShopSKUId(index)"></el-input>
									<div class="el-form-item__error" v-if="videoShopSKUList[index].isError">
										{{videoShopSKUList[index].errorMsg }}
									</div>
								</el-form-item>
								<el-form-item label="商品区：" label-width="85px">
									<div v-if="!editData.itemList[index].image.length">
										<span class="noImage">暂无图片</span>
									</div>
									<div v-else class="uploade-show uploade-select">
										<m-image-scroll v-model="editData.itemList[index].images" :index="index"></m-image-scroll>
									</div>
								</el-form-item>
								<el-form-item label="广告文案：" label-width="85px">
									<el-input type="textarea" v-model="editData.itemList[index].description"
											  resize="none" :rows="4" placeholder=""></el-input>
								</el-form-item>
							</div>
							<div class="btn btn-normal addbtn" @click="addVideoDesCount" v-show="editData.itemList.length!==3">新增商品</div>
							<div class="SKUerror" v-if="validateMsg.SKU.isSkuAll && SKUlen() == 0">{{validateMsg.SKU.errorMsg}}</div>
						</div>
					</template>
				</template>
				<template style="clear:both">
					<el-row class="spliTitle">分享卡</el-row>
					<el-form-item label="分享卡图片：" >
						<div class="detail-row">
							<div class="photo-box">
								<div class="btn btn-normal" @click="changeShareFile">上传图片</div>
								<span>{{validateMsg.cardImg.cardImgName}}</span>
								<div class="el-upload__tip" style="font-size:14px;color:#89919c;">建议上传尺寸为150*150的图片</div>
								<input id="sharePicture" type="file" style="display:none;position:absolute;"
									   @change="sharePictureChange" accept="image/jpg,image/jpeg,image/png">
								<div class="photo-add"  v-show="cardImg !== undefined"><img :src="cardImg"></div>
							</div>
						</div>
						<div class="SKUerror" v-if="validateMsg.cardImg.isError && (cardImg == undefined || cardImg =='')">{{validateMsg.cardImg.errorMsg}}</div>
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
import Vue from 'vue';
import apiConfig from '../../../../config/api.config.js';
import store from 'store';
import {
	copyObj,
	objType,
	formatDate,
	mixin,
	debounce,
	getImgSize,
	isEmptyObj,
	limitLen
} from '../../../../utils/common';
import Event from 'event';
import Http from 'http';
import { Sketch } from 'vue-color';
import ImageScroll from '../../../common/imageScroll.vue';
let defaultProps = {
	hex: '#194d33',
	hsl: {
		h: 150,
		s: 0.5,
		l: 0.2,
		a: 1
	},
	hsv: {
		h: 150,
		s: 0.66,
		v: 0.30,
		a: 1
	},
	rgba: {
		r: 25,
		g: 77,
		b: 51,
		a: 1
	},
	a: 1
};
require('../../../../utils/uploadVideo.js');
export default {
	name: 'app-page-edit',
	props: ['pageId'],
	data() {
		return {
		    videoShopData:[],
			videoShopLogoShow:true,
			videoShopIdShow:false,
			videoDesCount: 1,
			videoShopSKUList:[
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''},
				{skuId: '', isError: false, errorMsg: ''}
			],
			shopIdReadOnly:false,
			showChildComponents: {
				showPalette: false
			},
			imageFile: null,
			formData: {
				itemList: [],
			},
			editData: {
		        imgUrl:'',
				videoId: '0',
				itemList: [],
			},
			validateMsg:{
		        topImg:{
					imgUrlName: '',
		            isError:false,
					errorMsg:''
				},
				SKU:{    //所有的图片
					isSkuAll:false,
					errorMsg:''
				},
				cardImg:{ //分享图片
		            cardImgName:'',
					isError:false,
					errorMsg:''
				},
				video:{    //模板三-视频
					videoName: '',
					isError:false,
					errorMsg:'',
					tipMsg:'',
					pro:0,
					proCode:0,
					tip:false,
					processShow:false,
					videoNameShow:false,
				},
				promote:{ //模板三-推广
					isError:false,
					errorMsg:''
				}
			},
			imgUrl: '',
			cardImg:'',
			itemList: [],
			uploadUrl: `${$CONFIG['domain']}/api/image/upload`,
			fileType: ".jpg, .png, .jpeg, |images/*",
			colors: defaultProps,
			selectColor: "",
			shopSkuCount:4,
			rules:{
		        'shopId':[{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入店铺ID'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
		        'cardDescription':[{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入分享卡文案'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
		        'cardTitle':[{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入分享卡名称'));
						}else {
							callback();
						}
					}, trigger: 'blur'
				}],
				'title': [{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入名称'));
						}else {
						    callback();
						}
					}, trigger: 'blur'
				}],
		        'videoTitle':[{
					validator: function (rule, value, callback) {
						if (value.trim() == '') {
							callback(new Error('请输入名称'))
						} else if (!limitLen(value, 30)) {
							callback(new Error('最大长度不超过15个汉字'));
						} else {
							callback();
						}
				}, trigger: 'blur' }],
		        'videoDescription':[{validator: function(rule, value, callback) {
					if(limitLen(value, 100)){
						callback();
					}else{
						callback(new Error('最大长度不超过50个汉字'));
					}
				}, trigger: 'blur' }],
		        'description':[{validator: function(rule, value, callback) {
					if(limitLen(value, 200)){
						callback();
					}else{
						callback(new Error('最大长度不超过100个汉字'));
					}
					}, trigger: 'blur' }],
				'SKUname':[{validator: function(rule, value, callback) {
					if(limitLen(value, 60)){
						callback();
					}else{
						callback(new Error('最大长度不超过30个汉字'));
					}
					}, trigger: 'blur'}],
			}

		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action
	},
	components: {
		'sketch-picker': Sketch,
		'm-image-scroll': ImageScroll
	},
	created() {
	    let itemList = {'itemList':[]};
		let skus = [];
		this.editData = copyObj(mixin(this.drawerData,itemList));
		this.cardImg = this.editData.cardImage;
		this.imgUrl = this.editData.image;
		this.selectColor = this.editData.backgroundColor;
		let SKUlen = this.editData.pageTemplateId == 2 ? '4':(this.editData.pageTemplateId == 3 ? '1' : '10');
		for (var i =0; i < SKUlen; i++) {
			let item = {skuId:'', images:[], image:'',productId: '', description:'' ,name:''};
			this.editData.itemList.push(item);
		}
		if (store.state.drawerCtrl.action === 'modify') {
			if(this.editData.pageTemplateId == 3){ //视频
				if(this.editData.videoId !== 0){
					this.validateMsg.video.tip = true;
					this.validateMsg.video.tipMsg = '<div class="icon icon-selecton" style="color:#1bb169;font-size: 14px;"> 上传成功！</div>';
				}
				if(this.editData.promotionType == 2 ){ //店铺
					this.editData.shopId = this.editData.data[0].shopId
					this.editData.videoShopLogo = this.editData.data[0].image;
					this.editData.videoShopName = this.editData.data[0].name;
					this.editData.videoShopDescription = this.editData.data[0].description;
					Http.get("/api/page/shop?shopId=" + this.editData.shopId, {
						hideLoading: true,
					})
						.then((res) => {
							if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
								this.editData.shopId = res.data.data.id;
								this.videoShopLogoShow = true;
								this.videoShopIdShow = false;
								this.shopIdReadOnly = true;
							} else if(this.editData.shopId  !== ""){
								this.videoShopLogoShow = true;
								this.videoShopIdShow = true;
								this.shopIdReadOnly = true;
							}else {
								this.videoShopLogoShow = false;
								this.videoShopIdShow = true;
								this.shopIdReadOnly = true;
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				}else if(this.editData.promotionType == 1){
					this.videoDesCount = this.editData.data.length;
					this.editData.data.map((item,index)=>{
						skus.push(this.editData.data[index].skuId);
					    this.editData.itemList[index].skuId = this.editData.data[index].skuId;
					    this.editData.itemList[index].image = this.editData.data[index].image;
					    this.editData.itemList[index].productId = this.editData.data[index].productId;
					    this.editData.itemList[index].description = this.editData.data[index].description;
					    this.editData.itemList[index].name = this.editData.data[index].name;
					})
				}
			}
			if(this.editData.pageTemplateId == 2){
				Http.get("/api/page/shop", {
					hideLoading: true,
				}).then(res => {
					if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
						this.shopIdReadOnly = true;
					}

				}).catch(function (error) {
					console.log(error);
				});
				this.editData.data.map((item,index)=>{
					skus.push(this.editData.data[index].skuId);
					this.editData.itemList[index].skuId = this.editData.data[index].skuId;
					this.editData.itemList[index].image = this.editData.data[index].image;
					this.editData.itemList[index].productId = this.editData.data[index].productId;
					this.editData.itemList[index].description = this.editData.data[index].description;
					this.editData.itemList[index].name = this.editData.data[index].name;
				})
				this.shopSkuCount = this.editData.data.length;

			}
			if(this.editData.pageTemplateId == 1 || this.editData.pageTemplateId == 4){
				Http.get("/api/page/shop", {
					hideLoading: true,
				}).then(res => {
					if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
						this.editData.shopId = res.data.data.id;
					}
				}).catch(function (error) {
                     console.log(error);
				});
				this.editData.data.forEach((item,index)=>{
					skus.push(this.editData.data[index].skuId);
					this.editData.itemList[index].skuId = this.editData.data[index].skuId;
					this.editData.itemList[index].image = this.editData.data[index].image;
					this.editData.itemList[index].productId = this.editData.data[index].productId;
					this.editData.itemList[index].description = this.editData.data[index].description;
					this.editData.itemList[index].name = this.editData.data[index].name;
				});
			}
		}
		this.getSkus(skus);
		this.getShopId();
	},
	mounted() {
	    window.addEventListener('click',() => {
			this.showChildComponents.showPalette = false;
		});
		Event.$off('page-save');
		Event.$on('page-save', (avg) =>{
		    let RES = false;
		    if(avg.publish == 'publish'){
				this.$refs.editData.validate((result) => {
					RES = result;
				});
				if(this.cardImg == undefined || this.cardImg == ''){
					this.validateMsg.cardImg.isError = true;
					this.validateMsg.cardImg.errorMsg = '请上传分享卡图片';
				}else{
					this.validateMsg.cardImg.isError = false;
					this.validateMsg.cardImg.errorMsg = '';
				}
				if (this.editData.pageTemplateId == 1 || this.editData.pageTemplateId == 4) {
				    if(this.SKUlen() < 10) {
						this.validateMsg.SKU.isSkuAll = true;
						this.validateMsg.SKU.errorMsg = 'SKU数量必须为10个'
					}
					if(this.imgUrl == undefined || this.imgUrl == '') {
					    this.validateMsg.topImg.isError = true;
					    this.validateMsg.topImg.errorMsg = '请上传图片';
					}else{
						this.validateMsg.topImg.isError = false;
						this.validateMsg.topImg.errorMsg = '';
					}
				}else if(this.editData.pageTemplateId == 2) {
					if(this.SKUlen() < 4) {
						this.validateMsg.SKU.isSkuAll = true;
						this.validateMsg.SKU.errorMsg = '至少添加4个SKU';
					}else {
						this.validateMsg.SKU.isSkuAll = false;
						this.validateMsg.SKU.errorMsg = '';
					}

				}else if(this.editData.pageTemplateId == 3) {
				    if(this.editData.videoId == '') {
						this.validateMsg.video.isError = true;
						this.validateMsg.video.errorMsg = '请上传视频';
					}
					if(this.editData.useDefaultImage ==1 && (this.imgUrl == undefined || this.imgUrl == '')) {
						this.validateMsg.topImg.isError = true;
						this.validateMsg.topImg.errorMsg = '请上传图片';
					}else{
						this.validateMsg.topImg.isError = false;
						this.validateMsg.topImg.errorMsg = '';
					}
					if(this.editData.promotionType == 0) {
				        this.validateMsg.promote.isError = true;
				        this.validateMsg.promote.errorMsg = '请选择推广内容';
					}
					if(this.editData.promotionType == 1){
						if(this.SKUlen() == 0) {
							this.validateMsg.SKU.isSkuAll = true;
							this.validateMsg.SKU.errorMsg = '至少添加1个SKU';
						}else {
							this.validateMsg.SKU.isSkuAll = false;
							this.validateMsg.SKU.errorMsg = '';
						}
					}
				}
				if(!RES || this.validateMsg.SKU.isSkuAll || this.validateMsg.topImg.isError || this.validateMsg.video.isError || this.validateMsg.promote.isError) {
					return false;
				}
			};
			if (avg.pId !== '' ) {
				//修改
				if (this.editData.pageTemplateId == 3) {
					if (this.editData.promotionType == 2) { //视频里面有店铺 2=>店铺  1=>商品
						this.editData.itemList = [{
							'image': this.editData.videoShopLogo,
							'name': this.editData.videoShopName,
							'shopId': this.editData.shopId,
							'description': this.editData.videoShopDescription,
						}]
					}
				};
				let params = {
					videoId: this.editData.videoId, //视频ID
					promotionType: this.editData.promotionType,//推广内容
					useDefaultImage: this.editData.useDefaultImage, //0 默认 1自定义
					pageTemplateId: this.editData.pageTemplateId,
					shopId: this.editData.shopId,
					title: this.editData.title ? this.editData.title : '',
					name: this.editData.name,
					image: this.imgUrl ? this.imgUrl : '',
					description: this.editData.description ? this.editData.description : '',
					pageTemplatePlatform: this.editData.platform ? this.editData.platform : '1',
					data: this.editData.itemList,
					backgroundColor: this.selectColor ? this.selectColor : '',
					cardTitle: this.editData.cardTitle ? this.editData.cardTitle : '',
					cardImage: this.cardImg ? this.cardImg : '',
					cardDescription: this.editData.cardDescription ? this.editData.cardDescription : '',
					pageId: this.editData.pageId ? this.editData.pageId : avg.pId
				};
				Http.put("/api/page",
					params
				)
					.then((res) => {
						if (!res.data.iserror) {
							Event.$emit('page-save-result', {
								error: 0,
								res: mixin(res.data, {videoId: this.editData.videoId})
							});
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
								duration: 3000
							});
							Event.$emit('page-save-result', {
								error: 1,
								res: res.data
							});
						}
					})
					.catch((e) => {
						console.log(e);
						Event.$emit('page-save-result', {
							error: 1,
							res: ''
						});
					});
			} else {
				//新建
				if (this.editData.pageTemplateId == 3) {  //视频
					if (this.editData.promotionType == 2) { //视频里面有店铺 2=>店铺  1=>商品
						this.editData.itemList = [{
							'image': this.editData.videoShopLogo,
							'name': this.editData.videoShopName,
							'shopId': this.editData.shopId,
							'description': this.editData.videoShopDescription,
						}]
					}
				}
				;
				let params = {
					//视频
					videoId: this.editData.videoId == '' ? 0 : this.editData.videoId, //视频ID
					promotionType: this.editData.promotionType,//推广内容
					useDefaultImage: this.editData.useDefaultImage, //0 默认 1自定义
					pageTemplateId: this.editData.pageTemplateId,
					shopId: this.editData.shopId,
					name: this.editData.name,
					pageTemplatePlatform: this.editData.platform ? this.editData.platform : '1',
					title: this.editData.title ? this.editData.title : '',
					image: this.imgUrl ? this.imgUrl : '',
					description: this.editData.description ? this.editData.description : '',
					data: this.editData.itemList,
					backgroundColor: this.selectColor ? this.selectColor : '',
					cardTitle: this.editData.cardTitle ? this.editData.cardTitle : '',
					cardImage: this.cardImg ? this.cardImg : '',
					cardDescription: this.editData.cardDescription ? this.editData.cardDescription : ''
				};
				Http.post("/api/page",
					params
				)
					.then((res) => {
						if (!res.data.iserror) {
							Event.$emit('page-save-result', {
								error: 0,
								res: mixin(res.data, {
									videoId: this.editData.videoId,
									pageTemplateId: this.editData.pageTemplateId
								})
							});
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
								duration: 3000
							});
							Event.$emit('page-save-result', {
								error: 1,
								res: res.data

							});
						}
					})
					.catch((e) => {
						console.log(e);
						Event.$emit('page-save-result', {
							error: 1,
							res: ''
						});
					});
			}
		});
		Event.$off('page-publish');
			Event.$on('page-publish', (argv) => {
				Http.put("/api/page/publish", {
						pageId: argv.res.data.pageId
					}
				)
				.then((res) => {
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
				})
				.catch((e) => {
					console.log(e);
					Event.$emit('page-publish-result', {
						error: 1,
						res: ''
					});
				});
		});
		//视频渲染
		if(this.editData.pageTemplateId == 3){
			let flashPic = document.getElementById('flashPic');
			let pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
			flashPic.innerHTML = "<a href='http://www.adobe.com/go/getflashplayer'><img src='"
				+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' target='_blank' /></a>";
			uploadVideo();
		}

		Event.$off('startUploadVideo');
		Event.$on('startUploadVideo', (data) => {
            this.validateMsg.video.videoName = data.videoName;
			this.validateMsg.videotip = false;
			this.validateMsg.video.processShow = false;
			this.validateMsg.video.videoNameShow = false;
		})

		Event.$off('uploadVideoProgress');
		Event.$on('uploadVideoProgress', (data) => {
			this.validateMsg.video.processShow = true;
			this.validateMsg.video.pro = data.progress;
			this.validateMsg.video.proCode = data.progress+'%';
		});

		Event.$off('uploadVideoSuccess');
		Event.$on('uploadVideoSuccess', (data) => {
			this.validateMsg.video.isError = false;
			this.validateMsg.video.processShow = false;
			this.validateMsg.video.videoNameShow = true;
			this.validateMsg.video.tip = true;
			this.validateMsg.video.tipMsg = '<div class="icon icon-selecton" style="color:#1bb169;font-size: 14px;"> 上传成功！</div>';
			this.editData.videoId = data.videoId;
		});

		Event.$off('uploadVideoFail');
		Event.$on('uploadVideoFail', (data) => {
			this.validateMsg.video.isError = false;
			this.validateMsg.video.processShow = false;
			this.validateMsg.video.videoNameShow = true;
			this.validateMsg.video.tip = true;
			this.validateMsg.video.tipMsg = '<div class="icon icon-shut" style="color:#d30312;font-size: 14px;"> 上传失败！</div>';
		})

	},
	methods: {
		getSkus(skus) {
			Http.get("/api/material/skus?skuIds=" + skus).then((res) => {
			    res.data.data.skus.forEach((skus,i) => {
					this.editData.itemList.forEach((items,index) => {
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
		SKUlen() {
			let SKUlen = 0;
			this.editData.itemList.forEach((item) => {
				if(item.skuId !== '') SKUlen ++ ;
			})
			return SKUlen;
		},
		videoShopId(){
		    if(this.editData.shopId == '') {
				this.videoShopLogoShow = false;
				this.videoShopIdShow = true;
				return false;
			};
			Http.get("/api/page/shop", {
				params: {
					shopId: this.editData.shopId
				}
			}).then(res=> {
				if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
					this.editData.videoShopName = res.data.data.name;
					this.editData.videoShopLogo = res.data.data.icon;
					this.editData.videoShopDescription = res.data.data.description;
					this.shopIdReadOnly = true;
					this.videoShopLogoShow = true;
					this.videoShopIdShow = true;
				} else {
					this.editData.videoShopName = '';
					this.editData.videoShopLogo = '';
					this.editData.shopId = '';
					this.videoShopLogoShow = false;
					this.videoShopIdShow = true;
					this.shopIdReadOnly = false;
					this.$message({
						message: '店铺ID填写错误!',
						type: 'error'
					});
					return false;
				}
			}).catch(function (error) {
			    console.log(error);
			});
		},
		queryVideoShopSKUId(index){
			if (this.editData.itemList[index].skuId === "" ) {
				this.editData.itemList[index].description = '';
				this.editData.itemList[index].image = '';
				this.editData.itemList[index].productId = '';
				this.editData.itemList[index].name = '';
				this.videoShopSKUList[index].isError = true;
				this.videoShopSKUList[index].errorMsg = '请输入SKU ID';
				return;
			} else{
				let currentSku = this.editData.itemList.find((item,i) => {
					return i !== index && item.skuId === this.editData.itemList[index].skuId;
				});
				if(currentSku !== undefined){
					this.videoShopSKUList[index].isError = true;
					this.videoShopSKUList[index].errorMsg = '请不要输入重复商品';
					this.editData.itemList[index].skuId = '';
					this.editData.itemList[index].description = '';
					this.editData.itemList[index].image = '';
					this.editData.itemList[index].productId = '';
					this.editData.itemList[index].name = '';
					setTimeout(()=>{
						this.videoShopSKUList[index].errorMsg = '';
					},3000)
					return false;
				}
				Http.get('/api/material/sku', {
					params: {
						skuId: this.editData.itemList[index].skuId
					}
				})
					.then((res) => {
						if (res.data.data.skuId == null  &&  res.data.data.productId == null ) {
							this.editData.itemList[index].skuId = '';
							this.videoShopSKUList[index].isError = true;
							this.videoShopSKUList[index].errorMsg = '未找到该商品';
							return false;
						} else if(this.editData.shopId !== "" && res.data.data.shopId !== this.editData.shopId ) {
							this.editData.itemList[index].skuId = ''
							this.editData.itemList[index].description = '';
							this.editData.itemList[index].image = '';
							this.editData.itemList[index].productId = '';
							this.videoShopSKUList[index].isError = true;
							this.videoShopSKUList[index].errorMsg = '请填写店铺内的SKU ID';
							return false;
						}else{
							this.editData.itemList[index].description = res.data.data.description;
							this.editData.itemList[index].productId = res.data.data.productId;
							this.editData.itemList[index].name = res.data.data.name;
							this.videoShopSKUList[index].isError = false;
							this.videoShopSKUList[index].errorMsg = '';
							res.data.data.images.forEach((item) => {
								this.editData.itemList[index].images.push({
									url: item,
									checked: false
								});
							});
							this.editData.itemList[index].images[0].checked = true;
							this.editData.itemList[index].image = this.editData.itemList[index].images[0].url;
						}
					});
			}
		},
		videoImageTypeChange(){
		    this.imgUrl = undefined;
			this.validateMsg.topImg.isError = false;
			this.validateMsg.topImg.errorMsg = '';
			this.validateMsg.topImg.imgUrlName = '';
		},
		promoteDetailChange(obj){
			this.videoDesCount = 1;
			this.editData.itemList = [
				{skuId:'', images:[], image:'',productId: '', description:'' ,name:''}
			];
			  //2=>店铺 1=>商品
			Http.get("/api/page/shop", {
			    hideLoading:true
			})
				.then(res => {
					if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
						this.editData.videoShopName = res.data.data.name;
						this.editData.videoShopLogo = res.data.data.icon;
						this.editData.videoShopDescription = res.data.data.description;
						this.editData.shopId = res.data.data.id;
						this.videoShopLogoShow = true;
						this.videoShopIdShow = false;
						this.shopIdReadOnly = true;
					} else {
						this.editData.videoShopName = '';
						this.editData.videoShopLogo = '';
						this.editData.videoShopDescription = '';
						this.editData.shopId = '';
						this.videoShopLogoShow = false;
						this.videoShopIdShow = true;
						this.shopIdReadOnly = false;
					}
				})
				.catch(function (error) {
                   console.log(error);
				});

		},
		addVideoDesCount(){
			let item = {skuId:'', images:[], image:'',productId: '', description:'' ,name:''};
			this.editData.itemList.push(item);
		},
		changeFile() {
			let input = document.getElementById("videoImage");
			input.click();
		},
		videoImageChange(eve){
			let files= eve.target.files;
			this.loadVideoImage(files[0]);
		},
		loadVideoImage(file){
			if (file.size > 500 *1024) {
				this.validateMsg.topImg.isError = true;
				this.validateMsg.topImg.errorMsg = '图片大小最大为500KB'
				return false;
			}
			let that = this;
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload=function(){
					let width = image.width;
					let height = image.height;
					let scale = width / height;
					console.log(scale);
					if(scale !== 2) {
						that.validateMsg.topImg.isError = true;
						that.validateMsg.topImg.errorMsg = '请上传宽高比例为2:1的图片'
					} else {
						imageData.append('file', file);
						that.videoImageUpload(imageData);
						that.validateMsg.topImg.imgUrlName = file.name;
					}
				};
				image.src= data;
			};
			reader.readAsDataURL(file);
		},
		videoImageUpload(data){
			Http.post(this.uploadUrl, data)
				.then((res) => {
					if (res.data.code === 200) {
						this.imgUrl = res.data.data.imageUrl;
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
	    //店铺
		shopIdChange(){
		    if(this.editData.shopId == '') return;
			Http.get("/api/page/shop", {
				params: {
					shopId: this.editData.shopId
				}
			}).then(res=> {
				if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
					this.editData.title = res.data.data.name;
					this.imgUrl = res.data.data.icon;
					this.editData.shopId = res.data.data.id;
					this.editData.description = res.data.data.description;
					this.videoShopLogoShow = true;
					this.videoShopIdShow = false;
				} else {
					this.editData.videoShopName = '';
					this.editData.videoShopLogo = '';
					this.editData.shopId = '';
					this.videoShopLogoShow = false;
					this.videoShopIdShow = true;
					this.shopIdReadOnly = false;
					this.$message({
						message: '店铺ID填写错误!',
						type: 'error'
					});
					return false;
				}
			})
				.catch(function(error) {

				});
		},
		shopSkuCountAdd(){
			let item = {skuId:'', images:[], image:'',productId: '', description:'' ,name:''};
			this.editData.itemList.push(item);
		},
		getShopId(){
		    console.log();
			if(store.state.drawerCtrl.action === 'new'){
				Http.get("/api/page/shop", {
					hideLoading: true,
				})
					.then(res=> {
						if (res.data.code === 200 && !isEmptyObj(res.data.data)) {
							this.editData.shopId = res.data.data.id;
							if(this.editData.pageTemplateId == 2){
								this.shopIdReadOnly = true;
								this.editData.title = res.data.data.name;
								this.imgUrl = res.data.data.icon;
								this.editData.description = res.data.data.description;
							}
						}
					})
					.catch(function(error) {

					});
			}
		},
		queryShopSKUId(index){
			if (this.editData.itemList[index].skuId === "" ) {
				this.editData.itemList[index].description = '';
				this.editData.itemList[index].name = '';
				this.editData.itemList[index].image = '';
				this.editData.itemList[index].productId = '';
				this.videoShopSKUList[index].isError = true;
				this.videoShopSKUList[index].errorMsg = '请输入SKU ID';
				return;
			} else if(this.editData.shopId === "" || this.editData.shopId == undefined ){
				this.editData.itemList[index].skuId = '';
				this.videoShopSKUList[index].isError = true;
				this.videoShopSKUList[index].errorMsg = '请先填写店铺ID';
				return false;
			} else{
				let currentSku = this.editData.itemList.find((item,i) => {
				    return i !== index && item.skuId === this.editData.itemList[index].skuId;
				});

				if(currentSku !== undefined){
					this.videoShopSKUList[index].isError = true;
					this.videoShopSKUList[index].errorMsg = '请不要输入重复商品';
					this.editData.itemList[index].skuId = '';
					this.editData.itemList[index].description = '';
					this.editData.itemList[index].name = '';
					this.editData.itemList[index].image = '';
					this.editData.itemList[index].productId = '';
					setTimeout(()=>{
						this.videoShopSKUList[index].errorMsg = '';
					},3000)
					return false;
				};
				Http.get('/api/material/sku', {
					params: {
						skuId: this.editData.itemList[index].skuId
					}
				})
					.then((res) => {
						if (res.data.data.skuId == null  &&  res.data.data.productId == null ) {
							this.editData.itemList[index].skuId = '';
							this.videoShopSKUList[index].isError = true;
							this.videoShopSKUList[index].errorMsg = '未找到该商品';
							return false;
						} else if(res.data.data.shopId !== this.editData.shopId){
							this.editData.itemList[index].skuId = ''
							this.editData.itemList[index].description = '';
							this.editData.itemList[index].name = '';
							this.editData.itemList[index].image= '';
							this.editData.itemList[index].productId= '';
							this.videoShopSKUList[index].isError = true;
							this.videoShopSKUList[index].errorMsg = '请填写店铺内的SKU ID';
							return false;
						}else{
							this.editData.itemList[index].description = res.data.data.description;
							this.editData.itemList[index].name = res.data.data.name;
							this.editData.itemList[index].productId = res.data.data.productId;
							this.videoShopSKUList[index].isError = false;
							this.videoShopSKUList[index].errorMsg = '';
							res.data.data.images.forEach((item) => {
								this.editData.itemList[index].images.push({
									url: item,
									checked: false
								});
							});
							this.editData.itemList[index].images[0].checked = true;
							this.editData.itemList[index].image = this.editData.itemList[index].images[0].url;
						}
					});
			}
		},
		changeTopFile() {
			let input = document.getElementById("topPicture");
			input.click();
		},
		topPictureChange(eve) {
			let files= eve.target.files;
			this.loadTopFile(files[0]);
		},
		loadTopFile(file) {
			if (file.size > 500 *1024) {
				this.validateMsg.topImg.isError = true;
				this.validateMsg.topImg.errorMsg = '图片大小最大为500KB'
				return false;
			}
			let that = this;
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload=function(){
					let width = image.width;
					let height = image.height;
					let scale = width / height;
					if(scale !== 2) {
						that.validateMsg.topImg.isError = true;
						that.validateMsg.topImg.errorMsg = '请上传宽高比例为2:1的图片'
					} else {
						imageData.append('file', file);
						that.imageTopUpload(imageData);
						that.validateMsg.topImg.isError = false;
						that.validateMsg.topImg.errorMsg = '';
						that.validateMsg.topImg.imgUrlName = file.name;
					}
				};
				image.src= data;
			};
		   reader.readAsDataURL(file);
		},
		imageTopUpload(data) {
			Http.post(this.uploadUrl, data)
			.then((res) => {
				if (res.data.code === 200) {
					this.imgUrl = res.data.data.imageUrl;
				}
			})
			.catch((error) => {
				console.log(error);
			});
		},

		handlePalette(e) {
		    e.stopPropagation();
			this.showChildComponents.showPalette = true;
		},
		onChange(val) {
			this.selectColor = val.hex;
			console.log('this.selectColor: ' + this.selectColor);
			console.log('val.hex: ' + val.hex);
		},
		changeShareFile(){
			let input = document.getElementById("sharePicture");
			input.click();
		},
		sharePictureChange(eve) {
			let files= eve.target.files;
			this.loadShareImage(files[0]);

		},
		loadShareImage(file) {
			if (file.size > 15 *1024) {
				this.validateMsg.cardImg.isError = true;
				this.validateMsg.cardImg.errorMsg = '图片大小最大为15KB';
				return false;
			}
			let that = this;
			let imageData = new FormData();
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				//加载图片获取图片真实宽度和高度
				let image = new Image();
				image.onload=function(){
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
			Http.post(this.uploadUrl, data)
			.then((res) => {
				if (res.data.code === 200) {
					this.cardImg = res.data.data.imageUrl;
				}
			})
			.catch((error) => {
				console.log(error);
			});
		},
		queryItemId(index) {
			if (this.editData.itemList[index].skuId === "" || this.editData.itemList[index].skuId.length === 0) {
				this.editData.itemList[index].description = '';
				this.editData.itemList[index].image = '';
				this.editData.itemList[index].productId = '';
				this.editData.itemList[index].name = '';
				this.videoShopSKUList[index].isError = true;
				this.videoShopSKUList[index].errorMsg = '请输入SKU ID';
				return;
			} else {
				let currentSku = this.editData.itemList.find((item,i) => {
					return i !== index && item.skuId === this.editData.itemList[index].skuId;
				});

				if(currentSku !== undefined){
					this.videoShopSKUList[index].isError = true;
					this.videoShopSKUList[index].errorMsg = '请不要输入重复商品';
					this.editData.itemList[index].skuId = '';
					this.editData.itemList[index].description = '';
					this.editData.itemList[index].image = '';
					this.editData.itemList[index].productId = '';
					this.editData.itemList[index].name = '';
					setTimeout(()=>{
						this.videoShopSKUList[index].errorMsg = '';
					},2000);
					return false;
				}
				Http.get('/api/material/sku', {
					params: {
						skuId: this.editData.itemList[index].skuId
					}
				})
				.then((res) => {
					if ( res.data.data.skuId == null && res.data.data.productId == null) {
						this.editData.itemList[index].skuId = '';
						this.editData.itemList[index].description = '';
						this.editData.itemList[index].image= '';
						this.editData.itemList[index].productId= '';
						this.editData.itemList[index].name= '';
						this.videoShopSKUList[index].isError = true;
						this.videoShopSKUList[index].errorMsg = '未找到该商品';
						return false;
					} else if(this.editData.shopId !== "" && res.data.data.shopId !== this.editData.shopId ){
						this.editData.itemList[index].skuId = ''
						this.editData.itemList[index].description = '';
						this.editData.itemList[index].image = '';
						this.editData.itemList[index].productId = '';
						this.videoShopSKUList[index].isError = true;
						this.videoShopSKUList[index].errorMsg = '请填写店铺内的SKU ID';
						return false;
					}else{
						this.editData.itemList[index].description = res.data.data.description;
						this.editData.itemList[index].productId = res.data.data.productId;
						this.videoShopSKUList[index].isError = false;
						this.videoShopSKUList[index].errorMsg = '';
						res.data.data.images.forEach((item) => {
							this.editData.itemList[index].images.push({
								url: item,
								checked: false
							});
						});
						this.editData.itemList[index].images[0].checked = true;
						this.editData.itemList[index].image = this.editData.itemList[index].images[0].url;
					}
				});
			}
		},
		selectImg(index) {
			this.formData.image = this.allImgList[index].url;
			this.allImgList.forEach((item) => {
				item.checked = false;
			});
			this.allImgList[index].checked = true;
		},
		upSuccess(response, file, fileList){
			if (response.code === 200) {
				this.cardImg = response.data.imageUrl;
			}
		},
	},
	watch:{
		'editData.itemList': {
			handler: function (value, oldvalue) {
				value.forEach((items,i) => {
					items.images.forEach((item, j) => {
						if (item.checked) {
							items.image = item.url;
						}
					})
				})
			},
			deep: true
		}
	}
};
</script>
<style scoped lang="less">
	.vue-color__sketch{
		margin: 40px 0 0 0;
	}
	.icon-selectColor{
		float: left;
		margin: 10px 0 0 10px;
		&:hover{
			 color:#d30312;
		 }
	}
	.addbtn{
		width:118px;
		height:34px;
		display: block;
		margin: 20px 0;
		clear: both;
	}
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
		width:auto;
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
	.photo-box .photo-add{
		width: 160px;
		height: 80px;
		img{
			width: 100%;
			height:100%;
		}
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
	.photoContent{
		overflow: hidden;
		position: relative;
		width: 385px;
		height:50px;
		float: left
	}
	.photoBox{
		width: 105%;
		height: 50px;
	}
	.scrollBtn{
		width: 20px;
		height: 50px;
		float: left;
	}
	.detail-row .row-photo-l .photo-add {
		width: 400px;
		height: 200px;
		text-align: center;
		background-color: #e5e5e6;
		color: #d9dbde;
		margin: 20px 0 0 0;
		position: relative;
		overflow: hidden;
		background-position: center center;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.photo-add {
		cursor: pointer;
	}

	.el-input input[readonly='readonly'] {
		border: none;
	}
	.add-fn{
		width:400px
	}
	input[readonly = 'readonly']{
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
	.error-left{
		width:50%;
		margin-left: 215px;
	}

	#shopIdReadOnly .el-input__inner{
		border:none;
	}
	.imgupload{
		background-image: none;
		text-align: center;
		font-size: 12px;
		border-radius: 4px;
		color: #fff;
		background-color: #20a0ff;
		border-color: #20a0ff;
		width:68px;
		height:28px;
		line-height: 28px;
		cursor: pointer;
	}
</style>
