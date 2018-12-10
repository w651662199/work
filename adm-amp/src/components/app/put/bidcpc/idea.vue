<template>
  <div>
    <m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
    <m-idea-list ref='data'></m-idea-list>
  </div>
</template>
<script>
import Breadcrumb from '../../../common/breadcrumb.vue';
import unitList from "./idea-list";
import Event from 'event';
export default {
  name: 'app-put-bidcpc-idea-overview',
  data() {
    return {
      id: ''
    };
  },
  components: {
    'm-breadcrumb': Breadcrumb,
    'm-idea-list': unitList
  },
  computed: {
		breadcrumbConfig() {
			let breadcrumbConfig = {
				msg: '创意',
        link: '/#/app/bidcpc/unit/' + this.id,
        showBack: true
			};
			return breadcrumbConfig;
		}
	},
	mounted() {
		Event.$on('sendCampaignId', (id) => {
      this.id = id;
    });
	}
};
</script>
