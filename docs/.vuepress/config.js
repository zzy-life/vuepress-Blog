const EncodingPlugin = require("webpack-encoding-plugin");
module.exports = {
    title: "网络弧线", // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
    description: "张志宇(zhangzhiyu)博客网站", // meta 中的描述文字，用于SEO
    dest: "./dist",
    base: "/",
    port: "7777",
    lang: "zh-CN",
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        "/": {
            lang: "zh-CN", // 将会被设置为 <html> 的 lang 属性
            title: "网络弧线",
            description: "张志宇(zhangzhiyu)博客网站",
        },
    },
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        [
            "link",
            {
                rel: "icon",
                href: "/img/logo.png",
            },
        ],
        ["link", { rel: "stylesheet", type: "text/css", href: "https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.6.0/style.css" }],
        ["link", { rel: "stylesheet", type: "text/css", href: "/css-js/heti.min.css" }],
        ["meta", { name: "baidu-site-verification", content: "codeva-ZxscZYe7Ez" }],
        ["meta", { name: "msvalidate.01", content: "6722A0A06EF8813240FF138FAE55ACC6" }],
        ["script", { async: true, crossorigin: "anonymous", src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5887138614491431" }],
        ["script", { src: "https://webarcx-1305513514.cos.ap-shanghai.myqcloud.com/log.js" }],
    ],
    chainWebpack: (config, isServer) => {
        // Thanks to https://github.com/vuejs/vuepress/issues/969#issuecomment-434193517
        // https://stackoverflow.com/a/52121492/4017403
        config.module
            .rule("js") // Find the rule.
            .use("babel-loader") // Find the loader
            .tap((options) =>
                Object.assign(options, {
                    // Modifying options
                    plugins: [
                        [
                            "component",
                            {
                                libraryName: "element-ui",
                                styleLibraryName: "theme-chalk",
                            },
                        ],
                    ],
                })
            ),
            //https://github.com/tcoopman/image-webpack-loader
            config.module
                .rule("images")
                .test(/\.(gif|png|jpe?g||webp)$/i)
                .use("file-loader")
                .loader("image-webpack-loader")
                .options({
                    disable: true,
                    mozjpeg: {
                        progressive: true,
                        disable: true,
                    },
                    // optipng.enabled: false will disable optipng
                    optipng: {
                        enabled: false,
                    },
                    pngquant: {
                        quality: [0.65, 0.9],
                        speed: 4,
                        disable: true,
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    // the webp option will enable WEBP
                    webp: {
                        quality: 75,
                    },
                });
    },

    serviceWorker: true,
    markdown: {
        lineNumbers: true,
        extractHeaders: ["h2", "h3", "h4"], //Markdown 文件的 headers (标题 & 小标题) 修改提取出的标题级别
        extendMarkdown: (md) => {
            md.use(require("markdown-it-disable-url-encode"));
        },
    },
    //你可以监听任何想监听的文件，文件变动将会触发 vuepress 重新构建，并实时更新。
    extraWatchFiles: [
        "./nav.js", // 使用相对路径
        "./sidebar.js",
    ],
    themeConfig: {
        nav: require("./nav.js"),
        sidebar: require("./sidebar.js"),
        sidebarDepth: 2,
        lastUpdated: "上次更新",
        serviceWorker: {
            updatePopup: {
                message: "有新的内容.",
                buttonText: "更新",
            },
        },
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: "https://github.com/zzy-life/vuepress-Blog",
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: "文档源码",
        // 以下为可选的编辑链接选项
        // 假如文档不是放在仓库的根目录下：
        docsDir: "docs",
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: "帮助我改善此页面！",
        //页面滚动效果
        smoothScroll: true,
    },

    plugins: [
        new EncodingPlugin({
            encoding: "UTF-8",
        }),
        "fulltext-search",
        require("./vuepress-plugin-jsonld"),
        "@vuepress/back-to-top",
        "vuepress-plugin-mermaidjs",
        [
            "@vuepress/last-updated",
            {
                transformer: (timestamp, lang) => {
                    return new Date(timestamp).toLocaleDateString();
                },
            },
        ],
        //SEO优化插件
        [
            "sitemap",
            {
                hostname: "https://blog.webarcx.com",
                // 排除无实际内容的页面
                exclude: ["/404.html"],
                dateFormatter: (lastUpdated) => {
                    return new Date(lastUpdated.replace(/[上|下]午/g, "")).toISOString();
                },
            },
        ],
        [
            "autometa",
            {
                site: {
                    name: "网络弧线",
                },
                canonical_base: "https://www.webarcx.com",
            },
        ],
    ],
};
