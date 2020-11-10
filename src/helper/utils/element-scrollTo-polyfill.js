// element scrollTo（ScrollToOptions API）在低端机型不可用
// 具体的如vivo 安卓v5.6.0及以下
// 因此降级为使用scrollTop

/**
 * 
 */
export function scrollToPolyfill (element, options) {
  if (!element) {
    return false;
  }
  let defaultOptions = Object.assign({
    top: 0,
    left: 0,
    behavior: 'smooth'
  }, options);

  if (element.scrollTo) {
    element.scrollTo(defaultOptions);
  } else {
    element.scrollTop = defaultOptions.top;
    element.scrollLeft = defaultOptions.left
  }
}