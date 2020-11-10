import React from 'react';
import Loadable from 'react-loadable';
import { Skeleton } from 'zzc-design-mobile';
// 低版本【安卓5.5.1中，国内租车app报错 webpackJsonp is undefined】
export default function withLoadable(comp) {
    return Loadable({
        loader: comp,
        loading: () => (
            null
            // <Skeleton>
            //     <Skeleton.Box>
            //         <Skeleton.Item height='5vh' width='100%' />
            //     </Skeleton.Box>
            // </Skeleton>
        )
    })
}
