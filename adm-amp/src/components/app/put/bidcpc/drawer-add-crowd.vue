<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">选择人群</span><span class="header-fn"><em @click="hide()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form02">
				<div class="amp-bidcpc" >
					<div class="bidcpc-inner">
						<div>
							<span>人群：</span>
							<el-input style="width:170px;display:inline-block;margin-right: 20px;vertical-align: top;" placeholder="输入人群名称" v-model="search.name"></el-input>
							<button type="button" class="btn btn-primary" @click="getCrowdList('search')" style="padding: 0 10px; margin-right: 20px;">查询</button>
							<a @click="newCrowd" href='javascript:void(0)'>新建人群</a>
						</div>
						<div class="addbtn">
							<button class="btn btn-normal" @click="addSelCrowd">添加</button><span><span :class="{'overSelNum':selectList.length>(5 - selRightList.length)}">{{selectList.length}}</span>/{{5 - selRightList.length}}</span>
							<span class='overSelNumTip' v-if="validateMsg.selectLength.isError">{{validateMsg.selectLength.errorMsg}}</span>
						</div>
						<table class="table main-table">
							<thead>
							<tr :class="{actived: isListActived, 'list-header': true}">
								<th style="width:10%"><span><em class="icon icon-select select-all" @click="checkListAll"></em></span></th>
								<th style="width:45%">人群名称</th>
								<th style="width:45%">人群类型</th>
							</tr>
							</thead>
							<div class="bodyBox" :class="{'bodyBox':true,'bodyBoxShaw':list.length > 6}">
								<tbody>
								<tr v-if="list.length == 0">
									<td :colspan="3" style="text-align: center; height: 100px;line-height: 100px;width: 407px;">{{noContentMsg}}</td>
								</tr>
								<tr :class="{actived: item.isActived, 'body-row': true}" v-for="item in list">
									<td class="firstTd"><span><em @click="checkbox(item.crowdId)" :class="'icon icon-select select-' + item.crowdId" ></em></span></td>
									<td class="secTd">{{item.name}}</td>
									<td class="thirdTd">{{item.type == 1 ? '系统推荐' : '标签人群'}}</td>
								</tr>
								</tbody>
							</div>
						</table>
						<!--v-show="Math.floor(page.totalCount/page.pageSize)>0"-->
						<el-pagination
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
				<div class="amp-bidcpc right-bidcpc">
					<div>
						<p class="sel-crowd">已添加人群<span>{{selRightList.length}}/5</span></p>
						<button class="btn btn-normal addbtn" @click="del">删除</button>
						<span class="sel-tip addbtn">竞价价格=单元原出价*（1+人群溢价）</span>
					</div>
					<table class="table main-table">
						<thead>
						<tr :class="{actived: isSelListActived, 'list-header': true}">
							<th style="width:10%"><span><em class="icon icon-select select-all" @click="checkSelAll"></em></span></th>
							<th style="width:45%">人群名称</th>
							<th style="width:45%">溢价</th>
						</tr>
						</thead>
						<tbody>
						<tr v-if="selRightList.length == 0">
							<td :colspan="3" style="text-align: center; height: 100px;line-height: 100px;">{{noContentMsg}}</td>
						</tr>
						<tr :class="{actived: item.isActived, 'body-row': true}" class="body-row" v-for="(item,index) in selRightList">
							<td><span><em @click="checkSelbox(item.crowdId)" :class="'icon icon-select select-' + item.crowdId"></em></span></td>
							<td>{{item.name}}</td>
							<td>
								<input type="text" class="riPrice el-input-inner" v-model="item.premium" value="" :id="'price'+index"
									   @blur="premiumBlurCheck(index)" @input="premiumInputCheck(index)"></input> <em>%</em>
								<!--<el-input class='inputBox' style=""-->
										  <!--v-model="item.premium" @blur="premiumBlurCheck(index)" @change="premiumInputCheck(index)"></el-input>-->
								<!--<em style="line-height: 2.5;">%</em>-->
								<div class="overpremiumTip" v-if="premium[index].isError">{{premium[index].errorMsg}}</div>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div style="margin: 20px 70px">
				<label>通投</label>
				<el-tooltip placement="right" effect="light">
					<div slot="content">
						设置“通投”<br/>
						1.符合人群定向条件人群以原单元出价*（1+人群溢价）参与竞价；<br/>
						2.不符合人群定向条件的人群以原单元出价参与竞价；<br/>
						<br/>
						未设置“通投”<br/>
						1.符合人群定向条件的人群以原单元出价*（1+人群溢价）参与竞价；<br/>
						2.不符合人群定向条件人群，该单元广告不投放。<br/>
					</div>
					<div class="SKUtipicon"><em class="icon icon-doubt"></em></div>
				</el-tooltip>：
					<el-radio-group v-model="generalDelivery">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
			</div>
		</div>



		<!--新建人群-->
		<transition name="drawer" :appear="true">
			<m-drawer v-if="crowdShow"></m-drawer>
		</transition>
		<!--新建人群成功提示-->
		<transition name="drawer" :appear="true">
			<m-drawer-success v-if="crowdSuccessShow"></m-drawer-success>
		</transition>

		<div class="drawer-btn">
			<button class="btn btn-primary" @click="save()">保存</button>
			<button class="btn btn-gray" @click="hide()">取消</button>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import store from 'store';
	import actions from 'actions';
	import {
		copyObj,
		strTrim
	} from 'utils/common';
	import Event from 'event';
	import Http from 'http';
	import CONST from '../../../../help/CONST';
	import drawCrowdPage from '../../tools/dmp/crowdManage/drawer.vue';
	import drawCrowdPageSuccess from '../../tools/dmp/crowdManage/seccessCrowdDrawer.vue';

	export default {
		name: 'app-put-bidcpc-new-add-crowd',
		props:['crowd','isGeneralDelivery'],
		data() {
		    return {
				crowdSuccessShow:false,
				crowdShow:false,
		        validateMsg:{
		            selectLength:{
		                isError:false,
						errorMsg:''
					},
				},
		        search:{
		            name:''
				},
				page: {
					totalCount: 0,
					currentPage: 1,
					pageSizes: [20, 30, 50],
					pageSize: 20
				},
				noContentMsg:'暂无内容',
				generalDelivery: 1,
				list:[],//原有的list
				selRightList:[], //右边已经选择的list
				premium:[
					{isError:false,errorMsg:''},
					{isError:false,errorMsg:''},
					{isError:false,errorMsg:''},
					{isError:false,errorMsg:''},
					{isError:false,errorMsg:''}
				],
				selectList:[]
			}
		},
		created(){
		    this.selRightList = this.crowd.length ? copyObj(this.crowd) : [];
		    this.generalDelivery = this.isGeneralDelivery == undefined ? 1 : this.isGeneralDelivery;
    		this.getCrowdList();
		},
		computed:{
			isListActived(){
				let list = this.list;
				let isActived = list.length > 0;
				for(var item of list){
					if(item.isActived){
						continue;
					}
					isActived = false;
					break;
				}
				return isActived;
			},
			isSelListActived(){
				let list = this.selRightList;
				let isActived = list.length > 0;
				for(var item of list){
					if(item.isActived){
						continue;
					}
					isActived = false;
					break;
				}
				return isActived;
			},
			selectLength(){
			    let list = this.list.filter((item) => { return item.isActived});
			    return list.length;
			},
			config: () => store.state.drawerDmpCtrl
		},
		components:{
		    'm-drawer': drawCrowdPage,
			'm-drawer-success': drawCrowdPageSuccess
		},
		mounted(){
		    //新建人群保存
			Event.$off('crowd-save');
			Event.$on('crowd-save',(data) => {
				this.crowdSave(data.data);
			})
			//新建人群，成功抽屉提示
			Event.$off('crowd-success-template');
			Event.$on('crowd-success-template', (data) => {
			    this.crowdSuccessShow = true;
				actions.controlDmpDrawer(this.$store, {
					show: false,
					type: 'success',
					action: data.data.action,
					config: {}
				});
			});
			//新建人群，成功提示关闭
			Event.$off('success-close');
			Event.$on('success-close',() => {
				this.crowdSuccessShow = false;
				this.crowdShow = false;
				this.getCrowdList();
				actions.controlDmpDrawer(this.$store, {
					show: false,
					type: '',
					action: 'new',
					config: {}
				});
			});
			//关闭新建人群
			Event.$off('unit-close-crowd');
			Event.$on('unit-close-crowd',() => {
			    this.crowdShow = false;
			});

		},
		methods:{
			//溢价
			premiumInputCheck(index){
			    let value = document.getElementById('price'+index).value;
				// 处理非数字 非小数点 的字符
				value = value.replace(/[^0-9\.]+/, "");
				// 处理以小数点开头的字符
				value = value.replace(/^\.+/, "");
				// 处理一个或者多个0开头 的字符
				if (value != 0) {
					value = value.replace(/^0+/, "");
				}
				// 处理不小数点开头但出现多次小数点的字符
				var regObject = value.match(/\.+/g);
				var count = 0;
				if (regObject != null && regObject.length > 0) {
					for (var i = 0; i < regObject.length; i++) {
						count += regObject[i].length;
					}
				}
				if (value.indexOf(".") > 0) {
					if (count > 1) {
						value = value.substring(0, value.indexOf(".") + 1) + value.substring(value.indexOf(".")).replace(/\./g, "");
					}
					value = value.substring(0, value.indexOf(".") + 3);
				}

				document.getElementById('price'+index).value = value;
				this.selRightList[index].premium = Number(value);
			},
			premiumBlurCheck(index){
				let value = this.selRightList[index].premium;
				if(value == ''){
					this.premium[index].isError = true;
					this.premium[index].errorMsg = '请输入溢价';
				}else if(value > 1000){
					this.premium[index].isError = true;
					this.premium[index].errorMsg = '溢价最大不超过1000%';
				}else if(value < 1){
					this.premium[index].isError = true;
					this.premium[index].errorMsg = '溢价最小不小于1%';
				}else {
					this.premium[index].isError = false;
					this.premium[index].errorMsg = '';
				}
			},
		    //新建人群保存
			crowdSave(data) {
				let tagIds = [];
				data.list.forEach((item) => {
					tagIds.push(item.tagId);
				});
				Http.post('/api/crowd',{
					name:data.name,
					type:2,
					tagIds:tagIds
				}).then((res) => {
					if(res.data.iserror == 0){
						Event.$emit('crowd-success-template',{data:{action:'new'}});
					} else if (res.data.code >= 500) {
						this.$message({
							message: '服务器异常，请稍后再试。',
							type: 'error',
							duration: 3000
						});
					} else {
						this.$message({
							message: '操作失败，请检查网络设置或稍后再试。',
							type: 'error'
						});
					}
				})
			},
			newCrowd(){
			    this.crowdShow = true;
				actions.controlDmpDrawer(this.$store, {
					show: true,
					action: 'new',
					type: 'template',
					config: CONST.DRAWDMP
				});

			},
			del(){
			    let list = copyObj(this.selRightList);
			    let UnSelect = [];
			    list.forEach((item) => {
			        if(!item.isActived){
			            UnSelect.push(item)
					}
				});
			    this.selRightList = UnSelect;
			},
			checkSelAll(){
				let list = this.selRightList;
				let isActived = this.isSelListActived;
				console.log(isActived);
				for(var item of list){
					item.isActived = !isActived;
				}
			},
			checkSelbox(id){
			    console.log(id);
				let list = this.selRightList;
				let crowdId = id;
				for(var item of list){
					if(item.crowdId == crowdId){
						item.isActived = !item.isActived;
					}
				}
			},
			addSelCrowd(){
				let list = copyObj(this.list);
			    let unSeletc = [];
			    let unSelList = [];
			    if(this.selRightList.length == 5) {
					this.validateMsg.selectLength.isError = true;
					this.validateMsg.selectLength.errorMsg = '最多只能添加5个人群，已为您添加前5个';
					return false;
				};
				this.validateMsg.selectLength.isError = false;
				this.validateMsg.selectLength.errorMsg = '';
			    for(let i = 0; i < this.selectList.length; i++){
					if(!this.getSelFilterList(this.selRightList,this.selectList[i].crowdId) && this.selRightList.length < 5 ){
						this.selectList[i].isActived = false;
						this.selectList[i].premium = 10;
						this.selRightList.push(this.selectList[i]);
					}else{
						this.validateMsg.selectLength.isError = true;
						this.validateMsg.selectLength.errorMsg = '最多只能添加5个人群，已为您添加前5个';
					}
				}
				this.selectList.forEach((item) => {
					if(!this.getSelFilterList(this.selRightList,item.crowdId)){
						unSelList.push(item);
					}
				})
				this.selectList = copyObj(unSelList);
				list.forEach((item) => {
					if(!this.getSelFilterList(this.selRightList,item.crowdId)) {
						unSeletc.push(item);
					}
				})
				this.list = unSeletc;
			},
			checkListAll() {
				let list = this.list;
				let isActived = this.isListActived;
				for(var item of list){
					item.isActived = !isActived;
				}
				this.getSelectList();
			},
			checkbox(id){
				let list = this.list;
				let crowdId = id;
				for(var item of list){
					if(item.crowdId == crowdId){
						item.isActived = !item.isActived;
					}
				}
				this.getSelectList();
			},
			getSelectList(){
				this.list.forEach((item) => {
				    if(item.isActived && !this.getSelFilterList(this.selectList,item.crowdId)){
				        this.selectList.push(item);
					}else if (!item.isActived && this.getSelFilterList(this.selectList,item.crowdId)){
				        let i = -1;
				        this.selectList.forEach((items,index) => {
				            if(items.crowdId == item.crowdId){
				                i = index
							}
						})
				        this.selectList.splice(i,1);
					}
				})
			},
			save(){
			    let isError = false;
			    for (let i = 0; i < this.premium.length; i++) {
			        if(this.premium[i].isError){
			            isError = true;
					}
				}
				if(isError) return false;

				Event.$emit('drawer-save-add-crowd',this.selRightList, this.generalDelivery);
	        },
		    hide(){
		        console.log('取消');
				Event.$emit('drawer-hide-add-crowd');
			},
			pageSizeChange(size) {
				this.page.pageSize = size;
				this.getCrowdList();
			},
			currentPageChange(page) {
				this.page.currentPage = page;
				this.getCrowdList();
			},
			getCrowdList(obj) {
				let search = this.search;
				let selList = copyObj(this.selectList);
				let selRightList = copyObj(this.selRightList);
				Http.get('/api/crowds', {
					params: {
						type:0,
						status:3,
						keyword: search.name,
						page: this.page.currentPage,
						number: this.page.pageSize
					}
				}).then((res) => {
					this.list = [];
					if (res.status === 200 && res.data.code === 200 && res.data.iserror === 0) {
						res.data.data.list.forEach((item,index) => {
							let obj = {};
							obj.crowdId = item.crowdId;
							obj.name = item.name;
							obj.type = item.type;
							obj.isActived = this.getSelFilterList(selList,item.crowdId);
							if(!this.getSelFilterList(selRightList,item.crowdId)){
								this.list.push(obj);
							}
						})
						if(this.list.length == 0 && obj =='search'){
							this.noContentMsg = '无查询结果';
						}
						this.page.totalCount = res.data.data.totalCount;
					} else if (res.data.code >= 500) {
						this.list = [];
						this.noContentMsg = '服务器异常，请稍后再试。';
					} else {
						this.list = [];
						this.noContentMsg = '加载内容失败，请检查网络或刷新当前页面';
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			getSelFilterList(arrList,id) {
			   let isHave = false;
			   let arr = [];
			   arrList.forEach((item) => {
			       arr.push(item.crowdId)
			   });
			   return arr.indexOf(id) > -1  //true => 有
			}
		}
	}
</script>
<style lang="less" scoped>
	.table .body-row.actived{
		background: #f2faff;
	}
	.inputBox{
		width: 100px; float: left; margin-left: 40px; margin-right: -20px; padding: 5px 0;
		input{
			height: 25px;
		}
	}
	.riPrice{
		width: 100px;
		display: inline-block;
		vertical-align: middle;
		overflow: hidden;
		position: relative;
		padding: 10px 10px;
		height: 36px;
		line-height: 36px;
		border: 1px solid #e1e3e5;
		background: #fff;
		border-radius: 4px;
		box-sizing: border-box;
		color: #000;
	}
	.bidcpc-inner{
		.bodyBoxShaw{
			border-bottom: 1px solid #e1e3e6;
		}
		.bodyBox{
			display: block;
			width: 415px;
			height: 280px;
			overflow: auto;
			tr .firstTd{
				width: 40px;
			}
			tr .secTd{
				width: 184px;
			}
			tr .thirdTd{
				width: 182px;
			}

		}
	}
	.overpremiumTip{
		color:#d30312;
		font-size: 12px;
		text-align: left;
		margin-left: 35px;
	}
	.right-bidcpc {
		box-shadow: -2px 0 3px #c0ccda;
		.table td{
			height:60px;
		}
	}
	.sel-crowd{
		span:first-child{
			margin-left: 10px;
		}
	}
	.overSelNum{
		color:#d30312
	}
	.addbtn{
		margin: 25px 0 15px 0;
		span:first-child{
			margin-left: 10px;
		}
		.overSelNumTip{
			color:#d30312;
			font-size: 12px;
		}
	}
	.amp-form{
		overflow: hidden;
		border: 1px solid #e1e3e6;
		margin: 60px 70px 0;
		height: 550px;
		padding:0;
	    .amp-bidcpc{
			width: 50%;
			height: 550px;
			overflow: auto;
			float:left;
			padding: 20px;
            table .body-row{
				text-align: center;
			}
			.sel-crowd{
				height: 37px;
				line-height: 37px;
			}
			.sel-tip{
				color:#89919c;
				height: 34px;
				line-height: 34px;
				float: right;
			}
		}
		.amp-bidcpc:last-child{
			/*box-shadow:*/
		}
	}
</style>
