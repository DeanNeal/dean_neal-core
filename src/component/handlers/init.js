import {PRIVATES} from '../private';
import {Utils} from '../../core';

export function _init(root, directive) {
    let array = directive ? PRIVATES.DIRECTIVES[directive] : [];

    let attr = root.getAttribute(directive);
    if (attr && !Utils.isCustomElement(root)) { // only for loops
        let obj = {
            elem: root,
            attr,
            items: [],
            parent: root.parentNode,
            cached: root
        };

        array.get ? array.get(this).push(obj) : array.push(obj);
        root.removeAttribute(directive);
        if (directive === 'ac-for') elem.remove();
    }

    for (let elem of root.querySelectorAll(`[${directive}]`)) {
        let attr = elem.getAttribute(directive);

        // exclude inner loops
        if (directive === 'ac-for' && elem.querySelectorAll('[ac-for]').length) {
            for (let innerElem of elem.querySelectorAll(`[ac-for]`)) {
                innerElem.setAttribute('frameworkInnerLoop', true);
            }
        }

        if (directive === 'ac-for' && elem.getAttribute('frameworkInnerLoop')) {
            elem.removeAttribute('frameworkInnerLoop');
            return;
        }

        let obj = {
            elem,
            attr,
            comment: Utils.insertAfter(document.createComment(directive + ': ' + attr), elem),
            items: [],
            parent: elem.parentNode,
            cached: elem
        };console.log(array);
        array.get ? array.get(this).push(obj) : array.push(obj);
        elem.removeAttribute(directive);
        if (directive === 'ac-for') elem.remove();
    }
    return array;
}