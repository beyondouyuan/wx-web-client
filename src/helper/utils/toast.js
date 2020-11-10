import { Toast as myToast } from 'zzc-design-mobile';

/**
 * Toast封装
 * @param {object} param 配置参数
 * @param {string} param.level 提示级别 info | success | error | waring | loading
 * @param {string} param.content 提示内容
 * @param {string} param.duration 自动关闭toast时间
 * @param {function} param.onClose 关闭后回调
 * @param {DOMElement} param.parentNode 父节点
 * @param {bool} param.mask 是否开启蒙版
 */
export function Toast({
  level, content, duration, onClose, parentNode, mask
}) {
  return myToast[`${level}`](content, duration, onClose, parentNode, mask);
}
