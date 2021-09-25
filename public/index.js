import {router} from './app/router.js';
import { TestController } from './controllers/testController.js';

(async () => {
    try {
        router.route();
    } catch (error) {
        console.error(error);
    }
})();
