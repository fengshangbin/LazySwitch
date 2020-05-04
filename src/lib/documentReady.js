var _ready = require('./ready.js');

var ready = new _ready();
var timer;

var bindReady = function (evt) {
	ready.trigger();
	if (document.removeEventListener) {
		document.removeEventListener("DOMContentLoaded", bindReady, false);
	} else if (document.attachEvent) {
		document.detachEvent("onreadystatechange", bindReady);
		if (window == window.top) {
			clearInterval(timer); //事件发生后清除定时器
			timer = null;
		}
	}
};

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", bindReady, false);
} else if (document.attachEvent) { //非最顶级父窗口
	document.attachEvent("onreadystatechange", function () {
		if ((/loaded|complete/).test(document.readyState))
			bindReady();
	});
	if (window == window.top){//在应用有frameset或者iframe的页面时，parent是父窗口，top是最顶级父窗口（有的窗口中套了好几层frameset或者iframe)
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');//在IE下用能否执行doScroll判断 dom是否加载完毕
			} catch (e) {
				return;
			}
			bindReady();
		}, 5);
	}
}

module.exports = ready.bind;