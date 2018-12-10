<template>
	<div>
		<transition name="fade">
			<div style="z-index:1300;" class="master" v-if="showPreview"></div>
		</transition>
		<transition name="fade">
			<div class="dialog-pop" v-if="showPreview">
				<div class="pop-header">
					<span class="header-close" @click="closeDialogHandler" id="header-close-position"><em class="icon icon-close"></em></span>
					<iframe width="320" height="600" frameborder="0" id="J_preview_iframe"></iframe>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import Event from 'event';
import http from 'utils/http.js';
import store from 'store';
export default {
	name: 'app-page-preview',
	data() {
		return {
			data: {},
			webpageId: ''
		};
	},
	props: ['showPreview', 'pageId', 'previewId', 'isTemplate'],
	computed: {
		drawerType: () => store.state.drawerCtrl.type
	},
	created() {
		this.webpageId = this.pageId;
		this.getList();
	},
	methods: {
		closeDialogHandler() {
			Event.$emit('close-preview');
		},
		getList(){
			let that = this;
			http.get('/api/webpage/preview?webpageId=' + that.webpageId).then((res) => {
				if (res.data.code === 200) {
					that.data = res.data.data;
					if (this.isTemplate) {
						const Emoji = require('../../../common/Editor/modules/emoji/emoji.js');
						if (/\[|\]/g.test(that.data.html)) {
							Emoji.default.forEach((emoji) => {
								let name = emoji.name.substring(1, emoji.name.length - 1);
								that.data.html = that.data.html.replace(new RegExp('\\[' + name + '\\]', 'g'), '<img style="width: 20px;height:20px;" src="' + emoji.icon + '">');
							});
						}
					}
					document.getElementById('J_preview_iframe').contentWindow.document.write(that.data.html);
				} else {
					that.$message({
						message: '获取数据失败，请检查网络设置或稍后再试',
						type: 'error',
						duration: 3000
					});
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	},
	watch: {
		pageId: function(val, oldVal) {
			this.webpageId = val;
		}
	}
};
</script>
<style scoped>
.dialog-pop {
	position: fixed;
	left: 50%;
	top: 0;
	z-index: 1400;
	margin-left: -280px;
	width: 360px;
	height: 640px;
	margin-top: 0px;
	background: #fff;
	border-radius: 10px;
}

#header-close-position {
	right: 6px;
	top: 3px;
}

</style>
