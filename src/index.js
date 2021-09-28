'use strict';

import {router} from './utils/Router/Router.js';

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
  
  try {
    router.route();
  } catch (error) {
    console.error(error);
  }
});
