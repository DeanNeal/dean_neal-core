import {Component, Decorators} from '../../../../core';
import Tpl from './doc-forms.component.html';

@Decorators.ComponentDecorator({
    template: Tpl,
    props: {
    	checkbox: {

    	},
    	form: {

    	}
    }
})
export class DocFormsComponent {

    onInit() {

    }

    submit(e, form) {
    	
    }
}