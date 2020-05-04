import "./css/lazypage.less";
import "./lib/default";
import { goto as gotoInner, openPreLoad, closePreLoad } from "./lib/route";
//import { extend } from './lib/utils';
export function goto(url, history) {
  /* options = extend(
    {
      history: true,
      isBack: 'auto',
      animate: 'auto'
    },
    options
  ); */
  if (history == null) history = true;
  var options = {
    history: history,
    isBack: "auto",
    animate: "auto",
  };
  var state = gotoInner(url, options);
  if (!state) location.href = url;
}
export var needLoading = true;
export function closeLoading() {
  needLoading = false;
}
export function openLoading() {
  needLoading = true;
}
export {
  addEventListener,
  removeEventListener,
  hasEventListener,
  PageEvent,
  animation,
} from "./lib/animate";
export { openPreLoad, closePreLoad };
