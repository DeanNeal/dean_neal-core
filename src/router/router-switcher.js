// import Router from './router-core';
// import API from './../api';
// import { Utils } from '../utils/utils';

// export class RouteSwitcher {
//     constructor(root, parent) {
//         this.routes = RouteSwitcher.ROUTES;
//         this.root = root;
//         this.children = {};
//         this.parent = parent;
//         this.root.COMPONENT = this;

//         this.onCreate();
//     }

//     onCreate() {
//         this.routes.forEach(route => {
//             Router
//                 .on(route.path, (params) => {
//                     if (this.prevPage !== route.path) { // don't refresh parent router
//                         // REMOVE ALL COMPONENTS BEFORE CLEARING
//                         this.destroyChildren(this.root);
//                         this.renderComponent(this, route, params);
//                         this.prevPage = route.path;
//                         this.prevChild = null;
//                     }


//                     let childComp;
//                     let router;

//                     if (Object.keys(this.children).length) {
//                         childComp = this.children[Object.keys(this.children)[0]][0];
//                         if (childComp.root) {
//                             router = childComp.root.querySelectorAll('child-route-switcher')[0];
//                         }
//                     }

//                     if (router) {
//                         this.destroyChildren(router);
//                         let newComp = new ChildRouter(router, childComp);
//                         if (childComp) {
//                             childComp.children[newComp.constructor.name] = [];
//                             childComp.children[newComp.constructor.name].push(newComp);
//                         }

//                         let current = this.routes.filter(item => item.path === route.path)[0];
//                         let path = Router.getCurrentFullPath()[1];
//                         let child = this.getChild(current, path);

//                         if (this.prevChild !== path || !this.prevChild) {
//                             this.renderComponent(newComp, child, params);
//                             this.prevChild = path;
//                         }
//                     }

//                     this.setActiveLink();
//                 });
//         });
//         Router.update();
//     }

//     setActiveLink() {
//         let a = API.rootInstance.root.querySelectorAll('[href]'); //this.root.querySelectorAll('[href]');
//         a.forEach(item => {
//             let fullRoute = Router.getCurrentFullPath();
//             let fullPath = Router.getFullStringPath();
//             let attr = item.getAttribute('href');
//             let setActive = attr === fullPath || (fullRoute[0] === attr && !item.getAttribute('bind-link-exact'));
//             setActive ? item.classList.add('active') : item.classList.remove('active')
//         });
//     }

//     getChild(current, path) {
//         return path ? current.children.filter(item => item.path === path)[0] :
//             current.children.filter(item => item.path === '' || item.path === '/')[0];
//     }

//     getComponentName(route) {
//         return API.COMPONENTS.filter(r => r.selector === route.component)[0];
//     }

//     renderComponent(component, route, params) {
//         if (route) {
//             let newCompObject = this.getComponentName(route); //Component.COMPONENTS.filter(r => r.selector === route.component)[0];
//             if (newCompObject) {
//                 let newComp = document.createElement(route.component);
//                 this.checkAccess(component.root, newComp, route, () => {
//                     let a = new newCompObject(newComp, {}, component);
//                     component.children = {};
//                     component.children[a.constructor.name] = [];
//                     component.children[a.constructor.name].push(a);
//                 });

//             } else {
//                 this.appendEmpty(component.root);
//             }

//         } else {
//             this.appendEmpty(component.root);
//         }
//     }

//     checkAccess(root, newComp, route, cb) {
//         if (route.protector) {

//             let protector = API.injectorGet(route.protector); //new route.protector();
//             if (protector.check()) {
//                 root.appendChild(newComp);
//                 cb();
//             } else {
//                 // this.noAccess(root);
//             }
//         } else {
//             root.appendChild(newComp);
//             cb();
//         }

//     }


//     destroyChildren(root) {
//         let elements = root.querySelectorAll('*');
//         elements.forEach(node => {
//             if (Utils.isCustomElement(node)) {
//                 node.COMPONENT && node.COMPONENT.destroy();
//             }
//         })

//         // if (root.childNodes[0]) {
//         //     let currentChild = root.childNodes[0].COMPONENT;
//         //     if(currentChild) {
//         //         this.destroyAllChildren(currentChild.children);
//         //         currentChild.destroy();
//         //     }
//         // }
//         root.innerHTML = '';
//     }

//     // destroyAllChildren(children) {
//     //     for (let key in children) {
//     //         children[key].forEach(child => {
//     //             this.destroyAllChildren(child.children);
//     //             child.destroy();
//     //         })
//     //     }
//     // }

//     appendEmpty(root) {
//         let newComp = document.createElement('div');
//         newComp.innerHTML = `Please specify a component for this route <b style="color: red">${Router.getCurrentFullPath().join('/')}</b>!`;
//         root.appendChild(newComp);
//     }

//     // noAccess(root) {
//     //     let newComp = document.createElement('div');
//     //     newComp.innerHTML = `You have no access to this page`;
//     //     newComp.className = 'no-access';
//     //     root.appendChild(newComp);
//     // }
// }

// class ChildRouter extends RouteSwitcher {
//     constructor(root, parent) {
//         super(root, parent);
//     }

//     onCreate() {

//     }
//     destroy() {

//     }
// }