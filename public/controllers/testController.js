import { ControllerInterface } from "./baseController.js";
import { constants } from "../app/constants.js";

export class TestController extends ControllerInterface {
    constructor() {
        super();
        this.root = document.getElementById(constants.elementsID.appRoot);
    }

    work(data) {
        let message = document.createElement('h1');
        message.innerText = "Hello word!";
        message.style.color = '#8000FF';
        
        let link = document.createElement('a');
        link.href = "/404";
        link.innerText = 'lin
        
        this.root.innerHTML = '';
        this.root.appendChild(message);
        this.root.appendChild(link);
    }
}
