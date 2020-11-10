import EventEmitter from 'events';
import { isApp } from './index';
import zzc from '../zzc';


function getEventInstance() {
    if (getEventInstance.event) return getEventInstance.event;

    getEventInstance.event = new EventEmitter();

    return getEventInstance.event;
}

function listenNative() {
    if (!listenNative._once) {
        listenNative._once = true;

        const event = getEventInstance();
        if (isApp()) {
            zzc.call('onVisibilitychange', {
                listener(e) {
                    if (e && e.type === 'hide') {
                        event.emit('page-hide');
                    }
                }
            });
        }
    }
}

export function onPageHide(listener) {
    const event = getEventInstance();
    event.on('page-hide', listener);

    listenNative();
}

export function offPageHide(listener) {
    const event = getEventInstance();

    event.off('page-hide', listener);
}
