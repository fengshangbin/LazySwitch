/*!
 *  lazypage.js 
 *  by fengshangbin 2019-01-10 
 *  https://github.com/fengshangbin/LazyPage 
 *  Easy H5 Page Framework
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.LazyPage=e():t.LazyPage=e()}(window,function(){return function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=4)}([function(t,e){var n={extractCode:function(t,e){for(var n=e?"style":"script",a="<"+n+"[^>]*>([\\S\\s]*?)</"+n+"\\s*>",r=new RegExp(a,"img"),i=new RegExp(a,"im"),o=/src=[\'\"]?([^\'\"]*)[\'\"]?/i,s=/type=[\'\"]?([^\'\"]*)[\'\"]?/i,c=t.match(r)||[],u=[],l=0,d=c.length;l<d;l++){var f=(c[l].match(s)||["",""])[1].toLowerCase();if(""==f||f.indexOf("javascript")>=0){var p=(c[l].match(i)||["",""])[1];p&&""!=p&&u.push({code:p});var h=(c[l].match(o)||["",""])[1];h&&""!=h&&u.push({src:h})}}return u},activeCodes:function(t,e){n.activeCode(t,0,e)},activeCode:function(t,e,a){if(e==t.length)a();else{var r=t[e];r.code?(n.evalScripts(r.code),n.activeCode(t,e+1,a)):r.src&&n.dynamicLoadJs(r.src,function(){n.activeCode(t,e+1,a)})}},evalScripts:function(t){var e=document.getElementsByTagName("head")[0],n=document.createElement("script");n.text=t,e.insertBefore(n,e.firstChild),e.removeChild(n)},dynamicLoadJs:function(t,e){var n=document.getElementsByTagName("head")[0],a=document.createElement("script");a.type="text/javascript",a.src=t,a.onload=a.onreadystatechange=function(){this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(a.onload=a.onreadystatechange=null,n.removeChild(a),e&&e())},a.onerror=function(){e&&e()},n.appendChild(a)},evalStyles:function(t){var e=document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css";try{n.appendChild(document.createTextNode(t))}catch(e){n.styleSheet.cssText=t}e.appendChild(n)}};t.exports=n},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){(function(t){var a=void 0!==t&&t||"undefined"!=typeof self&&self||window,r=Function.prototype.apply;function i(t,e){this._id=t,this._clearFn=e}e.setTimeout=function(){return new i(r.call(setTimeout,a,arguments),clearTimeout)},e.setInterval=function(){return new i(r.call(setInterval,a,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(a,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},n(6),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate}).call(this,n(1))},function(t,e,n){var a,r=new(n(8)),i=function t(e){r.trigger(),document.removeEventListener?document.removeEventListener("DOMContentLoaded",t,!1):document.attachEvent&&(document.detachEvent("onreadystatechange",t),window==window.top&&(clearInterval(a),a=null))};document.addEventListener?document.addEventListener("DOMContentLoaded",i,!1):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){/loaded|complete/.test(document.readyState)&&i()}),window==window.top&&(a=setInterval(function(){try{document.documentElement.doScroll("left")}catch(t){return}i()},5))),t.exports=r.bind},function(t,e,n){t.exports=n(9)},function(t,e,n){},function(t,e,n){(function(t,e){!function(t,n){"use strict";if(!t.setImmediate){var a,r,i,o,s,c=1,u={},l=!1,d=t.document,f=Object.getPrototypeOf&&Object.getPrototypeOf(t);f=f&&f.setTimeout?f:t,"[object process]"==={}.toString.call(t.process)?a=function(t){e.nextTick(function(){h(t)})}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=n,e}}()?t.MessageChannel?((i=new MessageChannel).port1.onmessage=function(t){h(t.data)},a=function(t){i.port2.postMessage(t)}):d&&"onreadystatechange"in d.createElement("script")?(r=d.documentElement,a=function(t){var e=d.createElement("script");e.onreadystatechange=function(){h(t),e.onreadystatechange=null,r.removeChild(e),e=null},r.appendChild(e)}):a=function(t){setTimeout(h,0,t)}:(o="setImmediate$"+Math.random()+"$",s=function(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(o)&&h(+e.data.slice(o.length))},t.addEventListener?t.addEventListener("message",s,!1):t.attachEvent("onmessage",s),a=function(e){t.postMessage(o+e,"*")}),f.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var r={callback:t,args:e};return u[c]=r,a(c),c++},f.clearImmediate=p}function p(t){delete u[t]}function h(t){if(l)setTimeout(h,0,t);else{var e=u[t];if(e){l=!0;try{!function(t){var e=t.callback,a=t.args;switch(a.length){case 0:e();break;case 1:e(a[0]);break;case 2:e(a[0],a[1]);break;case 3:e(a[0],a[1],a[2]);break;default:e.apply(n,a)}}(e)}finally{p(t),l=!1}}}}}("undefined"==typeof self?void 0===t?this:t:self)}).call(this,n(1),n(7))},function(t,e){var n,a,r=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function s(t){if(n===setTimeout)return setTimeout(t,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(t){n=i}try{a="function"==typeof clearTimeout?clearTimeout:o}catch(t){a=o}}();var c,u=[],l=!1,d=-1;function f(){l&&c&&(l=!1,c.length?u=c.concat(u):d=-1,u.length&&p())}function p(){if(!l){var t=s(f);l=!0;for(var e=u.length;e;){for(c=u,u=[];++d<e;)c&&c[d].run();d=-1,e=u.length}c=null,l=!1,function(t){if(a===clearTimeout)return clearTimeout(t);if((a===o||!a)&&clearTimeout)return a=clearTimeout,clearTimeout(t);try{a(t)}catch(e){try{return a.call(null,t)}catch(e){return a.call(this,t)}}}(t)}}function h(t,e){this.fun=t,this.array=e}function m(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new h(t,e)),1!==u.length||l||s(p)},h.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=m,r.addListener=m,r.once=m,r.off=m,r.removeListener=m,r.removeAllListeners=m,r.emit=m,r.prependListener=m,r.prependOnceListener=m,r.listeners=function(t){return[]},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},function(t,e){t.exports=function(){var t=!1,e=[];this.bind=function(n){t?n.call(window):e.push(n)},this.trigger=function(){if(!t){t=!0;for(var n=0;n<e.length;n++)e[n].apply(window);e=null}}}},function(t,e,n){"use strict";n.r(e);n(5);function a(t,e,n){if(t&&t.length>0){if("string"==typeof t)return!!e.classList.contains(t);for(var a=0,r=0;r<t.length;r++)e.classList.contains(t[r])&&a++;return a==t.length}return!0}function r(){return this.data=[],this.addClass=function(t){for(var e=0;e<this.data.length;e++)this.data[e].classList.add(t)},this.removeClass=function(t){for(var e=0;e<this.data.length;e++)this.data[e].classList.remove(t)},this.hasClass=function(t){for(var e=0;e<this.data.length;e++)if(this.data[e].classList.contains(t))return!0;return!1},this.hide=function(){for(var t=0;t<this.data.length;t++)this.data[t].style.display="none"},this}function i(t,e){var n={};for(var a in t)n[a]=t[a];for(var r in e)n[r]=e[r];return n}Element.prototype.getParentElementByTag=function(t){if(!t)return null;var e=null,n=this;return function a(){if(!(n=n.parentElement))return null;var r=n.tagName.toLowerCase();r===t?e=n:"body"==r?e=null:a()}(),e},Element.prototype.hasLazyPageParent=function(t){var e=!1,n=this;return function a(){(n=n.parentElement)==t?e=!1:n.classList.contains("lazypage")?e=!0:a()}(),e},Element.prototype.siblings=function(t,e){for(var n=new r,i=this.parentElement.children,o=0;o<i.length;o++){var s=i[o];(s!=this||e)&&(a(t,s)&&n.data.push(s))}return n},Element.prototype.childrens=function(t){for(var e=new r,n=this.children,i=0;i<n.length;i++){var o=n[i];a(t,o)&&e.data.push(o)}return e};var o=location.origin;function s(t){return t.replace(new RegExp(o,"i"),"")}function c(t,e){this.type=t,this.data=e,this.target=null}function u(t){return s(t).replace(/(\?.*)|(#.*)/,"").replace(/^\//,"").replace(/\/\//g,"/").split("/")}function l(){var t={type:arguments[0].type||"GET",url:arguments[0].url||"",async:arguments[0].async||"true",data:arguments[0].data||null,dataType:arguments[0].dataType||"text",header:arguments[0].header||null,contentType:arguments[0].contentType||"application/x-www-form-urlencoded",beforeSend:arguments[0].beforeSend||function(){},success:arguments[0].success||function(){},error:arguments[0].error||function(){}};t.beforeSend();var e=new XMLHttpRequest;if("get"==t.type.toLowerCase()&&null!=t.data&&""!=t.data&&(t.url+=t.url.indexOf("?")>0?"&":"?",t.url+=t.data),e.open(t.type,t.url,t.async),e.setRequestHeader("Content-Type",t.contentType),null!=t.header)for(var n in t.header)e.setRequestHeader(n,t.header[n]);e.send("post"==t.type.toLowerCase()&&null!=t.data?t.data:null),e.onreadystatechange=function(){4==e.readyState&&(200==e.status?t.success(e.responseText):t.error(e.status))}}null==o&&(o=/^((https|http|ftp|rtsp|mms)?:\/\/[^\/]*)/i.exec(location.href)[0]);var d=n(0),f=n.n(d);function p(t,e){var n,a=u(t),r=u(e);if(a.join("/")==r.join("/"))return null;for(n=0;n<a.length&&n<r.length&&a[n]==r[n];n++);var i=v(a.slice(0,n+1));if(null==i)return null;var o=v(r.slice(0,n+1)),s=r.slice(n+1).filter(function(t){return t.length>0});return{current:i,target:o,sun:s,ajaxSun:!!function(t,e){if(0==e.length||null==t)return null;var n=m(e),a=y(t,n);return a.length<n.split(" ").length?n:null}(o,s)}}function h(t){var e=g(t,".in");return e?h(e):t}function m(t){for(var e="",n=0;n<t.length;n++){var a=0==n?"":" ";e=""!=t[n]?e+a+'[data-page="'+t[n]+'"]':e+a+".default"}return e}function v(t){var e=m(t),n=y(null,e);return n.length==e.split(" ").length?n[n.length-1]:null}function g(t,e){for(var n=t.querySelectorAll(".lazypage"+e),a=0;a<n.length;a++)if(0==n[a].hasLazyPageParent(t))return n[a];return null}function y(t,e){null==t&&(t=document.body);for(var n=e.split(" "),a=[],r=0;r<n.length;r++){var i=g(t,n[r]);if(!i)return a;a.push(i),t=i}return a}function E(t){var e=u(t),n=document.querySelector(".lazypage");if(null==n)return null;for(var a=n.parentElement,r=0;r<e.length;r++){var i=g(a,""==e[r]?".default":'[data-page="'+e[r]+'"]');if(null==i)return{container:a,selector:m(e.slice(0,r+1))};a=i}return{container:a}}var b={};function T(t,e,n){var a=E(t);if(a.selector){if(!n){if(b[t])return void b[t].push(e);b[t]=[e]}l({url:t,data:"lazypageTargetSelector="+encodeURIComponent(a.selector),success:function(n){if((n=JSON.parse(n)).hasTargetLazyPage){var r,i=E(t);if(!i.selector)return;if(i.selector!=a.selector)return void T(t,e,!0);for(var o=n.block,s=/data-sort *= *"([0-9])*"/i.exec(o),c=s?parseFloat(s[1]):0,u=a.container.childrens("lazypage"),l=0;l<u.data.length;l++){var d=u.data[l];if(c<parseFloat(d.getAttribute("data-sort")||"0")){d.insertAdjacentHTML("beforebegin",o),r=d.previousSibling||d.previousElementSibling;break}l==u.data.length-1&&(d.insertAdjacentHTML("afterend",o),r=d.nextSibling||d.nextElementSibling)}r.classList.add("out"),r.classList.remove("in"),h(r).setAttribute("data-title",n.title.replace(/<\/?title>/gi,""));var p=f.a.extractCode(o);f.a.activeCodes(p,function(){L(t,r)})}else L(t,null)},error:function(e){console.log("error",e),L(t,null)}})}else e&&e(a.container)}function L(t,e){for(var n=b[t],a=0;a<n.length;a++)n[a]&&n[a](e);b[t]=null}var w=n(2),S=new function(){var t={};this.addEventListener=function(e,n){null==t[e]&&(t[e]=[]),-1==t[e].indexOf(n)&&t[e].push(n)},this.removeEventListener=function(e,n){if(null==t[e]&&(t[e]=[]),null==n)t[e].length>0&&(t[e]=[]);else{var a=t[e].indexOf(n);a>-1&&t[e].splice(a,1)}},this.dispatchEvent=function(e){if(e.target=this,null!=t[e.type])for(var n=0;n<t[e.type].length;n++)t[e.type][n](e)},this.hasEventListener=function(e){return null==t[e]&&(t[e]=[]),t[e].length>0}},x=S.addEventListener,_=S.removeEventListener,I=S.hasEventListener,P={PAGE_FIRST_IN:"PageFirstIn",PAGE_IN_START:"PageInStart",PAGE_IN_END:"PageInEnd",PAGE_OUT_START:"PageOutStart",PAGE_OUT_END:"PageOutEnd"},k={fade:{priority:1,fadeInDelay:"outend"},popup:{priority:2,fadeInDelay:0}};function A(t){null==k[t]&&(k[t]={priority:1,fadeInDelay:0})}function C(t,e){t.style.display="block";var n=h(t);n.hasPageFirstIn||(S.dispatchEvent(new c(P.PAGE_FIRST_IN,i(e,{page:n}))),n.hasPageFirstIn=!0),S.dispatchEvent(new c(P.PAGE_IN_START,i(e,{page:n}))),t.classList.contains("in")&&"onPageLoadShow"==e.animate?S.dispatchEvent(new c(P.PAGE_IN_END,i(e,{page:n}))):(e.isBack&&t.classList.add("reverse"),t.classList.remove("out"),t.classList.add(e.animate),t.classList.add("in"),O(t,n,e,P.PAGE_IN_END))}function j(t,e,n){t.style.display="block";var a=h(t);S.dispatchEvent(new c(P.PAGE_OUT_START,i(e,{page:a}))),e.isBack&&t.classList.add("reverse"),t.classList.remove("in"),t.classList.add(e.animate),t.classList.add("out"),O(t,a,e,P.PAGE_OUT_END,n)}function O(t,e,n,a,r){t.addEventListener("animationend",function o(s){t.classList.remove("reverse");t.classList.remove(n.animate);t.classList.contains("out")&&(t.style.display="none");t.removeEventListener("animationend",o);S.dispatchEvent(new c(a,i(n,{page:e})));r&&r()})}function B(t){return(B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var N=s(location.href),M="pushState"in history&&"replaceState"in history;function z(t,e){if(!M)return!1;if(t=s(t),/^https?:\/\//i.test(t))return!1;var n=p(N,t);if(null==n)return!1;var a=n.current,r=n.target;return null==r||n.ajaxSun?(T(t,function(i){if(null==i)return location.href=t,!0;null==r&&null==(r=p(N,t).target)&&(r=i),function(t){if(!K)return;var e=t.parentElement.childrens("lazypage-loading-mask");e.data.length>0&&(e.data[0].style.display="none")}(a),D(t,a,r,n.sun,e)}),function(t){if(!K)return;var e=t.parentElement,n=e.childrens("lazypage-loading-mask");n.data.length>0?n.data[0].style.display="block":e.insertAdjacentHTML("beforeend",'<div class="lazypage-loading-mask"></div>')}(a)):D(t,a,r,n.sun,e),!0}function D(t,e,n,a,r){var i,o=function(t,e){var n=t;if(e.length>0){var a=y(t,m(e));if(a.length>0){n=a[a.length-1];for(var r=0;r<a.length;r++){var i=a[r].siblings(["lazypage","in"]);i.addClass("out"),i.removeClass("in"),i.hide(),a[r].classList.add("in"),a[r].classList.remove("out"),a[r].style.display="block"}}}return n}(n,a);!function t(e){var n=g(e,".default");n&&0==n.siblings(["lazypage","in"]).data.length&&(n.classList.contains("out")&&(n.classList.add("in"),n.classList.remove("out"),n.style.display="block"),t(n))}(o),(i=h(o).getAttribute("data-title"))&&(document.title=i),e!=n&&function(t,e,n){if("auto"==n.animate){var a=t.getAttribute("data-animate")||"slide",r=e.getAttribute("data-animate")||"slide";A(a),A(r),k[a].priority==k[r].priority?n.animate=r:k[a].priority>k[r].priority?(n.animate=a,n.isBack=!0):(n.animate=r,n.isBack=!1)}A(n.animate),"string"==typeof n.isBack&&(n.isBack=4==e.compareDocumentPosition(t));var i=k[n.animate].fadeInDelay;"number"==typeof i?(j(t,n),0==i?C(e,n):Object(w.setTimeout)(function(){C(e,n)},i)):"outend"==i&&j(t,n,function(){C(e,n)})}(e,n,r);var c=function t(e,n){var a=g(n,".in:not(.default)");return a?t(e+"/"+a.getAttribute("data-page"),a):e=e.replace("//","/")}(t,o);!function(t,e){var n=s(location.href);if(e.history){null==U&&(U={path:n});var a={animate:e.animate,isBack:e.isBack,path:t,prev:{animate:U.animate,isBack:U.isBack,path:U.path}};U.next={animate:a.animate,isBack:a.isBack,path:a.path},window.history.replaceState(U,null,n),window.history.pushState(a,null,t),U=a}}(c,r),N=c,q(n)}var R=!1,F={};function G(t){M&&(R=!0,t&&"object"==B(t)&&H(t),q(document.body))}function q(t){if(R){for(var e=t.querySelectorAll("a[href]"),n=[],a=0;a<e.length;a++){var r=e[a].href;/^javascript/i.test(r)||(r=s(r),/^https?:\/\//i.test(r)||"true"!=e[a].getAttribute("data-direct")&&n.push(r))}H(n)}}function H(t){for(var e=0;e<t.length;e++)F[t[e]]||(F[t[e]]=1,T(t[e],null))}var U=null;var J=n(3),$=n.n(J);function X(t,e){null==e&&(e=!0),z(t,{history:e,isBack:"auto",animate:"auto"})||(location.href=t)}document.addEventListener("click",function(t){var e=t.target;if(e&&("a"==e.tagName.toLowerCase()||(e=e.getParentElementByTag("a")))){var n=e.href;if(/^javascript/i.test(n))return!1;if("true"==e.getAttribute("data-direct"))return!1;z(n,{history:"true"===(e.getAttribute("data-history")||"true"),isBack:"auto",animate:"auto"})&&t.preventDefault()}}),window.onpopstate=function(){var t,e=(t=history.state).prev&&N==t.prev.path?(U=t,{history:!1,isBack:t.isBack,animate:t.animate}):t.next&&N==t.next.path?(U=t,{history:!1,isBack:!t.next.isBack,animate:t.next.animate}):{history:!1,isBack:"auto",animate:"auto"};z(location.href,e)},$()(function(){var t=h(document.body);t&&(t.setAttribute("data-title",document.title),C(t,{isBack:!1,animate:"onPageLoadShow"}))}),n.d(e,"goto",function(){return X}),n.d(e,"needLoading",function(){return K}),n.d(e,"closeLoading",function(){return Q}),n.d(e,"openLoading",function(){return V}),n.d(e,"closePreLoad",function(){return closePreLoad}),n.d(e,"addEventListener",function(){return x}),n.d(e,"removeEventListener",function(){return _}),n.d(e,"hasEventListener",function(){return I}),n.d(e,"PageEvent",function(){return P}),n.d(e,"animation",function(){return k}),n.d(e,"openPreLoad",function(){return G});var K=!0;function Q(){K=!1}function V(){K=!0}}])});