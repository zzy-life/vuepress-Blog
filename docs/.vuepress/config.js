const EncodingPlugin = require('webpack-encoding-plugin');
module.exports = {
  title: '博客', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: '张志宇的个人博客网站', // meta 中的描述文字，用于SEO
  dest: './dist',
  base: '/vuepress/',
  port: '7777',
  lang: 'zh-CN',
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', {
      rel: 'icon',
      href: '/img/logo.png'
    }],
    ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.6.0/style.css' }],
    ['link', { rel: 'stylesheet', type: 'text/css', href: '/css-js/heti.min.css' }]

  ],
  chainWebpack: (config, isServer) => {
    // Thanks to https://github.com/vuejs/vuepress/issues/969#issuecomment-434193517
    // https://stackoverflow.com/a/52121492/4017403
    config.module
      .rule('js') // Find the rule.
      .use('babel-loader') // Find the loader
      .tap(options => Object.assign(options, { // Modifying options
        plugins: [
          ["component", {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }]
        ]
      })),
      //https://github.com/tcoopman/image-webpack-loader
    config.module
      .rule('images')
      .test(/\.(gif|png|jpe?g|svg||webp)$/i)
      .use('file-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: {
          progressive: true,
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      })
  },
 
  serviceWorker: true,
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: '博客',
      description: '张志宇的个人博客网站'
    }
  },
  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4'], //Markdown 文件的 headers (标题 & 小标题) 修改提取出的标题级别
    extendMarkdown: md => {
      md.use(require("markdown-it-disable-url-encode"));
    }
  },
  //你可以监听任何想监听的文件，文件变动将会触发 vuepress 重新构建，并实时更新。
  extraWatchFiles: [
    './nav.js', // 使用相对路径
    './sidebar.js'
  ],
  themeConfig: {
    nav: require("./nav.js"),
    sidebar: require("./sidebar.js"),
    sidebarDepth: 2,
    lastUpdated: '上次更新',
    serviceWorker: {
      updatePopup: {
        message: "有新的内容.",
        buttonText: '更新'
      }
    },
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/zzy-life/vuepress-Blog',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '文档源码',
    // 以下为可选的编辑链接选项
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我改善此页面！',
    //页面滚动效果
    smoothScroll: true
  },

  plugins: [
    new EncodingPlugin({
      encoding: 'UTF-8'
    }),
    'fulltext-search', '@vuepress/back-to-top', '@vuepress/last-updated', 'vuepress-plugin-mermaidjs',
    ['meting',
      {
        meting: {
          auto: "https://music.163.com/#/playlist?id=7237352520"
        },
        aplayer: {
          // 歌单为随机
          order: 'random',
          // 0为不显示歌词
          lrcType: 0,
          // 音量
          volume: 0.6,
          // 开启迷你模式
          mini: true,
          // 自动播放
          autoplay: true,
          additionalAudios: [{
            name: '半句再见',
            artist: '孙燕姿',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=ef5a4cc3-bdfa-4bba-b0d0-6fc555f8898c',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=9ea1f460-e399-4441-a6bf-fdf5d5ff3499'
          },
          {
            name: '定风波',
            artist: '谭咏麟',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=96b731cb-9c01-4fe6-b30e-6a28443c680f',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=ad60b313-6b4f-47a8-bb5e-49e0bc75731a'
          }, {
            name: '不想这是场戏',
            artist: '张学友',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=45e3781b-d4c1-40cd-a679-5e25773b521a',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=0bd57931-30b8-460a-a966-e39d21a7c27d'
          }, {
            name: '东风破',
            artist: '周杰伦',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=49e5bf9d-97fb-4433-a8b2-d93bce613ff1',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=06362cc0-2eef-4d27-8110-803e7b5699de'
          }, {
            name: '渐渐',
            artist: '陈奕迅',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=291516e4-2609-4fee-9c72-14db7f940f4e',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=25e6185c-ab12-46b0-93d4-6e5a2e3be399'
          }, {
            name: '晴天',
            artist: '周杰伦',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=0a2f3604-dfd8-4b1e-af74-109ac008207d',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=06362cc0-2eef-4d27-8110-803e7b5699de'
          }, {
            name: '体面',
            artist: '于文文',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=cdb192d5-88e1-432b-89a7-b8d0fa0f99b2',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=0d5761ba-45b8-4a4d-a54b-6584cbdcd823'
          }, {
            name: '无言感激',
            artist: '谭咏麟',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=8a69fb1e-55bf-44b2-bf38-a3bf29481adb',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=d90f0e08-a2cf-4026-8b38-7cf12033fba0'
          }, {
            name: '洋葱',
            artist: '杨千嬅',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=a6c7ed02-eb71-4069-a0af-9ed1def2ab35',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=6d9a5097-9476-4e54-a5ed-978a355426b5'
          }, {
            name: 'Welcome To New York',
            artist: '泰勒·斯威夫特',
            url: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=36f64b7e-570a-4c11-b6b8-f195bcd992f2',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=7e748fbe-bd9f-4486-a894-cbaf8b7df0b7'
          }, {
            name: '夜的第七章',
            artist: '周杰伦',
            url: '/mp3/夜的第七章.mp3',
            cover: 'https://www.zhangzhiyu.live:8900/homeController/downloadFile.do?fileId=06362cc0-2eef-4d27-8110-803e7b5699de'
          },
          ]
        },

      }
    ]
  ],
}