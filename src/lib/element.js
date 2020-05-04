import ajax from "./ajax.js";
import analyzeScript from "./analyzeScript";
import { urlToPaths } from "./utils";

export function getElementByPath(currentPath, targetPath) {
  var paths = urlToPaths(currentPath);
  var toPaths = urlToPaths(targetPath);
  if (paths.join("/") == toPaths.join("/")) return null;
  var index;
  for (index = 0; index < paths.length && index < toPaths.length; index++) {
    if (paths[index] != toPaths[index]) break;
  }
  //console.log(index, paths, toPaths);
  var current = getLazyPageElementByPaths(paths.slice(0, index + 1));
  if (current == null) return null;
  var target = getLazyPageElementByPaths(toPaths.slice(0, index + 1));
  var sun = toPaths.slice(index + 1).filter((a) => {
    return a.length > 0;
  });
  //var targetSelector = getLazyPageSelector(index, toPaths);
  var sunSelector = getSunSelector(target, sun);
  return {
    current: current,
    target: target,
    sun: sun,
    ajaxSun: sunSelector ? true : false,
  };
}

function getSunSelector(target, sun) {
  if (sun.length == 0 || target == null) return null;
  else {
    var selector = getLazyPageSelector(sun);
    var items = getLazyPageElements(target, selector);
    if (items.length < selector.split(" ").length) return selector;
    else return null;
  }
}

export function showSun(target, sun) {
  //console.log(sun);
  var finalPage = target;
  if (sun.length > 0) {
    var selector = getLazyPageSelector(sun);
    var items = getLazyPageElements(target, selector);
    if (items.length > 0) {
      finalPage = items[items.length - 1];
      for (var i = 0; i < items.length; i++) {
        var siblings = items[i].siblings(["lazypage", "in"]);
        siblings.addClass("out");
        siblings.removeClass("in");
        siblings.hide();
        items[i].classList.add("in");
        items[i].classList.remove("out");
        items[i].style.display = "block";
      }
    }
  }
  return finalPage;
}

export function showDefaultPage(target) {
  var defaultPage = getLazyPageElement(target, ".default");
  if (defaultPage) {
    var siblings = defaultPage.siblings(["lazypage", "in"]);
    if (siblings.data.length == 0) {
      if (defaultPage.classList.contains("out")) {
        defaultPage.classList.add("in");
        defaultPage.classList.remove("out");
        defaultPage.style.display = "block";
      }
      showDefaultPage(defaultPage);
    }
  }
}

export function getFinalPath(path, target) {
  //console.log(path, target);
  var displayPage = getLazyPageElement(target, ".in:not(.default)");
  if (displayPage) {
    return getFinalPath(
      path + "/" + displayPage.getAttribute("data-page"),
      displayPage
    );
  }
  path = path.replace("//", "/");
  return path;
}

export function getFinalPage(target) {
  var displayPage = getLazyPageElement(target, ".in");
  if (displayPage) {
    return getFinalPage(displayPage);
  } else {
    return target;
  }
}

function getLazyPageSelector(paths) {
  var selector = "";
  for (var i = 0; i < paths.length; i++) {
    var space = i == 0 ? "" : " ";
    if (paths[i] != "") {
      selector = selector + space + '[data-page="' + paths[i] + '"]';
    } else {
      selector = selector + space + ".default";
    }
  }
  return selector;
}

function getLazyPageElementByPaths(paths) {
  var selector = getLazyPageSelector(paths);
  //console.log(paths, selector);
  var items = getLazyPageElements(null, selector);
  if (items.length == selector.split(" ").length)
    return items[items.length - 1];
  else return null;
}

function getLazyPageElement(container, query) {
  var items = container.querySelectorAll(".lazypage" + query);
  for (var i = 0; i < items.length; i++) {
    if (items[i].hasLazyPageParent(container) == false) return items[i];
  }
  return null;
}

function getLazyPageElements(container, query) {
  if (container == null) container = document.body;
  var selectors = query.split(" ");
  var result = [];
  for (var i = 0; i < selectors.length; i++) {
    var item = getLazyPageElement(container, selectors[i]);
    if (item) {
      result.push(item);
      container = item;
    } else {
      return result;
    }
  }
  return result;
}

function getContainerByURL(url) {
  var paths = urlToPaths(url);
  var firstLazyPage = document.querySelector(".lazypage");
  if (firstLazyPage == null) return null;
  var container = firstLazyPage.parentElement;
  for (var i = 0; i < paths.length; i++) {
    var lazypage = getLazyPageElement(
      container,
      paths[i] == "" ? ".default" : '[data-page="' + paths[i] + '"]'
    );
    //console.log(lazypage, container, '[data-page="' + paths[i] + '"]', paths);
    //console.log(paths, paths[i]);
    if (lazypage == null) {
      //console.log(paths, paths.slice(0, i + 1));
      return {
        container: container,
        selector: getLazyPageSelector(paths.slice(0, i + 1)),
      };
    } else {
      container = lazypage;
    }
  }
  return {
    container: container,
  };
}

var ajaxPageHistory = {};
export function loadPage(url, callback, force) {
  var result = getContainerByURL(url);
  if (result.selector) {
    if (!force) {
      if (ajaxPageHistory[url]) {
        ajaxPageHistory[url].push(callback);
        return;
      }
      ajaxPageHistory[url] = [callback];
    }
    ajax({
      url: url,
      data: "lazypageTargetSelector=" + encodeURIComponent(result.selector),
      success: function (data) {
        //console.log(data);
        var data = JSON.parse(data);
        if (data.hasTargetLazyPage) {
          var finaleResult = getContainerByURL(url);
          if (!finaleResult.selector) return;
          else if (finaleResult.selector != result.selector) {
            loadPage(url, callback, true);
            return;
          }
          var addTarget;
          var block = data.block;
          var group = /data-sort *= *"([0-9])*"/i.exec(block);
          var sort = group ? parseFloat(group[1]) : 0;
          var siblings = result.container.childrens("lazypage");
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
          var finalePage = getFinalPage(addTarget);
          finalePage.setAttribute(
            "data-title",
            data.title.replace(/<\/?title>/gi, "")
          );

          let matchScripts = analyzeScript.extractCode(block);
          analyzeScript.activeCodes(matchScripts, function () {
            loadPageCallback(url, addTarget);
          });
          /* let len = matchScripts.length;
          if (len > 0) {
            for (let m = 0; m < len; m++) {
              var js = matchScripts[m];
              if (js.code) {
                analyzeScript.evalScripts(js.code);
                if (m == len) {
                  loadPageCallback(url, addTarget);
                }
              } else if (js.src) {
                analyzeScript.dynamicLoadJs(js.src, function() {
                  if (m == len) {
                    loadPageCallback(url, addTarget);
                  }
                });
              }
            }
          } else {
            loadPageCallback(url, addTarget);
          } */

          /* var codes = matchScripts.codes;
          var srcs = matchScripts.srcs;
          for (let m = 0, len = codes.length; m < len; m++) {
            analyzeScript.evalScripts(codes[m]);
          }
          if (srcs.length > 0) {
            var blockScriptLoad = 0;
            for (let n = 0, len = srcs.length; n < len; n++) {
              analyzeScript.dynamicLoadJs(srcs[n], function() {
                blockScriptLoad++;
                if (blockScriptLoad == srcs.length) {
                  loadPageCallback(url, addTarget);
                }
              });
            }
          } else {
            loadPageCallback(url, addTarget);
            //callback(addTarget);
          } */
        } else {
          loadPageCallback(url, null);
          //callback(null);
        }
      },
      error: function (e) {
        console.log("error", e);
        loadPageCallback(url, null);
        //callback(null);
      },
    });
  } else {
    if (callback) callback(result.container);
  }
}

function loadPageCallback(key, lazypage) {
  var callbacks = ajaxPageHistory[key];
  for (var i = 0; i < callbacks.length; i++) {
    if (callbacks[i]) callbacks[i](lazypage);
  }
  ajaxPageHistory[key] = null;
}
