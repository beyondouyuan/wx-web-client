/**
 * 深层遍历对象并trim对象属性
 * @param {object} o
 */
export function deepParseIterator(o) {
    Object.keys(o).forEach(function(k) {
        if (o[k] !== null && typeof o[k] === 'object') {
            deepParseIterator(o[k]);

            return;
        }

        if (typeof o[k] === 'string') {
            o[k] = o[k].trim();
        }
    });

    return o;
}
