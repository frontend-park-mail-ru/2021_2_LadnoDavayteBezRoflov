import {ViewInterface} from './baseView.js'
import {constants} from '../app/constants.js'

export class NotFoundView extends ViewInterface {

    constructor() {
        super();
        this.root = document.getElementById(constants.elementsID.appRoot);
    }

    render() {
        let message = document.createElement('h1');
        message.innerText = constants.texts.notFound;
        message.style.color = '#8000FF';
        this.root.innerHTML = '';
        this.root.appendChild(message);
    }
}
