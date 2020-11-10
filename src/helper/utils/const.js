import { getUserId } from './cookie';
import { getQueryString } from './url';

import guide1 from '@/image/guide1.jpg';
import guide2 from '@/image/guide2.jpg';
import guide3 from '@/image/guide3.jpg';
import guide4 from '@/image/guide4.jpg';
import guide5 from '@/image/guide5.jpg';
import guide6 from '@/image/guide6.jpg';
import guide7 from '@/image/guide7.jpg';
import guide8 from '@/image/guide8.jpg';

const USER_ID = getUserId() || 'default';

// 证件类型
export const cardList = [
    { cardType: 1, cardName: '身份证' },
    { cardType: 3, cardName: '护照' },
    { cardType: 4, cardName: '军人证' },
    { cardType: 6, cardName: '回乡证' },
    { cardType: 25, cardName: '回乡证' },
    { cardType: 26, cardName: '台胞证' },
];
// 首次修改订单并付款
export const CRD_ZZC_FIRST_REVISE_ORDER_SUCCESSFULLY =
    'CRD_ZZC_FIRST_REVISE_ORDER_SUCCESSFULLY';

// 修改订单用以保存驾驶人信息
export const CRD_ZZC_DRIVER_INFO = 'CRD_ZZC_DRIVER_INFO';
// 优惠券
export const COUPON = {
    COUPON_AVAILABLE_LIST: 'CRD_ZZC_COUPON_AVAILABLE_LIST', // 可用优惠券
    COUPON_SELECT: 'CRD_ZZC_COUPON_SELECT', // 选择的优惠券
    COUPONS: 'CRD_ZZC_COUPONS', // 全部优惠券
    COUPONS_BACK: 'CRD_ZZC_COUPONS_BACK', // 从coupon页选择后返回
};

// 驾驶人信息
export const DRIVER = {
    NAME: 'CRD_ZZC_DRIVER_NAME',
    SELECTINDEX: `CRD_ZZC_${USER_ID}_SELECT_DRIVER_INDEX`,
    DRIVER_BACK: 'CRD_ZZC_DRIVER_BACK',
};

export const SHOULD_REFETCH = 'SHOULD_REFETCH';
export const COMMENT = `CRD_ZZC_${getQueryString('orderId')}_COMMENT`;
export const COMMENT_SAVE = 'CRD_ZZC_comment_save_success';

// 首汽用户首次点击订单详情的认证教程（首次针对订单而不是用户）
export const DRIVER_AUTH_CLICK_GUIDE_FIRST_TIME_OF_THE_ORDER =
    'CRD_ZZC_DRIVER_AUTH_CLICK_GUIDE_FIRST_TIME_OF_THE_ORDER';

// 微信支付分授权
export const WECHATSORCE = 'WECHAT_SORCE';

// 新手指南
export const GUIDEOBJ = [
    {
        title: '预订',
        problem: '自驾租车麻烦吗？',
        answer: '不麻烦，只需轻松三步！',
        descOrder: ['选择合适车型', '填写驾驶员信息', '提交订单，完成预订'],
        img: guide1,
    },
    {
        title: '证件',
        problem: '取车需要携带哪些证件？',
        answer: '两证一卡',
        desc: ['驾驶员二代身份证', '驾驶员驾驶证正副面', '驾驶员信用卡'],
        tips:
            'TIPS：部分车行支持芝麻免押卡，无需信用卡；部分车行支持护照、回乡证、台胞证租车，具体见产品详情页',
        img: guide2,
    },
    {
        title: '费用',
        problem: '租车基本费用有哪些？',
        answer: '价格透明没隐藏收费',
        desc: ['租车费', '手续费', '基本保险费'],
        tips:
            'TIPS：在国内租车每个车行都会收取一定金额的手续费(包含人员及场地费)和基本保险费，所有收费都可以在页面的【费用明细】查看',
        img: guide3,
    },
    {
        title: '保险',
        problem: '需要购买什么保险？',
        answer: '我们为您提供最佳方案！',
        desc: [
            '订单已包含基本保险',
            '可在线升级更全面的保险保障',
            '也可选择租租车人身财物险，全方位保障',
        ],
        img: guide4,
    },
    {
        title: '取车',
        problem: '取车流程会很复杂吗？',
        answer: '简单，就2步',
        descOrder: [
            '按订单或短信提示，自行前往门店取车，部分车行可送车上门或免费接您到门店取车',
            '到店后出示取车证件，刷租车押金，取车完成',
        ],
        img: guide5,
    },
    {
        title: '用车',
        problem: '路上遇到问题怎么办？',
        answer: '找租租车！',
        desc: [
            '遇到任何问题，请随时联系租租车客服中心，为您提供专业指引，并全程跟进，让您无后顾之忧！',
        ],
        img: guide6,
    },
    {
        title: '还车',
        problem: '还车流程麻烦吗？',
        answer: '不麻烦，就2步',
        descOrder: [
            '车辆停靠还车区域，工作人员验车',
            '核对费用明细，退回租车押金，刷取违章押金，还车完成',
        ],
        img: guide7,
    },
    {
        title: '开始预订',
        problem: '和租租车一起',
        problem1: '自驾探索祖国大好河山',
        desc: [
            '租租车甄选顶级车行，出行无担忧',
            '多重优惠，新客专属',
            '贴心服务您行程前后的每一个细节',
        ],
        img: guide8,
        btn: '立即租车',
    },
];

// 闪租弹窗的特权列表
export const PRIVILEGE_LISTS = {
    get latest() {
        return this['1.0.1'];
    },
    // '1.0.1': [
    //     {
    //         icon: 'easy_rent_new_car',
    //         title: '新车',
    //         desc: '保证3年内新车',
    //     },
    //     {
    //         icon: 'easy_rent_wash',
    //         title: '洗车后交付',
    //         desc: '一车一洗，干净卫生',
    //     },
    //     {
    //         icon: 'easy_rent_full_fuel',
    //         title: '满油取车',
    //         desc: '送车上门80%以上油量<br>到店取车保证满油',
    //     },
    //     {
    //         icon: 'easy_rent_unlimit',
    //         title: '无限里程',
    //         desc: '安心驰骋不限里程',
    //     },
    //     {
    //         icon: 'easy_rent_cancel_free',
    //         title: '免费取消',
    //         desc: '取车前可免费取消（国家法定节假日除外）',
    //     },
    //     {
    //         icon: 'easy_rent_hundred_percent',
    //         title: '100%有车',
    //         desc: '到店无车免费更换<br>同组车型',
    //     },
    //     {
    //         icon: 'easy_rent_sesame',
    //         title: '信用免押金',
    //         desc: '免租车&违章押金（需在下单页授权芝麻）',
    //     },
    //     {
    //         icon: 'easy_rent_to_door',
    //         title: '送车上门',
    //         desc: '取还车很轻松（部分门店接到店取车）',
    //     },
    //     {
    //         icon: 'easy_rent_ins',
    //         title: '保险8折',
    //         desc: '租租车安心保障险8折',
    //     },
    // ],
    '1.0.1': [{
        title: '严选好车，保证优良车况',
        list: [{
            icon: 'easy_rent_new_car',
            text: '新车保证*'
        }, {
            icon: 'easy_rent_wash',
            text: '洗车后交付'
        }, {
            icon: 'easy_rent_full_fuel',
            text: '满油取车*'
        }]
    }, {
        title: '品质服务，更好租车体验',
        list: [{
            icon: 'easy_rent_sesame',
            text: '信用免押金'
        }, {
            icon: 'easy_rent_to_door',
            text: '送车上门*'
        }, {
            icon: 'easy_rent_drive_guide',
            text: '驾驶指导'
        }]
    }, {
        title: '全面保障，安心自驾无忧',
        list: [{
            icon: 'easy_rent_hundred_percent',
            text: '100%有车'
        }, {
            icon: 'easy_rent_cancel_free',
            text: '免费取消*'
        }, {
            icon: 'easy_rent_nomatch_pay',
            text: '不符即赔'
        }]
    }]
};

// 长短租
export const CRD_ZZC_LONG_RENT_FORM = 'CRD_ZZC_LONG_RENT_FORM';

// 验价
export const LOCAL_NEW_GOODS_ID = 'LOCAL_NEW_GOODS_ID';


export const STATIC_AVATER_IMG = [
    'https://imgcdn5.zuzuche.com/static/46/11/67a3ceb7cba6b5ca50214142e4997fcd.jpg',
    'https://imgcdn5.zuzuche.com/static/25/44/93fe796c279d006e9faf994c5f2d057a.jpg',
    'https://imgcdn5.zuzuche.com/static/33/54/aaa91dc3e1ea776c43e5882c7752cbc8.jpg',
    'https://imgcdn5.zuzuche.com/static/31/30/818449e323497bbabffc920302e64007.jpg',
    'https://imgcdn5.zuzuche.com/static/49/92/f6859cb214b40126d3565f0ffcb5045d.jpg',
    'https://imgcdn5.zuzuche.com/static/12/21/af17e015413ae98bfc0d01182fe843a3.jpg',
    'https://imgcdn5.zuzuche.com/static/23/70/ad424554c76c5cc3436769e2f00c75c9.jpg',
    'https://imgcdn5.zuzuche.com/static/20/77/a8f788146debabb93bf5b72058bdd3ed.jpg',
    'https://imgcdn5.zuzuche.com/static/10/69/ccf2fe5029fbf916cea045947da47a2e.jpg',
    'https://imgcdn5.zuzuche.com/static/37/33/9e8f81f563e63ac114cdd7cb1c5cad17.jpg',
    'https://imgcdn5.zuzuche.com/static/35/04/c168f1b81caf09ed56d8956b266c0f6f.jpg',
    'https://imgcdn5.zuzuche.com/static/53/66/a8425c69ea9b84b598e49ec526619d44.jpg',
    'https://imgcdn5.zuzuche.com/static/61/76/80f58f54031dc1af4220643715cbe9e7.jpg',
    'https://imgcdn5.zuzuche.com/static/27/31/f307bb11f22091fe8cd7d823e2e6bc9c.jpg',
    'https://imgcdn5.zuzuche.com/static/34/20/c836a1f53e360e31605ea5f42d6ac18a.jpg',
    'https://imgcdn5.zuzuche.com/static/35/14/5940984fff5fa494333c81084498aec4.jpg'
];

// utm参数
export const UTM = 'CRD_ZZC_UTM';

// 详情页localStorage预渲染数据
export const CARPREVIEWINFO = 'CRD_ZZC_CARPREVIEWINFO';
// 详情页数据编辑保存
export const VIEWSEDITDATA = 'CRD_ZZC_VIEWSEDITDATA';

// 列表页专题类型 &topic=*
export const TOPIC_NEW_DRIVER = 'newDriver';


/*
  智能进度条：
            --------------------=================
            ↑      均匀增加     ↑ 
                                ↑ 根据请求次数增加 ↑ 
*/

// “匀速增加”进度条的运行时间。（毫秒）
export const uniformSpeedTime = 4000;
// “匀速增加”间隔时间。
export const intervalTime = 100;
// “匀速增加”的进度条长度。
export const uniformSpeedProgressLength = 80;
// “根据请求次数”的进度条长度
export const requestProgressLength = 100 - uniformSpeedProgressLength;
