export function locationHref(url) {
    console.log('url', url)
    return location.href = url;
}

export const formatParams = (params, pure = true) => {
    const arr = [];
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined) {
            console.error(`formatParams: 传参的键${key}的值为undefined，已丢弃`);
        } else {
            pure ? arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`) : arr.push(`${key}=${params[key]}`);
        }
    });
    return arr.join('&');
};
