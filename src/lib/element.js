var ignorePath = "2";

export function getElementByPath(path) {
  return document.querySelector(".lazyswitch[data-path=\"" + replacePath(path) + "\"]");
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