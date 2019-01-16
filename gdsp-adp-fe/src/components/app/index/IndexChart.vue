<template>
    <div class="chart"></div>
</template>
<script>
import Axios from 'utils/http';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
export default{
	name:'app-index-line-chart',
	props: ['lineChartOption'],
	data: function() {
		return {
			lineChartLoading: false,
			echart: null
		};
	},
	mounted: function() {
		let vm = this;
		if (vm.echart == null) {
			vm.echart = echarts.init(vm.$el);
		}
	},
	watch: {
		lineChartOption: {
			handler: function(val, oldVal) {
				this.echart.setOption(val);
			},
			deep: true
		}
	}
};
</script>
<style>
    .chart {
        width: 1100px;
        height: 396px;
    }
</style>
