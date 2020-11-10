class EmiterEvent {
	constructor() {
		this._event = {}
	}
	on(key, handler) {
		if (!this._event[key]) {
			this._event[key] = []
		}

		this._event[key].push(handler)
	}
	emit(key) {
		const events = this._event[key]
		const args = Array.prototype.slice.call(arguments, 1)
		if (!events) {
			return
		}
		events.forEach(event => {
			event.apply(this, args)
		})
	}
	off(key, handler) {
		const handlers = this._event[key]
		if (!handlers) {
			return false
		}
		if (!handler) {
			//如果没有回调，表示取消此key下的所有方法
			handlers && (handlers.length)
		} else { // 取消某个订阅
			for (let i = 0; i < handlers.length; i++) {
				if (handlers[i] == handler) {
					// 从函数待用数组中移除订阅
					handlers.splice(i, 1)
				}
			}
		}
	}
	once(key, handler) {
		function handleEmiter() {
			const args = Array.prototype.slice.call(arguments, 0)
			handler.apply(this, args)
			this.off(key, handleEmiter)
		}
		this.on(key, handleEmiter)
	}
}

/**
 * 导出单例
 */
const EmiterEventMange = new EmiterEvent();

export default EmiterEventMange;
