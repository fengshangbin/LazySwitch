import { extend, C3Event, C3EventDispatcher } from './utils';
import { getFinalPage } from './element';
import { setTimeout } from 'timers';

var instance = new C3EventDispatcher();

export var addEventListener = instance.addEventListener;
export var removeEventListener = instance.removeEventListener;
//export var dispatchEvent = instance.dispatchEvent;
export var hasEventListener = instance.hasEventListener;

export var PageEvent = {
  PAGE_FIRST_IN: 'PageFirstIn',
  PAGE_IN_START: 'PageInStart',
  PAGE_IN_END: 'PageInEnd',
  PAGE_OUT_START: 'PageOutStart',
  PAGE_OUT_END: 'PageOutEnd'
};

export var animation = {
  fade: {
    priority: 1,
    fadeInDelay: 'outend'
  },
  popup: {
    priority: 2,
    fadeInDelay: 0
  }
};

function makeNotEmpty(type) {
  if (animation[type] == null) {
    animation[type] = {
      priority: 1,
      fadeInDelay: 0
    };
  }
}

export function pageAnimate(current, target, options) {
  if (options.animate == 'auto') {
    var currentAnimate = current.getAttribute('data-animate') || 'slide';
    var targetAnimate = target.getAttribute('data-animate') || 'slide';
    makeNotEmpty(currentAnimate);
    makeNotEmpty(targetAnimate);
    if (animation[currentAnimate].priority == animation[targetAnimate].priority) {
      options.animate = targetAnimate;
    } else if (animation[currentAnimate].priority > animation[targetAnimate].priority) {
      options.animate = currentAnimate;
      options.isBack = true;
    } else {
      options.animate = targetAnimate;
      options.isBack = false;
    }
  }
  makeNotEmpty(options.animate);
  if (typeof options.isBack == 'string') {
    /* if (options.isBack === 'auto') options.isBack = target.compareDocumentPosition(current) == 4;
    else options.isBack = options.isBack === 'true'; */
    options.isBack = target.compareDocumentPosition(current) == 4;
  }
  var fadeInDelay = animation[options.animate].fadeInDelay;
  if (typeof fadeInDelay == 'number') {
    pageOut(current, options);
    if (fadeInDelay == 0) pageIn(target, options);
    else {
      setTimeout(function() {
        pageIn(target, options);
      }, fadeInDelay);
    }
  } else if (fadeInDelay == 'outend') {
    pageOut(current, options, function() {
      pageIn(target, options);
    });
  }
}

export function pageIn(page, options) {
  page.style.display = 'block';
  var finalePage = getFinalPage(page);
  if (!finalePage.hasPageFirstIn) {
    instance.dispatchEvent(new C3Event(PageEvent.PAGE_FIRST_IN, extend(options, { page: finalePage })));
    finalePage.hasPageFirstIn = true;
  }
  instance.dispatchEvent(new C3Event(PageEvent.PAGE_IN_START, extend(options, { page: finalePage })));
  if (page.classList.contains('in') && options.animate == 'onPageLoadShow') {
    instance.dispatchEvent(new C3Event(PageEvent.PAGE_IN_END, extend(options, { page: finalePage })));
  } else {
    if (options.isBack) page.classList.add('reverse');
    page.classList.remove('out');
    page.classList.add(options.animate);
    page.classList.add('in');
    listenerAnimateEnd(page, finalePage, options, PageEvent.PAGE_IN_END);
  }
}

function pageOut(page, options, callback) {
  page.style.display = 'block';
  var finalePage = getFinalPage(page);
  instance.dispatchEvent(new C3Event(PageEvent.PAGE_OUT_START, extend(options, { page: finalePage })));
  if (options.isBack) page.classList.add('reverse');
  page.classList.remove('in');
  page.classList.add(options.animate);
  page.classList.add('out');
  listenerAnimateEnd(page, finalePage, options, PageEvent.PAGE_OUT_END, callback);
}

function listenerAnimateEnd(page, finalePage, options, type, callback) {
  page.addEventListener('animationend', animationend);
  function animationend(e) {
    page.classList.remove('reverse');
    page.classList.remove(options.animate);
    if (page.classList.contains('out')) page.style.display = 'none';
    page.removeEventListener('animationend', animationend);
    instance.dispatchEvent(new C3Event(type, extend(options, { page: finalePage })));
    if (callback) callback();
  }
}
