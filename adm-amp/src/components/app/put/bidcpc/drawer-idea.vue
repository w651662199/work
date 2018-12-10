<template>
 <div>
    <div class="account-set">

      <div class="set-fn">
        <div class="fn-plan" style="position: relative;">
          <div class="ele-input" style="width: 290px;" :class="{errorBorderColor:showHintSkuId}">
            <input v-model="so.skuId" :placeholder="showHintSkuId?'':'输入商品SKU ID，联营商品前方添加pop'">
          </div>
          <div class="skuidHint" v-show="showHintSkuId">{{showHintSkuIdTxt}}</div>
        </div>

        <div class="fn-search" @click.prevent="addProductBySkuId"><a href="" class="btn btn-normal" style="width:76px;padding:0">添加</a></div>
      </div>

      <div class="amp-data" style="position: relative;">
      		<div style="margin: 40px 0 20px 0; font-size: 16px;">
      			<span>已添加推广商品</span>
      		</div>
            <div class="data-table">
              <div class="table-list">
                <div class="list-header">
                  <span class="span-col-1">商品SKU ID</span>
                  <span class="span-col-2">商品标题</span>
                  <span class="span-col-3">创意图片</span>
                  <span class="span-col-4">操作</span>
                </div>
                <div v-for="(item, index) in list" class="list-body">
                  <div class="body-row">
                    <span class="span-col-1">
                    	<i class="data-id">{{item.skuId}}</i>
                    </span>
                    <span class="span-col-2" :title="item.title">
                      <i class="ellipsis">
                        {{item.title}}
                      </i>
                    </span>
                    <span class="span-col-3">
                      <img :src="item.image" :alt="item.title" style="height: 50px;border-radius: 6px;">
                    </span>
                    <span class="span-col-4">
                      <b class="operat-link">
                        <a href="" @click.prevent="showDialog(index)">删除</a>
                      </b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="skuidListHint" v-show="showHintSkuIdList">请添加推广商品</div>
          </div>
    </div>
    <div class="el-dialog__wrapper" style="z-index: 1400;" v-if="dialogVisible">
    	<div class="el-dialog el-dialog--tiny" style="top: 15%;">
	    	<div class="el-dialog__header">
	    		<span class="el-dialog__title">提示</span>
	    		<div class="el-dialog__headerbtn" @click="dialogVisible = false"><i class="el-dialog__close el-icon el-icon-close"></i></div>
	    	</div>
	    	<div class="el-dialog__body"><span>确定删除该推广商品吗？</span> </div>
	    	<div class="el-dialog__footer">
	    		<span class="dialog-footer">
	    			<button type="button" class="el-button el-button--default" @click="dialogVisible = false"><span>取 消</span></button>
	    			<button type="button" class="el-button el-button--primary" @click="delIdea"><span>确 定</span></button>
	    		</span>
	    	</div>
	    </div>
    </div>
    <div class="v-modal" v-if="dialogVisible" style=" z-index: 1350;" @click="dialogVisible = false"></div>
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
	isEmptyObj
} from 'utils/common';
import Event from 'event';
import Http from 'http';

export default {
	name: 'app-put-bidcpc-new-idea',
	data() {
		return {
			showHintSkuId: false,
			showHintSkuIdTxt: '',
			showHintSkuIdList: false,
			formData: {},

			so: {
            	skuId: ""
            },

			httpMethodMap: {
				new: 'post',
				copy: 'post',
				modify: 'put'
			},
			delIndex: 0,
			list: [],

            dialogVisible: false,
		  	title : '提示',
		  	body_html : '',
		  	btn_state : '',
		  	index : ''
		};
	},
	computed: {
		drawerData: () => store.state.drawerCtrl.config, // from store
		drawerCtrlAction: () => store.state.drawerCtrl.action,
	},
	created() {
		this.formData = copyObj(this.drawerData);
	},
	mounted() {
		Event.$off('put-save');
		Event.$on('put-save', () => {
			this.saveMaterial();
		});
	},

	methods: {
		showDialog(index) {
			this.delIndex = index;
			this.dialogVisible = true;
		},
		addProductBySkuId() {
			var skuId = this.so.skuId;
			var isExist = 0;

			// 非空校验
			if (skuId === '') {
				this.showHintSkuId = true;
				this.showHintSkuIdTxt = '请输入商品SKU ID';
            	return;
            } else {
            	this.showHintSkuId = false;
            	this.showHintSkuIdTxt = '';
            }

            // 非重复校验
			this.list.find((item) => {
				if (item.skuId == skuId) {
					isExist += 1;
				} else {
					isExist += 0;
				}
			});

			if (isExist) {
				this.showHintSkuId = true;
				this.showHintSkuIdTxt = '当前创意中已添加了该SKU，请勿重复添加';
				return;
			} else {
				this.showHintSkuId = false;
				this.showHintSkuIdTxt = '';
			}

			//重复校验
			Http.get('/api/material/exist', {
				params: {
					skuId: skuId,
					flightId: this.formData.flightId
				}
			})
			.then((res) => {
				if (res.data.code == 200) {
					if (res.data.data.exist == 1) {
						this.showHintSkuId = true;
						this.showHintSkuIdTxt = '当前单元中已添加了该SKU，请勿重复添加';
						return;
					} else {
						this.showHintSkuId = false;
						this.showHintSkuIdTxt = '';
						Http.get('/api/material/total', {
							params: {
								flightId: this.formData.flightId
							}
						})
						.then((res) => {
							if (res.data.iserror) {
								this.$message({message: res.data.msg, type: 'error'});
								return;
							}
							if (res.data.data.materialTotal >= 50) {
								this.$message({message: '此投放单元下的创意总数不能超过50个', type: 'error'});
								return;
							}
							// SKU ID商品信息是否存在校验
							Http.get('api/material/sku', {
								params: {
									skuId: skuId
								}
							})
							.then((res) => {
								if (res.data.iserror) {
									this.$message({message: res.data.msg, type: 'error'});
									return;
								}
								if (!res.data.data.skuId) {
									this.showHintSkuId = true;
									this.showHintSkuIdTxt = '未查询到与SKU ID相关的商品';
									return;
								} else {
									this.showHintSkuId = false;
									this.showHintSkuIdTxt = '';
								}
								var skuInfo = res.data.data;
								// 是否属于禁投分类校验
								Http.get('/api/material/banned', {
									params: {
										skuId: skuId
									}
								})
								.then((res) => {
									if (res.data.iserror) {
										this.$message({message: res.data.msg, type: 'error'});
										return;
									}
									if (res.data.data.isBadden) {
										this.$message({message: '抱歉, 此商品为广告法禁投商品, 请添加其他商品', type: 'error'});
										return;
									}
									var item = {};
									item.productId = skuInfo.productId;
									item.skuId = skuInfo.skuId;
									item.skuNo = skuInfo.skuNo;
									item.title = skuInfo.name;
									item.image = skuInfo.images[0];
									item.flightId = this.formData.flightId;
									this.list.push(item);
								});
							});
						});
					}
				} else if (res.data.code >= 500) {
					this.$message({
						message: '服务器异常，请稍后再试。',
						type: 'error',
						duration: 3000
					});
				} else {
					this.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			});
		},

		saveMaterial() {
			if (this.list.length <= 0) {
				this.showHintSkuIdList = true;
				return;
			} else {
				this.showHintSkuIdList = false;
			}

			let params = this.list;

			Http({
				url: 'api/material/bid',
				method: this.httpMethodMap[this.drawerCtrlAction],
				data: params
			})
			.then((res) => {
				if (!res.data.iserror) {
					Event.$emit('put-save-result', {
						error: 0,
						res: res.data
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
			})
			.catch((e) => {
				Event.$emit('put-save-result', {
					error: 1,
					res: null
				});
			});

		},

		delIdea() {
      		this.list.splice(this.delIndex, 1);
      		this.dialogVisible = false;
		},

	}
};
</script>
<style lang="less">
.errorBorderColor{
	border-color: #ff4949;
}
.errorBorderColor:hover{
	border-color: #ff4949;
}
.skuidHint{
	position: absolute;
	left: 3px;
	top: 37px;
	color: #ff4949;
	font-size: 14px;
}
.skuidListHint{
	position: absolute;
	left: 0;
	bottom: 0;
	color: #ff4949;
}
</style>
