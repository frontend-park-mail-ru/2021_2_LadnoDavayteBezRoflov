import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';
import cardActions, { CardActionTypes } from '../../actions/card.js';
import cardListActions from '../../actions/cardlist.js';
import CardListComponent from '../../components/CardList/CardList.js';

/**
 * Класс, реализующий хранилище доски
 */
class BoardStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('Board');

        this._cardlists = new Map();
        this._cards = new Map();

        this._currentCard = undefined;

        this._get(0);
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case BoardsActionTypes.BOARD_GET:
            await this._get(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_GET:
            await this._getCard(action.data);
            this._emitChange();
            break;

        default:
            return;
        }
    }

    getCardContext(cid) {
        return this.getContext('cards')[cid];
    }

    getBoardByCID(CID) {
        console.log(this.getContext('cards')[CID].bid)
        return this.getContext('cards')[CID].bid;
    }

    async _getCard(data) {
        console.log(this._storage.get('cards')[data.id])
        this._storage.set('_currentCard', this._storage.get('cards')[data.id]);
    }

    /**
     * Метод, реализующий реакцию на инициализацию.
     */
    async _get(data) {

        this._storage.set('id', data.id);
        this._storage.set('title', `${data.id}_Board`);
        this._storage.set('team', 'testTeam');
        this._storage.set('cardlists', {
            1: {
                title: 'in progress',
                position: 0,
                clid: 1,
                bid: 0,
                cards: {
                    1: {
                        title: 'card1',
                        cid: 1,
                        clid: 1,
                        bid: 0,
                        description: 'desc1',
                        deadline: '1.11.2021',
                    },
                    2: {
                        title: 'card2',
                        cid: 2,
                        clid: 1,
                        bid: 0,
                        description: 'desc2',
                        deadline: '2.11.2021',
                    },
                },
            },
            2: {
                title: 'done',
                position: 1,
                clid: 2,
                bid: 0,
                cards: {
                    25: {
                        title: 'card25',
                        cid: 25,
                        clid: 2,
                        bid: 0,
                        description: 'desc25',
                        deadline: '1.11.2021',
                    },
                    26: {
                        title: 'card26',
                        cid: 26,
                        clid: 2,
                        bid: 0,
                        description: 'desc26',
                        deadline: '2.11.2021',
                    },
                },
            },
        });

        this._storage.set('cards', {
            1: {
                title: 'card1',
                cid: 1,
                clid: 1,
                bid: 0,
                description: 'desc1',
                deadline: '1.11.2021',
            },
            2: {
                title: 'card2',
                cid: 2,
                clid: 1,
                bid: 0,
                description: 'desc2',
                deadline: '2.11.2021',
            },
            25: {
                title: 'card25',
                cid: 25,
                clid: 2,
                bid: 0,
                description: 'desc25',
                deadline: '1.11.2021',
            },
            26: {
                title: 'card26',
                cid: 26,
                clid: 2,
                bid: 0,
                description: 'desc26',
                deadline: '2.11.2021',
            },
        })
        this._storage.set('description', `coolboard ${data.id}_Board`);

        //for (let cardlist in this._storage.get('cardlists')) {
        //    this._cardlists.set(cardlist, new CardListComponent());
            //cardListActions.getCardList(cardlist);
        //}
        /* for (let cardlist_ of this._cardlists) {
            console.log(cardlist_[1]._storage)

            cardlist_[1]._storage.cards.forEach(element => {
                console.log(element)
            }); */

            //cardListActions.getCardList(cardlist);
        //}

        return;

        let payload;

        try {
            payload = await Network.getBoards();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:

            this._storage.set('teams', payload.data.sort(
                (first, second) => (first.id > second.id) ?
                    1 : ((second.id > first.id) ? -1 : 0)),
            );
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }
}

export default new BoardStore();
