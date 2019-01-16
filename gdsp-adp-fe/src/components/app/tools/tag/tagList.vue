<template>
	<div>
		<div class="tab">
			<div class="tab-fn">
				<span :class="{'active': tab === 'shop'}" @click="changeTab('shop')">购物行为标签</span>
				<span :class="{'active': tab === 'search'}" @click="changeTab('search')">搜索行为标签</span>
				<span :class="{'active': tab === 'platform'}" @click="changeTab('platform')">平台特征标签</span>
			</div>
		</div>
		<div class="query-information">
			<div class="information-fn">
				<div class="fn-item" v-if="tab === 'shop'">
					<button class="btn btn-blue" type="button" @click.prevent="newTag">新建购物行为标签</button>
				</div>
				<div class="fn-item" v-if="tab === 'search'">
					<button class="btn btn-blue" type="button" @click.prevent="newTag">新建搜索行为标签</button>
				</div>
				<div class="fn-item" v-if="tab !== 'platform'">
					<button class="btn btn-blue-simple" type="button" @click.prevent="deleteTags">删除</button>
				</div>
				<div class="fn-item" v-if="false">
					<span>标签类别：</span>
					<el-select v-model="searchParams.tagType" style="width:130px;display:inline-block;" placeholder="全部">
						<el-option v-for="tagType of searchParams.tagTypeOptions" :label="tagType.label" :value="tagType.value"></el-option>
					</el-select>
				</div>
				<div class="fn-item" style="float:right;" v-if="tab !== 'platform'">
					<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
				</div>
				<div class="fn-item" style="float:right;" v-if="tab !== 'platform'">
					<span>标签：</span>
					<el-input v-model="searchParams.keyword" placeholder="" style="width:170px;display:inline-block;"></el-input>
				</div>
			</div>
		</div>
		<div class="data-table" id="JS_tag_list">
			<div class="table-content">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr>
								<th class="w40" v-if="tab !== 'platform'"><span><em class="icon" :class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}" @click="selectAll"></em></span></th>
								<th class="w40" v-if="tab !== 'platform'"><span>ID</span></th>
								<th class="w140"><span>标签名称</span></th>
								<th class="w80" v-if="tab === 'platform'"><span>标签类别</span></th>
								<th class="w180" v-if="tab === 'platform'"><span>标签值</span></th>
								<th class="w140" v-if="tab !== 'platform'"><span>操作</span></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="tag in list" :key="tag.tagId">
								<td v-if="tab !== 'platform'"><span><em class="icon" :class="{'icon-select': !tag.checked, 'icon-selected': tag.checked}" @click="selectTag(tag)"></em></span></td>
								<td v-if="tab !== 'platform'"><span>{{tag.tagId}}</span></td>
								<td><span><i class="ellipsis">{{tag.name}}</i></span></td>
								<td v-if="tab == 'platform'"><span>{{getPlatformType(tag.type)}}</span></td>
								<td v-if="tab == 'platform'">
									<span>
										<i v-for="(item, i) in tag.platformTagOptions">{{item.value}}{{i < tag.platformTagOptions.length -1 ? '、' : ''}}</i>
									</span>
								</td>
								<td v-if="tab !== 'platform'">
									<span>
										<b class="operat-link">
											<a href="javascript:void(0)" @click="showView(tag)">查看</a>
											<a href="javascript:void(0)" :class="{'disabled': tag.isUsed === 1}" @click="modify(tag)">修改</a>
											<a href="javascript:void(0)" :class="{'disabled': tag.isUsed === 1}" @click.prevent="deleteTag(tag)">删除</a>
										</b>
									</span>
								</td>
							</tr>
						</tbody>
					</table>
					<p class="no-content" v-if="list.length === 0">无相关查询结果</p>
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
		<el-dialog :title="dialogData.title" v-model="dialogData.dialogVisible" size="tiny">
			<h3>{{dialogData.message}}</h3>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogData.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogHandler">确 定</el-button>
			</span>
		</el-dialog>
		<transition name="fade">
			<div style="z-index:1200;" class="master" v-show="isShowTagDrawer || isShowViewTagDrawer"></div>
		</transition>
		<transition-group name="drawer">
			<tag-drawer key="editDrawer" v-if="isShowTagDrawer" :type="tab" :tagId="tagId"></tag-drawer>
			<view-drawer key="viewDrawer" v-if="isShowViewTagDrawer" :type="tab" :tagId="tagId"></view-drawer>
		</transition-group>
	</div>
</template>
<script>
import Event from 'event';
import CONST from 'help/CONST.js';
import moment from 'moment';
import Http from 'http';
import TagDrawer from './tagDrawer.vue';
import ViewDrawer from './viewTag.vue';
export default {
	name: 'TagList',
	data() {
		return {
			list: [],
			searchParams: {
				keyword: '',
				tagType: 0,
				tagTypeOptions: [{
					label: '全部',
					value: 0
				}]
			},
			tab: 'shop',
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			dialogData: {
				dialogVisible: false,
				body_html: '',
				title: '',
				data: '',
				type: '',
				sureHandler: null
			},
			isShowTagDrawer: false,
			isShowViewTagDrawer: false,
			tagId: 0,
			tagIds: []
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let tag of this.list) {
				if (!tag.checked) {
					isSelect = false;
					break;
				}
			}
			return isSelect;
		}
	},
	watch: {
		isShowTagDrawer: function(val) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		},
		isShowViewTagDrawer: function(val) {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	},
	components: {
		TagDrawer,
		ViewDrawer
	},
	created() {
		this.getList();
	},
	mounted() {
		Event.$off("closeTagDrawer");
		Event.$on("closeTagDrawer", () => {
			this.isShowTagDrawer = false;
			this.tagId = 0;
			this.getList();
		});
		Event.$off('closeViewTagDrawer');
		Event.$on('closeViewTagDrawer', () => {
			this.isShowViewTagDrawer = false;
			this.tagId = 0;
		});
	},
	methods: {
		newTag() {
			this.isShowTagDrawer = true;
		},
		changeTab(type) {
			if (this.tab === type) return;
			this.tab = type;
			this.list = [];
			this.searchParams.keyword = '';
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		getList() {
			let url = '/api/tags';
			let params = {
				keyword: this.searchParams.keyword,
				page: this.page.currentPage,
				number: this.page.pageSize
			};
			if (this.tab === 'platform') {
				url = '/api/platform/tags';
			} else {
				params.type = this.tab === 'shop' ? 1 : 2;
			}
			Http.get(url, {
				params: params
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					for (let item of this.list) {
						this.$set(item, 'checked', false);
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
		search() {
			if (this.page.currentPage === 1) {
				this.getList();
			} else {
				this.page.currentPage = 1;
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		modify(tag) {
			if (tag.isUsed === 1) return false;
			this.tagId = tag.tagId;
			this.isShowTagDrawer = true;
		},
		showView(tag) {
			this.tagId = tag.tagId;
			this.isShowViewTagDrawer = true;
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let tag of this.list) {
				tag.checked = !isAllSelect;
			}
		},
		selectTag(tag) {
			tag.checked = !tag.checked;
		},
		deleteTag(item) {
			if (item.isUsed === 1) return false;
			this.tagIds = [item.tagId];
			this.dialogData.message = '确定删除该标签吗？';
			this.dialogData.sureHandler = this.deleteTagsHandler;
			this.dialogData.dialogVisible = true;
		},
		deleteTags() {
			let tagIds = [];
			let isContainUsed = false;
			for (let tag of this.list) {
				if (tag.checked) {
					if (tag.isUsed === 1) {
						isContainUsed = true;
					}
					tagIds.push(tag.tagId);
				}
			}
			if (tagIds.length === 0) return;
			if (isContainUsed) {
				this.dialogData.message = '已选择' + tagIds.length + '个标签，其中仅“没有被人群引”用的标签才可以删除。请重新选择。';
				this.dialogData.sureHandler = this.closeDialog;
				this.dialogData.dialogVisible = true;
			} else {
				this.tagIds = tagIds;
				this.dialogData.message = '已选择' + tagIds.length + '个标签，确定全部删除吗？';
				this.dialogData.sureHandler = this.deleteTagsHandler;
				this.dialogData.dialogVisible = true;
			}
		},
		deleteTagsHandler() {
			if (this.tagIds.length === 0) return;
			Http.delete('/api/tag', {
				data: {
					tagIds: this.tagIds
				}
			}).then(res => {
				if (res.data.code !== 200 || res.data.iserror !== 0) {
					this.$message({
						type: 'error',
						message: res.data.msg,
						duration: 3000
					});
				} else {
					this.getList();
					this.tagIds = [];
				}
			}).catch(err => {
				console.log(err);
			});
		},
		dialogHandler() {
			this.dialogData.sureHandler();
			this.closeDialog();
		},
		closeDialog() {
			this.dialogData.message = '';
			this.dialogData.sureHandler = null;
			this.dialogData.dialogVisible = false;
			this.tagIds = [];
		},
		getPlatformType(type) {
			if (type === CONST.PLATFORM_TAG_TYPE.BASE) {
				return '基础属性';
			} else if (type === CONST.PLATFORM_TAG_TYPE.SHOP) {
				return '购物偏好';
			} else if (type === CONST.PLATFORM_TAG_TYPE.CUSTOMER) {
				return '客户服务';
			} else {
				return '';
			}
		}
	}
};
</script>