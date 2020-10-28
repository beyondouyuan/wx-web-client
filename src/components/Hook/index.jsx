import React, { useEffect, useState } from 'react';

export default function() {
    const [ count, setCount ] = useState(1)
    // useEffect(() => {
    //     console.log(`第二个参数为空的 => ${count}`)
    // }) // 第二个参数如果直接不传，那么useEffect函数将会在每次任何一个state变更情况下都执行
    // useEffect(() => {
    //     console.log(`第二个参数为空数组 => ${count}`)
    // }, []) // 第二个参数如果为空数组，那么useEffect只会在函数组件第一次加载时执行，state值变更时不会执行该函数
    useEffect(() => {
        console.log(`第二个参数不为空数组 => ${count}`)
    }, [count]) // 第二个参数的数组中包含又值，该值为某个或者多个state，那么只有这些state值中的某一个变更了，useEffect函数就会被触发
    return (
        <div>
            <p>一个子组件</p>
            <button onClick={() => setCount(count + 1)}>按钮</button>
        </div>
    )
}