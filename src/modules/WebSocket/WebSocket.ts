/**
 * Класс, реализующий валидацию форм.
 */
export default class WSocket {
    private _url: string;
    private _protocols: string[];
    private _socket: WebSocket;

    /**
     * @constructor
     */
    constructor(url: string, protocols: string[]) {
        this._url = url;
        this._protocols = protocols;
    }

    onOpen() {
        if (!window['WebSocket']) {
            throw new Error('WebSocket: Браузер не поддерживает веб-сокеты');
        }

        if (this.#currentState() !== 0 && this.#currentState() !== 1) {
            this._socket = new WebSocket(this._url, this._protocols);
        }
    }

    set onmessage(onmessage: ((this: WebSocket, ev: MessageEvent<any>) => any) | null) {
        this._socket.onmessage = onmessage;
    }

    send(message: string) {
        const payload = JSON.stringify({
            message,
        });

        this.#waitForSocketConnection(() => {
            this._socket.send(payload);
        });
    }

    set onerror(onerror: ((this: WebSocket, ev: Event) => any) | null) {
        this._socket.onerror = onerror;
    }

    onClose(code: number, reason: string) {
        if (this.#currentState() !== 2 && this.#currentState() !== 3) {
            this._socket.close(code, reason);
        }
    }

    #currentState(): number {
        return this._socket.readyState;
    }

    #waitForSocketConnection(callback: any) {
        setTimeout(
            () => {
                if (this.#currentState() === 1) {
                    if (!!callback) {
                        callback();
                    }
                } else {
                    console.log('wait for connection...');
                    this.#waitForSocketConnection(callback);
                }
            }, 10);
    }
}
