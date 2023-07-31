/*
 * @Author: zzy 790002517@qq.com
 * @Date: 2022-01-21 01:31:22
 * @LastEditors: 时不待我 790002517@qq.com
 * @LastEditTime: 2022-09-18 18:27:28
 */
import { Notification, Button } from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

export default ({
  Vue
}) => {
  //按需引入
  Vue.use(Button);
  Vue.prototype.$notify = Notification;

}