import ajax from "./ajax.js";
import analyzeScript from "./analyzeScript";
import { querySelectorElement } from "./queryhelp";
import { getPath, getRealUrl, getDomain } from "./utils";
import { getElementByPath, getDataElementByPath, setElementPath } from "./element";
import ready from "./documentReady";

/* loading动画 */
var needLoading = true;
export function addLoading(lazyswitch) {
    if (!needLoading) return;
    var conatiner = lazyswitch.parentElement;
    var loadingUI = conatiner.childrens("lazyswitch-loading-mask");
    if (loadingUI.data.length > 0) {
        loadingUI.data[0].style.display = "block";
    } else {
        conatiner.insertAdjacentHTML(
            "beforeend",
            '<div class="lazyswitch-loading-mask"></div>'
        );
    }
}
export function removeLoading(lazyswitch) {
    if (!needLoading) return;
    var conatiner = lazyswitch.parentElement;
    var loadingUI = conatiner.childrens("lazyswitch-loading-mask");
    if (loadingUI.data.length > 0) {
        loadingUI.data[0].style.display = "none";
    }
}
export function closeLoading() {
    needLoading = false;
}
export function openLoading() {
    needLoading = true;
}

/* 预加载 */
var isPreLoad = false;
var preLoadURLS = {};
export function openPreLoad() {
    isPreLoad = true;
    ready(function () {
        checkPreLoad(document.body);
    })
}
export function closePreLoad() {
    isPreLoad = false;
}
export function checkPreLoad(container) {
    if (!isPreLoad) return;
    var a = container.querySelectorAll("a[href]");
    var urls = [];
    for (var i = 0; i < a.length; i++) {
        var url = a[i].href;
        if (/^javascript/i.test(url)) {
            continue;
        }
        if (a[i].getAttribute("data-direct") == "true") {
            continue;
        }
        url = getRealUrl(url);
        url = url.replace(new RegExp(getDomain(), 'i'), '');
        if (/^https?:\/\//i.test(url)) {
            continue;
        }
        var targetPath = getPath(url);
        var target = getElementByPath(targetPath);
        if (target == null)
            urls.push(url);
    }
    preLoad(urls);
}
export function preLoad(urls) {
    for (var i = 0; i < urls.length; i++) {
        if (!preLoadURLS[urls[i]]) {
            preLoadURLS[urls[i]] = 1;
            loadPage(urls[i], null);
        }
    }
}

/* ajax加载lazypage */
var ajaxPageHistory = {};
export function loadPage(url, callback) {
    var targetPath = getPath(url);
    var targetPage = getElementByPath(targetPath);
    if (targetPage != null) return;
    if (ajaxPageHistory[url]) {
        ajaxPageHistory[url].push(callback);
        return;
    }
    ajaxPageHistory[url] = [callback];
    ajax({
        url: url,
        success: function (data) {
            targetPage = getDataElementByPath(data, targetPath);
            if (targetPage == null) {
                targetPage = querySelectorElement(data, ".lazyswitch.in", false) || querySelectorElement(data, ".lazyswitch", false);
            }
            if (targetPage != null) {
                var addTarget;
                var block = targetPage;
                var group = /data-sort *= *"([0-9]*)"/i.exec(block);
                var sort = group ? parseFloat(group[1]) : 0;
                var current = document.querySelector(".lazyswitch.in");
                var container = current.parentElement;
                var siblings = container.childrens("lazyswitch");
                for (var i = 0; i < siblings.data.length; i++) {
                    var item = siblings.data[i];
                    var itemSort = parseFloat(item.getAttribute("data-sort") || "0");
                    if (sort < itemSort) {
                        item.insertAdjacentHTML("beforebegin", block);
                        addTarget = item.previousSibling || item.previousElementSibling;
                        break;
                    } else if (i == siblings.data.length - 1) {
                        item.insertAdjacentHTML("afterend", block);
                        addTarget = item.nextSibling || item.nextElementSibling;
                    }
                }
                addTarget.classList.add("out");
                addTarget.classList.remove("in");
                if (!addTarget.hasAttribute("data-title")) {
                    var title = querySelectorElement(data, "title", false);
                    if (title) {
                        title = title.replace(/< *\/? *title *>/ig, "");
                        addTarget.setAttribute("data-title", title);
                    }
                }
                setElementPath(addTarget, targetPath);
                let matchScripts = analyzeScript.extractCode(block);
                analyzeScript.activeCodes(matchScripts, function () {
                    loadPageCallback(url, addTarget);
                });
            } else {
                loadPageCallback(url, null);
            }
        },
        error: function (e) {
            console.log("error", e);
            loadPageCallback(url, null);
            //callback(null);
        },
    });
}

function loadPageCallback(key, lazyswitch) {
    var callbacks = ajaxPageHistory[key];
    for (var i = 0; i < callbacks.length; i++) {
        if (callbacks[i]) callbacks[i](lazyswitch, key);
    }
    ajaxPageHistory[key] = null;
}