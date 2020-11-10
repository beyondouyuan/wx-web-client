export default function getPriceMix(price) {
    if (!!window.__shuffleList) {
        var numArr = (price + '').split('');
        var unicodeArr = [];
        numArr.map(function (num) {
            unicodeArr.push(window.__shuffleList[num]);
        });

        return unicodeArr.join('');
    }

    return price;
}