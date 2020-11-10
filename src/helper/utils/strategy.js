const strategy = {
  phone: function (val) {
    return /13888888888/.test(val);
  }
};

/**
 * TODO: 策略模式将一些正则聚合起来
 */
export default class validate {
  message = ''

  validate(val, rule, msg) {
    const argu = rule.split(':');
    const func = argu.shift();
    const result = strategy[func](val, ...argu);
    if (!result) {
      this.msg = msg;
    }
    return this;
  }

  start() {
    if (this.msg) {
      throw new TypeError(this.msg);
    }
  }
}
