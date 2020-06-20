function querySelectorElement(parent, regStr, multiElement) {
  regStr = encodEscapeWord(regStr.trim());
  var regArr = regStr.split(" ");
  var source = [parent];
  var index = 0;
  while (source && source.length > 0 && index < regArr.length) {
    //if (regArr[index].length > 0) {
    source = queryBlock(
      source,
      regArr[index],
      index == regArr.length - 1,
      multiElement
    );
    //}
    index++;
  }
  if (!multiElement && source instanceof Array) {
    //console.log(parent.html, regStr);
    return null;
  }
  return source;
}
function parseRegStr(regStr) {
  var attrRegs = "";
  var attrReg = /\[[^\]]*\]/g;
  var group = attrReg.exec(regStr);
  while (group != null) {
    attrRegs += decodeEscapeWord(group[0]);
    group = attrReg.exec(regStr);
  }
  regStr = regStr.replace(attrReg, "");

  var idReg = /#[^#.[]*/g;
  var group2 = idReg.exec(regStr);
  while (group2 != null) {
    attrRegs += "[id=" + group2[0].substring(1) + "]";
    group2 = idReg.exec(regStr);
  }
  regStr = regStr.replace(idReg, "");

  var classRegs = "";
  var classReg = /\.[^#.[]*/g;
  var group3 = classReg.exec(regStr);
  while (group3 != null) {
    classRegs += group3[0];
    group3 = classReg.exec(regStr);
  }
  regStr = regStr.replace(classReg, "");
  return {
    regStr: regStr,
    attrRegs: attrRegs,
    classRegs: classRegs,
  };
}
function queryBlock(source, regStr, last, multiElement) {
  var option = {
    multiElement: !last || multiElement,
    moreRegs: [],
  };
  var needClassMark = false;

  var notReg = /:not\((.*?)\)/g;
  var group = notReg.exec(regStr);
  while (group != null) {
    var result = parseRegStr(group[1]);
    if (result.attrRegs.length > 0)
      option.moreRegs.push({
        index: 2,
        regStr: buildAttrReg(result.attrRegs),
        exclude: true,
      });
    if (result.classRegs.length > 0) {
      option.moreRegs.push({
        index: 3,
        regStr: buildClassReg(result.classRegs),
        exclude: true,
      });
      needClassMark = true;
    }
    group = notReg.exec(regStr);
  }
  regStr = regStr.replace(notReg, "");

  var result = parseRegStr(regStr);
  if (result.attrRegs.length > 0)
    option.moreRegs.push({
      index: 2,
      regStr: buildAttrReg(result.attrRegs),
    });
  if (result.classRegs.length > 0) {
    option.moreRegs.push({
      index: 3,
      regStr: buildClassReg(result.classRegs),
    });
    needClassMark = true;
  }
  regStr = result.regStr;

  var tagReg = regStr.trim();
  if (tagReg.length == 0) tagReg = "[^ >\n\r]*";
  var classRegsMark = needClassMark ? '[^>]*?\\bclass *= *"([^"]*)"' : "";
  regStr = "< *(" + tagReg + ")(" + classRegsMark + "[^>]*)>";

  var resultAll = [];
  for (var i = 0; i < source.length; i++) {
    var result = queryElement(regStr, source[i], option);
    if (!option.multiElement) {
      if (result || i == source.length - 1) return result;
    } else resultAll = resultAll.concat(result);
  }
  return resultAll;
}
function buildClassReg(classNames) {
  var classArr = classNames.split(".");
  var classReg = "";
  for (var i = 0; i < classArr.length; i++) {
    var className = classArr[i];
    if (className.length > 0) {
      classReg += "(?=.*?\\b" + className + "\\b)";
    }
  }
  return classReg;
}
function getElementByAttr(parent, attrs, multiElement) {
  var option = {
    multiElement: multiElement,
    moreRegs: [
      {
        index: 2,
        regStr: buildAttrReg(attrs),
      },
    ],
  };
  var regStr = "< *([^ >\n\r]*)\\b([^>]*)>";
  return queryElement(regStr, parent, option);
}
function buildAttrReg(attrs) {
  var attrArr = attrs.substring(1, attrs.length - 1).split("][");
  var attrReg = "";
  for (var i = 0; i < attrArr.length; i++) {
    var attrGroup = attrArr[i].split("=");
    var key = attrGroup[0].trim();
    var value = null;
    if (attrGroup.length == 2) {
      value = attrGroup[1].trim().replace(/^'|"/, "").replace(/'|"$/, "");
    }
    if (value == null) {
      attrReg += "(?=.*?\\b" + key + "\\b)";
    } else {
      attrReg += "(?=.*?\\b" + key + ' *= *"?' + value + '"?' + "\\b)";
    }
  }
  //console.log(attrReg);
  return attrReg;
}
function queryElement(regStr, parent, option) {
  var parentStart = null;
  var html = null;
  var dom = null;
  if (parent.type == "dom") {
    parentStart = 0;
    html = parent.html;
    dom = parent;
  } else if (parent.type == "element") {
    parentStart = parent.getStart() + parent.getAttrLen();
    html = parent.getInnerHTML();
    dom = parent.getDom();
  } else {
    html = parent;
    //throw "查询主体必须是fastdom或者element";
  }
  //console.log("----------regStr:" + regStr);
  var match = new RegExp(regStr, "img");
  var result = option.multiElement ? [] : null;
  var group = match.exec(html);
  while (group != null) {
    if (option.moreRegs != null && option.moreRegs.length > 0) {
      while (group != null) {
        var moreState = true;
        for (var i = 0; i < option.moreRegs.length; i++) {
          var moreContent = group[option.moreRegs[i].index];
          var moreMatch = new RegExp(option.moreRegs[i].regStr, "im");
          var matchResult = moreMatch.test(moreContent);
          if (option.moreRegs[i].exclude) matchResult = !matchResult;
          moreState = moreState && matchResult;
        }
        if (moreState) break;
        group = match.exec(html);
      }
      if (group == null) return result;
    }
    var el = null;
    if (dom != null) {
      el = dom.findElement(group.index);
    }
    if (el == null) {
      var searchStart = group.index + group[0].length;
      var closeIndex = 0,
        closeLen = 0;
      if (/\/ *>$/.test(group[0]) == false) {
        var closeObj = queryCloseTag(group[1], html.substring(searchStart));
        closeIndex = closeObj.index;
        closeLen = closeObj.len;
      }
      var targetHtml = html.substring(group.index, searchStart + closeIndex);
      if (html != parent) {
        el = new element(
          dom,
          group.index + parentStart,
          searchStart + closeIndex + parentStart,
          targetHtml,
          group[0].length,
          closeLen
        );
        dom.addElement(el);
      } else {
        el = targetHtml;
      }
    }
    if (result == null) {
      result = el;
      break;
    } else {
      result.push(el);
      group = match.exec(html);
    }
  }
  return result;
}
function queryCloseTag(tag, html) {
  var regStrAll = "< */? *" + tag + "[^>]*>";
  var matchAll = new RegExp(regStrAll, "img");

  var regStrClose = "< */ *" + tag + " *>";
  var matchClose = new RegExp(regStrClose, "im");

  var openCount = 1;
  var lastCloseIndex = 0;
  var closeLen = 0;
  while (openCount > 0) {
    var groupAll = matchAll.exec(html);
    if (groupAll == null) {
      break;
    } else {
      if (matchClose.test(groupAll[0])) {
        openCount--;
        lastCloseIndex = groupAll.index + groupAll[0].length;
        closeLen = groupAll[0].length;
      } else {
        openCount++;
        if (new RegExp("\\b" + tag + "\\b", "i").test("input br image"))
          return { index: 0, len: 0 };
      }
    }
  }
  return { index: lastCloseIndex, len: closeLen };
}
function encodEscapeWord(regStr) {
  var marks = [];
  var marksReg = /'[^']*'/g;
  var marksReg2 = /"[^"]*"/g;
  var group = marksReg.exec(regStr);
  while (group != null) {
    marks.push(group[0]);
    group = marksReg.exec(regStr);
  }
  var group2 = marksReg2.exec(regStr);
  while (group2 != null) {
    marks.push(group2[0]);
    group2 = marksReg2.exec(regStr);
  }
  for (var i = 0; i < marks.length; i++) {
    regStr = regStr.replace(
      marks[i],
      marks[i]
        .replace(/ /g, "{-space-}")
        .replace(/\[/g, "{-left-}")
        .replace(/\]/g, "{-right-}")
    );
  }
  return regStr;
}
function decodeEscapeWord(regStr) {
  return regStr
    .replace(/\{-space-\}/g, " ")
    .replace(/\{-left-\}/g, "[")
    .replace(/\{-right-\}/g, "]");
}

module.exports = {
  querySelectorElement,
  getElementByAttr,
  queryElement,
  buildClassReg,
};
