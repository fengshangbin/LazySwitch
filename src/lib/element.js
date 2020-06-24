import { querySelectorElement } from "./queryhelp";

var ignorePath = "";

export function getElementByPath(path, unMatchHomePage) {
  var element = document.querySelector(".lazyswitch[data-path=\"" + replacePath(path) + "\"]");
  if(element == null && !unMatchHomePage){
    if(path.endsWith("index.html")) return getElementByPath(path.replace("index.html", ""), true);
    else if(path.endsWith("/")) return getElementByPath(path+"index.html", true);
  }
  return element;
}

export function getDataElementByPath(data, path, unMatchHomePage) {
  var element =  querySelectorElement(data, ".lazyswitch[data-path=\"" + replacePath(path) + "\"]", false);
  if(element == null && !unMatchHomePage){
    if(path.endsWith("index.html")) return getDataElementByPath(data, path.replace("index.html", ""), true);
    else if(path.endsWith("/")) return getDataElementByPath(data, path+"index.html", true);
  }
  return element;
}

export function setElementPath(element, path) {
  if (!element.hasAttribute("data-path"))
    element.setAttribute("data-path", replacePath(path));
}

export function setIgnorePath(_ignorePath) {
  ignorePath = _ignorePath;
}

function replacePath(path) {
  return path.replace(new RegExp('^' + ignorePath, 'i'), '');
}