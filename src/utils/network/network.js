'use strict';

/**
  * Класс, реализующий работу с сетью.
  */
class Network {

    /**
     * Конструктор, инициализирующий url и порт бэкенд-сервера.
     */
    constructor() {
        this.url = 'localhost';
        this.port = '8000';
    }

    /**
     * Метод, реализующий http-запрос.
     * @param {String} URL адрес, на который будет посылаться запрос
     * @param {object} options параметры запроса
     * @returns {Promise<Response>} промис запроса
     */
    httpRequest = (URL, options) => {
        return fetch(URL, options)
            .then((response) => { 
                return response.json().then((data) => {
                    return [response.status, data];
                })});
    }

    /**
     * Метод, реализующий запрос GET /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @returns {Promise<Response>} промис запроса
     */
    async getUser(data) {
        const options = {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        return this.httpRequest(`http://${this.url}:${this.port}/api/sessions`, options);
    }

    /**
     * Метод, реализующий запрос POST /api/profile.
     * @param {object} data полезная нагрузка запроса
     * @returns {Promise<Response>} промис запроса
     */
    async sendRegistration(data) {
        const options = {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        return this.httpRequest(`http://${this.url}:${this.port}/api/profile`, options);
    }

    /**
     * Метод, реализующий запрос POST /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @returns {Promise<Response>} промис запроса
     */
    async sendAuthorization(data) {
        const options = {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        return this.httpRequest(`http://${this.url}:${this.port}/api/sessions`, options);
    }

    /**
     * Метод, реализующий запрос GET /api/boards.
     * @param {object} data полезная нагрузка запроса
     * @returns {Promise<Response>} промис запроса
     */
    async getBoards(data) {
        const options = {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        return this.httpRequest(`http://${this.url}:${this.port}/api/boards`, options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @returns {Promise<Response>} промис запроса
     */
    async sendLogout(data) {
        const options = {
            method: 'delete',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        return this.httpRequest(`http://${this.url}:${this.port}/api/sessions`, options);
    }
}

export default new Network();
