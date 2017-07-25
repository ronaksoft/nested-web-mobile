/**
 * @interface ISocketConfig
 * @desc The configuration object which is required to create a Socket instance
 * @export
 * @interface ISocketConfig
 */
export interface ISocketConfig {
    /**
     * @prop server
     * @desc Cyrus socket gateway address
     * @type {string}
     * @memberof ISocketConfig
     */
    server: string;
    /**
     * @prop pingPongTime
     * @desc The delay between every ping message
     * @type {number}
     * @memberof ISocketConfig
     */
    pingPongTime ?: number;
    /**
     * @prop onMessage
     * @desc An event that will be triggered on receiving a message
     * @type {IOnMessageFunction}
     * @memberof ISocketConfig
     */
    onMessage?: IOnMessageFunction;
    /**
     * @prop onReady
     * @desc An event that will be triggered on receiving a message
     * @type {IOnReadyFunction}
     * @memberof ISocketConfig
     */
    onReady ?: IOnReadyFunction;
}

// TODO: The interface is not required. Remove it and define the function in ISocketConfig
interface IOnMessageFunction {
    (message: string): void;
}

// TODO: The interface is not required. Remove it and define the function in ISocketConfig
interface IOnReadyFunction {
    (): void;
}

