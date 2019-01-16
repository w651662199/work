
class EventEmitter {
	constructor() {
    this._events = this._events || {};
  }

  emit(key, ...args) {
    let e;
    e = this._events[key];
    if (e) {
      if (Array.isArray(e)) {
        for (let i = 0; i < e.length; i++) {
          e[i].apply(this, args);
        }
      } else {
        e.apply(this, args);
      }
    }
  }

  on(key, cb) {
    let e = this._events[key];
    if (e) {
      e.push(cb);
    } else {
      this._events[key] = [cb];
    }
  }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
