# LazyPage-switch

LazyPage-switch 让多页也可以像单页一样做页面切换动画  
GitHub Pages: [https://github.com/fengshangbin/LazyPage-switch](https://github.com/fengshangbin/LazyPage-switch)

# 关于 LazyPage

参见 https://github.com/fengshangbin/LazyPage

# 现实问题

单页 VS 多页  
1, 单页可以在切换视图时使用酷炫的过度动画，但会所有内容放在一个页面会增加开发难度，同时会消耗很多实际没用到的网络流量，如果内容是动态生成的如博客的博文，就很难做单页了。  
2，多页传统模式，但就是不支持页面切换动画。

# 关于 LazyPage-switch

LazyPage 是一个 js 插件，实现页面切换的各种动画。
主要特点  
1, 支持多页面间的切换动画。  
2, 支持多层级的页面切换。

# 在线示例

[http://lazypage-switch.fengshangbin.com/](http://lazypage-switch.fengshangbin.com/)

# 如何使用

### 1. 引入 LazyPage-switch

引用 lazypage-switch.css 到页面

```
<link href="/css/lazypage-switch.css" rel="stylesheet" type="text/css" />
```

引用 lazypage-switch.js 到页面

```
<script src="js/lazypage-switch.js"></script>
```

### 2. 页面和 URL 地址的对应关系

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

### 3. 默认页面

如 \$-.html 文件 代码包含

```
<div class="lazypage default in" data-page="home">...</div>
```

当 URL 地址是 域名/ 或 域名/home 时 都会对应这个页面单元

### 3. 多个同级页面单元

如 news+\$-.html

```
<div class="lazypage in" data-page="news">
	...
	<div class="lazypage in" data-page="2019">2019</div>
	<div class="lazypage out" data-page="2018">2018</div>
	<div class="lazypage out" data-page="2017">2017</div>
	...
</div>
```

同级页面只能有一个 lazypage 元素是展示状态 CSS 样式 in，其他 lazypage 的 css 样式为 out

### 4. 页面切换动画

lazypage.css 内置了 slide、slidevertical、fade、popup 四种切换动画，您也可以自己定义自己需要的动画样式  
lazypage 默认使用 slide 进行页面切换

```
<div class="lazypage" data-page="news" data-animate="slidevertical">...</div>
```

属性 data-animate 为该页面切换时的动画样式

### 5. 页面顺序

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

### 6. 禁用部分页面切换动画

在超链接 a 设置属性 data-direct="true"
如果跨域名跳转链接时会自动直接跳转的

```
<a href="/index" data-direct="true">index(direct)</a>
```

a 标签还有一个属性 data-history="true",默认为 true 控制页面切换时是否产生浏览器历史纪录

### 7. 禁用 loading 动画

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

### 8. 开启多页面预加载

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

### 9. 监听页面切换事件

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

### 10. 动态调用页面切换

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

### 11. 页面标题

如果一个 html 文件中只有唯一一个页面单元时，这个页面单元会自动继承该页面的 title 值，  
如果有多个页面单元时 需要设置每个页面单元的标题 data-title
如 news+\$-.html

```
<div class="lazypage in" data-page="news">
	...
	<div class="lazypage in" data-page="2019" data-title="2019">2019</div>
	<div class="lazypage out" data-page="2018" data-title="2018">2018</div>
	<div class="lazypage out" data-page="2017" data-title="2017">2017</div>
	...
</div>
```
