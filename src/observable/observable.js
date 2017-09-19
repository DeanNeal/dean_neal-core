import { ifObject, ifArray } from '../decorators';

export class Observable {
    constructor(options) {
        this.lId = -1;
        if (options) {
            this.defineProperties(options);
        }

        this.callbacksArray = [];
    }

    defineProperties(options) {
        Object.keys(options).forEach(key => {
            this.defineProperty(key, options[key]);
        });
    }

    defineProperty(key, value) {
        Object.defineProperty(this, key, {
            set: value => this.set(key, value),
            get: () => this.get(key),
            configurable: true
        })
    }

    sub(f) {
        this.callbacksArray.push({ f, id: ++this.lId });

        f.call(this, this._data);

        let a = Number(this.lId);
        return {
            unsubscribe: () => {
                // console.log(this.callbacksArray.length);
                this.unsubscribe(a);
            }
        }
    }

    unsubscribe(id) {
        this.callbacksArray = this.callbacksArray.filter(r => {
            return r.id !== id;
        });
        // console.log(this.callbacksArray);
    }

    clear() {
        this._data = {};
        this._callAll();
    }

    set(data, value) {

        if (typeof data == 'object') {
            if (data.length || data.length === 0) {
                this._data = data;
            } else {
                for (let key in data) {
                    this._data[key] = data[key];
                }
                this.defineProperties(data);
            }
        } else {
            this.defineProperty(data, value);
            this._data[data] = value;
        }

        this._callAll();
    }

    getData() {
        return this._data;
    }

    get(key) {
        return this._data[key];
    }

    _callAll() {
        this.callbacksArray.forEach(r => {
            if (this._data) {
                r.f.call(this, this._data)
            }
        });
    }
}



@ifObject
export class ObservableModel extends Observable {
    constructor(options) {
        super(options);
        this._data = options || {};
    }
}


@ifArray
export class ObservableCollection extends Observable {
    constructor(options) {
        super(options);
    }

    save(params) {
        let res = this._data.map(item => {
            if (item.id === params.id) {
                item = params;
            }
            return item;
        });
        this.set(res);
    }

    last() {
        return this._data[this._data.length - 1];
    }

    push(data, model) {
        this._data.push(data);
        this._callAll();
    }

    unshift(data, model) {
        this._data.unshift(data);
        this._callAll();
    }

    remove(id) {
        this._data = this._data.filter(item => item.id != id);
        this._callAll();
    }

}