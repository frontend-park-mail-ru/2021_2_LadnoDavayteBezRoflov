import {router} from './app/router.js';
import { constants } from './app/constants.js';
import { TestController } from './controllers/testController.js';

(() => {
    try {
        router.registerUrl(constants.urls.index, new TestController);
        router.registerUrlAlias(constants.urls.index, constants.urls.home);
        router.route();
    } catch (error) {
        console.error(error);
    }
})();
