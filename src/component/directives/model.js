import { Utils } from '../../core';

export function _model(array, loopParams) {
    array.forEach(item => {
        
        if (loopParams) {
            if(item.attr !== loopParams.iterator) {
                throw new Error(`Incorrect model value ${item.attr}; ` + this.constructor.name);
            }
        }
        
        if (item.elem.localName === 'input') {

            switch (item.elem.type) {
                case 'checkbox':
                    item.elem.addEventListener('change', (e) => {
                        this.setComponentVariable(item.attr, e.currentTarget.checked ? true : false);
                    }, false);
                    break;
                case 'radio':
                    item.elem.addEventListener('change', (e) => {
                        this.setComponentVariable(item.attr, e.currentTarget.value);
                    }, false);
                    break;
                case 'text':
                case 'email':
                case 'number':
                case 'password':
                    item.elem.addEventListener('input', (e) => {
                        const value = (item.elem.type === 'number' ? parseFloat(e.currentTarget.value) : e.currentTarget.value);
                        this.setComponentVariable(item.attr, value, loopParams);
                    }, false);
                    break;
            }

        }

        if (Utils.isCustomElement(item.elem)) {
            item.elem.addEventListener('modelChange', (e) => {
                this.setComponentVariable(item.attr, e.detail);
            }, false);
        }
    });
}