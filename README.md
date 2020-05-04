# LazyPage

LazyPage make you have easy and lazy front develop, and fully decoupled front-end and back-end development  
LazyPage 让前端开发更简洁，彻底解耦前后端开发  
LazyPage 让多页变单页，让单页变多页，彻底解决多页和单页各自的弊端  
GitHub Pages: [https://github.com/fengshangbin/LazyPage](https://github.com/fengshangbin/LazyPage)

# 现实问题

两种常用开发模式  
1, 前端做静态页面，后端整合成 JSP/CSHTML 等前后端混合代码  
后期维护超麻烦， 前端看不懂后端的代码，后端又很难改前端的代码， 前后端同时维护一份文件时也容易出错。前端测试还得需要后端环境。真是剪不断理还乱。  
2, 前后端分离，前端用 Ajax 请求后端数据  
客户怒，MMP 我花钱做的网站怎么百度搜不到，搜索引擎爬虫很难爬取 Ajax 的数据，网站内容严重缺失  
前端怒，MMP 我一个页头和页尾无法公用，几十个页面一个个改页头页尾？  
如果这时对页面地址有要求如参数不能放在问号后面传递或者不要显示.html 扩展名，就没办法再前后端分离了。

单页 VS 多页  
1, 单页可以在切换视图时使用酷炫的过度动画，但会所有内容放在一个页面会增加开发难度，同时会消耗很多实际没用到的网络流量，如果内容是动态生成的如博客的博文，就很难做单页了。  
2，多页传统模式，但就是不支持页面切换动画。

# 关于 LazyPage

LazyPage 是一个前端框架，帮助前端人员高质量高效率完成前端开发，让后端人员可以彻底远离前端代码可以专心提供数据接口。
主要特点  
1, 支持前后端彻底分离，前端可以自主任意定义页面地址，并且支持搜索引擎爬虫爬取完整网页内容。  
2, 前端采用模板渲染数据的方式，可以简单引用外部模板文件，简化代码，不用写一堆重复代码了。  
3, 模板脚本直接运行 JS 语言，不需要额外再学习一套模板语言。  
4, 支持多页面间的切换动画。  
5, 支持多层级的页面切换。

# 在线示例

[http://lazypage-switch.fengshangbin.com/](http://lazypage-switch.fengshangbin.com/)

# 如何使用

### 1. 渲染数据

静态数据，无外部模板

```
<script type="x-tmpl-lazypage" source="{'name':'Zhangsan','age':20}">
	<p>Hello, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```

注：Lazypage 使用了百度前端模板渲染的 JS  
<%var name="Lisi"%>执行 JS 语句  
<%=name%>输出变量  
更多详情 [http://baidufe.github.io/BaiduTemplate/](http://baidufe.github.io/BaiduTemplate/)

外部数据，外部模板

```
<script type="x-tmpl-lazypage" source="cgi/person.json" src="include/_body.html"></script>
```

### 2. 外部模板文件命名

统一使用下划线开头， 如\_body.html

### 3. 依赖编译

有时 B 模块需要 A 模块的数据，这时 B 模块就依赖 A 模块了, 用 wait 属性表示依赖关系，多个依赖用空格分隔

```
<script type="x-tmpl-lazypage" source="cgi/listA.json" id="blockA">
	<p>list A count:<%=count%></p>
</script>
<script type="x-tmpl-lazypage" source="cgi/listB.json" wait="blockA">
	<p>list B count:<%=count%></p>
	<p>list total count:<%=count+{@blockA.count}%></p>
</script>
```

注：Lazypage 的数据源统一使用 json 格式，使用 {@被依赖模块 ID+引用数据} 来获取被依赖模块的数据

### 4. 请求数据接口参数

```
<script type="x-tmpl-lazypage" source="cgi/person.json" wait="blockA" ajax-type="post" ajax-data="id1=1&id2={&id}&id3={@blockA.count}">
	<p>Hello4, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```

ajax-type 接口访问方式 get/post 默认 get  
ajax-data 接口参数，key=value, &隔开  
{&id}获取当前地址栏参数 id  
{\$0}获取当前地址栏路径参数  
{@blockA.count}获取依赖模块数据

### 5. 关于多层嵌套渲染

<%%> 第二层数据用&替换%, 第三层用&&, 以此类推  
script 第二层用 jscript, 第三层用 jjscript, 以此类推

```
<script type="x-tmpl-lazypage" source="{'name':'Zhangsan1','age':21}">
	<p>Hello1, my name is <%=name%>. I'm <%=age%> years old.</p>
	<jscript type="x-tmpl-lazypage" source="{'name':'Zhangsan2','age':22}">
		<p>Hello2, my name is <&=name&>. I'm <&=age&> years old.</p>
		<jjscript type="x-tmpl-lazypage" source="{'name':'Zhangsan3','age':23}">
			<p>Hello3, my name is <&&=name&&>. I'm <&&=age&&> years old.</p>
		</jjscript>
	</jscript>
</script>
```

### 6. 模板中 JS 脚本规则

1, 因为模板脚本需要同时在后端编译，所以模板脚本不可以有 Dom,Window 的相关操作。  
如<%=window.innerWidth%>是不允许的  
2, 模板脚本中的函数调用，需要在后端注册调用函数所在的脚本文件。  
如 examples 的日期格式化函数 dataFormat，引用了 js/format.js 脚本文件，  
需要同时在后端注册这个脚本文件  
例 java 端代码

```java
String rootPath = context.getRealPath("");
LazyPage.addJsFile(rootPath+"/js/format.js");
```

### 7. 自主任意定义页面地址

在文件命名里.html 前追加-即可隐藏扩展名访问，如 news-.html => http://localhost:8089/news  
在文件命名里+会转换为/访问，如 home+news-.html => http://localhost:8089/home/news  
在文件名里$会转换为可变值访问，如home+news+$-.html => http://localhost:8089/home/news/xxx  
这时模板参数 ajax-data="id={\$0}"会自动转换为 ajax-data="id=xxx"去编译

# 启用页面切换动画

注：如果不需要多页间的切换动画，是不需要引入 lazypage.css 和 lazypage.js 文件的。  
引用 lazypage.css 到页面

```
<link href="/dist/lazypage.css" rel="stylesheet" type="text/css" />
```

引用 lazypage.js 到页面

```
<script src="js/lazypage.js"></script>
```

### 1. 页面和 URL 地址的对应关系(多页切换动画)

把 URL 按/分隔后 应该能逐级找到对应的 dom 元素  
如 news-.html 文件对应的 URL 地址是 域名/news, html 代码里要包含

```
<div class="lazypage in" data-page="news">...</div>
```

css 类 lazypage 代表当前为一个页面单元, 属性 data-page 为该页面单元所对应的 URL 地址  
多层级页面关系  
如 news+2019-.html 文件对应的 URL 地址是 域名/news/2019, html 代码里要包含

```
<div class="lazypage in" data-page="news">
	...
	<div class="lazypage in" data-page="2019">
		...
	</div>
	...
</div>
```

### 2. 默认页面(多页切换动画)

如 \$-.html 文件 代码包含

```
<div class="lazypage default in" data-page="home">...</div>
```

当 URL 地址是 域名/ 或 域名/home 时 都会对应这个页面单元

### 3. 多个同级页面单元(多页切换动画)

如 news+\$-.html

```
<script type="x-tmpl-lazypage">
	<div class="lazypage in" data-page="news">
		...
		<div class="lazypage <%={$0}=="2019"?"in":"out"%>" data-page="2019">2019</div>
		<div class="lazypage <%={$0}=="2018"?"in":"out"%>" data-page="2018">2018</div>
		<div class="lazypage <%={$0}=="2017"?"in":"out"%>" data-page="2017">2017</div>
		...
	</div>
</script>
```

同级页面只能有一个 lazypage 元素是展示状态 CSS 样式 in，其他 lazypage 的 css 样式为 out

### 4. 页面切换动画(多页切换动画)

lazypage.css 内置了 slide、slidevertical、fade、popup 四种切换动画，您也可以自己定义自己需要的动画样式  
lazypage 默认使用 slide 进行页面切换

```
<div class="lazypage" data-page="news" data-animate="slidevertical">...</div>
```

属性 data-animate 为该页面切换时的动画样式

### 5. 页面顺序(多页切换动画)

当页面动态载入时会按照属性 data-sort 的值去插入 dom 结构中  
如 news+2017-.html 代码

```
<div class="lazypage in" data-page="news">
	<div class="lazypage in" data-page="2017" data-sort="7">2017</div>
</div>
```

news+2018-.html 代码

```
<div class="lazypage in" data-page="news">
	<div class="lazypage in" data-page="2018" data-sort="8">2018</div>
</div>
```

news+2019-.html 代码

```
<div class="lazypage in" data-page="news">
	<div class="lazypage in" data-page="2019" data-sort="9">2019</div>
</div>
```

当从 news/2018 跳转到 news/2019 时 dom 结构会变为

```
<div class="lazypage in" data-page="news">
	<div class="lazypage in" data-page="2018" data-sort="8">2018</div>
	<div class="lazypage in" data-page="2019" data-sort="9">2019</div>
</div>
```

而从 news/2018 跳转到 news/2017 时 dom 结构会变为

```
<div class="lazypage in" data-page="news">
	<div class="lazypage in" data-page="2017" data-sort="7">2017</div>
	<div class="lazypage in" data-page="2018" data-sort="8">2018</div>
</div>
```

lazypage 页面切换时，如果目标页面在 dom 中的位置是当前页面的前面，则会进行反转动画 css 类 reverse  
反转动画在一些切换效果中很有用如 slide，在 fade 切换时则无效

### 6. 禁用部分页面切换动画(多页切换动画)

如整站都不需要切换动画，则不需要引入 lazypage.css 和 lazypage.js 文件即可  
如果部分禁用可以在超链接 a 设置属性 data-direct="true"
如果跨域名跳转链接时会自动直接跳转的

```
<a href="/index" data-direct="true">index(direct)</a>
```

a 标签还有一个属性 data-history="true",默认为 true 控制页面切换时是否产生浏览器历史纪录

### 7. 禁用 loading 动画(多页切换动画)

loading 动画默认开启  
关闭

```
<script>
	LazyPage.closeLoading();
</script>
```

开启

```
<script>
	LazyPage.openLoading();
</script>
```

### 8. 开启多页面预加载(多页切换动画)

页面预加载默认关闭  
开启

```
<script>
	LazyPage.openPreLoad(urls); //urls为要预加载url数组，可以不传
</script>
```

开启预加载后 会自动查找 DOM 中的 a 标签的超链接，预加载这些超链接对应的页面

关闭

```
<script>
	LazyPage.closePreLoad();
</script>
```

### 9. 监听页面切换事件(多页切换动画)

lazypage 页面切换会有 5 种事件发出  
PAGE_FIRST_IN: 页面第一次进场  
PAGE_IN_START: 页面开始进场  
PAGE_IN_END: 页面结束进场  
PAGE_OUT_START: 页面开始出场  
PAGE_OUT_END: 页面结束出场

```
<script>
    LazyPage.addEventListener(LazyPage.PageEvent.PAGE_FIRST_IN, function test(event) {
        console.log(event);
    });
</script>
```

5 种事件 event 为相同结构  
event.type: 当前事件类型  
event.data.page 当前事件对应的页面单元  
event.data.animate 页面切换动画类型  
event.data.history 页面切换是否产生浏览器历史纪录  
event.data.isBack 页面切换动画是否反转

### 10. 动态调用页面切换(多页切换动画)

lazypage 页面切换默认在点击超链接 a 标签时触发
也可以通过代码调用触发页面切换

```
<script>
    LazyPage.goto(url,history);
</script>
```

参数:  
url: 跳转目标地址  
history: 是否产生浏览器历史纪录,如没有此参数则默认为 true

### 11. 页面标题(多页切换动画)

如果一个 html 文件中只有唯一一个页面单元时，这个页面单元会自动继承该页面的 title 值，  
如果有多个页面单元时 需要设置每个页面单元的标题 data-title
如 news+\$-.html

```
<script type="x-tmpl-lazypage">
	<div class="lazypage in" data-page="news">
		...
		<div class="lazypage <%={$0}=="2019"?"in":"out"%>" data-page="2019" data-title="2019">2019</div>
		<div class="lazypage <%={$0}=="2018"?"in":"out"%>" data-page="2018" data-title="2018">2018</div>
		<div class="lazypage <%={$0}=="2017"?"in":"out"%>" data-page="2017" data-title="2017">2017</div>
		...
	</div>
</script>
```

# 关于前端测试

### 1. 安装 nodejs 环境

### 2. 安装依赖

lazypage-node

```
npm install --save-dev lazypage-node
```

express

```
npm install --save-dev express
```

### 3. 创建 server.js

```
var express = require('express');
var serverFilter = require('lazypage-node');

var app = express();
app.use(serverFilter.filter('src')); // src为当前项目前端代码目录
app.use(express.static('src'));

app.listen(8181, function() {
  console.log('start lazypage server，访问地址为 http://localhost:8181/');
});
```

### 4. 运行 server.js

cmd 命令

```
node server
```

访问地址为 http://localhost:8181/ 即可

### 5. 整合 webpack(热更新)

参见 [https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-webpack](https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-webpack)

### 6. 整合 gulp(热更新)

参见 [https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-gulp](https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-gulp)

# 后端整合

LazyPage 的后端整合只需简单两部  
1, java 请参见 [https://github.com/fengshangbin/LazyPage-java](https://github.com/fengshangbin/LazyPage-java)  
2, node.js 请参见 [https://github.com/fengshangbin/LazyPage-node.js](https://github.com/fengshangbin/LazyPage-node.js)  
3, c# 敬请期待  
4, 其他欢迎大家共建
