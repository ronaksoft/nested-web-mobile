import * as log from 'loglevel';
import _ from 'lodash';

import {
  ISocketConfig,
} from './interfaces';
import SocketState from './states';

const defaultConfig: ISocketConfig = {
  server: '',
  pingPongTime: 10000,
};
const RECONNECT_DELAY: number = 8000;
const PINGPONG_MAX: number = 3;
const PING_MESSAGE: string = 'PING!';
const PONG_MESSAGE: string = 'PONG!';

class Socket {
  private currentState: SocketState;
  private config: ISocketConfig;
  private socket: any | null;
  private pingPongInterval: any = null;
  private pingPongCounter: number = 0;
  private reconnectTimeout: any = null;
  private onStateChanged: (state: SocketState) => void;

  constructor(config: ISocketConfig = defaultConfig) {
    if (config.server === '') {
      throw Error('WebSocket Server isn\'t declared!');
    }
    this.config = config;
    // we have to define a new state because websocket is dummy
    // and cannot rely on socket.readyState!
    this.currentState = null;
  }

  public send(msg: any) {
    if (this.socket && this.socket.readyState === SocketState.OPEN) {
      this.socket.send(msg);
      log.debug(`SOCKET | >>>`, msg);
    }
  }

  public isReady() {
    return this.socket.readyState === SocketState.OPEN;
  }

  public connect() {
    log.debug(`SOCKET | Setting to connect`);
    this.socket = new WebSocket(this.config.server);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  public close() {
    log.debug(`SOCKET | Setting to close the socket connection`);
    this.setStateClosed();
    if (this.socket.readyState === SocketState.CLOSING) {
      log.debug(`SOCKET | The socket connection is being closed`);
    } else if (this.socket.readyState === SocketState.CLOSED) {
      log.debug(`SOCKET | The socket has already been closed`);
    } else {
      this.socket.close(1000, 'The socked has ben closed intentially.');
      this.stopPingPong();
    }
  }

  private setStateClosed() {
    this.notifyStateChange(SocketState.CLOSED);
    this.currentState = SocketState.CLOSED;
  }

  private setStateOpen() {
    this.notifyStateChange(SocketState.OPEN);
    this.currentState = SocketState.OPEN;
  }

  private notifyStateChange(state: SocketState) {
    if (this.onStateChanged && _.isFunction(this.onStateChanged) && this.currentState !== state) {
      log.debug(`SOCKET | Notifying socket state has just changed to ${SocketState[state]}`);
      this.onStateChanged(state);
    }
  }

  private onOpen() {
    log.info(`SOCKET | Connection stabilised to ${this.config.server}`);
    this.stopReconnect();
    setTimeout(() => {
      this.config.onReady();
      this.startPingPong();
      this.setStateOpen();
    }, 100);
  }

  private onClose() {
    log.info(`SOCKET | Connection closed!`);
    this.reconnect();
  }

  private onError(error: any) {
    log.error(`SOCKET | Error`, error);
  }

  private onMessage(msg: any) {
    log.debug(`SOCKET | <<<`, msg.data);
    if (this.config.onMessage && msg.data !== PONG_MESSAGE) {
      this.config.onMessage(msg.data);
    } else if (msg.data === PONG_MESSAGE) {
      this.pingPongCounter = 0;
    }
    this.setStateOpen();
    this.stopReconnect();
  }

  private startPingPong() {
    this.pingPongCounter = 0;

    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
    }

    this.pingPongInterval = setInterval(() => {
      this.send(PING_MESSAGE);
      this.pingPongCounter++;

      if (this.pingPongCounter >= PINGPONG_MAX) {
        this.reconnect();
      }

    }, this.config.pingPongTime);
    log.debug('SOCKET | Ping pong has been started');
  }

  private stopPingPong() {
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
    }

    log.debug('SOCKET | Ping pong has been stopped!');
  }

  private reconnect() {
    log.debug('SOCKET | Setting to reconnect');
    this.stopReconnect();
    this.close();
    this.reconnectTimeout = setTimeout(this.connect.bind(this), RECONNECT_DELAY);
  }

  private stopReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }

}

export {Socket, SocketState};
