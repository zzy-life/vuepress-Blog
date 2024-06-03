<template></template>

<script>
export default {
  created() {
    if (typeof this.$ssrContext !== "undefined") {
      this.$ssrContext.userHeadTags += 
      `<script type='application/ld+json'>
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${this.$page.title}",
            "url": "${'https://blog.webarcx.com' + this.$page.path}",
            "image": [
              "https://www.webarcx.com/HomePage/favicon.ico"
              ],
            "datePublished": "${this.$page.frontmatter.date && (new Date(this.$page.frontmatter.date)).toISOString()}",
            "dateModified": "${this.$page.lastUpdated && (new Date(this.$page.lastUpdated)).toISOString()}",
            "author": [{
                "@type": "Person",
                "name": "网络弧线",
                "url": "https://www.webarcx.com/HomePage/favicon.ico"
            }]
          }
      <\/script>`;
    }
  }
};
</script>
