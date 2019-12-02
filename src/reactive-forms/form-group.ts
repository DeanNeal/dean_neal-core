import {Utils} from '../utils/utils';
export class FormControl {
    public valid:boolean = true;
    public dirty: boolean = false;
    public value: string;
    public initValue: string;
    public validators: [];
    public errors;
    public elem;
    public parent;

    constructor(params, parent) {
        // this.valid = true;
        // this.dirty = false;
        this.value = params[0] || '';
        this.initValue = params[0] || '';
        this.validators = params[1] || [];
        // this.parent = parent;
        Object.defineProperty(this, 'parent', {value: parent, writable: false})
        this.errors = {};
    }

    setElem(elem) {
        this.elem = elem;
        this.setValue(this.value, true, false);
    }

    setValue(value, silent = false, validate = true) {
        this.value = value;
        if (this.elem && Utils.isTextField(this.elem)) {
            this.elem.value = value;
        }

        if(this.elem && Utils.isCustomElement(this.elem)) {
            if(this.elem.COMPONENT) {
                this.elem.COMPONENT._onModelChange(value, this.dirty && !this.isValid());
            } else {
                throw new Error(this.elem.localName + ' is undefined');
            }
        }

        this.parent.getValues();
        if (!silent) {
            this.markAsDirty();
            this.parent.onChangeCallback();
        }

        if(validate) {
            this.parent._validate();
        }
     
    }

    validate() {
        if (this.validators.length) {
           
            this.errors = {};
            this.validators.forEach((v: any)=>{
                let validator = v(this);
                if(!validator[1] && Object.keys(this.errors).length === 0 && this.dirty) {
                    this.errors[validator[0]] = true;
                }
            });

            this.valid = this.validators.filter((validator: any) => validator(this)[1]).length === this.validators.length;
        } else {
            this.valid = true;
        }

        this.toggleClass();
    }

    toggleClass() {
        if(this.elem) {
            if (this.dirty) {
                this.valid ? this.elem.classList.remove('form-invalid') : this.elem.classList.add('form-invalid');
            } else {
                this.elem.classList.remove('form-invalid');
            }
        }
    }

    isValid() {
        this.validate();
        return this.valid;
    }

    markAsDirty() {
        this.dirty = true;
    }

    reset() {
        this.valid = true;
        this.dirty = false;
        this.value = this.initValue;
        if (this.elem && Utils.isTextField(this.elem)) {
            this.elem.value = this.initValue;
        }
    }
}

export class FormGroup {
    public valid: boolean = false;
    public controls;
    public value;
    public component;
    public onChangeCallback = ()=> {}

    constructor(controls) {
        this.valid = false;
        this.controls = {};
        this.value = {};
        this.component = null;
        this.onChangeCallback = () => {};

        for (let control in controls) {
            this.controls[control] = new FormControl(controls[control], this);
        }
        this._validate();
        this.getValues();
    }

    onChange(callback) {
        this.onChangeCallback = callback;
    }

    getValues() {
        let result = {};
        for (let control in this.controls) {
            result[control] = this.controls[control].value;
        }
        this.value = result;
        return result;
    }

    reset() {
        for (let control in this.controls) {
            this.controls[control].reset();
        }

        this._validate();
        this.getValues();
    }

    _validate() {
        let valid = [];
        for (let control in this.controls) {
            this.controls[control].validate(); // check current state
            valid.push(this.controls[control].valid);
        }

        this.valid = valid.filter(r => r).length === Object.keys(this.controls).length;

        if (this.component) {
            this.component.props._callAll();
        }
    }

    setValue(name, value) {
        if(typeof name === 'string'){
            this.controls[name].setValue(value);
            this.getValues();
        } else if (typeof name === 'object') {

            for (let key in name) {
                this.controls[key].setValue(name[key], false, false);
            }

            this.getValues();
            this.onChangeCallback();
            this._validate();
        }
    }

    isValid() {
        this._validate();
        return this.valid;
    }

    setComponent(component) {
        this.component = component;
    }
}