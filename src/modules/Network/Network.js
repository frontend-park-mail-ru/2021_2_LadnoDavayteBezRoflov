import {SelfAddress, BackendAddress} from '../../constants/constants.js';

/**
  * Класс, реализующий работу с сетью.
  */
class Network {
    /**
     * Конструктор, инициализирующий BackendUrl и порт бэкенд-сервера.
     */
    constructor() {
        this.SelfUrl = SelfAddress.Url;
        this.SelfPort = SelfAddress.Port;

        this.BackendUrl = BackendAddress.Url;
        this.BackendPort = BackendAddress.Port;

        this._defaultOptions = {
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Origin': `http://${this.SelfUrl}:${this.SelfPort}`,
            },
        };
    }

    /**
     * Метод, реализующий http-запрос.
     * @param {String} URL адрес, на который будет посылаться запрос
     * @param {object} options параметры запроса
     * @return {Promise<Response>} промис запроса
    */
    httpRequest(URL, options) {
        return fetch(URL, options)
            .then((response) => response.json()
                .then((data) => Object({status: response.status, data: data})),
            );
    };

    /**
     * Метод, реализующий запрос GET /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async getUser(data) {
        const options = {
            method: 'get',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`http://${this.BackendUrl}:${this.BackendPort}/api/sessions`,
                                {...options, ...this._defaultOptions});
    }

    /**
     * Метод, реализующий запрос POST /api/profile.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendRegistration(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`http://${this.BackendUrl}:${this.BackendPort}/api/profile`,
                                {...options, ...this._defaultOptions});
    }

    /**
     * Метод, реализующий запрос POST /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendAuthorization(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`http://${this.BackendUrl}:${this.BackendPort}/api/sessions`,
                                {...options, ...this._defaultOptions});
    }

    /**
     * Метод, реализующий запрос GET /api/boards.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async getBoards(data) {
        const options = {
            method: 'get',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`http://${this.BackendUrl}:${this.BackendPort}/api/boards`,
                                {...options, ...this._defaultOptions});
    }

    /**
     * Метод, реализующий запрос DELETE /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendLogout(data) {
        const options = {
            method: 'delete',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`http://${this.BackendUrl}:${this.BackendPort}/api/sessions`,
                                {...options, ...this._defaultOptions});
    }
}

export default new Network();
