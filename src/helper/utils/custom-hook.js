import { useState, useEffect, useRef } from 'react';

/**
 * 传入剩余秒数，生成倒计时
 * @param {number} dealineSeconds 距离死线的剩余秒数
 */
export const useCountDown = (dealineSeconds = 0) => {
    const [countDown, setCountDown] = useState(dealineSeconds);
    const lastTimeStamp = useRef(null);
    useEffect(() => {
        let timeoutId;
        let differ = 1000;

        if (countDown > 0) {
            timeoutId = setTimeout(() => {
                const nowTimeStamp = Date.now();
                // 修正JS队列和执行时间带来的时间差异
                if (lastTimeStamp.current) {
                    differ = nowTimeStamp - lastTimeStamp.current;
                }
                lastTimeStamp.current = nowTimeStamp;
                setCountDown(countDown - 1);
            }, 2000 - differ);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [countDown, lastTimeStamp]);

    return {
        countDown,
        min: Math.floor(countDown / 60),
        sec: countDown % 60
    };
};
