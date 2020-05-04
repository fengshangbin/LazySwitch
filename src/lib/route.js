import { push } from "./history";
import { getPath, changeTitle } from "./utils";
import { pageAnimate } from "./animate";
import {
  getElementByPath,
  showSun,
  showDefaultPage,
  getFinalPath,
  getFinalPage,
  loadPage,
} from "./element";
import { needLoading } from "../index";

export var lastPath = getPath(location.href);

var supportHistory = "pushState" in history && "replaceState" in history;

export function goto(url, options) {
  if (!supportHistory) {
    return false;
  }
  url = getPath(url);
  if (/^https?:\/\//i.test(url)) {
    return false;
  }
  var elements = getElementByPath(lastPath, url);
  //console.log(elements);
  if (elements == null) return false;
  var current = elements.current;
  var target = elements.target;
  if (target == null || elements.ajaxSun) {
    loadPage(url, function (addedLazyPage) {
      if (addedLazyPage == null) {
        location.href = url;
        return true;
      } else if (target == null) {
        target = getElementByPath(lastPath, url).target;
        if (target == null) target = addedLazyPage;
      }
      removeLoading(current);
      transition(url, current, target, elements.sun, options);
    });
    addLoading(current);
  } else {
    transition(url, current, target, elements.sun, options);
  }
  return true;
}

function addLoading(lazypage) {
  if (!needLoading) return;
  var conatiner = lazypage.parentElement;
  var loadingUI = conatiner.childrens("lazypage-loading-mask");
  if (loadingUI.data.length > 0) {
    loadingUI.data[0].style.display = "block";
  } else {
    conatiner.insertAdjacentHTML(
      "beforeend",
      '<div class="lazypage-loading-mask"></div>'
    );
  }
}
function removeLoading(lazypage) {
  if (!needLoading) return;
  var conatiner = lazypage.parentElement;
  var loadingUI = conatiner.childrens("lazypage-loading-mask");
  if (loadingUI.data.length > 0) {
    loadingUI.data[0].style.display = "none";
  }
}

function transition(path, current, target, sun, options) {
  //console.log(options);
  var finalPage = showSun(target, sun);
  showDefaultPage(finalPage);
  changeTitle(getFinalPage(finalPage).getAttribute("data-title"));
  if (current != target) {
    pageAnimate(current, target, options);
  }
  var finalPath = getFinalPath(path, finalPage);
  push(finalPath, options);
  lastPath = finalPath;
  //console.log(lastPath);
  checkPreLoad(target);
}
var isPreLoad = false;
var preLoadURLS = {};
export function openPreLoad(pages) {
  if (!supportHistory) return;
  isPreLoad = true;
  if (pages && typeof pages == "object") startPreLoad(pages);
  checkPreLoad(document.body);
}
export function closePreLoad() {
  isPreLoad = false;
}
function checkPreLoad(container) {
  if (!isPreLoad) return;
  var a = container.querySelectorAll("a[href]");
  var urls = [];
  for (var i = 0; i < a.length; i++) {
    var url = a[i].href;
    if (/^javascript/i.test(url)) {
      continue;
    }
    url = getPath(url);
    if (/^https?:\/\//i.test(url)) {
      continue;
    }
    if (a[i].getAttribute("data-direct") == "true") {
      continue;
    }
    urls.push(url);
  }
  startPreLoad(urls);
}
function startPreLoad(urls) {
  for (var i = 0; i < urls.length; i++) {
    if (!preLoadURLS[urls[i]]) {
      preLoadURLS[urls[i]] = 1;
      loadPage(urls[i], null);
    } /*  else {
      startPreLoad(urls, i + 1);
    } */
  }
}
