/**
 * Icon svg
 *
 * 用例：
 * ```js
 * import Icon from 'path/to/Icon';
 * ReactDOM.render(
 *   <div><Icon name='gift' /></div>,
 *   mountedNode
 * )
 * ```
 *
 * 新增：
 * 1. 将svg文件放到`./svg/`目录
 * 2. 在`./define.js`加载svg文件
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as mapSvgs from './define';

import './styles.scss';


Icon.propTypes = {
  // 与svg文件名相同（将“中划线”改为“下划线”）
  name: PropTypes.string.isRequired
};

export default function Icon(props) {
  const { name, className, style={} } = props;
  const Svg = mapSvgs[name];

  if (!Svg) {
    // eslint-disable-next-line
    console.error(new Error(`未定义这个Icon: ${name}`));
    return null;
  }

  return (
    <i className={`component-icon ${className}`} style={style}>
      {/* <Svg /> */}
      {/* 不实用上面的方式，用下面 */}
      <svg><use xlinkHref={Svg} /></svg>
    </i>
  );
}
