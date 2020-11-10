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
                    if (e && e.type === 'show') {
                        event.emit('page-show');
                    }
                }
            });
        }
    }
}

export function onPageShow(listener) {
    const event = getEventInstance();
    event.on('page-show', listener);

    listenNative();
}

export function offPageShow(listener) {
    const event = getEventInstance();

    event.off('page-show', listener);
}
