import { lastPath } from './route';
import { getPath } from './utils';

var preHistory = null;

export function push(targetPath, options) {
  var path = getPath(location.href);
  if (options.history) {
    if (preHistory == null) {
      preHistory = { path: path };
    }
    var historyItem = {
      animate: options.animate,
      isBack: options.isBack,
      path: targetPath,
      prev: {
        animate: preHistory.animate,
        isBack: preHistory.isBack,
        path: preHistory.path
      }
    };
    preHistory.next = {
      animate: historyItem.animate,
      isBack: historyItem.isBack,
      path: historyItem.path
    };
    window.history.replaceState(preHistory, null, path);
    window.history.pushState(historyItem, null, targetPath);
    //console.log(preHistory, historyItem);
    preHistory = historyItem;
  }/* else{
    window.history.replaceState(preHistory, null, targetPath);
  } */
}

export function pop() {
  var historyItem = history.state;
  if (historyItem.prev && lastPath == historyItem.prev.path) {
    preHistory = historyItem;
    return {
      history: false,
      isBack: historyItem.isBack,
      animate: historyItem.animate
    };
  } else if (historyItem.next && lastPath == historyItem.next.path) {
    preHistory = historyItem;
    return {
      history: false,
      isBack: !historyItem.next.isBack,
      animate: historyItem.next.animate
    };
  } else {
    //console.log('-------------error-----------');
    //console.log(historyItem, lastPath);
    return {
      history: false,
      isBack: 'auto',
      animate: 'auto'
    };
  }
}
