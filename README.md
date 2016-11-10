# Take_out_food_react
一个基于react的外卖项目

## API地址
跟工程项目放在同一文件夹，同级

## 技术栈
项目基于webpack构建，用到的技术有：
- reactjs
- react-router 路由管理
- react-redux 状态树管理
- reqwest 异步请求操作
- ant-design react 组件库
- lodash 工具库 [API文档](http://lodashjs.com/docs/)
- js-cookie 操作cookie的库
- storejs 对localstorge的封装

## 起步

```
    npm install // 下载项目开发依赖包
    npm start // 运行项目
    npm run dist // 打包项目
```

### 工程目录
- cfg 配置文件目录
- dist 打包生成文件目录
- src
    - actions
    - common 公用工具类等
    - components 组件目录
        - Home
            - index.jsx 组件jsx代码
            - index.less 组件样式文件(组件样式文件单独引入)
        - ...
    - images 图片等资源文件
    - reducers
    - stores
    - styles 公用样式文件
- package.json
- server.js node 服务文件
- webpack.config.js webpack配置文件

### 基本配置

#### 关于端口
默认端口7389，如需修改请修改/cfg/default.js -> dfltPort

#### 关于代理

```
    // 文件 /cfg/base.js
    devServer: {
        ...,
        proxy: {
          '/api/*': {
            target: 'http://localhost:7390',
            changeOrigin: false
          }
        }
    }
    // 默认api代理到http://localhost:7390
    target: 代理目标地址
    changeOrigin: 是否开启跨域
```

### 共用组件文档

#### common/utils
一些常用的工具方法
- dom 对DOM节点相关操作
  - css 类似jquery.css
  - addEventListener 添加事件监听，返回移除事件方法
  - getScroll 获取滚动条滚动位置 返回{ top,left }。
  - getOffset 获取dom相对window的偏移量 返回{ top,left } 。
  - scrollTo 滚动到指定位置(position, duration,call）。
  - createElement 根据字符串创建dom
  - contains 判断dom A是否包含B
- throttle 节流方法
- debounce 防抖方法
- Animation Tween动画库

#### ListView
滚动加载列表页

```js
  var data = [
    {id: 1,text:'ITEM 1'},
    {id: 2,text:'ITEM 2'},
    {id: 3,text:'ITEM 3'},
    {id: 4,text:'ITEM 4'},
  ];

  <ListView
    keySet='id'
    dataSource={data}
    offset={100}
    handleLoad={this.onLoad}
    renderChildren={this.renderChildren}
    renderFooter={this.renderFooter}
  >
    <Item/>
  </ListView>
```

| 参数        | 描述           |
| ------------- |:-------------:|
| keySet      | 当没使用renderChildren时必要，循环时会取item[keySet]作文<Item/>的key |
| dataSource      | 必要，要循环的数据      |
| params | load时额外的参数，当params变化是会触发refresh，pageNo回到第一页      |
| offset | 偏移量，当滚动到距离底部多少时触发handleLoad,默认0      |
| handleLoad | 滚动到底部时触发的函数 (params,callback)      |
| renderChildren | 自定义子组件渲染 (dataSource,self)      |
| renderFooter | 自定义Footer渲染 (loading,hasMore,self)      |

## 任务

- [ ] 【业务】支付流程
- [ ] 【业务】订单页
- [ ] 【业务】搜索页
- [ ] 【业务】个人中心页
- [ ] 【业务】商户详情页
- [x] 【业务】登录注册等
- [x] 【业务】首页功能开发
- [x] 【业务】地图选择页开发
- [x] 图片预览功能
- [x] ListView开发
- [x] Img组件开发
- [x] demo页开发
- [x] 工程构建
