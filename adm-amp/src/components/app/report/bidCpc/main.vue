<template>
  <div>
    <m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
    <router-view></router-view>
  </div>
  <!--
  <div class="amp-content">
    <m-nav :config="navMenu"></m-nav>
    <div class="content-main">
      <div class="amp-account">
        <m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
        <router-view></router-view>
      </div>
    </div>
  </div>-->
</template>
<script>
import Breadcrumb from '../../../common/breadcrumb.vue';
import Nav from '../../../common/nav.vue';

export default {
  name: 'app-report-bidcpc-main-overview',
  data() {
    return {
      breadcrumbConfig: {
        data: [{
          msg: '数据报表',
          link: '/#/app/report/bidCpc'
        }, {
          msg: '广告报表',
          link: '/#' + this.$route.path
        }]
      },
      navMenu: [{
        msg: '广告报表',
        link: '/#/app/report/bidCpc/plan/campaign',
        icon: 'icon-computer',
        checked: true,
        sub: []
      }]
    };
  },
  components: {
    'm-breadcrumb': Breadcrumb,
    'm-nav': Nav,
  }
};
</script>
