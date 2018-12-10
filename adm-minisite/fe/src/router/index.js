import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import routerConfig from '@/config/router.config';

export default new Router({
  //mode: 'history',
  routes: routerConfig
});
