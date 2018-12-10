<template>
    <div class="chart" ref="chart"></div>
</template>
<script>
import Axios from 'utils/http';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
export default{
	name:'app-index-line-chart',
	props: ['lineChartOption'],
	data: function() {
		return {
			lineChartLoading: false,
			echart: null
		};
	},
	mounted() {
		// this.$el.style.width = this.$parent.$el.offsetWidth - 60 + 'px';
		// this.$el.style.height = '300px';
		let vm = this;
		if (vm.echart == null) {
			vm.echart = echarts.init(vm.$el, null, {
				width: this.$parent.$el.offsetWidth - 60 + 'px',
				height: '300px'
			});
		}
		vm.$watch('lineChartOption', function(lineChartOption){
			vm.echart.setOption(lineChartOption);
		}, {deep: true});
		vm.echart.resize();
	}
};
</script>
