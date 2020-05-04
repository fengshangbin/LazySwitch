Element.prototype.getParentElementByTag = function(tag) {
  if (!tag) return null;
  var element = null,
    parent = this;
  var popup = function() {
    parent = parent.parentElement;
    if (!parent) return null;
    var tagParent = parent.tagName.toLowerCase();
    if (tagParent === tag) {
      element = parent;
    } else if (tagParent == 'body') {
      element = null;
    } else {
      popup();
    }
  };
  popup();
  return element;
};

Element.prototype.hasLazyPageParent = function(container) {
  var result = false,
    parent = this;
  var popup = function() {
    parent = parent.parentElement;
    if (parent == container) result = false;
    else if (parent.classList.contains('lazypage')) result = true;
    else popup();
  };
  popup();
  return result;
};

Element.prototype.siblings = function(className, includeSelf) {
  var nodeArray = new NodeArray();
  var parent = this.parentElement;
  var childrens = parent.children;
  for (var index = 0; index < childrens.length; index++) {
    var children = childrens[index];
    if (children == this && !includeSelf) continue;
    if (checkNode(className, children)) {
      nodeArray.data.push(children);
    }
  }
  return nodeArray;
};

Element.prototype.childrens = function(className) {
  var nodeArray = new NodeArray();
  var childrens = this.children;
  for (var index = 0; index < childrens.length; index++) {
    var children = childrens[index];
    if (checkNode(className, children)) {
      nodeArray.data.push(children);
    }
  }
  return nodeArray;
};

function checkNode(className, children, nodeArray) {
  if (className && className.length > 0) {
    if (typeof className == 'string') {
      if (children.classList.contains(className)) return true;
      else return false;
    } else {
      var mactchCount = 0;
      for (var i = 0; i < className.length; i++) {
        if (children.classList.contains(className[i])) mactchCount++;
      }
      if (mactchCount == className.length) return true;
      else return false;
    }
  } else {
    return true;
  }
}

function NodeArray() {
  this.data = [];
  this.addClass = function(className) {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].classList.add(className);
    }
  };
  this.removeClass = function(className) {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].classList.remove(className);
    }
  };
  this.hasClass = function(className) {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].classList.contains(className)) return true;
    }
    return false;
  };
  this.hide = function() {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].style.display = 'none';
    }
  };
  return this;
}

/* NodeList.prototype.addClass = function(className) {
  for (var i = 0; i < this.length; i++) {
    this[i].classList.add(className);
  }
};

NodeList.prototype.removeClass = function(className) {
  for (var i = 0; i < this.length; i++) {
    this[i].classList.remove(className);
  }
}; */

export function extend(defaultOption, options) {
  var temp = {};
  for (var i in defaultOption) {
    temp[i] = defaultOption[i];
  }
  for (var j in options) {
    temp[j] = options[j];
  }
  return temp;
}

var domain = location.origin;
if (domain == undefined) domain = /^((https|http|ftp|rtsp|mms)?:\/\/[^/]*)/i.exec(location.href)[0];
export function getPath(url) {
  return url.replace(new RegExp(domain, 'i'), '');
}

export function C3Event(type, data) {
  this.type = type;
  this.data = data;
  this.target = null;
}
export function C3EventDispatcher() {
  var event = {};
  this.addEventListener = function(eventType, callback) {
    if (event[eventType] == null) event[eventType] = [];
    if (event[eventType].indexOf(callback) == -1) event[eventType].push(callback);
  };
  this.removeEventListener = function(eventType, callback) {
    if (event[eventType] == null) event[eventType] = [];
    if (callback == null) {
      if (event[eventType].length > 0) event[eventType] = [];
    } else {
      var index = event[eventType].indexOf(callback);
      if (index > -1) {
        event[eventType].splice(index, 1);
      }
    }
  };
  this.dispatchEvent = function(e) {
    e.target = this;
    if (event[e.type] != null) {
      for (var i = 0; i < event[e.type].length; i++) {
        event[e.type][i](e);
      }
    }
  };
  this.hasEventListener = function(eventType) {
    if (event[eventType] == null) event[eventType] = [];
    return event[eventType].length > 0;
  };
}

export function changeTitle(title) {
  if (title) {
    document.title = title;
  }
}

export function urlToPaths(url) {
  return getPath(url)
    .replace(/(\?.*)|(#.*)/, '')
    .replace(/^\//, '')
    .replace(/\/\//g, '/')
    .split('/');
  /* .filter(a => {
      return a.length > 0;
    }); */
}
