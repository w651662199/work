<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">新建{{type === 'shop' ? '购物' : '搜索'}}行为标签</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form" style="width: 900px;">
				<div class="form-column">
					<el-form :model="tagData" ref="tagForm" :rules="formRules" label-width="155px">
						<el-form-item label="圈定维度：" prop="dimension" class="is-required">
							<el-radio-group v-model="tagData.dimension" @change="dimensionChange">
								<el-radio :label="CONST.TAG_DIMENSION.SKU" v-if="type === 'shop'">SKU</el-radio>
								<el-radio :label="CONST.TAG_DIMENSION.CATEGORY">品类</el-radio>
								<el-radio :label="CONST.TAG_DIMENSION.BRAND">品牌</el-radio>
							</el-radio-group>
						</el-form-item>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.SKU">
							<el-form-item label="SKU ID：" prop="tagSkus" class="is-required">
								<el-input
									v-model="tagData.tagSkus"
									type="textarea"
									:rows="10"
									resize="none"
									style="width: 500px"
								></el-input>
							</el-form-item>
							<el-form-item>
								<p class="error-message" v-if="skuError.length > 0">{{skuError}}</p>
								<p>多个SKU ID之间，请以逗号、分号、句号、空格或者换行分隔</p>
								<button class="btn btn-blue-simple" type="button" @click.prevent="getSkus">获取SKU</button>
							</el-form-item>
							<el-form-item prop="skus" v-if="skus.length > 0">
								<div class="detail-row">
									<table class="table">
										<tbody>
											<tr>
												<th class="w140"><span>SKU ID</span></th>
												<th class="w140"><span>商品名称</span></th>
												<th class="w140"><span>品牌</span></th>
												<th class="w140"><span>店铺</span></th>
												<th class="w140"><span>品类</span></th>
												<th class="w80"><span>操作</span></th>
											</tr>
											<tr v-for="(item, index) in skus">
												<td><span>{{item.skuId}}</span></td>
												<td><span>{{item.name}}</span></td>
												<td><span>{{item.brandName}}</span></td>
												<td><span>{{item.shopName}}</span></td>
												<td><span>{{item.thirdCategoryName}}</span></td>
												<td><span><em class="icon icon-delete" @click="removeSku(item.skuId, index)"></em></span></td>
											</tr>
										</tbody>
									</table>
								</div>
							</el-form-item>
							<el-form-item label="SKU扩展：" prop="skuExt">
								<el-row>
									<el-col :span="4">
										<el-form-item prop="isExtBrand">
											<el-tooltip placement="right" effect="light">
												<p slot="content">同品牌：扩展至标签内所有SKU所属品牌的所有SKU商品。<br/>同三级类目：扩展至标签内所有SKU所属三级类目下所有SKU商品。
												</p>
												<em class="icon icon-help"></em>
											</el-tooltip>
											<el-checkbox v-model="tagData.isExtBrand">同品牌</el-checkbox>
										</el-form-item>
									</el-col>
									<el-col :span="4">
										<el-form-item prop="isExtC3">
											<el-checkbox v-model="tagData.isExtC3">同三级类目</el-checkbox>
										</el-form-item>
									</el-col>
									<el-col :span="4" v-if="false">
										<el-form-item prop="isExtShop">
											<el-checkbox v-model="tagData.isExtShop">同店铺</el-checkbox>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</template>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.CATEGORY">
							<el-form-item prop="tagCategorys">
								<el-row>
									<el-col :span="6" style="margin-right: 2px;">
										<span>一级品类：</span>
										<el-form-item class="con-box w200">
											<span class="check-item"
												v-for="category in categoryOne"
												@click="clickCategory(category)"
											>
												<el-checkbox v-model="category.checked"></el-checkbox>
												{{category.name}}
											</span>
										</el-form-item>
									</el-col>
									<el-col :span="6" style="margin-right: 2px;" v-if="categoryTwo.length > 0">
										<span>二级品类：</span>
										<el-form-item class="con-box w200">
											<span class="check-item"
												v-for="category in categoryTwo"
												@click="clickCategory(category)"
											>
												<el-checkbox v-model="category.checked"></el-checkbox>
												{{category.name}}
											</span>
										</el-form-item>
									</el-col>
									<el-col :span="6" v-if="categoryThree.length > 0">
										<span>三级品类：</span>
										<el-form-item class="con-box w200">
											<span class="check-item"
												v-for="category in categoryThree"
											>
												<el-checkbox v-model="category.checked"></el-checkbox>
												{{category.name}}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</template>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.BRAND">
							<el-form-item label="品牌：" prop="keyword">
								<el-input v-model="tagData.keyword" icon="search" :on-icon-click="searchBrand" style="width: 300px;"></el-input>
								<p v-if="errorMsg.length > 0">{{errorMsg}}</p>
								<p v-if="noBrand">没有相关品牌，请更换关键词重新查询！</p>
								<div class="con-box w300" v-if="brands.length > 0">
									<el-checkbox v-for="brand in brands" v-model="brand.checked"style="display: block;" :disabled="brand.checked" @change="selectBrand(brand)">{{brand.name}}</el-checkbox>
								</div>
							</el-form-item>
							<el-form-item label="已选品牌：" prop="brandIds">
								<div class="tag-box" style="">
									<span class="tag-item" v-for="(brand, index) in selectBrands">
										{{brand.name}}
										<em class="icon icon-shut" @click="removeBrand(index)"></em>
									</span>
								</div>
							</el-form-item>
						</template>
						<el-form-item label="用户行为：" prop="behavior" class="is-required" v-if="type === 'shop'">
							<el-select v-model="tagData.behavior" placeholder="请选择" style="width: 300px" @change="behaviorChange">
								<el-option label="浏览" :value="CONST.TAG_BEHAVIOR.VIEW"></el-option>
								<el-option label="加购" :value="CONST.TAG_BEHAVIOR.ADD_CART"></el-option>
								<el-option label="购买" :value="CONST.TAG_BEHAVIOR.BUY"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="行为时间：" prop="behaviorTime" class="is-required">
							<el-select v-model="tagData.behaviorTime" placeholder="请选择" style="width: 300px;">
								<el-option label="1天" :value="CONST.TAG_BEHAVIOR_TIME.ONE_DAY"></el-option>
								<el-option label="3天" :value="CONST.TAG_BEHAVIOR_TIME.THREE_DAY"></el-option>
								<el-option label="7天" :value="CONST.TAG_BEHAVIOR_TIME.SEVEN_DAY"></el-option>
								<el-option label="15天" :value="CONST.TAG_BEHAVIOR_TIME.HALF_MONTH"></el-option>
								<el-option label="1个月" :value="CONST.TAG_BEHAVIOR_TIME.MONTH"></el-option>
								<el-option label="2个月" :value="CONST.TAG_BEHAVIOR_TIME.TWO_MONTH"></el-option>
								<el-option label="3个月" :value="CONST.TAG_BEHAVIOR_TIME.THREE_MONTH"></el-option>
								<el-option label="6个月" :value="CONST.TAG_BEHAVIOR_TIME.SIX_MONTH"></el-option>
								<el-option label="12个月" :value="CONST.TAG_BEHAVIOR_TIME.YEAR" v-show="tagData.behavior === CONST.TAG_BEHAVIOR.BUY"></el-option>
								<el-option label="18个月" :value="CONST.TAG_BEHAVIOR_TIME.ONE_HALF_YEAR" v-show="tagData.behavior === CONST.TAG_BEHAVIOR.BUY"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="标签名称：" prop="name" class="is-required">
							<el-input v-model="tagData.name" placeholder="请输入标签名称" style="width: 300px;"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
		</div>
	</div>
</template>
<script>
import {mixin} from 'utils/common';
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
export default {
	name: 'TagDrawer',
	data() {
		return {
			CONST: CONST,
			tagData: {
				tagId: '',
				type: '',
				dimension: '',
				tagSkus: '',
				isExtBrand: false,
				isExtC3: false,
				isExtShop: false,
				behavior: 1,
				behaviorTime: 1,
				tagCategorys: [],
				brandIds: [],
				name: '',
				keyword: '',
				skuExt: []
			},
			skuError: '',
			formRules: {
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('请输入标签名称'));
						} else if (value.length > 30) {
							callback(new Error('填写的内容不得超过30个字符'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				dimension: [{
					required: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择圈定维度'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				tagCategorys: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.tagData.dimension === CONST.TAG_DIMENSION.CATEGORY) {
							let isChecked = false;
							for (let c of this.categorys) {
								if (c.checked) {
									isChecked = true;
									break;
								}
							}
							if (isChecked) {
								callback();
							} else {
								callback(new Error('请选择品类'));
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				brandIds: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.tagData.dimension === CONST.TAG_DIMENSION.BRAND) {
							if (this.selectBrandIds.length > 0) {
								callback();
							} else {
								callback(new Error('请选择品牌'));
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				tagSkus: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.tagData.dimension === CONST.TAG_DIMENSION.SKU) {
							if (this.skus.length === 0) {
								if (!value || value.length === 0) {
									callback(new Error('请输入有效的SKU ID'));
								} else {
									callback();
								}
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				skuExt: [{
					required: true,
					validator: (rule, value, callback) => {
						if (this.tagData.dimension === CONST.TAG_DIMENSION.SKU) {
							if (!this.tagData.isExtBrand && !this.tagData.isExtC3) {
								callback(new Error('请选择SKU扩展类型'));
							} else {
								callback();
							}
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}]
			},
			skus: [],
			categorys: [],
			defaultOne: [],
			defaultTwo: [],
			defaultThree: [],
			categoryOne: [],
			categoryTwo: [],
			categoryThree: [],
			brands: [],
			selectBrands: [],
			errorMsg: '',
			noBrand: false
		};
	},
	props: ['type', 'tagId'],
	computed: {
		selectBrandIds() {
			let brandIds = [];
			for (let brand of this.selectBrands) {
				brandIds.push(brand.brandId);
			}
			return brandIds;
		}
	},
	created() {
		if (this.tagId) {
			this.getData();
		}
	},
	methods: {
		closeDrawer() {
			Event.$emit('closeTagDrawer');
		},
		getData() {
			Http.get('/api/tag?tagId=' + this.tagId).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.tagData = mixin(this.tagData, res.data.data);
					if (this.tagData.dimension === CONST.TAG_DIMENSION.SKU) {
						let skuIds = [];
						for (let sku of this.tagData.tagSkus) {
							skuIds.push(sku.skuId);
						}
						this.tagData.isExtBrand = this.tagData.isExtBrand === 1;
						this.tagData.isExtC3 = this.tagData.isExtC3 === 1;
						this.tagData.isExtShop = this.tagData.isExtShop === 1;
						this.tagData.tagSkus = skuIds.join(';');
						this.getSkus();
					} else if (this.tagData.dimension === CONST.TAG_DIMENSION.BRAND) {
						this.getBrands();
					}
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
		save() {
			this.$refs['tagForm'].validate((valid) => {
				if (valid) {
					if (this.tagData.dimension === CONST.TAG_DIMENSION.SKU && this.skus.length === 0) {
						this.skuError = '请获取SKU验证SKU ID的正确性';
						return false;
					}
					let saveData = {
						name: this.tagData.name,
						type: this.type === 'shop' ? 1 : 2,
						dimension: this.tagData.dimension,
						behavior: this.type === 'shop' ? this.tagData.behavior : CONST.TAG_BEHAVIOR.SEARCH,
						behaviorTime: this.tagData.behaviorTime,
						isExtBrand: this.tagData.isExtBrand ? 1 : 0,
						isExtC3: this.tagData.isExtC3 ? 1 : 0,
						isExtShop: this.tagData.isExtShop ? 1 : 0,
						tagSkus: this.getTagSkus(),
						brandIds: this.selectBrandIds,
						tagCategorys: this.getTagCategorys()
					};
					if (this.tagId !== 0) {
						saveData.tagId = this.tagData.tagId;
					}
					Http({
						url: '/api/tag',
						method: this.tagId == 0 ? 'post' : 'put',
						data: saveData
					}).then((res) => {
						if (res.data.code === 200 && res.data.iserror === 0) {
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
		searchBrand() {
			if (this.tagData.keyword.length === 0) {
				this.errorMsg = '请输入搜索关键词';
				return false;
			}
			this.errorMsg = '';
			Http.get('/api/brands?keyword=' + this.tagData.keyword).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.brands = res.data.data;
					if (this.brands.length === 0) {
						this.noBrand = true;
					} else {
						this.noBrand = false;
						for (let brand of this.brands) {
							this.$set(brand, 'checked', this.selectBrandIds.indexOf(brand.brandId) > -1);
						}
					}
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
		selectBrand(brand) {
			if (brand.checked) {
				this.selectBrands.push(brand);
			}
		},
		removeBrand(index) {
			let brandId = this.selectBrands[index].brandId;
			for (let brand of this.brands) {
				if (brand.brandId === brandId) {
					brand.checked = false;
					break;
				}
			}
			this.selectBrands.splice(index, 1);
		},
		getTagSkus() {
			let tagSkus = [];
			for (let sku of this.skus) {
				tagSkus.push({
					skuId: sku.skuId ? sku.skuId : '',
					shopId: sku.shopId ? sku.shopId : '',
					c3Id: sku.thirdCategoryId ? sku.thirdCategoryId : '',
					brandId: sku.brandId ? sku.brandId :''
				});
			}
			return tagSkus;
		},
		getTagCategorys() {
			let tagCategorys = [];
			for (let c of this.categorys) {
				if (c.checked) {
					tagCategorys.push({categoryId: c.categoryId, level: c.level});
				}
			}
			return tagCategorys;
		},
		getSkus() {
			let skuIds = this.tagData.tagSkus.replace(/&nbsp|，| |;|；|,|\.|。|\s|\n|<[^>]+>/g, ',').split(',');
			if (skuIds.length > 0) {
				Http.get('/api/mall/skus', {
					params: {
						skuIds: skuIds.join(',')
					}
				}).then(res => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						for (let sku of res.data.data) {
							let index = skuIds.indexOf(sku.skuId);
							if (index > -1) {
								skuIds.splice(index, 1);
							}
							this.skus.push(sku);
						}
						this.skuError = skuIds.length > 0 ? '未找到SKU ID对应的商品' : '';
						this.tagData.tagSkus = skuIds.join(';');
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
		},
		removeSku(index) {
			this.skus.splice(index, 1);
		},
		getCategorys() {
			Http.get('/api/categorys').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.categorys = res.data.data;
					this.defaultOne = [];
					this.defaultTwo = [];
					this.defaultThree = [];
					let selectIds = this.getCategoryIds();
					for (let c of this.categorys) {
						this.$set(c, 'checked', selectIds.indexOf(c.categoryId) > -1);
						if (c.level === CONST.CATEGORY_LEVEL.ONE) {
							this.defaultOne.push(c);
						} else if (c.level === CONST.CATEGORY_LEVEL.TWO) {
							this.defaultTwo.push(c);
						} else {
							this.defaultThree.push(c);
						}
					}
					this.getCategoryOne();
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
		getCategoryIds() {
			let ids = [];
			for (let c of this.tagData.tagCategorys) {
				ids.push(c.categoryId);
			}
			return ids;
		},
		getBrands() {
			Http.get('/api/brands/batch?brandIds=' + this.tagData.brandIds.join(',')).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.selectBrands = res.data.data;
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
		getCategoryOne() {
			for (let c of this.defaultOne) {
				if (c.level === CONST.CATEGORY_LEVEL.ONE) {
					this.categoryOne.push(c);
				}
			}
		},
		dimensionChange() {
			if (this.tagData.dimension === CONST.TAG_DIMENSION.SKU) {
				this.resetCategory();
				this.resetBrands();
			} else if (this.tagData.dimension === CONST.TAG_DIMENSION.CATEGORY) {
				this.resetSkus();
				this.resetBrands();
				if (this.categorys.length === 0) {
					this.getCategorys();
				}
			} else if (this.tagData.dimension === CONST.TAG_DIMENSION.BRAND) {
				this.resetSkus();
				this.resetCategory();
			}
		},
		clickCategory(category) {
			let categorys = [];
			if (category.level === CONST.CATEGORY_LEVEL.ONE && this.currentCategoryId !== category.categoryId) {
				this.categoryTwo = [];
				this.categoryThree = [];
				this.currentCategoryId = category.categoryId;
			}
			if (category.level === CONST.CATEGORY_LEVEL.ONE) {
				for (let c of this.defaultTwo) {
					if (c.parentId === category.categoryId && c.level === CONST.CATEGORY_LEVEL.TWO) {
						categorys.push(c);
					}
				}
				this.categoryTwo = categorys;
			} else if (category.level === CONST.CATEGORY_LEVEL.TWO) {
				for (let c of this.defaultThree) {
					if (c.parentId === category.categoryId && c.level === CONST.CATEGORY_LEVEL.THREE) {
						categorys.push(c);
					}
				}
				this.categoryThree = categorys;
			}
		},
		resetCategory() {
			this.tagData.tagCategorys = [];
			for (let c of this.categorys) {
				c.checked = false;
			}
		},
		resetSkus() {
			this.tagData.tagSkus = '';
			this.skus = [];
			this.skuError = '';
			this.tagData.isExtBrand = false;
			this.tagData.isExtC3 = false;
			this.tagData.isExtShop = false;
		},
		resetBrands() {
			this.tagData.brandIds = [];
			this.brands = [];
			this.selectBrands = [];
		},
		behaviorChange() {
			if ((this.tagData.behavior === CONST.TAG_BEHAVIOR.VIEW || this.tagData.behavior === CONST.TAG_BEHAVIOR.ADD_CART) && (this.tagData.behaviorTime === CONST.TAG_BEHAVIOR_TIME.YEAR || this.tagData.behaviorTime === CONST.TAG_BEHAVIOR_TIME.ONE_HALF_YEAR)) {
				this.tagData.behaviorTime = CONST.TAG_BEHAVIOR_TIME.ONE_DAY;
			}
		}
	}
};
</script>
<style lang="less" scoped>
	.check-item {
		height: 28px;
		line-height: 28px;
		display: block;
		cursor: pointer;
	}
	.con-box {
		height: 200px;
		border: 1px solid #ddd;
		overflow: auto;
	}
	.tag-box {
		background: #fff;
		width: 500px;
		max-height: 300px;
		overflow: auto;
		padding-top: 0;
		.tag-item {
			padding-right: 20px;
			margin-right: 10px;
		}
	}
</style>