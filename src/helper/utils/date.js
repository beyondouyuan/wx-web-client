import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const DEFAULT_DATE_FORMAT_TYPE = 'YYYY/MM/DD HH:mm';
const PICKER_DATE_FROMAT_TYPE = 'YYYY/MM/DD HH:mm';

// 单位:日
const UNIT_DAY_TYPE = 'day';
// 单位:小时
const UNIT_HOUR_TYPE = 'hour';
// 单位:分钟
const UNIT_MINUTE_TYPE = 'minute';
// 单位:秒钟
const UNIT_SECOND_TYPE = 'second';

const DEFAULT_DATE_DIFF = '2';

/**
 * 对取还车时间格式化的封装
 * php返回时间戳
 * 支持读、取格式化的时间
 * 兼容时间戳和dayjs或者原生Date对象的参数
 */

/**
 * use example
 * import DateUitl, { DateTimeFormat } from '@utils/date';
 * // 实例化
 * const mm = new DateTimeFormat({
 * pickupTime: '2019-05-30 16:16',
 * dropoffTime: searchParams.toTime});
 * // 获取
 * console.log(mm.getFormatTime())
 * // 设置/更新
 * mm.setFormatTime({pickupTime: '2019/05/29 16:16',
 * dropoffTime: searchParams.toTime})
 * // 得到设置/更新后的取还车时间
 * console.log(mm.getFormatTime())
 */

export class DateTimeFormat {
    /**
     * 格式化取还车时间
     * @param {object} param 时间参数
     * @param {string} param.pickupTime 取车时间  单位为秒的时间戳 | 合法的dayjs或者原生Date对象
     * @param {string} param.dropoffTime 还车时间  同pickupTime
     */
    constructor({ pickupTime, dropoffTime }) {
        /**
         * 解决php时间戳单位为秒而javascript默认时间单位为毫秒的问题
         */
        if (!Number.isNaN(pickupTime) && pickupTime.toString().length < 13) {
            pickupTime *= 1000;
        }
        if (!Number.isNaN(dropoffTime) && dropoffTime.toString().length < 13) {
            dropoffTime *= 1000;
        }
        this.pickupTime = dayjs(pickupTime);
        this.dropoffTime = dayjs(dropoffTime);
    }

    /**
     * 格式化
     * @param {*} time dayjs的日期对象
     * @param {*} cFormat 格式化
     */
    _format(time, cFormat = `${DEFAULT_DATE_FORMAT_TYPE}`) {
        return time.format(`${cFormat}`);
    }

    /**
     * 返回周几
     * @param {*} time dayjs的日期对象
     * @param {*} cFormat 格式化
     */
    _week(time, cFormat = 'ddd') {
        return time.locale('zh-cn').format(`${cFormat}`);
    }

    /**
     * 时间差 默认单位为毫秒
     * @param {string} unit 单位
     */
    _diff(unit = 'milliscond') {
        return Number(this.dropoffTime.diff(this.pickupTime, `${unit}`));
    }

    /**
     * 格式化时间差 x天-x小时-x分
     */
    _formatDiff() {
        const milliscond = this._diff();
        const days = Math.floor(milliscond / (24 * 3600 * 1000));
        const diffHours = milliscond % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
        const hours = Math.floor(diffHours / (3600 * 1000));
        return hours > 0 ? `${days}天${hours}小时` : `${days}天`;
    }

    /**
     * 获取取还车的各种格式化时间格式
     */
    getFormatTime() {
        const pickDateTime = this._format(this.pickupTime); // 格式化完整的取车时间 2019-06-03 13:33
        const dropDateTime = this._format(this.dropoffTime); // 格式化完整的还车时间 xxxx年xx月xx日 xx小时xx分
        const pickDay = this._format(this.pickupTime, 'MM-DD'); // 格式化取车日期 xx月xx日 07-03
        const dropDay = this._format(this.dropoffTime, 'MM-DD'); // 格式化还车日期 xx月xx日 07-03
        const pickZhDay = this._format(this.pickupTime, 'MM月DD日'); // 中文格式化的取车时间 xx月xx日 07月03日
        const dropZhDay = this._format(this.dropoffTime, 'MM月DD日'); // 中文格式化的还车时间 xx月xx日 07月03日
        const pickWeek = this._week(this.pickupTime); // 格式化周几取车时间 周一
        const dropWeek = this._week(this.dropoffTime); // 格式化周几还车时间 周二
        const pickTime = this._format(this.pickupTime, 'HH:mm'); // 格式化钟点取车时间 10;30
        const dropTime = this._format(this.dropoffTime, 'HH:mm'); // 格式化钟点还车时间 11:00
        const diffDay = this._diff('day'); // 计算得到取还车时间差值 单位为天
        const diffHour = this._diff('hour'); // 计算得到取还车时间差值 单位为小时
        const diffTime = this._formatDiff(); // 计算得到取还车时间差 xx天xx小时 12天3小时
        const pickCalendar = this._format(this.pickupTime, `${PICKER_DATE_FROMAT_TYPE}`); // 用于日历选择的取车时间
        const dropCalendar = this._format(this.dropoffTime, `${PICKER_DATE_FROMAT_TYPE}`); // 用户日历选择的还车时间
        return {
            pickDateTime,
            pickDay,
            pickZhDay,
            pickWeek,
            pickTime,
            pickCalendar,
            dropDateTime,
            dropDay,
            dropZhDay,
            dropWeek,
            dropTime,
            dropCalendar,
            diffDay,
            diffHour,
            diffTime,
        };
    }

    /**
     * 设置\更新取还车时间
     * @param {object} param 时间参数
     * @param {string} param.pickupTime 取车时间  单位为秒的时间戳| 合法的dayjs或者原生Date对象
     * @param {string} param.dropoffTime 还车时间  同pickupTime
     */
    setFormatTime({ pickupTime, dropoffTime }) {
        if (!Number.isNaN(pickupTime) && pickupTime.toString().length < 13) {
            pickupTime *= 1000;
        }
        if (!Number.isNaN(pickupTime) && dropoffTime.toString().length < 13) {
            dropoffTime *= 1000;
        }
        this.pickupTime = dayjs(pickupTime);
        this.dropoffTime = dayjs(dropoffTime);
    }
}

// 优惠券时间格式化
export function couponTime(time) {
    if (!Number.isNaN(time) && time.toString().length < 13) {
        time *= 1000;
    }
    return dayjs(time).format('YYYY.MM.DD');
}

// 砍价倒计时格式化
export function formatBargainCountDown({ start, end, millisecond }) {
    if (start && end && !millisecond) {
        millisecond = dayjs(end).diff(start, 'millisecond');
    }

    const millisecPerSec = 1000; // 毫秒/秒
    const millisecPerMin = 60 * millisecPerSec; // 毫秒/分
    const millisecPerHour = 60 * millisecPerMin; // 毫秒/小时

    if (millisecond) {
        let remain = millisecond; // 剩余毫秒数
        const hours = Math.floor(remain / millisecPerHour);
        remain %= millisecPerHour;
        const minutes = Math.floor(remain / millisecPerMin);
        remain %= millisecPerMin;
        const seconds = Math.floor(remain / millisecPerSec);

        function padStart(val) {
            return String.prototype.padStart.call(val, 2, '0');
        }

        return {
            hours: padStart(hours),
            minutes: padStart(minutes),
            seconds: padStart(seconds),
        };
    }
    return {};
}

/**
 * 总结封装了业务中可能使用到的时间操作工具
 */
class DateUitls {
    formatPickDropNow({ time = this.today(`YYYY/MM/DD HH:mm`) } = {}) {
        /**
         * 取车时间(根据分钟值计算)是否为前半小时
         * 00-30
         * 是否在00-30分钟之间(不包含00和30)
         * 不包前也不包后
         */
        const BE_HALF_START = dayjs(time)
            .set(`${UNIT_MINUTE_TYPE}`, '01')
            .set(`${UNIT_SECOND_TYPE}`, '00');
        const BE_HALF_END = dayjs(time)
            .set(`${UNIT_MINUTE_TYPE}`, '29')
            .set(`${UNIT_SECOND_TYPE}`, '59');
        const AT_BF_HALF = dayjs(time).isBetween(
            dayjs(`${BE_HALF_START}`),
            dayjs(`${BE_HALF_END}`),
            `${UNIT_MINUTE_TYPE}`,
            '[]'
        );

        /**
         * 取车时间(分钟值)：是否为前半小时
         * 31-59
         * 是否在31-59分钟之间(包含31和59)
         * 包前包后
         */

        const AF_HALF_START = dayjs(time)
            .set(`${UNIT_MINUTE_TYPE}`, '31')
            .set(`${UNIT_SECOND_TYPE}`, '00');
        const AF_HALF_END = dayjs(time)
            .set(`${UNIT_MINUTE_TYPE}`, '59')
            .set(`${UNIT_SECOND_TYPE}`, '59');
        const AT_AF_HALF = dayjs(time).isBetween(
            dayjs(`${AF_HALF_START}`),
            dayjs(`${AF_HALF_END}`),
            `${UNIT_MINUTE_TYPE}`,
            '[]'
        );

        if (AT_BF_HALF) {
            time = dayjs(time)
                .set(`${UNIT_MINUTE_TYPE}`, '30')
                .set(`${UNIT_SECOND_TYPE}`, '00');
        } else if (AT_AF_HALF) {
            /**
             * 若是在后半小时 31 - 59之间
             * 则默认时间为4小时候后再+1小时，并且分钟取整点
             * 如14:31 取车时间为 19:00而不是18:31
             */
            time = dayjs(time)
                .add('1', `${UNIT_HOUR_TYPE}`)
                .set(`${UNIT_MINUTE_TYPE}`, '00');
        } else {
            time = dayjs(time);
        }
        return time;
    }
    /**
     * 获取当天日期
     * @param {string} cFormat 格式化格式
     */
    today(cFormat = 'YYYY/MM/DD') {
        return dayjs(Date.now()).format(cFormat);
    }

    /**
     * 获取昨日日期
     * @param {sting} cFormat 格式化格式
     */
    yesterday(cFormat = 'YYYY/MM/DD') {
        return dayjs(Date.now() - 24 * 60 * 60 * 1000).format(cFormat);
    }

    /**
     * 当前时间是否在两者之间
     * @param {object} param 参数对象
     * @param {object} param.current 参数对象
     * @param {object} param.start 参数对象
     * @param {object} param.end 参数对象
     * @param {object} param.unit 参数对象
     * @param {object} param.cFormat 参数对象
     */
    isBetween({ current = '', start = '', end = '', unit = 'day', cFormat = '[]' } = {}) {
        return dayjs(`${current}`).isBetween(
            dayjs(`${start}`),
            dayjs(`${end}`),
            `${unit}`,
            `${cFormat}`
        );
    }

    /**
     * 是否在国庆期间
     */

    isBetweenNational(date) {
        if (!date) return false;
        if (!Number.isNaN(date) && date.toString().length < 13) {
            date *= 1000; // 时间戳
        } else {
            date = dayjs(date); // 合法的dayjs或者原生Date对象
        }
        date = dayjs(date).format('YYYY/MM/DD HH:mm');

        const start = dayjs(Date.now())
            .set('month', 9)
            .set('date', 1)
            .format('YYYY/MM/DD HH:mm');
        const end = dayjs(Date.now())
            .set('month', 9)
            .set('date', 7)
            .format('YYYY/MM/DD HH:mm');
        return dayjs(`${date}`).isBetween(
            dayjs(`${start}`),
            dayjs(`${end}`),
            `day`,
            `[]`
        );
    }

    /**
     * 是否在节假日期间
     */
    isBetweenHoliday(date, holidayAlerts = []) {
        if (!holidayAlerts || !holidayAlerts.length || !date) return false;
        if (!Number.isNaN(date) && date.toString().length < 13) {
            date *= 1000; // 时间戳
        } else {
            date = dayjs(date); // 合法的dayjs或者原生Date对象
        }
        date = dayjs(date).format('YYYY/MM/DD HH:mm');
        return holidayAlerts.find(holiday => {
            const { timeStart, timeEnd } = holiday;
            const start = dayjs(timeStart.replace(/-/g, '/'));
            const end = dayjs(timeEnd.replace(/-/g, '/'));
            return dayjs(`${date}`).isBetween(
                dayjs(`${start}`),
                dayjs(`${end}`),
                `day`,
                `[]`
            );
        });
    }

    setDate(year, month, date) {
        return dayjs(Date.now())
            .set('year', year)
            .set('month', month)
            .set('date', date)
            .format('YYYY/MM/DD HH:mm');
    }
    /**
     * 是否春节,首页用
     */
    isBetweenHomeNewYear(date) {
        if (!date) return false;
        if (!Number.isNaN(date) && date.toString().length < 13) {
            date *= 1000; // 时间戳
        } else {
            date = dayjs(date); // 合法的dayjs或者原生Date对象
        }
        date = dayjs(date).format('YYYY/MM/DD HH:mm');
        const start = this.setDate(2020, 0, 21);
        const end = this.setDate(2020, 1, 1);
        return dayjs(`${date}`).isBetween(
            dayjs(`${start}`),
            dayjs(`${end}`),
            `day`,
            `[]`
        );
    }
    stockGrowth(pickTime, dropTime) {
        // 春节库存预警
        // let tips = '';
        // const newYesrStart = '2020/01/21 00:00';
        // const now = Date.now();
        // const isBetweenNewYear =
        //     this.isBetweenHomeNewYear(pickTime) || this.isBetweenHomeNewYear(dropTime);
        // const isNowInnernewYear = this.isBetweenHomeNewYear(now);
        // if (!isBetweenNewYear) return;

        // // 当前时间与新年开始的时间差值(单位周)
        // let diffNewYearStart = Math.abs(
        //     this.parseDiff({
        //         start: newYesrStart,
        //         end: now,
        //         unit: 'week',
        //     })
        // );
        // // 若是当前时间在新年期间，均预警库存量90%以上
        // if (isNowInnernewYear) {
        //     diffNewYearStart = 0;
        // }

        // // 库存增长量
        // const stockInc = 0.11;
        // // 库存总量
        // const stockEnd = 0.9;
        // const stockWarning =
        //     ((stockEnd - diffNewYearStart * stockInc) * 100).toFixed() + '%';
        // tips = `春节期间大部分车行需3-7天起租，库存紧张${stockWarning}车辆已被预订，建议您现在就下单租车！`;
        // return tips;
        // 五一库存预警
        return this.maydayStockGrowth(pickTime, dropTime)
    }

    maydayStockGrowth(pickTime, dropTime) {
        let tips = '';
        const maydaystart = '2020/04/25 00:00';
        const now = Date.now();
        const isBetweenMayday =
            this.isBetweenMayday(pickTime) || this.isBetweenMayday(dropTime);
        const isNowInnerMayday = this.isBetweenMayday(now);
        if (!isBetweenMayday) return;

        // 当前时间与新年开始的时间差值(单位周)
        let diffMaydayStart = this.parseDiff({
            end: now,
            start: maydaystart,
            unit: 'day',
        });
        const end = this.setDate(2020, 4, 5);
        if (this.isAfter({
            end: maydaystart,
            start: now,
            unit: 'day'
        }) || this.isAfter({
            end: now,
            start: end,
            unit: 'day'
        }) || diffMaydayStart < 0) return;
        // 库存增长量
        let stockInc = 0.045;
        // 若是当前时间在新年期间，均预警库存量90%以上
        if (isNowInnerMayday || diffMaydayStart > 4) {
            diffMaydayStart = 4;
            stockInc = 0.05;
        }


        // 库存总量
        const stockEnd = 0.7;
        const stockWarning =
            ((stockEnd + diffMaydayStart * stockInc) * 100).toFixed() + '%';
        tips = `五一为用车旺季，${stockWarning}车辆已经被租了，马上下单锁定车辆！`;
        return tips;
    }
    /**
    * 是否五一
    */
    isBetweenMayday(date) {
        if (!date) return false;
        if (!Number.isNaN(date) && date.toString().length < 13) {
            date *= 1000; // 时间戳
        } else {
            date = dayjs(date); // 合法的dayjs或者原生Date对象
        }
        date = dayjs(date).format('YYYY/MM/DD HH:mm');
        const start = this.setDate(2020, 4, 1);
        const end = this.setDate(2020, 4, 5);
        return dayjs(`${date}`).isBetween(
            dayjs(`${start}`),
            dayjs(`${end}`),
            `day`,
            `[]`
        );
    }

    /**
     * 是否春节,搜索列表页用
     */
    isBetweenSearchNewYear(date) {
        if (!date) return false;
        if (!Number.isNaN(date) && date.toString().length < 13) {
            date *= 1000; // 时间戳
        } else {
            date = dayjs(date); // 合法的dayjs或者原生Date对象
        }
        date = dayjs(date).format('YYYY/MM/DD HH:mm');
        const start = this.setDate(2020, 0, 21);
        const end = this.setDate(2020, 0, 31);
        return dayjs(`${date}`).isBetween(
            dayjs(`${start}`),
            dayjs(`${end}`),
            `day`,
            `[]`
        );
    }

    /**
     * 减去
     * @param {object} param 参数对象
     * @param {object} param.current 参数对象
     * @param {object} param.value 参数对象
     * @param {object} param.unit 参数对象
     */
    subtract({ current = null, value = '', unit = 'day' } = {}) {
        return dayjs(`${current}`).subtract(`${value}`, `${unit}`);
    }

    /**
     * 返回当前时间的星期数 dayjs插件将星期的插件剔除了，所以直接使用format来处理这个需求
     * @param {string} datetime 时间
     * @param {string} cFormat ddd ：周x dddd：星期x
     */
    week(datetime, cFormat = 'ddd') {
        if (datetime && !Number.isNaN(datetime) && datetime.toString().length < 13) {
            datetime *= 1000;
        }
        return dayjs(datetime)
            .locale('zh-cn')
            .format(`${cFormat}`);
    }

    /**
     * 添加时间
     * @param {object} param 参数对象
     * @param {string} param.current 当前时间 默认为null，即为当天时间 可选
     * @param {string} param.num 增加数量 默认增加一天
     * @param {string} param.unit 增加单位 默认为day 即 天 可选
     * @param {string} param.cFormat 格式化格式 可选
     */
    add({ current = null, num = '1', unit = 'day', cFormat = 'YYYY/MM/DD' } = {}) {
        const time = current && current !== null ? current : Date.now();
        return dayjs(time)
            .add(num, `${unit}`)
            .format(`${cFormat}`);
    }

    /**
     * 设置/获取分钟
     * @param {object} param 参数对象
     * @param {string} param.current 当前时间，必选
     * @param {string} param.value 分钟值， 可选
     */
    minute({ current = null, value = null } = {}) {
        if (value) {
            // set
            return dayjs(current).minute(value);
        } // get
        return dayjs(current).minute();
    }

    /**
     * 设置/获取小时
     * @param {object} param 参数对象
     * @param {string} param.current 当前时间，必选
     * @param {string} param.value 小时值， 可选
     */
    hour({ current = null, value = null } = {}) {
        if (value) {
            // set
            return dayjs(current).hour(value);
        } // get
        return dayjs(current).hour();
    }

    /**
     * 获取从Dayjs对象中取到的信息
     * @param {object} param 参数对象
     * @param {string} param.current 当前时间 必选
     * @param {string} param.unit 获取的单位 year | month | day | date | hour | minute
     */
    get({ current = null, unit = 'day' } = {}) {
        return dayjs(current).get(unit);
    }

    /**
     * 设置Dayjs对象中的信息
     * @param {object} param 参数对象
     * @param {string} param.current 当前时间 必选
     * @param {string} param.unit 设置的单位 year | month | day | date | hour | minute
     * @param {string} param.value 设置的值
     */
    set({ current = null, unit = 'day', value = '' } = {}) {
        return dayjs(current).set(unit, value);
    }

    /**
     * 格式化时间
     * @param {string/timestamp} datetime 时间字符串或者时间戳
     * @param {string} cFormat 格式化
     */
    format(datetime, cFormat = 'YYYY/MM/DD') {
        if (datetime && !Number.isNaN(+datetime) && datetime.toString().length < 13) {
            datetime *= 1000;
        }
        return dayjs(datetime).format(`${cFormat}`);
    }

    /**
     * end是否在start之后
     * @param {object} param 参数数据
     * @param {string} param.start 起始时间
     * @param {string} param.end 截止时间
     * @param {string} param.unit 单位
     */
    isAfter({ start, end, unit = null }) {
        return dayjs(this.format(end, 'YYYY/MM/DD HH:mm')).isAfter(
            dayjs(this.format(start, 'YYYY/MM/DD HH:mm')),
            unit
        );
    }

    /**
     * end是否和start相同
     * @param {object} param 参数数据
     * @param {string} param.start 起始时间
     * @param {string} param.end 截止时间
     * @param {string} param.unit 单位
     */
    isSame({ start, end, unit = 'day' }) {
        return dayjs(this.format(end, 'YYYY/MM/DD HH:mm')).isSame(
            dayjs(this.format(start, 'YYYY/MM/DD HH:mm')),
            `${unit}`
        );
    }
    /**
     * 得到时间戳（秒）
     * @param {string} datetime 时间
     */
    timestamp(datetime) {
        return dayjs(datetime).unix();
    }

    /**
     * 计算时间差 返回 数值
     * @param {object} param 格式化参数
     * @param {string} param.start 起始时间
     * @param {string} param.end 结束时间
     * @param {string} param.unit 计算单位
     */
    parseDiff({ start, end, unit = 'hour' }) {
        const date1 = dayjs(`${this.format(end, 'YYYY/MM/DD HH:mm')}`);
        const date2 = dayjs(`${this.format(start, 'YYYY/MM/DD HH:mm')}`);
        return Number(date1.diff(date2, `${unit}`));
    }

    /**
     * 获取两个日期的时间间隔 返回类似倒计时结构 x天-x小时-x分-x秒
     * @param {object} param 参数数据
     * @param {string} param.start 起始时间
     * @param {string} param.end 结束时间
     * @param {bool} param.full 是否返回完整时间 true xx天-xx小时-xx分钟-xx秒 false xx天-xx小时
     */
    diff({ start, end, full = false }) {
        if (start && !Number.isNaN(start) && start.toString().length <= 13) {
            start = this.format(Number(start), 'YYYY/MM/DD HH:mm');
        }
        if (end && !Number.isNaN(end) && end.toString().length <= 13) {
            end = this.format(Number(end), 'YYYY/MM/DD HH:mm');
        }
        // 得到毫秒数
        const milliscond = dayjs(`${end}`).diff(dayjs(`${start}`));
        // 计算相差天数
        let days = Math.floor(milliscond / (24 * 3600 * 1000));
        // 计算出小时数
        const diffHours = milliscond % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
        let hours = Math.floor(diffHours / (3600 * 1000));
        // 计算相差分钟数
        const diffMinutes = diffHours % (3600 * 1000); // 计算小时数后剩余的毫秒数
        const minutes = Math.floor(diffMinutes / (60 * 1000));
        // 计算相差秒数
        const diffSeconds = diffMinutes % (60 * 1000); // 计算分钟数后剩余的毫秒数
        const seconds = Math.round(diffSeconds / 1000);
        // 解决时间临界值
        if (minutes >= 29) {
            hours += 1;
        }
        if (hours === 24) {
            days += 1;
            hours = 0;
        }
        /**
         * 目前返回时间差为实际"真实"的时间差
         * 按需求：若大于三十分钟而小于一小时的时间，即 30 < minutes < 60 则加收一小时时间，使用时根据实际需求，看看是否需要判断 minutes 来增加hours
         */
        return {
            days,
            hours,
            minutes,
            seconds,
            times: full
                ? `${days}天${hours}小时${minutes}分钟${seconds}秒`
                : Number(days) > 0 && Number(hours) > 0
                    ? `${days}天${hours}小时`
                    : Number(hours) > 0
                        ? `${hours}小时`
                        : `${days}天`,
        };
    }
    diffDuration(timestamp) {
        if (!Number.isNaN(timestamp) && timestamp.toString().length < 13) {
            timestamp *= 1000;
        }
        // 计算相差天数
        let days = Math.floor(timestamp / (24 * 3600 * 1000));
        // 计算出小时数
        const diffHours = timestamp % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
        let hours = Math.floor(diffHours / (3600 * 1000));
        // 计算相差分钟数
        const diffMinutes = diffHours % (3600 * 1000); // 计算小时数后剩余的毫秒数
        const minutes = Math.floor(diffMinutes / (60 * 1000));
        // 计算相差秒数
        const diffSeconds = diffMinutes % (60 * 1000); // 计算分钟数后剩余的毫秒数
        const seconds = Math.round(diffSeconds / 1000);
        // 解决时间临界值
        if (minutes >= 29) {
            hours += 1;
        }
        if (hours === 24) {
            days += 1;
            hours = 0;
        }
        /**
         * 目前返回时间差为实际"真实"的时间差
         * 按需求：若大于三十分钟而小于一小时的时间，即 30 < minutes < 60 则加收一小时时间，使用时根据实际需求，看看是否需要判断 minutes 来增加hours
         */
        return {
            days,
            hours,
            minutes,
            seconds,
            times:
                Number(days) > 0 && Number(hours) > 0
                    ? `${days}天${hours}小时`
                    : Number(hours) > 0
                        ? `${hours}小时`
                        : `${days}天`,
        };
    }

    /**
     * 封装页面所需要的时间格式
     * @param {*string} pickTime 时间戳 毫秒单位 取车时间
     * @param {*string} dropTime 时间戳 毫秒单位 还车时间
     */
    formateTime(pickTime, dropTime) {
        const datePickTime = dayjs(pickTime).format('YYYY/MM/DD HH:mm');
        const dateDropTime = dayjs(dropTime).format('YYYY/MM/DD HH:mm');

        const pickedTime = dayjs(pickTime).format('YYYY-MM-DD HH:mm');
        const dropedTime = dayjs(dropTime).format('YYYY-MM-DD HH:mm');

        const milliscond = dayjs(`${dateDropTime}`).diff(dayjs(`${datePickTime}`));
        // 页面需要格式
        const datePick = dayjs(pickTime).format('MM-DD');
        const dateDrop = dayjs(dropTime).format('MM-DD');
        const weekPick = dayjs(pickTime)
            .locale('zh-cn')
            .format('ddd');
        const weekDrop = dayjs(dropTime)
            .locale('zh-cn')
            .format('ddd');
        const hourPick = dayjs(pickTime).format('HH:mm');
        const hourDrop = dayjs(dropTime).format('HH:mm');
        // 计算出天数
        // 计算出小时数
        // 计算相差分钟数
        const hours = milliscond % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
        let diffHours = Math.floor(hours / (3600 * 1000));

        const minutes = hours % (3600 * 1000); // 计算小时数后剩余的毫秒数
        const diffMinutes = Math.floor(minutes / (60 * 1000));

        let diffDay = Math.floor(milliscond / (24 * 3600 * 1000));

        // 解决时间临界值
        if (diffMinutes >= 29) {
            diffHours += 1;
        }
        if (diffHours === 24) {
            diffDay += 1;
            diffHours = 0;
        }

        const continueDay = diffDay > 0 ? `${diffDay}天` : '';
        const continueHour = diffHours > 0 ? `${diffHours}小时` : '';

        return {
            datePick,
            dateDrop,
            weekPick,
            weekDrop,
            hourPick,
            hourDrop,
            continueDay,
            continueHour,
            pickedTime,
            dropedTime,
        };
    }

    /**
     * 格式化数据为时间戳
     * @param {*string} time 需要格式化得时间
     */
    ToTimeStamp(time) {
        return dayjs(time).valueOf();
    }

    /**
     * 增加时间
     * @param {*string} value 数量
     * @param {*string} unit 单位 year， month， day等
     */
    addTime(value, unit) {
        return dayjs().add(value, unit);
    }
}

const DateUitl = new DateUitls();

/**
 * use example
 * import DateUitl from '../../utils/date';
 * const today = DateUitl.today('YYYY/MM/DD HH:mm')
 */

export default DateUitl;
