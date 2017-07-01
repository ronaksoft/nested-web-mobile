export interface ISocketConfig {
    server: string;
    pingPongTime ?: number;
    onMessage?: IOnMessageFunction;
    onReady ?: IOnReadyFunction;
}

interface IOnMessageFunction {
    (message: string): void;
}


interface IOnReadyFunction {
    (): void;
}

