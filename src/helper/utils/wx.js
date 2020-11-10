function promisify(func) {
  return function (...params) {
    return new Promise((res, rej) =>
      func.call(this, {
        ...params,
        success: (e) => res(e),
        fail: (e) => rej(e)
      })
    );
  }
}

class WxInstance {
  constructor() {
    if (Wx.isWx()) {
      const script = document.createElement('script');

      script.src = "http://res.wx.qq.com/open/js/jweixin-1.5.0.js";
      document.body.appendChild(script);
      console.log('wx', window.wx);
    } else {
      console.log('不是微信环境,无需载入jssdk');
    }
    return window.wx;
  }
}

export default class Wx extends WxInstance {
  constructor(config) {
    super();

    this.jsApiList = ['updateAppMessageShareData', 'updateTimelineShareData'];
    super.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: '', // 必填，公众号的唯一标识
      timestamp: Date.now(), // 必填，生成签名的时间戳
      nonceStr: '', // 必填，生成签名的随机串
      signature: '',// 必填，签名
      jsApiList: this.jsApiList, // 必填，需要使用的JS接口列表
      ...config
    });
  }

  static isWx() {
    return true;
  }

  ready(func) {
    return super.ready(func);
  }

  // 检测api
  check() {
    return promisify(super.checkJsApi)({
      jsApiList: this.jsApiList
    });
  }

  // 分享到好友
  shareToFriend({ title, desc, link, imgUrl }) {
    return ready(promisify(super.updateAppMessageShareData)({
      title, // 分享标题
      desc, // 分享描述
      link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, // 分享图标
    }));
  }

  // 分享到朋友圈
  shareToTimeline({ title, link, desc, imgUrl }) {
    return ready(promisify(super.updateTimelineShareData)({
      title, // 分享标题
      desc, // 分享描述
      link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, // 分享图标
    }));
  }
}
