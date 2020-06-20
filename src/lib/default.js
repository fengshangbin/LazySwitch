import { pop } from "./history";
import { goto } from "./route";
import { getElementByPath, setElementPath } from "./element";
import ready from "./documentReady";
import { pageIn } from "./animate";
import { getPath, changeTitle } from "./utils";

document.addEventListener("click", function (event) {
  //event.preventDefault();
  var target = event.target;
  if (!target) return;
  if (
    target.tagName.toLowerCase() != "a" &&
    !(target = target.getParentElementByTag("a"))
  ) {
    return;
  }
  var href = target.href;
  if (/^javascript/i.test(href)) {
    return false;
  }
  if (target.getAttribute("data-direct") == "true") {
    return false;
  }
  var history = target.getAttribute("data-history") || "true";
  var state = goto(href, {
    history: history === "true",
    isBack: "auto",
    animate: "auto",
  });
  if (state)
    event.preventDefault();
});

window.onpopstate = function () {
  var options = pop();
  goto(location.href, options);
};

ready(function () {
  var targetPath = getPath(location.href);
  var targetLazyPage = getElementByPath(targetPath);

  var currentLazyPage = document.querySelector(".lazypage.in") || document.querySelector(".lazypage");

  if (targetLazyPage == null && currentLazyPage == null) return;
  else {
    if (targetLazyPage == null) {
      targetLazyPage = currentLazyPage;
      setElementPath(currentLazyPage, targetPath);
    }
    if (targetLazyPage != currentLazyPage && currentLazyPage != null) {
      currentLazyPage.classList.remove('in');
      currentLazyPage.classList.add('out');
    }
    if (targetLazyPage.hasAttribute("data-title")) {
      changeTitle(targetLazyPage.getAttribute("data-title"));
    } else {
      targetLazyPage.setAttribute("data-title", document.title);
    }
    pageIn(targetLazyPage, {
      isBack: false,
      animate: "onPageLoadShow",
    });
  }
});
