export function getType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
}

function isType(val, type) {
    return getType(val) === type;
}

export function isNull(val) {
    return isType(val, 'Null');
}
export function isUndefined(val) {
    return isType(val, 'Undefined');
}

export function isString(val) {
    return isType(val, 'String');
}

export function isNumber(val) {
    return isType(val, 'Number');
}

export function isArray(val) {
    return isType(val, 'Array');
}

export function isObject(val) {
    return isType(val, 'Object');
}

export function isFunction(val) {
    return isType(val, 'Function');
}

export function isBoolean(val) {
    return isType(val, 'Boolean');
}

export function isRegExp(s) {
    return isType(s, 'RegExp');
}

export function isEmptyObject(s) {
    for (const key in s) {
        if ({}.hasOwnProperty.call(s, key)) {
            return false;
        }
    }
    return true;
}

export function isObjectEqual(a, b) {
    // Of course, we can do it use for in
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i += 1) {
        const propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

export function isNaN(val) {
    return isNumber(val) && val !== val;
}

// 是否为JSON字符串
export function isJsonString(val) {
    if(typeof val === 'string') {
        try {
            const obj = JSON.parse(val)
            if(typeof obj === 'object' && obj) {
                return true;
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }
}