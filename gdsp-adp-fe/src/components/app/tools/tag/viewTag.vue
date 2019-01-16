<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">查看标签</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form" style="width: 900px;">
				<div class="form-column">
					<el-form :model="tagData" ref="tagForm" label-width="155px">
						<el-form-item label="标签名称：" prop="name">
							<span>{{tagData.name}}</span>
						</el-form-item>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.SKU">
							<el-form-item label="SKU ID：" prop="tagSkus">
								<div class="detail-row">
									<table class="table">
										<tbody>
											<tr>
												<th class="w140"><span>SKU ID</span></th>
												<th class="w140"><span>商品名称</span></th>
												<th class="w140"><span>品牌</span></th>
												<th class="w140"><span>店铺</span></th>
												<th class="w140"><span>品类</span></th>
											</tr>
											<tr v-for="(item, index) in skus">
												<td><span>{{item.skuId}}</span></td>
												<td><span>{{item.name}}</span></td>
												<td><span>{{item.brandName}}</span></td>
												<td><span>{{item.shopName}}</span></td>
												<td><span>{{item.thirdCategoryName}}</span></td>
											</tr>
										</tbody>
									</table>
								</div>
							</el-form-item>
							<el-form-item label="SKU扩展：">
								<el-row>
									<el-col :span="4">
										<el-form-item prop="isExtBrand">
											<span v-if="tagData.isExtBrand === 1">同品牌</span>
										</el-form-item>
									</el-col>
									<el-col :span="4">
										<el-form-item prop="isExtC3">
											<span v-if="tagData.isExtC3 === 1">同三级类目</span>
										</el-form-item>
									</el-col>
									<el-col :span="4">
										<el-form-item prop="isExtShop">
											<span v-if="tagData.isExtShop === 1">同店铺</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</template>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.CATEGORY">
							<el-form-item>
								<el-row>
									<el-col :span="6" style="margin-right: 2px;">
										<span>一级品类：</span>
										<el-form-item style="border: 1px solid #ddd;height: 200px;overflow: auto;">
											<span class="check-item"
												v-for="category in categoryOne"
												@click="clickCategory(category)"
											>
												<em :class="{'icon': true, 'icon-selected': category.checked, 'icon-indeterminate': !category.checked}" style="margin-right: 5px;"></em>{{category.name}}
											</span>
										</el-form-item>
									</el-col>
									<el-col :span="6" style="margin-right: 2px;" v-if="categoryTwo.length > 0">
										<span>二级品类：</span>
										<el-form-item style="border: 1px solid #ddd;height: 200px;overflow: auto;">
											<span class="check-item"
												v-for="category in categoryTwo"
												@click="clickCategory(category)"
											>
												<em :class="{'icon': true, 'icon-selected': category.checked, 'icon-indeterminate': !category.checked}" style="margin-right: 5px;"></em>{{category.name}}
											</span>
										</el-form-item>
									</el-col>
									<el-col :span="6" v-if="categoryThree.length > 0">
										<span>三级品类：</span>
										<el-form-item prop="categroyThree" style="border: 1px solid #ddd;">
											<span class="check-item"
												v-for="category in categoryThree"
											>
												{{category.name}}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</template>
						<template v-if="tagData.dimension === CONST.TAG_DIMENSION.BRAND">
							<el-form-item>
								<el-row>
									<el-col :span="6" style="margin-right: 2px;">
										<span>品牌：</span>
										<el-form-item prop="categroyThree" style="border: 1px solid #ddd;">
											<span class="check-item"
												v-for="brand in selectBrands"
											>
												{{brand.name}}
											</span>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</template>
						<el-form-item label="用户行为：" prop="behavior" v-if="type === 'shop'">
							<span v-if="tagData.behavior === CONST.TAG_BEHAVIOR.VIEW">浏览</span>
							<span v-if="tagData.behavior === CONST.TAG_BEHAVIOR.ADD_CART">加购</span>
							<span v-if="tagData.behavior === CONST.TAG_BEHAVIOR.BUY">购买</span>
						</el-form-item>
						<el-form-item label="行为时间：" prop="behaviorTime">
							<span>{{getBehaviorTime(tagData.behaviorTime)}}</span>
						</el-form-item>
						<el-form-item label="被添加的人群：" prop="crowds">
							<span v-if="tagData.crowds.length === 0">无</span>
							<div class="detail-row" v-if="tagData.crowds.length > 0">
								<table class="table">
									<tbody>
										<tr>
											<th class="w140"><span>人群 ID</span></th>
											<th class="w140"><span>人群名称</span></th>
										</tr>
										<tr v-for="(item, index) in tagData.crowds">
											<td><span>{{item.crowdId}}</span></td>
											<td><span>{{item.name}}</span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">关闭</button>
		</div>
	</div>
</template>
<script>
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
import {mixin} from 'utils/common';
export default {
	name: 'ViewTagDrawer',
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
				crowds: []
			},
			skus: [],
			categorys: [],
			defaultOne: [],
			defaultTwo: [],
			defaultThree: [],
			categoryOne: [],
			categoryTwo: [],
			categoryThree: [],
			selectBrands: []
		};
	},
	props: ['type', 'tagId'],
	created() {
		this.getData();
	},
	methods: {
		closeDrawer() {
			Event.$emit('closeViewTagDrawer');
		},
		getBehaviorTime(behaviorTime) {
			if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.ONE_DAY) {
				return '1天';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.THREE_DAY) {
				return '3天';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.SEVEN_DAY) {
				return '7天';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.HALF_MONTH) {
				return '15天';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.MONTH) {
				return '1个月';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.TWO_MONTH) {
				return '2个月';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.THREE_MONTH) {
				return '3个月';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.SIX_MONTH) {
				return '6个月';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.YEAR) {
				return '12个月';
			} else if (behaviorTime === CONST.TAG_BEHAVIOR_TIME.ONE_HALF_YEAR) {
				return '18个月';
			} else {
				return '';
			}
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
						this.tagData.tagSkus = skuIds.join(';');
						this.getSkus();
					} else if (this.tagData.dimension === CONST.TAG_DIMENSION.CATEGORY) {
						this.getCategorys();
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
		getSkus() {
			let skuIds = this.tagData.tagSkus.replace(/&nbsp|，| |;|；|,|\.|。|\s|\n|<[^>]+>/g, ',').split(',');
			if (skuIds.length > 0) {
				Http.get('/api/mall/skus', {
					params: {
						skuIds: skuIds.join(',')
					}
				}).then(res => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						this.skus = res.data.data;
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
		getCategorys() {
			Http.get('/api/categorys').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.categorys = res.data.data;
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
				let subSelectLength = this.getChildCategory(c.categoryId, CONST.CATEGORY_LEVEL.ONE);
				if (c.level === CONST.CATEGORY_LEVEL.ONE && (subSelectLength > 0 || c.checked)) {
					this.categoryOne.push(c);
				}
			}
		},
		getChildCategory(categoryId, level) {
			let categorys = [];
			if (level === CONST.CATEGORY_LEVEL.ONE) {
				for (let c of this.defaultTwo) {
					let childCategoryLength = this.getChildCategory(c.categoryId, CONST.CATEGORY_LEVEL.TWO);
					if (c.parentId === categoryId && (c.checked || childCategoryLength > 0)) {
						categorys.push(c);
					}
				}

			} else {
				for (let c of this.defaultThree) {
					if (c.parentId === categoryId && c.checked) {
						categorys.push(c);
					}
				}
			}
			return categorys.length;
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
					let subSelectLength = this.getChildCategory(c.categoryId);
					if (c.parentId === category.categoryId && (c.checked || subSelectLength > 0)) {
						categorys.push(c);
					}
				}
				this.categoryTwo = categorys;
			} else if (category.level === CONST.CATEGORY_LEVEL.TWO) {
				for (let c of this.defaultThree) {
					if (c.parentId === category.categoryId && c.level === CONST.CATEGORY_LEVEL.THREE && c.checked) {
						categorys.push(c);
					}
				}
				this.categoryThree = categorys;
			}
		},
	}
};
</script>
<style scoped>
	.check-item {
		padding: 0 5px;
		height: 28px;
		line-height: 28px;
		display: block;
		cursor: pointer;
	}
</style>