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

        this._endpoints = {
            sessions: 'api/sessions',
            profile: 'api/profile',
            board: 'api/boards',
            card: 'api/cards',
            cardlist: 'api/cardLists',
            comments: 'api/comments',
            usersearch: {
                card: 'api/usersearch/card',
                board: 'api/usersearch/board',
                team: 'api/usersearch/team',
            },
            team: 'api/teams',
            checklists: 'api/checkLists',
            checklistsItems: 'api/checkListItems',
            tags: 'api/tags',
        };

        this._defaultOptions = {
            mode: 'cors',
            credentials: 'include',
            headers: {
                Origin: `https://${this.SelfUrl}:${this.SelfPort}`,
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
     * @return {Promise<Response>} промис запроса
     */
    async getUser() {
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.sessions}`,
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
            `https://${this.BackendUrl}/${this._endpoints.profile}/${data.userName}`,
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
            `https://${this.BackendUrl}/${this._endpoints.profile}`,
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
            `https://${this.BackendUrl}/` +
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
            `https://${this.BackendUrl}/` +
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
            `https://${this.BackendUrl}/${this._endpoints.sessions}`,
            options);
    }

    /**
     * Метод, реализующий запрос GET /api/boards.
     * @return {Promise<Response>} промис запроса
     */
    async getBoards() {
        const options = {
            method: 'get',
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.board}`,
            options);
    }

    /**
     * Метод, реализующий запрос GET /api/board/.
     * @param {Number} bid - id доски
     * @return {Promise<Response>} промис запроса
     */
    async getBoard(bid) {
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.board}/${bid}`,
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
            `https://${this.BackendUrl}/${this._endpoints.card}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/cards.
     * @param {object} data полезная нагрузка запроса
     * @param {Number} cid id карточки
     * @return {Promise<Response>} промис запроса
     */
    async _updateCard(data, cid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.card}/${cid}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/cards.
     * @param {Number} cid id карточки
     * @return {Promise<Response>} промис запроса
     */
    async _deleteCard(cid) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.card}/${cid}`,
            options);
    }
    /**
     * Метод, реализующий запрос POST /api/cardlists.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async _createCardList(data) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.cardlist}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/cardlists.
     * @param {object} data полезная нагрузка запроса
     * @param {Number} clid id обновляемой доски
     * @return {Promise<Response>} промис запроса
     */
    async _updateCardList(data, clid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.cardlist}/${clid}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/cardlists.
     * @param {Number} clid id удаляемой доски
     * @return {Promise<Response>} промис запроса
     */
    async _deleteCardList(clid) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.cardlist}/${clid}`,
            options);
    }

    /**
     * Метод, реализующий запрос POST /api/board.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async createBoard(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`https://${this.BackendUrl}/api/boards`,
                                options);
    }

    /**
     * Метод, реализующий запрос PUT /api/sessions.
     * @param {Object} data полезная нагрузка запроса
     * @param {Number} bid id обновляемой доски
     * @return {Promise<Response>} промис запроса
     */
    async updateBoard(data, bid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.board}/${bid}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/board/:bid.
     * @param {Number} bid id уаляемой доски
     * @return {Promise<Response>} промис запроса
     */
    async deleteBoard(bid) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.board}/${bid}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/sessions.
     * @return {Promise<Response>} промис запроса
     */
    async sendLogout() {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.sessions}`,
            options);
    }

    /**
     * Метод, реализующий GET /api/usersearch/card/:cid/:search_text
     * @param {String} searchString - строка для поиска
     * @param {Number} cid - id карточки
     */
    async searchCardMembers(searchString, cid) {
        const options = {
            method: 'get',
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.usersearch.card}` +
            `/${cid}/${searchString}`,
            options);
    }

    /**
     * Метод, реализующий GET /api/usersearch/board/:bid/:search_text
     * @param {String} searchString - строка для поиска
     * @param {Number} bid - id доски
     */
    async searchBoardMembers(searchString, bid) {
        const options = {
            method: 'get',
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.usersearch.board}` +
            `/${bid}/${searchString}`,
            options);
    }

    /**
     * Метод, реализующий GET /api/usersearch/team/:tid/:search_text
     * @param {String} searchString - строка для поиска
     * @param {Number} tid - id команды
     */
    async searchTeamMembers(searchString, tid) {
        const options = {
            method: 'get',
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.usersearch.team}` +
            `/${tid}/${searchString}`,
            options);
    }

    /**
     * Метод, реализующий PUT /api/teams/:tid/toggleuser/:uid
     * @param {Number} tid - id команды
     * @param {Number} uid - id переключаемого пользователя
     */
    async toggleTeamMember(tid, uid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.team}/${tid}` +
            `/toggleuser/${uid}`, options);
    }

    /**
     * Метод, реализующий PUT /api/boards/:bid/toggleuser/:uid
     * @param {Number} bid - id доски
     * @param {Number} uid - id переключаемого пользователя
     */
    async toggleBoardMember(bid, uid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.board}/${bid}` +
            `/toggleuser/${uid}`, options);
    }

    /**
     * Метод, реализующий PUT /api/cards/:cid/toggleuser/:uid
     * @param {Number} cid - id карточки
     * @param {Number} uid - id переключаемого пользователя
     */
    async toggleCardMember(cid, uid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.card}/${cid}` +
            `/toggleuser/${uid}`, options);
    }
    /**
     * Метод, реализующий запрос POST /api/checkLists.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async createCheckList(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
                                `/${this._endpoints.checklists}`, options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/checkLists/:chlid
     * @param {Number} chlid - id чеклиста
     * @return {Promise<Response>} промис запроса
     */
    async deleteCheckList(chlid) {
        const options = {
            method: 'delete',
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.checklists}/${chlid}`, options);
    }

    /**
     * Метод, реализующий запрос PUT /api/checkLists/:chlid
     * @param {object} data полезная нагрузка запроса
     * @param {Number} chlid - id чеклиста
     * @return {Promise<Response>} промис запроса
     */
    async updateCheckList(data, chlid) {
        const options = {
            method: 'put',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.checklists}/${chlid}`, options);
    }

    /**
     * Метод, реализующий запрос POST /api/checkListItems.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async createCheckListItem(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.checklistsItems}`, options);
    }

    /**
     * Метод, реализующий запрос PUT /api/checkListItems/:chliid
     * @param {object} data полезная нагрузка запроса
     * @param {Number} chliid - id элемента чеклиста
     * @return {Promise<Response>} промис запроса
     */
    async updateCheckListItem(data, chliid) {
        const options = {
            method: 'put',
            body: JSON.stringify(data),
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.checklistsItems}/${chliid}`, options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/checkListItems/:chliid
     * @param {Number} chliid - id элемента чеклиста
     * @return {Promise<Response>} промис запроса
     */
    async deleteCheckListItem(chliid) {
        const options = {
            method: 'delete',
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.checklistsItems}/${chliid}`, options);
    }


    /**
     * Метод, реализующий запрос POST /api/comments.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async createComment(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.comments}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/comments.
     * @param {Object} data полезная нагрузка запроса
     * @param {Number} cmid id обновляемого комментария
     * @return {Promise<Response>} промис запроса
     */
    async updateComment(data) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.comments}/${data.cmid}`,
            options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/comments/:cmid.
     * @param {Number} data данные запроса
     * @return {Promise<Response>} промис запроса
     */
    async deleteComment(data) {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.comments}/${data.cmid}`,
            options);
    }

    /**
     * Метод, реализующий PUT /api/cards/:cid/toggletag/:tgid
     * @param {Number} cid - id карточки
     * @param {Number} tgid - id переключаемого тега
     */
    async toggleCardTag(cid, tgid) {
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.card}/${cid}` +
            `/toggletag/${tgid}`, options);
    }

    /**
     * Метод, реализующий запрос DELETE /api/tags/:tgid
     * @param {Number} tgid - id тега
     * @return {Promise<Response>} промис запроса
     */
    async deleteTag(tgid) {
        const options = {
            method: 'delete',
        };
        return this.httpRequest(`https://${this.BackendUrl}` +
            `/${this._endpoints.tags}/${tgid}`, options);
    }


    /**
     * Метод, реализующий запрос POST /api/tags.
     * @param {object} data полезная нагрузка запроса
     * @return {Promise<Response>} промис запроса
     */
    async createTag(data) {
        const options = {
            method: 'post',
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.tags}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/tag/:tgid.
     * @param {Object} data полезная нагрузка запроса
     * @param {Number} tgid id обновляемого тега
     * @return {Promise<Response>} промис запроса
     */
    async updateTag(data, tgid) {
        const options = {
            method: 'put',
            body: JSON.stringify(data),
        };
        return this.httpRequest(
            `https://${this.BackendUrl}/${this._endpoints.tags}/${tgid}`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/boards/access/:accessPath.
     * @param {String} accessPath ключ доступа
     * @return {Promise<Response>} промис запроса
     */
    async useBoardInvite(accessPath) {
        const options = {
            method: 'put',
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.board}/access/` +
                `${accessPath}`, options);
    }

    /**
     * Метод, реализующий запрос PUT /api/boards/:bid/access.
     * @param {Number} bid id доски
     * @return {Promise<Response>} промис запроса
     */
    async refreshBoardInvite(bid) {
        const options = {
            method: 'put',
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.board}/${bid}/access`,
            options);
    }

    /**
     * Метод, реализующий запрос PUT /api/card/access/tocard/:accessPath
     * @param {String} accessPath ключ доступа
     * @return {Promise<Response>} промис запроса
     */
    async useCardInvite(accessPath) {
        const options = {
            method: 'put',
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.card}/access/tocard/` +
            `${accessPath}`, options);
    }

    /**
     * Метод, реализующий запрос PUT /api/boards/:bid/access.
     * @param {Number} cid id карточки
     * @return {Promise<Response>} промис запроса
     */
    async refreshCardInvite(cid) {
        const options = {
            method: 'put',
        };
        return this.httpRequest(
            `http://${this.BackendUrl}:${this.BackendPort}/${this._endpoints.card}/access/${cid}`,
            options);
    }
}

export default new Network();
