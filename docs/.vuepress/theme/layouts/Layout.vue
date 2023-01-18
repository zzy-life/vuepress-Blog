<!--
 * @Author: 时不待我 790002517@qq.com
 * @Date: 2022-02-19 15:14:23
 * @LastEditors: 时不待我 790002517@qq.com
 * @LastEditTime: 2022-09-18 12:01:20
-->

<template>
  <ParentLayout>
    <template #sidebar-top>
      <CarbonAds />
    </template>

  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from '@theme/components/CarbonAds.vue'
export default {
  name: 'Layout',

  components: {
    ParentLayout,
    CarbonAds,
  }
}
</script>
