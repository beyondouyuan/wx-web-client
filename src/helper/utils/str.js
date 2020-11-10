// 去除空白字符
export function removeTempStrBlankChar(...str) {
  return String.raw(...str).replace(/\s/g, '');
}


/**
 * 将经过转义的string转换为json
 * @param {*} str 
 */

export function parseEscapeString(str) {
  return JSON.parse(str.replace(/&quot;/g, '"'));
}