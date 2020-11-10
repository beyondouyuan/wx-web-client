
/**
 * 获取n至m之间的随机数 2位小数点(*100) / 100
 * 获取n至m之间的随机数 1位小数点(*10) / 10
 * @param {number} min 
 * @param {number} max 
 */
export function generateRandom(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
}


// 随机整数
export function generateFloorRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
