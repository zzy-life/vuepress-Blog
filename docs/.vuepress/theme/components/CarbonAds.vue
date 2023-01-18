<script>
export default {
  name: "CarbonAds",
  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Only reload if the ad has been loaded
        // otherwise it's possible that the script is appended but
        // the ads are not loaded yet. This would result in duplicated ads.
        this.$el.querySelector("#carbonads")
      ) {
        this.$el.innerHTML = "";
        this.load();
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const div = document.createElement("div");
      div.id = "carbonads";
      let carbonPoweredby = "淘宝橱窗";
      var appData = require("./data.json");//引入广告json
      let rand = function (p) { //权重随机算法
        const totalWeight = p.reduce(function (pre, cur, index) {
          cur.startW = pre;
          return (cur.endW = pre + cur.w);
        }, 0);
        let random = Math.ceil(Math.random() * totalWeight);
        let selectPeople = p.find(
          (people) => people.startW < random && people.endW > random
        );
        return selectPeople;
      };
      let data = rand(appData.data)

      div.innerHTML =
        '<span><span class="carbon-wrap"><a href="' +
        data.imghttp +
        '" class="carbon-img" target="_blank" rel="noopener sponsored"><img src="' +
        data.imgsrc +
        '" alt="' +
        carbonPoweredby +
        '" border="0" height="100" width="130" style="max-width: 130px;"></a><a href="' +
        data.imghttp +
        '" class="carbon-text" target="_blank" rel="noopener sponsored">' +
        data.text +
        '</a></span><a href="#" class="carbon-poweredby" target="_blank" rel="noopener sponsored">' +
        carbonPoweredby +
        "</a></span>";
      this.$el.appendChild(div);
    },
  },
  render(h) {
    return h("div", { class: "carbon-ads" });
  },
};
</script>

<style lang="stylus">
.carbon-ads {
  min-height: 102px;
  padding: 1.5rem 1.8rem 0;
  margin-bottom: -0.5rem;
  font-size: 0.75rem;

  a {
    color: #444;
    font-weight: normal;
    display: inline;
  }

  .carbon-img {
    float: left;
    margin-right: 1rem;
    border: 1px solid $borderColor;

    img {
      display: block;
    }
  }

  .carbon-poweredby {
    color: #999;
    display: block;
    margin-top: 0.5em;
  }
}

@media (max-width: $MQMobile) {
  .carbon-ads {
    .carbon-img img {
      width: 100px;
      height: 77px;
    }
  }
}
</style>