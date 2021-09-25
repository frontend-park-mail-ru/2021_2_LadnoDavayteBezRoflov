import { ControllerInterface } from "./baseController.js";
import { NotFoundView } from '../views/notFoundView.js'

export class NotFoundController extends ControllerInterface {
    constructor() {
        super();
        this.view = new NotFoundView;
    }

    work(data) {
        this.view.render();
    }
}
