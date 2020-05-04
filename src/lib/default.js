import { pop } from "./history";
import { goto, lastPath } from "./route";
import { getFinalPage } from "./element";
import ready from "./documentReady";
import { pageIn } from "./animate";

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
  //var animate = target.getAttribute('data-animate') || 'auto';
  //var isBack = target.getAttribute('data-back') || 'auto';
  var history = target.getAttribute("data-history") || "true";
  var state = goto(href, {
    history: history === "true",
    isBack: "auto",
    animate: "auto",
  });
  if (state) event.preventDefault();
});
window.onpopstate = function () {
  var options = pop();
  //if (options) {
  goto(location.href, options);
  /* } else {
    location.reload();
  } */
};
ready(function () {
  var currentLazyPage = getFinalPage(document.body);
  if (currentLazyPage) {
    currentLazyPage.setAttribute("data-title", document.title);
    pageIn(currentLazyPage, {
      isBack: false,
      animate: "onPageLoadShow",
    });
  }
});
