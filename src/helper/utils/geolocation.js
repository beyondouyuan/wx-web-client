import { isApp } from "./native";
import zzc from './zzc';
/**
 * 封装地理定位
 */
const options = {
  enableHighAccuracy: true, // 是否使用最高精度结果，====>>>> ⚠️这会导致较慢的响应时间或者增加耗电量
  timeout: 5000, // 设备必须在多长时间内返回一个位置，默认是无限大Infinity ====>>>
  maximumAge: 0 // 是一个正的 long 值。它表明可以返回多长时间（即最长年龄，单位毫秒）内的可获取的缓存位置
};


export function getGeolocation(tips = '添加位置，让更多人看到你的视频') {
  return new Promise((resolve) => {
    if (isApp()) {
      zzc.call('base_requestLocation', {
        tips, // 动态权限申请时（如果未授予定位权限）应用弹框的文案，为空时app使用默认的文案（注：iOS无法动态修改权限文案）
        forceShowDialog: true, // 可选值true||false，默认false，false时将由原生控制是否弹出申请授权弹窗；true时则一定要弹出申请授权弹窗，即使用户之前拒绝了定位授权。
        success: function (response) {
          response.data ? resolve(response.data) : resolve({});
        }
      });
    } else {
      const { navigator } = window;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const response = {
            lat: position.coords.latitude, // 维度
            lng: position.coords.longitude // 经度
          };
          resolve(response);
        }, () => {
          resolve({});
        }, options);
      }
    }

  });
}
