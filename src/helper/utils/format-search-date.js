import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

// 默认时间格式
const DEFAULT_DATE_FORMAT_TYPE = 'YYYY/MM/DD HH:mm';
// 单位:日
const UNIT_DAY_TYPE = 'day';
// 单位:小时
const UNIT_HOUR_TYPE = 'hour';
// 单位:分钟
const UNIT_MINUTE_TYPE = 'minute';
// 单位:秒钟
const UNIT_SECOND_TYPE = 'second';

const DEFAULT_DATE_DIFF = '2';

export class FormatSearchPickDate {
    /**
     * 格式化取还车时间
     * @param {object} param 时间参数
     * @param {string} param.pickTime 取车时间  单位为秒的时间戳  | 合法的dayjs或者原生Date对象
     *  | 默认为当前时间往后2天
     * @param {string|number} param.num 增加时间
     * @param {string} param.unit 增加时间的单位  day | hour | minute 等
     * @param {string} param.dropTime 还车时间  同pickTime
     */
    constructor({
        pickTime = dayjs()
            .add(`${DEFAULT_DATE_DIFF}`, `${UNIT_DAY_TYPE}`)
            .set(`${UNIT_HOUR_TYPE}`, 10)
            .set(`${UNIT_MINUTE_TYPE}`, 0)
            .set(`${UNIT_SECOND_TYPE}`, 0),
        num = 2,
        unit = 'day',
        dropTime = dayjs(pickTime).add(`${num}`, `${unit}`),
    } = {}) {
        /**
         * 解决php时间戳单位为秒而javascript默认时间单位为毫秒的问题
         * 若传入的不是字符串，而是合法的dayjs或者原生Date对象
         * 则将其转换为时间戳，以此统一时间单位/格式
         */
        if (!Number.isNaN(pickTime) && pickTime.toString().length <= 13) {
            pickTime *= 1000; // 时间戳
        } else {
            pickTime = dayjs(pickTime); // 合法的dayjs或者原生Date对象
        }
        if (!Number.isNaN(dropTime) && dropTime.toString().length <= 13) {
            dropTime *= 1000;
        } else {
            dropTime = dayjs(dropTime);
        }
        this.pickTime = dayjs(pickTime);
        this.dropTime = dayjs(dropTime);
        const now = dayjs();
        const NIGHT_START = dayjs(now)
            .set(`${UNIT_HOUR_TYPE}`, '00')
            .set(`${UNIT_MINUTE_TYPE}`, '00');
        const NIGHT_END = dayjs(now)
            .set(`${UNIT_HOUR_TYPE}`, '03')
            .set(`${UNIT_MINUTE_TYPE}`, '59');
        const NOW_AT_NIGHT = dayjs(now).isBetween(
            dayjs(`${NIGHT_START}`),
            dayjs(`${NIGHT_END}`),
            `${UNIT_HOUR_TYPE}`,
            '[]'
        );
        if (NOW_AT_NIGHT) {
            // 当前时间是否为夜间
            this.pickTime = dayjs(now)
                .set(`${UNIT_HOUR_TYPE}`, '10')
                .set(`${UNIT_MINUTE_TYPE}`, '00');
            this.dropTime = dayjs(this.pickTime).add(`${num}`, `${unit}`);
        } else {
            /**
             * 先计算整点或者半点的临界点，再计算夜间
             */

            /**
             * 取车时间(根据分钟值计算)是否为前半小时
             * 00-30
             * 是否在00-30分钟之间(不包含00和30)
             * 不包前也不包后
             */
            const BE_HALF_START = this.pickTime
                .set(`${UNIT_MINUTE_TYPE}`, '01')
                .set(`${UNIT_SECOND_TYPE}`, '00');
            const BE_HALF_END = this.pickTime
                .set(`${UNIT_MINUTE_TYPE}`, '29')
                .set(`${UNIT_SECOND_TYPE}`, '59');
            const AT_BF_HALF = this.pickTime.isBetween(
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
            const AF_HALF_START = this.pickTime
                .set(`${UNIT_MINUTE_TYPE}`, '31')
                .set(`${UNIT_SECOND_TYPE}`, '00');
            const AF_HALF_END = this.pickTime
                .set(`${UNIT_MINUTE_TYPE}`, '59')
                .set(`${UNIT_SECOND_TYPE}`, '59');
            const AT_AF_HALF = this.pickTime.isBetween(
                dayjs(`${AF_HALF_START}`),
                dayjs(`${AF_HALF_END}`),
                `${UNIT_MINUTE_TYPE}`,
                '[]'
            );
            if (AT_BF_HALF) {
                this.pickTime = this.pickTime
                    .set(`${UNIT_MINUTE_TYPE}`, '30')
                    .set(`${UNIT_SECOND_TYPE}`, '00');
                this.dropTime = dayjs(this.pickTime).add(`${num}`, `${unit}`);
            } else if (AT_AF_HALF) {
                /**
                 * 若是在后半小时 31 - 59之间
                 * 则默认时间为4小时候后再+1小时，并且分钟取整点
                 * 如14:31 取车时间为 19:00而不是18:31
                 */
                this.pickTime = this.pickTime
                    .add('1', `${UNIT_HOUR_TYPE}`)
                    .set(`${UNIT_MINUTE_TYPE}`, '00');
                this.dropTime = dayjs(this.pickTime).add(`${num}`, `${unit}`);
            } else {
                this.pickTime = dayjs(this.pickTime);
                this.dropTime = dayjs(this.pickTime).add(`${num}`, `${unit}`);
            }
            /**
             * 取车时间 是否为前半夜
             * 21:00 - 23:59
             */
            const BE_NIGHT_START = this.pickTime
                .set(`${UNIT_HOUR_TYPE}`, '21')
                .set(`${UNIT_MINUTE_TYPE}`, '00');
            const BE_NIGHT_END = this.pickTime
                .set(`${UNIT_HOUR_TYPE}`, '23')
                .set(`${UNIT_MINUTE_TYPE}`, '59');
            const BE_AT_NIGHT = this.pickTime.isBetween(
                dayjs(`${BE_NIGHT_START}`),
                dayjs(`${BE_NIGHT_END}`),
                `${UNIT_MINUTE_TYPE}`,
                '[]'
            );

            /**
             * 取车时间：是否为后半夜
             * 00:00 - 07:59
             * (因为计算小时的间距，8点之后正常取+4小时的计算，所以比较时包前包后)
             */
            const AF_NIGHT_START = this.pickTime
                .set(`${UNIT_HOUR_TYPE}`, '00')
                .set(`${UNIT_MINUTE_TYPE}`, '00');
            const AF_NIGHT_END = this.pickTime
                .set(`${UNIT_HOUR_TYPE}`, '07')
                .set(`${UNIT_MINUTE_TYPE}`, '59');
            const AF_AT_NIGHT = this.pickTime.isBetween(
                dayjs(`${AF_NIGHT_START}`),
                dayjs(`${AF_NIGHT_END}`),
                `${UNIT_HOUR_TYPE}`,
                '[]'
            );
            /**
             * 取车时间是否能为夜间
             */
            const PICK_AT_NIGHT = BE_AT_NIGHT || AF_AT_NIGHT;

            /**
             * 取车时间为夜间 21:00 - 08:00
             * 则取车日期+1 时间为上午10:00
             */
            if (PICK_AT_NIGHT) {
                /**
                 * 前半夜
                 * 21:00 - 23:59
                 * 日期取车时间 +1
                 * 同理还车时间 +1
                 */
                if (BE_AT_NIGHT) {
                    this.pickTime = this.pickTime
                        .add('1', `${UNIT_DAY_TYPE}`)
                        .set(`${UNIT_HOUR_TYPE}`, '10')
                        .set(`${UNIT_MINUTE_TYPE}`, '00');
                    this.dropTime = dayjs(this.dropTime)
                        .add('1', `${UNIT_DAY_TYPE}`)
                        .set(`${UNIT_HOUR_TYPE}`, '10')
                        .set(`${UNIT_MINUTE_TYPE}`, '00');
                } else {
                    /**
                     * 后半夜
                     * 00:00 - 07:00
                     * 此时已经是第二天凌晨 日期无需+1 只需要设置为当天的10:00即可
                     * 还车时间同理设置
                     */
                    this.pickTime = this.pickTime
                        .set(`${UNIT_HOUR_TYPE}`, '10')
                        .set(`${UNIT_MINUTE_TYPE}`, '00');
                    this.dropTime = dayjs(this.dropTime)
                        .set(`${UNIT_HOUR_TYPE}`, '10')
                        .set(`${UNIT_MINUTE_TYPE}`, '00');
                }
            }
        }
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
        return Number(this.dropTime.diff(this.pickTime, `${unit}`));
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
     * 只返回取还车时间戳
     * 以便于管理
     */
    getFormatTime() {
        return {
            pickTime: dayjs(this.pickTime).format(DEFAULT_DATE_FORMAT_TYPE),
            dropTime: dayjs(this.dropTime).format(DEFAULT_DATE_FORMAT_TYPE),
        };
    }

    /**
     * 设置\更新取还车时间
     * @param {object} param 时间参数
     * @param {string} param.pickTime 取车时间  单位为秒的时间戳| 合法的dayjs或者原生Date对象
     * @param {string} param.dropTime 还车时间  同pickTime
     */
    setFormatTime({ pickTime = dayjs(), dropTime = dayjs(pickTime).add(2, 'day') } = {}) {
        if (pickTime && !Number.isNaN(pickTime) && pickTime.toString().length <= 13) {
            pickTime *= 1000; // 时间戳
        } else {
            pickTime = dayjs(pickTime); // 合法的dayjs或者原生Date对象
        }
        if (dropTime && !Number.isNaN(dropTime) && dropTime.toString().length <= 13) {
            dropTime *= 1000;
        } else {
            dropTime = dayjs(dropTime);
        }
        this.pickTime = dayjs(pickTime);
        this.dropTime = dayjs(dropTime);
    }
}

/**
 * 是否夜间取还车
 * @param {string} pickTime 时间戳 | 合法的dayjs或者原生Date对象
 */
export function isBetweenNight(pickTime) {
    if (pickTime && !Number.isNaN(pickTime) && pickTime.toString().length <= 13) {
        pickTime = dayjs(pickTime * 1000); // 时间戳
    } else {
        pickTime = dayjs(pickTime); // 合法的dayjs或者原生Date对象
    }
    /**
     * 取车时间 是否为前半夜
     * 21:00 - 23:59
     */
    const BE_NIGHT_START = pickTime
        .set(`${UNIT_HOUR_TYPE}`, '21')
        .set(`${UNIT_MINUTE_TYPE}`, '00');
    const BE_NIGHT_END = pickTime
        .set(`${UNIT_HOUR_TYPE}`, '23')
        .set(`${UNIT_MINUTE_TYPE}`, '59');
    const BE_AT_NIGHT = pickTime.isBetween(
        dayjs(`${BE_NIGHT_START}`),
        dayjs(`${BE_NIGHT_END}`),
        `${UNIT_MINUTE_TYPE}`,
        '[]'
    );
    /**
     * 取车时间：是否为后半夜
     * 00:00 - 07:59
     * (因为计算小时的间距，8点之后正常取+4小时的计算，所以比较时包前包后)
     */
    const AF_NIGHT_START = pickTime
        .set(`${UNIT_HOUR_TYPE}`, '00')
        .set(`${UNIT_MINUTE_TYPE}`, '00');
    const AF_NIGHT_END = pickTime
        .set(`${UNIT_HOUR_TYPE}`, '07')
        .set(`${UNIT_MINUTE_TYPE}`, '59');
    const AF_AT_NIGHT = pickTime.isBetween(
        dayjs(`${AF_NIGHT_START}`),
        dayjs(`${AF_NIGHT_END}`),
        `${UNIT_HOUR_TYPE}`,
        '[]'
    );
    /**
     * 取车时间是否能为夜间
     */
    return BE_AT_NIGHT || AF_AT_NIGHT;
}
