import DateUitl from '@utils/date';
import * as utilLogger from '@utils/logger';

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function isNeedUpdateSearchTime(pickTime, dropTime) {
    let update = false;
    const diffPickDrop = DateUitl.parseDiff({
        start: pickTime,
        end: dropTime,
        unit: 'minute',
    });

    const { days } = DateUitl.diff({
        start: pickTime,
        end: dropTime,
    });

    const isLegalTime = DateUitl.isAfter({
        start: DateUitl.today('YYYY/MM/DD HH:mm'),
        end: DateUitl.format(pickTime, 'YYYY/MM/DD HH:mm'),
        unit: 'minute',
    });

    if (!isLegalTime || diffPickDrop < 30 || days < 0 || days > 90) {
        update = true;
    }
    return update;
}
