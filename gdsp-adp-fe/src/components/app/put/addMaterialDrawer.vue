<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">{{type === 'flight' ? '创意库' : '添加托底素材'}}</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="part-form" style="width: 800px;">
				<div class="form-column">
					<div class="query-information" v-if="!isCampagin">
						<div class="information-fn">
							<div class="fn-item">
								<span>创意状态：</span>
								<el-select v-model="searchParams.status" style="width:130px;display:inline-block;" placeholder="全部">
									<el-option v-for="status of searchParams.statusOptions" :label="status.label" :value="status.value"></el-option>
								</el-select>
							</div>
							<div class="fn-item">
								<span>创意类型：</span>
								<el-select v-model="searchParams.formatCategoryId" style="width:130px;display:inline-block;" placeholder="全部" @change="formatCategoryChange">
									<el-option v-for="formatCategory of searchParams.formatCategoryOptions" :label="formatCategory.label" :value="formatCategory.value"></el-option>
								</el-select>
							</div>
							<div class="fn-item">
								<span>创意形式：</span>
								<el-select v-model="searchParams.formatId" style="width:130px;display:inline-block;" placeholder="全部">
									<el-option v-for="format of searchParams.formatOptions" :label="format.name" :value="format.formatId" v-if="format.isAppendMaterial !== 1"></el-option>
								</el-select>
							</div>
							<div class="fn-item">
								<el-input v-model="searchParams.keyword" placeholder="搜索创意" style="width:170px;display:inline-block;"></el-input>
							</div>
							<div class="fn-item">
								<button class="btn btn-blue" @click="search">搜索</button>
							</div>
						</div>
					</div>
					<div class="data-table" id="JS_material_list">
						<div class="table-content">
							<div class="main-table-wapper">
								<table class="table main-table">
									<thead>
										<tr>
											<th class="w40">
												<span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}"@click="selectAll"></em></span>
											</th>
											<th class="w140"><span>素材名称</span></th>
											<th class="w80" v-if="!isCampagin"><span>创意状态</span></th>
											<th class="w80"><span>创意类型</span></th>
											<th class="w180" v-if="!isCampagin"><span>创意形式</span></th>
											<th class="w180"><span>预览图</span></th>
											<th class="w60" v-if="!isCampagin"><span>引用单元数量</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in list">
											<td>
												<span>
													<em class="icon" :class="{'icon-select': !item.checked, 'icon-selected': item.checked}"@click="selectMaterial(item)"></em>
												</span>
											</td>
											<td><span><i class="ellipsis">{{item.name}}</i></span></td>
											<td v-if="!isCampagin"><span>{{getApproveStatus(item.approveStatus)}}</span></td>
											<td><span>{{getFormat(item.formatCategoryId)}}</span></td>
											<td v-if="!isCampagin"><span>{{item.formatName}}</span></td>
											<td><span><img class="img-preview" v-for="image in item.images" :src="image"></span></td>
											<td v-if="!isCampagin"><span>{{item.flightCount}}</span></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<el-pagination
				@current-change="currentPageChange"
				:current-page="page.currentPage"
				:page-size="page.pageSize"
				layout="total, prev, pager, next"
				:total="page.totalCount"
				:class="{'el-pagination-reset': true}">
			</el-pagination>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
		</div>
	</div>
</template>
<script>
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
export default {
	name: 'addMaterialDrawer',
	props: ['type', 'formatId', 'flightId', 'campaignId', 'materials'],
	data() {
		return {
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			searchParams: {
				keyword: '',
				formatCategoryId: -2,
				status: -2,
				formatId: -2,
				statusOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '审核通过',
					value: CONST.MATERIAL_APPROVE_STATUS.APPROVED
				}, {
					label: '待审核',
					value: CONST.MATERIAL_APPROVE_STATUS.APPROVING
				}],
				formatCategoryOptions: [{
					label: '全部',
					value: -2
				}, {
					label: '原生',
					value: CONST.FORMAT_CATEGORY.NATIVE
				}, {
					label: '应用下载',
					value: CONST.FORMAT_CATEGORY.DOWNLOAD
				}, {
					label: '视频',
					value: CONST.FORMAT_CATEGORY.VIDEO
				}, {
					label: '图片',
					value: CONST.FORMAT_CATEGORY.IMAGE
				}],
				formatOptions: [{
					name: '全部',
					formatId: -2
				}],
			},
			list: [],
			materialId: '',
			formats: []
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let material of this.list) {
				if (!material.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		},
		isCampagin() {
			return this.type === 'campaign';
		}
	},
	created() {
		if (!this.isCampagin) {
			this.getAllFormats();
		}
		this.getMaterialList();
	},
	methods: {
		getMaterialIds() {
			if (!this.isCampagin) return [];
			let materialIds = [];
			for (let material of this.materials) {
				materialIds.push(material.materialId);
			}
			return materialIds;
		},
		search() {
			if (this.page.currentPage === 1) {
				this.getMaterialList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getMaterialList() {
			let params = {
				page: this.page.currentPage,
				keyword: this.searchParams.keyword,
				formatCategoryId: this.searchParams.formatCategoryId,
				formatId: this.searchParams.formatId,
				number: this.page.pageSize
			};
			let url = '/api/materials';
			if (this.isCampagin) {
				params.approveStatus = CONST.MATERIAL_APPROVE_STATUS.APPROVED;
				params.formatId = this.formatId.join(',');
			} else {
				url = '/api/flight/materials';
				params.flightId = +this.flightId;
				params.campaignId = this.campaignId;
				params.approveStatus = this.searchParams.status;
			}
			Http.get(url, {
				params: params
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					let materialIds = this.getMaterialIds();
					for (let material of this.list) {
						let isChecked = false;
						if (material.images) {
							material.images = material.images.split(',');
						}
						if (this.isCampagin) {
							isChecked = materialIds.indexOf(material.materialId) > -1;
						}
						this.$set(material, 'checked', isChecked);
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
		getAllFormats() {
			Http.get('/api/formats').then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					for (let format of res.data.data) {
						this.formats.push({formatId: format.formatId, formatCategoryId: format.formatCategoryId, name: format.name, isAppendMaterial: format.isAppendMaterial});
					}
					this.searchParams.formatOptions = [...this.searchParams.formatOptions, ...this.formats];
				}
			}).catch(err => {
				console.log(err);
			});
		},
		formatCategoryChange() {
			this.searchParams.formatOptions = [{formatId: -2, name: '全部'}];
			if (this.searchParams.formatCategoryId === -2) {
				this.searchParams.formatOptions = [...this.searchParams.formatOptions, ...this.formats];
			} else {
				let formats = [];
				for (let format of this.formats) {
					if (format.formatCategoryId === this.searchParams.formatCategoryId) {
						this.searchParams.formatOptions.push(format);
					}
				}
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getMaterialList();
		},
		selectMaterial(material) {
			material.checked = !material.checked;
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let material of this.list) {
				material.checked = !isAllSelect;
			}
		},
		save() {
			let materials = [];
			for (let material of this.list) {
				if (material.checked) {
					if (!this.isCampagin) {
						//单元加挂创意，只取id
						materials.push(material.materialId);
					} else {
						materials.push(material);
					}
				}
			}
			if (this.isCampagin) {
				Event.$emit('closeMaterialDrawer', materials);
			} else {
				Http.put('/api/flight/materials', {
					flightId: this.flightId,
					materialIds: materials
				}).then(res => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						Event.$emit('closeMaterialDrawer');
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
		closeDrawer() {
			Event.$emit('closeMaterialDrawer');
		},
		getFormat(formatCategoryId) {
			let formats = [];
			if (formatCategoryId === CONST.FORMAT_CATEGORY.NATIVE) {
				return '原生';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.DOWNLOAD) {
				return '应用下载';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.VIDEO) {
				return '视频';
			}
			if (formatCategoryId === CONST.FORMAT_CATEGORY.IMAGE) {
				return '图片';
			}
			return '';
		},
		getApproveStatus(status) {
			if (status === CONST.MATERIAL_APPROVE_STATUS.APPROVING) {
				return '待审核';
			} else if (status === CONST.MATERIAL_APPROVE_STATUS.APPROVED) {
				return '审核通过';
			} else if (status === CONST.MATERIAL_APPROVE_STATUS.REJECT) {
				return '审核未通过';
			}
			return '';
		}
	}
};
</script>
