import { push } from "./history";
import { getPath, getRealUrl, changeTitle, extend } from "./utils";
import { pageAnimate } from "./animate";
import { getElementByPath } from "./element";
import { addLoading, removeLoading, checkPreLoad, loadPage } from "./load"

export var lastPath = getPath(location.href);

var supportHistory = "pushState" in history && "replaceState" in history;

var targetURL;

export function goto(url, options) {
  if (!supportHistory) {
    return false;
  }
  url = getRealUrl(url);
  targetURL = url;

  var targetPath = getPath(url);
  if (/^https?:\//i.test(targetPath)) {
    return false;
  }

  var current = document.querySelector(".lazyswitch.in");
  if (current == null) return;

  options = options || {};
  options = extend({
    history: true,
    isBack: "auto",
    animate: "auto",
  }, options);

  var target = getElementByPath(targetPath);
  if (target == null) {
    addLoading(current);
    //console.log("start url: " + url);
    loadPage(url, function (addedLazyPage) {
      //console.log("ok: " + url, "target: " + targetURL);
      if (targetURL == url) {
        if (addedLazyPage == null) {
          location.href = url;
          return true;
        }
        target = addedLazyPage;
        removeLoading(current);
        transition(targetPath, current, target, options);
      }
    });
  } else if (target != current) {
    transition(targetPath, current, target, options);
  }
  return true;
}

function transition(path, current, target, options) {
  changeTitle(target.getAttribute("data-title"));
  pageAnimate(current, target, options);
  push(path, options);
  lastPath = path;
  checkPreLoad(target);
}
