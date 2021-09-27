'use strict';

/**
  * Константа, содержащая в себе urlы.
  */
export const urls = {
    root: '/',
    boards: '/boards',
    login: '/login',
    register: '/register',
    logout: '/logout',
    notFound: '/404',
};

/**
  * Константа, содержащая в себе id корневого элемента.
  */
export const html = {
    root: 'root'
}

/**
  * Константа, содержащая в себе параметры бэкенда.
  */
export const uri = {
    url: 'localhost',
    port: '8000',
}

/**
  * Константа, содержащая в себе коды статусов HTTP.
  */
export const httpStatusCodes = {
    ok: 200,
    created: 201,
    
    unauthorized: 401,

    internalServerError: 500,
}

/**
  * Константа, содержащая в себе сообщения.
  */
export const constantMessages = {
    notFound: 'Страница не найдена! ;]',
}
