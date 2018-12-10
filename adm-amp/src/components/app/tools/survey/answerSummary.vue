<template>
		<div class="amp-drawer" style="padding-bottom: 0;">
			<div class="drawer-part">
				<h2 class="part-header"><span class="header-text">回答汇总</span><span class="header-fn"><em
					@click="closeAnswer()" class="icon icon-close"></em></span></h2>
					<div class="answerSummary">
						<div class="answerSummary-content">
							<a :href="noData?getExportUrl+answerId:'javascript:;'" @click='exportExcel'>导出为Excel表格</a>
						</div>
						<div class="table-content" style="width:759px;margin-top: 15px;">
							<table class="table">
								<thead>
									<tr class="media-tr">
										<th style="width:437px"><span>回答内容</span></th>
										<th><span>回答时间</span></th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="dataList.length == 0">
										<td colspan="2" style="text-align: center; height: 30px;line-height: 30px;">{{noDataMessage}}</td>
									</tr>
									<tr class="media-list-tr" v-for='(item,index) in dataList'>
										<td style="text-align:center;padding: 15px;"><span class="answer-content" style="word-break:break-all;text-align:left;overflow: hidden;margin: 0;padding:0;text-overflow: ellipsis;-webkit-line-clamp: 3;-webkit-box-orient: vertical;">{{item.content}}</span><em @click='spread($event)'>展开</em></td>
										<td><span>{{item.createTime | date('yyyy-MM-dd')}}</span></td>
									</tr>
								</tbody>
							</table>
							<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
										   @size-change="pageSizeChange"
										   @current-change="currentPageChange"
										   :current-page="page.currentPage"
										   :page-sizes="page.pageSizes"
										   :page-size="page.pageSize"
										   layout="total, sizes, prev, pager, next"
										   :class="{'el-pagination-reset': true}"
										   :total="page.totalCount">
							</el-pagination>
						</div>
					</div>
			</div>
		</div>
</template>

<script>
	import store from 'store';
	import actions from 'actions';
	import Event from 'event';
	import http from 'utils/http';
	export default {
		name:'app-question-count',
		props:['answerId'],
		data() {
			return {
				dataList: [],
				page: {
			    	totalCount: 0,
			        currentPage: 1,
			        pageSizes: [20, 30, 50],
			        pageSize: 20
			    },
			    open: true,
				noDataMessage: '无相关查询结果',
			    noData: false
			};
		},
		computed: {
			getExportUrl() {
				return $CONFIG['domain'] + '/api/survey/answer/export?surveyQuestionId=';
			}
		},
		methods:{
			exportExcel() {
				if (this.dataList.length == 0) {
					this.$message({
							message: '没有数据不能导出',
							type: 'warning',
							duration: 3000
						});
					this.noData = false;
				} else { 
					this.noData = true;
				}
			},
			closeAnswer(){
				Event.$emit('close-answerSummary');
			},
			pageSizeChange(size){
		        this.page.pageSize = size;
		        this.getList();
		    },
		    currentPageChange(page){
		        this.page.currentPage = page;
		        this.getList();
		    },
		    getList() {
		    	var vm = this;
		    	http.get('/api/survey/answers', {
					params: {
						surveyQuestionId: vm.answerId,
						page: vm.page.currentPage,
						number: vm.page.pageSize
					}
				})
				.then(function(res) {
					if (res.data.code == 200) {
						vm.page.totalCount = res.data.data.totalCount;
						vm.dataList = res.data.data.list[0].report;
						setTimeout(function() {
							vm.conAnswer();
						},0);
					} else {
						vm.dataList = [];
						vm.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		   },
		   conAnswer() {
		   		var oSpan = document.getElementsByClassName('answer-content');
		   		for (var i=0;i<oSpan.length;i++) {
		   			if (oSpan[i].offsetHeight>59) {
		   				console.log(oSpan[i].offsetHeight);
		   				oSpan[i].style.display = '-webkit-box';
		   				oSpan[i].nextSibling.style.display = 'block';
		   				oSpan[i].nextSibling.setAttribute('class','spread-answer-bottom');
		   			} else {
		   				oSpan[i].nextSibling.style.display = 'none';
		   				oSpan[i].style.display = 'inline-block';
		   			}
		   		}
		   },
		   spread(event) {
		   	    var oContent = event.currentTarget.parentNode.getElementsByClassName('answer-content')[0];
		   	    if (oContent.style['display'] == '-webkit-box') {
		   	    	oContent.style.display = 'inline-block';
		   	    	event.currentTarget.innerHTML = '收起';
		   	    	event.currentTarget.className = 'spread-answer-top';
		   	    } else {
		   	    	oContent.style.display = '-webkit-box';
		   	    	event.currentTarget.innerHTML = '展开';
		   	    	event.currentTarget.className = 'spread-answer-bottom';
		   	    }
		   }
		},
		mounted() {
			this.$nextTick(()=>{this.getList()})
		},
		watch: {
			
		}
	};
</script>

<style lang="less">
	.answerSummary{
		text-align: center;
		padding-top:80px;
		padding-left: 120px;
		.answerSummary-content{
			a{
				display: block;
				width:178px;
				height: 50px;
				border: 1px solid #e2e3e7;
				text-align: center;
				line-height: 50px;
				color: #666;
				border-radius: 5px;
			}
			.table-content{
				
			}
		}
	}
	.spread-answer-bottom{
		text-align: left;
		position: relative;
		cursor: pointer;
	}
	.spread-answer-bottom:before {
	    content: '';
	    position: absolute;
	    top: 5px;
	    left: 31px;
	    width: 0;
	    height: 0;
	    border-top: 10px solid #666;
	    border-left: 4px solid transparent;
	    border-right: 4px solid transparent; 
    }
    .spread-answer-top{
		text-align: left;
		position: relative;
		cursor: pointer;
	}
	.spread-answer-top:before {
	    content: '';
	    position: absolute;
	    top: 5px;
	    left: 31px;
	    width: 0;
	    height: 0;
	    border-bottom: 10px solid #666;
	    border-left: 4px solid transparent;
	    border-right: 4px solid transparent; 
    }
</style>