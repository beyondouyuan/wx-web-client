/**
 * 校验联系电话,手机号
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkPhone(val) {
    const isPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
    // const isMob = /^[1]([3-9])[0-9]{9}$/;
    return isPhone.test(val);
}

/**
 * 校验身份证号
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkIdCard(val) {
    if (val.length === 15) {
        return check15IdCardNo(val);
    }
    if (val.length === 18) {
        return check18IdCardNo(val);
    }
    return false;
}

/**
 * 判断是否大于18岁
 * @param val 身份证号
 * @return
 */
export function check18AgeData(val, min = 18) {
    // 获取出生年月
    const date = getBirthdayFromIdCard(val);
    // 计算
    const arrDate = date.split('-');
    const jsNow = new Date();
    let jsDate = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]);
    const nowYear = jsNow.getFullYear(); // 获取完整的年份(4位,1970-????)
    const nowMonth = jsNow.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
    const nowDate = jsNow.getDate(); // 获取当前日(1-31)

    const jsYear = jsDate.getFullYear();
    const jsMonth = jsDate.getMonth() + 1;
    jsDate = jsDate.getDate();

    if (nowYear - jsYear < min) {
        // 如果年份小于18，直接返回false
        return false;
    }
    if (nowYear - jsYear === min) {
        // 如果年份差等于18，则比较月份
        if (nowMonth < jsMonth) {
            // 年份等于18时，当前月份大于出生月份
            return false;
        }
        if (nowMonth === jsMonth) {
            // 如果月份也相等，则比较日期
            if (nowDate < jsDate) {
                // 年份等于18，月份相等时，如果当前日期小于出生日期，
                return false;
            }
        }
    }
    return true;
}

/**
 * 判断是否大于70岁
 * @param val 身份证号
 * @return
 */
export function check70AgeData(val, max = 70) {
    // 获取出生年月
    const date = getBirthdayFromIdCard(val);
    // 计算
    const arrDate = date.split('-');
    const jsNow = new Date();
    let jsDate = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]);
    const nowYear = jsNow.getFullYear(); // 获取完整的年份(4位,1970-????)
    const nowMonth = jsNow.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
    const nowDate = jsNow.getDate(); // 获取当前日(1-31)

    const jsYear = jsDate.getFullYear();
    const jsMonth = jsDate.getMonth() + 1;
    jsDate = jsDate.getDate();

    if (nowYear - jsYear < max) {
        return true;
    } else if ( nowYear == jsYear ) {
        if (nowMonth > jsMonth) {
            return true;
        }
        if (nowMonth === jsMonth) {
            if (nowDate > jsDate) {
                return true;
            }
        }


    }
    
    return false;
}

/**
 * 检查中文名
 */
export function checkChineseName(val) {
    const isName = /^[^\w\s\!@#\$%\^\&\*\(\)\+~\{\[\}\]\|\\\:;"'\<,\>\.\/\-]{2,}(?:[^\w\s\!@#\$%\^\&\*\(\)\+~\{\[\}\]\|\\\:;"'\<,\>\.\/\-]{1,})*$/;
    return isName.test(val);
}

/**
 * 校验护照
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkPassPort(val) {
    const isCard = /^([a-zA-z]|[0-9]){5,17}$/;
    return isCard.test(val);
}

/**
 * 校验军人证
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkSoldier(val) {
    const isCard = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
    return isCard.test(val);
}

/**
 * 校验回乡证
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkReentryCard(val) {
    const isCard = /(H|M)(\d{10})$/;
    return isCard.test(val);
}

/**
 * 校验台胞证
 * @param {string} val 值
 * @return {bool} 布尔值
 */
export function checkTaiwanCard(val) {
    const isCard = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
    return isCard.test(val);
}

/**
 * 校验航班号
 * @param {string} val 值
 */
export function checkFlight(val) {
    const isFlight = /^[0-9]{0,1}[A-Za-z]{1,3}[0-9]{1,5}$/;
    return isFlight.test(val);
}

/**
 * 校验邮箱
 * @param {string} val 值
 */
export function checkEmail(val) {
    // eslint-no-useless-escape
    const isEmail = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
    return isEmail.test(val);
}

/**
 * 去掉非法字符
 * @param {string} v 字符
 */
export function pureIllegalChars(v) {
    const pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/i;
    let result = '';
    for (let i = 0; i < v.length; i++) {
        result = result + v.substr(i, 1).replace(pattern, '');
    }
    return result.trim();
}

// 15位身份证， 待校验补全
function check15IdCardNo(val) {
    const reg = /^\d{15}$/;
    return reg.test(val);
}

// 18位身份证
function check18IdCardNo(val) {
    const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
    const arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验

    if (/^\d{17}\d|x$/i.test(val)) {
        let sum = 0;
        for (let i = 0; i < val.length - 1; i++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(val.substr(i, 1), 10) * arrExp[i];
        }
        const idx = sum % 11;
        // 检验第18为是否与校验码相等 因为类型不一样所以没用 ===
        return arrValid[idx] == val[17].toUpperCase();

        // 另一种方法
        // let sum = 0;
        // for (let i = 17; i > 0; i--) {
        //     const s = Math.pow(2, i) % 11;
        //     sum += s * val[17 - i];
        // }
        // console.log(typeof arrValid[sum % 11])
        // console.log(typeof val.substr(17, 1).toUpperCase())
        // return (arrValid[sum % 11] == val.substr(17, 1).toUpperCase());
    }
    return false;
}

// 检查港澳台公民身份证号码, 以810000，820000，830000开头
export function checkHMTIdCard(val) {
    return /^8[123]0000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(val)
}

/**
 * 获取当前添加身份证号的出生年月
 * @param idCard
 * @return
 */
function getBirthdayFromIdCard(idCard) {
    let birthday = '';
    if (idCard.length === 15) {
        birthday = `19${idCard.substr(6, 6)}`;
    } else if (idCard.length === 18) {
        birthday = idCard.substr(6, 8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
    return birthday;
}
