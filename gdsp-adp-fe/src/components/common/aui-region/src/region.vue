<template>
	<div class="aui-region">
		<div class="aui-region-header">
			<div class="aui-region-header-lenged" @click="selectAll">
				<em class="icon" :class="{'icon-select': !isAllSelected, 'icon-selected': isAllSelected}"></em><span>全选</span>
			</div>
			<div class="aui-shcedule-legend aui-right">
				<span class="aui-schedule-header-item">已选：{{selectedCount}}</span>
			</div>
		</div>
		<div class="aui-region-body">
			<div class="aui-region-detail aui-region-province">
				<ul class="aui-region-list">
					<li v-for="(province, index) in regions" @click="changeCities(index)" class="aui-region-check-item">
						<em class="icon" :class="getProClass(province)" @click="selectProvince(province)"></em><span>{{province.name}}</span>
					</li>
				</ul>
			</div>
			<div class="aui-region-detail aui-region-city">
				<ul class="aui-region-list">
					<li v-for="(city, index) in cities">
						<label @click="selectCity(city)" class="aui-region-check-item">
							<em class="icon" :class="{'icon-select': !city.checked, 'icon-selected': city.checked}"></em>{{city.name}}
						</label>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import AREA_DATA from './region.js';
export default {
	name: 'AuiRegion',
	props: {
		value: {
			required: true,
			type: Array
		}
	},
	data() {
		return {
			regions: [],
			cities: [],
			selectedCount: 0
		};
	},
	computed: {
		isAllSelected() {
			let isAllSelected = true;
			for (let province of this.regions) {
				let isPAllSelected = true;
				for (let city of province.city) {
					if (!city.checked) {
						isAllSelected = false;
						return isAllSelected;
					}
				}
			}
			return isAllSelected;
		},
		selected() {
			let regions = [];
			for (let province of this.regions) {
				for (let city of province.city) {
					if (city.checked) {
						regions.push(city.zip);
					}
				}
			}
			return regions;
		}
	},
	created() {
		this.selectedCount = this.value.length;
		this.initRegionData();
	},
	methods: {
		initRegionData() {
			for (let i = 0; i < AREA_DATA.length; i++) {
				let province = AREA_DATA[i];
				let p = {
					name: province.name,
					zip: province.zip,
					checked: false,
					city: []
				};
				for (let j = 0; j < province.city.length; j++) {
					let city = province.city[j];
					let c = {name: city.name, zip: city.zip, checked: this.value.indexOf(city.zip) > -1};
					p.city.push(c);
				}
				this.regions.push(p);
			}
		},
		changeCities(pIndex) {
			this.cities = this.regions[pIndex].city;
		},
		selectCity(city) {
			city.checked = !city.checked;
			this.updateValue();
		},
		getProClass(province) {
			let isSelected = true;
			let isIndeterminate = false;
			for (let city of province.city) {
				if (!city.checked) {
					isSelected = false;
				} else {
					isIndeterminate = true;
				}
			}
			if (isSelected) {
				return 'icon-selected';
			} else {
				if (isIndeterminate) {
					return 'icon-indeterminate';
				} else {
					return 'icon-select';
				}
			}
		},
		checkProvince(province) {
			let isSelected = true;
			for (let city of province.city) {
				if (!city.checked) {
					isSelected = false;
					break;
				}
			}
			province.checked = isSelected;
			return isSelected;
		},
		selectProvince(province) {
			let isSelected = province.checked;
			for (let city of province.city) {
				city.checked = !isSelected;
			}
			province.checked = !isSelected;
			this.updateValue();
		},
		updateValue() {
			let regions = [];
			for (let province of this.regions) {
				for (let city of province.city) {
					if (city.checked) {
						regions.push(city.zip);
					}
				}
			}
			this.selectedCount = regions.length;
			this.$emit('input', regions);
		},
		selectAll() {
			let isSelected = this.isAllSelected;
			for (let province of this.regions) {
				for (let city of province.city) {
					city.checked = !isSelected;
				}
			}
			this.updateValue();
		}
	}
};
</script>
<style lang="less">
@import './region.less';
</style>