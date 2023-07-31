# vscode插件大全，最完美配置vscode教程



## 代码美化

- Beautify: 一个用于美化代码的插件，支持多种语言格式化。
- Prettier - Code formatter: 一款代码格式化工具，支持大多数语言，并提供多种格式化配置选项。

## 代码提示

- python snippets: 为Python语言提供代码片段。
- Reactjs code snippets: 为 ReactJS 提供常用代码片段。
- Vue 3 Snippets: 为 Vue 3 提供常用代码片段。
- Vue VSCode Snippets: 为 Vue 2 提供常用代码片段。
- wechat-snippet: 为微信小程序提供代码片段。
- GitHub Copilot Nightly: 由 GitHub 开发的 AI 代码助手，提供代码自动生成功能。

  ![image-20230420082555231](image/image-20230420082555231.png)

## 代码检查

- ESLint: JavaScript 代码检查工具。

- Pylance: Microsoft 出品的 Python 语言服务器，支持代码补全、类型检查等。

- Error Lens: 在代码中直接显示错误和警告信息。

  ![image-20230420083341669](image/image-20230420083341669.png)

- koroFileHeader: 为代码文件添加头部注释。

  ![koroFileHeader](image/koroFileHeader.gif)

- Search node_modules: 快速查找项目中的 node_modules 目录。

  ![Search node_modules](image/Searchnode_modules.gif)

  

## 文件操作

- Auto Rename Tag: 自动重命名 HTML/XML 标签的插件。

  ![GIF 2023-4-20 8-20-50](image/AutoRenameTag.gif)

- file-jump: 快速跳转到工作区内的文件。

  ![file-jump](image/file-jump.gif)

- SFTP: 支持 SFTP 和 FTPS 协议的文件传输工具。

  ```json
  {
      "host": "",    //ip 
      "port": 22,    //端口
      "username": "", //服务器账号
      "password": "",//服务器密码
      "protocol": "sftp", 
      "agent": null,  
      "privateKeyPath": null,
      "passphrase": null,
      "passive": false,
      "interactiveAuth": false,
      "remotePath": "/www/wwwroot/vuepress/dist", //需要同步的服务器文档位置 
      "context": "c:/Users/zzy19/Desktop/md/press/dist",        //本地位置
      
      "uploadOnSave": true,  
      "syncMode": "update",
      "watcher": {           
          "files": false,    
          "autoUpload": false,
          "autoDelete": false
      },
      "ignore": [           
          "**/.vscode/**",
          "**/.git/**",
          "**/.DS_Store"
      ]
  }
  ```
  
  SFTP使用
  
  首先使用快捷键ctrl +shift+p 调出配置 选择Sftp会自动生成配置文件，自己填写好账号密码以及其他配置信息就可以
  
  ![202102252148227](image/202102252148227.png)
  
  ![20191011155949742](image/20191011155949742.png)
  
  

## 前端开发

- CSS Navigation: 快速浏览 CSS 样式。

  ![image-20230420082646367](image/image-20230420082646367.png)

- Live Sass Compiler: 实时编译 Sass/SCSS 文件。

  ![image-20230420082748625](image/image-20230420082748625.png)

  

- Live Server: 实时预览 Web 页面。

  ![image-20230420082819347](image/image-20230420082819347.png)

  ![image-20230420082835527](image/image-20230420082835527.png)

- Markdown All in One: 提供 Markdown 编辑支持，包括预览、自动补全等功能。

- Markdown Preview Github Styling: 为 Markdown 预览提供 Github 风格。

- Markdown Preview Mermaid Support: 为 Markdown 预览提供 Mermaid 图表支持。

- Vetur: 为 Vue 2/3 提供编辑支持。

- vue-helper: 为 Vue 2 提供代码提示和自动补全。

- WXML - Language Service: 为小程序 WXML 提供代码提示和自动补全。

## 代码截图

- CodeSnap: 通过代码生成漂亮的图片和 SVG。

  ![image-20230420082933557](image/image-20230420082933557.png)

## 其他

- Image preview: 支持预览多种图片格式。

  ![Image preview](image/Imagepreview.gif)

- Jupyter: vscode的python扩展。

- Jupyter Keymap: vscode的python扩展，为 Jupyter Notebook 提供快捷键支持。

- Path Intellisense: 路径智能提示。

  ![image-20230420083205954](image/image-20230420083205954.png)

- Python: 支持 Python 语言的开发环境。

- Prettier - Code formatter: 一款代码格式化工具，支持大多数语言，并提供多种格式化配置选项。

  

## 微信小程序开发

- wechat-snippet: 提供微信小程序的代码片段。
- WXML - Language Service: 为小程序 WXML 提供代码提示和自动补全。

## 插件配置

```json
{
    "explorer.confirmDragAndDrop": false,
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "[javascript]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "files.associations": {
        "*.cjson": "jsonc",
        "*.wxss": "css",
        "*.wxs": "javascript",
        "*.js": "javascriptreact",
        "*.vue": "vue"
    },
    "emmet.includeLanguages": {
        "wxml": "html",

    },
    "minapp-vscode.disableAutoConfig": true,
    "[json]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },

    "emmet.triggerExpansionOnTab": true,
    "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
    "[markdown]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },

    "fileheader.cursorMode": {

        "description": "",
        "param": "",
        "return": ""
    },
    "fileheader.customMade": {
        "moveCursor": true, // 移动光标到`Description :`所在行
        "Author": "git config user.name && git config user.email", // 同时获取用户名与邮箱
        "Date": "Do not edit", // 文件创建时间(不变)
        // 文件最后编辑者
        "LastEditors": "git config user.name && git config user.email", 
        "LastEditTime": "Do not edit", // 文件最后编辑时间
      },
      "fileheader.configObj": {
        "prohibitAutoAdd": [ "json", "md" ], // 禁止.json .md文件，自动添加头部注释
        "wideSame": false, // 设置为true开启
   "wideNum": 13 // 字段长度 默认为13
    },
    "github.copilot.enable": {
        "*": true,
        "yaml": false,
        "plaintext": false,
        "markdown": false,
        "vue": true
    },
    "github.copilot.advanced": {
    },
    "editor.inlineSuggest.enabled": true,
    "redhat.telemetry.enabled": true,
    "auto-rename-tag.activationOnLanguage": [

        "*"
    ],
    "[css]": {
        "editor.defaultFormatter": "vscode.css-language-features"
    },
    "editor.unicodeHighlight.ambiguousCharacters": false,
    "search.exclude": {
        "**/dist": true
    },
    "vetur.completion.scaffoldSnippetSources": {


        "workspace": "💼",
        "user": "🗒️",
        "vetur": "✌"
    },
   
  "vetur.format.defaultFormatter.less":"prettier",
  "vetur.format.defaultFormatter.css":"prettier",
  "vetur.format.defaultFormatter.scss":"prettier",
    "codesnap.containerPadding": "0",
    "codesnap.transparentBackground": true,
    "typescript.locale": "zh-CN"
}
```

