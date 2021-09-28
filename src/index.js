'use strict';

import { router } from './utils/Router/Router.js';
import TestController from './controllers/TestController.js'

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', () => {
  try {
    router.registerUrl('/', new TestController);
    router.route();
  } catch (error) {
    console.error(error);
  }
});
