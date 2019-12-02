
interface CustomElementConfig {
   selector:string;
   template: string;
   style?: string;
   useShadow?: boolean;
   component?: any;
}

const validateSelector = (selector: string) => {
   if (selector.indexOf('-') <= 0) {
       throw new Error('You need at least 1 dash in the custom element name!');
   }
};

export const CustomElement = (config: CustomElementConfig) => (cls) => {
   validateSelector(config.selector);
   if (!config.template) {
       throw new Error('You need to pass a template for the element');
   }
   const template = document.createElement('template');
   if (config.style) {
       config.template = `<style>${config.style}</style> ${config.template}`;
   }
   template.innerHTML = config.template;
   // const onInit = cls.prototype.onInit || function () {};



   cls.prototype.connectedCallback = function() {
       const clone = document.importNode(template.content, true);
       if (config.useShadow) {
           this.attachShadow({mode: 'open'}).appendChild(clone);
       } else {
           this.appendChild(clone);
       }

       const component = new config.component(clone);
       
      //  component.onInit();  
   };
   window.customElements.define(config.selector, cls);
};