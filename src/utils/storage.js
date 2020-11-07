const TOKEN_KEY = 'TOKEN_KEY'

export const getToken = () => {
    const res = localStorage.getItem(TOKEN_KEY)
    return isJsonString(res) ? JSON.parse(res) : res
}

export const setToken = (v) => {
    if (typeof v !== 'string') {
        v = JSON.stringify(v)
    }
    return localStorage.setItem(TOKEN_KEY, v)
}

export const removeToken = () => {
    return localStorage.removeItem(TOKEN_KEY)
}

// 是否为JSON字符串
export function isJsonString(val) {
    if (typeof val === 'string') {
        try {
            const obj = JSON.parse(val)
            if (typeof obj === 'object' && obj) {
                return true;
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }
}