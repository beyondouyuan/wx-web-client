export default function () {
    let isOverdue = false;
    const serviceElm = document.getElementById('js-service-href');
    const disableClassName = 'disable';
    /**
     * 为了解决某联想手机出现点击客服链接打开两次页面甚至因此造成app停止运行的问题
     * 三管齐下，使用“暴力”方案解决
     * 1、阻止默认事件(onClick事件和href做同一件事，两者取其一)，
     * 使用js进行跳转(或者直接return true使用默认行为，但是既然都写了那么多js，此处就直接用js跳转咯)
     * 2、阻止事件传播等行为，杜绝可能因事件传播造成此问题
     * 3、使用isLocked进行表单式的“防重”
     */
    let isLocked = false;
    function onClick(e) {
        e.preventDefault();
        e.stopPropagation(); 
        if (isLocked) return;
        isLocked = true;
        const element = e.currentTarget;
        if (isOverdue) {
            element.classList.add(disableClassName);
            element.removeEventListener('click', onClick);
        } else {
            element.classList.remove(disableClassName);
            window.location.href = element.href;
            /**
             * 为了以防万一 多加一个定时器吧
             */
            setTimeout(() => {
                isLocked = false;
            }, 600)
        }
    }

    if (serviceElm) {
        const countdown = serviceElm.dataset.countdown;

        if (countdown > 0) {
            // TODO: 定时器
            setTimeout(() => { isOverdue = true; }, countdown);
            serviceElm.addEventListener('click', e => onClick(e));
        } else {
            serviceElm.classList.add(disableClassName);
            serviceElm.href = 'javascript:void(0)';
        }
    }
}
