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

        this._endpoints = {
            sessions: 'api/sessions',
            profile: 'api/profile',
            board: 'api/boards',
            card: 'api/cards',
        };

        this._defaultOptions = {
            mode: 'cors',
            credentials: 'include',
            headers: {
                Origin: `http://${this.SelfUrl}:${this.SelfPort}`,
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
        return fetch(URL, {...this._defaultOptions, ...options})
            .then((response) => response.json()
                .then((data) => ({status: response.status, data: data})),
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.sessions}`,
            options);
    }

    /**
     * Метод, реализующий запрос GET /api/profile.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async getSettings(data) {
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.profile}/${data.userName}`,
            options);
    }

    /**
     * Метод, реализующий запрос POST /api/profile.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendRegistration(data) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.profile}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/profile.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async putSettings(data) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/` +
            `${this._endpoints.profile}/${data.login}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/profile/<login>/upload.
     * @param {object} data полезная нагрузка запроса
     * @param {String} login логин, аватар которого будем менять
     * @return {Promise<Response>} промис запроса
     */
    async putImage(data, login) {
        const options = {
            method: 'put',
            body: data,
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/` +
            `${this._endpoints.profile}/${login}/upload`,
            options);
    }

    /**
     * Метод, реализующий запрос POST /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendAuthorization(data) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.sessions}`,
            options);
    }

    /**
     * Метод, реализующий запрос GET /api/boards.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async getBoards(data) {
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.board}`,
            options);
    }

    /**
     * Метод, реализующий запрос POST /api/cards.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async _createCard(data) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.card}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/cards.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async _updateCard(data) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.card}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/cards.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async _deleteCard(data) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.card}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/sessions.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async sendLogout(data) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.sessions}`,
            options);
    }
}

export default new Network();
