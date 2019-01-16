<template>
	<div  class="drawer">
		<div class="drawer-part">
			<h2 class="part-header">
				<span class="header-text">{{getTitle()}}</span>
				<span class="header-fn"><em @click.prevent="closeDrawer" class="icon icon-close"></em></span>
			</h2>
			<div class="tab" style="margin: 40px 40px 0 40px;padding-top: 40px;">
				<div class="tab-fn">
					<span :class="{'active': tab === 1}" @click="changeTab(1)">购物行为标签</span>
					<span :class="{'active': tab === 2}" @click="changeTab(2)">搜索行为标签</span>
					<span :class="{'active': tab === 3}" @click="changeTab(3)">平台特征标签</span>
				</div>
			</div>
			<div class="part-form" style="width: 950px;margin-top:0;">
				<div class="form-column">
					<div class="query-information">
						<div class="information-fn">
							<div class="fn-item">
								<span>标签：</span>
								<el-input v-model="searchParams.keyword" placeholder="搜索标签" style="width:170px;display:inline-block;"></el-input>
							</div>
							<div class="fn-item">
								<button class="btn btn-blue" type="button" @click.prevent="search">搜索</button>
							</div>
						</div>
					</div>
					<div class="data-table" id="JS_tag_list">
						<div class="table-content">
							<div class="main-table-wapper">
								<table class="table main-table">
									<thead>
										<tr>
											<th class="w40" v-if="tab !== 3">
												<span>
													<em
														class="icon"
														:class="{'icon-select': !isAllSelect, 'icon-selected': isAllSelect}"
														@click="selectAll"
														style="font-size: 18px;margin-left: 15px;"></em>
												</span>
											</th>
											<th class="w140"><span>标签名称</span></th>
											<th class="w240" v-if="tab === 3"><span>标签值</span></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="item in list">
											<td v-if="tab !== 3">
												<span>
													<el-checkbox
														v-model="item.checked"
														:disabled="item.disabled"
														@change="tagChange(item)">
													</el-checkbox>
												</span>
											</td>
											<td><span>{{item.name}}</span></td>
											<td v-if="tab === 3">
												<span style="text-align: left;">
													<el-checkbox
														v-for="pItem in item.platformTagOptions"
														v-model="pItem.checked"
														:disabled="pItem.disabled"
														@change="platformTagChange(item, pItem)">
														{{pItem.value}}
													</el-checkbox>
												</span>
											</td>
										</tr>
									</tbody>
								</table>
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
				<p>已选：{{selectTagLength}}</p>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-blue" type="button" @click.prevent="save">保存</button>
			<button class="btn btn-gray" type="button" @click.prevent="closeDrawer">取消</button>
			<span class="error-message" v-if="selectTagLength > 10">最多只能选择10个标签</span>
		</div>
	</div>
</template>
<script>
import Event from 'event';
import Http from 'http';
import CONST from 'help/CONST.js';
import {copyObj} from 'utils/common';
export default {
	name: 'AddTagDrawer',
	props: ['type', 'andTags', 'orTags', 'notTags'],
	data() {
		return {
			CONST: CONST,
			tab: 1,
			searchParams: {
				keyword: '',
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSize: 20
			},
			list: [],
			selectAndTags: [],
			selectOrTags: [],
			selectNotTags: [],
			selectTags: []
		};
	},
	computed: {
		isAllSelect() {
			let isSelect = true;
			for (let tag of this.list) {
				if (!tag.disabled) {
					if (!tag.checked) {
						isSelect = false;
						break;
					}
				}
			}
			return isSelect;
		},
		selectTagLength() {
			return this.selectAndTags.length + this.selectOrTags.length + this.selectNotTags.length;
		}
	},
	created() {
		this.selectAndTags = copyObj(this.andTags);
		this.selectOrTags = copyObj(this.orTags);
		this.selectNotTags = copyObj(this.notTags);
		this.getList();
	},
	methods: {
		getTitle() {
			if (this.type === CONST.CROWD_TYPE.OR) {
				return '添加包含标签 - 关系为“或者”';
			} else if (this.type === CONST.CROWD_TYPE.AND) {
				return '添加包含标签 - 关系为“并且”';
			} else {
				return '添加排除标签';
			}
		},
		changeTab(type) {
			if (this.tab === type) return;
			this.tab = type;
			this.searchParams.keyword = '';
			this.search();
		},
		getTagIds() {
			let tagIds = [];
			for (let tag of this.tags) {
				tagIds.push(tag.tagId);
			}
			return tagIds;
		},
		search() {
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
			if (this.tab === 3) {
				url = '/api/platform/tags';
			} else {
				params.type = this.tab;
			}
			Http.get(url, {
				params: params
			}).then(res => {
				if (res.data.code === 200 && res.data.iserror === 0) {
					this.list = res.data.data.list;
					this.page.totalCount = res.data.data.totalCount;
					let selectIds = this.getSelectTagIds();
					for (let tag of this.list) {;
						let key = '';
						if (this.tab !== 3) {
							key = 'T_' + tag.tagId;
							this.$set(tag, 'checked', !!selectIds[key]);
							this.$set(tag, 'disabled', tag.checked && selectIds[key] != this.type);
						} else {
							for (let option of tag.platformTagOptions) {
								key = 'PT_' + option.platformTagOptionId;
								this.$set(option, 'checked', !!selectIds[key]);
								this.$set(option, 'disabled', option.checked && selectIds[key] != this.type);
							}
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
		getIds(tags, type, ids) {
			for (let tag of tags) {
				let key = '';
				if (tag.tagId) {
					key = 'T_' + tag.tagId;
					ids[key] = type;
				} else {
					for (let tOption of tag.platformTagOptions) {
						key = 'PT_' + tOption.platformTagOptionId;
						ids[key] = type;
					}
				}
			}
		},
		getSelectTagIds() {
			let ids = [];
			this.getIds(this.selectAndTags, CONST.CROWD_TYPE.AND, ids);
			this.getIds(this.selectOrTags, CONST.CROWD_TYPE.OR, ids);
			this.getIds(this.selectNotTags, CONST.CROWD_TYPE.NOT, ids);
			/*
			for (let tag of this.selectTags) {
				let key = '';
				if (tag.tagId) {
					key = 'T_' + tag.tagId;
					ids.push(key);
				} else {
					for (let tOption of tag.platformTagOptions) {
						if (tOption.checked) {
							key = 'PT_' + tOption.platformTagOptionId;
							ids.push(key);
						}
					}
				}
			}*/
			return ids;
		},
		selectTag(tag) {
			if (tag.checked) {
				let index = -1;
				for (let i = 0; i < this.selectTags.length; i++) {
					let t = this.selectTags[i];
					if (t.tagId === tag.tagId) {
						index = i;
						break;
					}
				}
				if (index > -1 && this.selectTags[index].logicType === this.type) {
					this.selectTags.splice(index, 1);
				}
				// this.$delete(this.selectTags, 'T_' + tag.tagId);
				// this.selectLength--;
			} else {
				let t = copyObj(tag);
				t.logicType = this.type;
				this.selectTags.push(t);
				// this.$set(this.selectTags, 'T_' + tag.tagId, tag);
				// this.selectLength++;
			}
			tag.checked = !tag.checked;
		},
		selectAll() {
			let isAllSelect = this.isAllSelect;
			for (let tag of this.list) {
				if (!tag.disabled) {
					if (tag.checked !== !isAllSelect) {
						tag.checked = !isAllSelect;
						this.tagChange(tag);
					}
				}
			}
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		save() {
			if (this.selectTagLength > 10) {
				return false;
			}
			this.isShowError = false;
			Event.$emit('closeTagDrawer', {
				andTags: this.selectAndTags,
				orTags: this.selectOrTags,
				notTags: this.selectNotTags
			});
		},
		closeDrawer() {
			Event.$emit('closeTagDrawer');
		},
		tagChange(tag) {
			let tags;
			if (this.type === CONST.CROWD_TYPE.AND) {
				tags = this.selectAndTags;
			} else if (this.type === CONST.CROWD_TYPE.OR) {
				tags = this.selectOrTags;
			} else {
				tags = this.selectNotTags;
			}
			if (!tag.checked) {
				let index = -1;
				for (let i = 0; i < tags.length; i++) {
					let t = tags[i];
					if (t.tagId === tag.tagId) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					tags.splice(index, 1);
				}
			} else {
				let t = copyObj(tag);
				tags.push(t);
			}
		},
		platformTagChange(item, pItem) {
			let tags;
			if (this.type === CONST.CROWD_TYPE.AND) {
				tags = this.selectAndTags;
			} else if (this.type === CONST.CROWD_TYPE.OR) {
				tags = this.selectOrTags;
			} else {
				tags = this.selectNotTags;
			}
			//找到该项的索引
			let index = -1;
			for (let i = 0; i < tags.length; i++) {
				let t = tags[i];
				if (t.platformTagId === item.platformTagId) {
					index = i;
					break;
				}
			}
			if (pItem.checked) {
				if (index > -1) {
					tags[index].platformTagOptions.push(pItem);
				} else {
					let newTag = copyObj(item);
					newTag.platformTagOptions = [pItem];
					tags.push(newTag);
				}
			} else {
				let pIndex = -1;
				for (let i = 0; i < tags[index].platformTagOptions.length; i++) {
					if (tags[index].platformTagOptions[i].platformTagOptionId === pItem.platformTagOptionId) {
						pIndex = i;
						break;
					}
				}
				if (pIndex > -1) {
					tags[index].platformTagOptions.splice(pIndex, 1);
					if (tags[index].platformTagOptions.length === 0) {
						tags.splice(index, 1);
					}
				}
			}
		}
	}
};
</script>
