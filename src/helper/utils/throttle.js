function throttle(handle, wait, maxTimelong) {
    let timeout = null,
        startTime = Date.parse(new Date);
    return function () {
        if (timeout !== null) clearTimeout(timeout);
        let curTime = Date.parse(new Date);
        const context = this;
        const args = arguments;
        if (curTime - startTime >= maxTimelong) { // 时间差>=maxTimelong秒直接执行
            handle.apply(context, args); // 实现回调函数handle接收参数
            startTime = curTime;
        } else { // 否则延时执行，像滚动了一下，差值<1秒的那种也要执行
            timeout = setTimeout(() => {
                handle.apply(context, args);
            }, wait);
        }
    }
}

export default throttle;