/*
 * @Author: zzy 790002517@qq.com
 * @Date: 2022-01-21 01:31:22
 * @LastEditors: 时不待我 790002517@qq.com
 * @LastEditTime: 2022-09-18 18:27:28
 */
import Router from 'vue-router'
import { Notification, Button } from 'element-ui';
import PrimeVue from 'primevue/config';
import Card from 'primevue/card';
import 'element-ui/lib/theme-chalk/index.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
export default ({
  router,
  Vue
}) => {
  //按需引入
  Vue.use(PrimeVue);
  Vue.use(Button);
  Vue.use(router);
  Vue.component('Card', Card);
  Vue.prototype.$notify = Notification;



  function decode(str) {
    try {

      return decodeURIComponent(str)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
      }
    }
    return str
  }

  const VueRouterMatch = Router.prototype.match
  Router.prototype.match = function match(raw, currentRoute, redirectedFrom) {
    if (typeof raw === 'string') {
      raw = decode(raw)
    }
    return VueRouterMatch.call(this, raw, currentRoute, redirectedFrom)
  }

}