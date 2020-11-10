// import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 利用单例模式创建如 Modal、Popup 之类的全局组件
 *
 * @param {ReactElement} reactElement - react组件
 * @param {DOMNode} container - 挂载的DOM节点
 * @return {function} - 先执行本方法生成单例闭包再用返回的方法创建实例
 */


export default function generateSingleton() {
  let instance = null;
  let container = null;

  return function getInstance(reactElement) {
    if (!instance) {
      container = container || document.createElement('div');

      instance = ReactDOM.render(reactElement, container);
      document.body.appendChild(container);
    }
    return instance;
  };
}
