import { isFunction, isArray } from './type';

export default class Validator {
    queue = []
    add = (key, rule, errMsg = '') => {
        if (isArray(key)) {
            key.forEach(item => {
                const {
                    key,
                    rule,
                    errMsg
                } = item;

                this.queue.push({ key, rule, errMsg });
            })
        } else {
            this.queue.push({ key, rule, errMsg });
        }
        return this;
    }

    launch() {
        const result = {};

        this.queue.forEach((item, i) => {
            const {
                key,
                rule,
                errMsg
            } = item;

            if (isFunction(rule)) {
                rule = rule();
            }

            if (!rule) {
                result[key] = errMsg;
            }
        });
        this.queue = [];
        return result;
    }
}
