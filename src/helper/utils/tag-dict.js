export const clientTagDict = {
    1: ['ZMXY', 'frame_gray', 'frame_green', 'frame_black', 'supplier1', 'supplier2', 'supplier3', 'driverAge'],
    2: ['canConfirmNow', 'notConfirmNow', 'freeCancel', 'conditionalCancel', 'notConfirmNowDetail', 'penaltyCancel'],
    3: ['coupon', 'SUPDISC'],
    4: ['localLicense', 'notLocalLicense', 'hotPrice'],
    5: ['bargainScale'],
    6: ['supplier4', 'bargain'],
    7: ['hidedPrice'],
    8: ['GNZC-2075']
};

export const clientTagSortDict = [
    ['canConfirmNow', 'notConfirmNow', 'notConfirmNowDetail'], // 确认的type在第一行
    ['freeCancel', 'conditionalCancel', 'penaltyCancel'] // 取消的type在第二行
];
