/**
 * @file services/socket/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc A custom Socket build on top of browser WebSocket that was designed to
 * keep a connection alive as much as possible with built-in ping-pong and reconnect
 * @exports {Socket, SocketState}
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-24
 * Reviewed by:            -
 * Date of review:         -
 */
import * as log from 'loglevel';

// TODO: Do not import whole lodash. Just import the required functions
import _ from 'lodash';

import {
  ISocketConfig,
} from './interfaces';
import SocketState from './states';
/**
 * @const defaultConfig
 * @desc Socket's default configuration
 */
const defaultConfig: ISocketConfig = {
  server: '',
  pingPongTime: 10000,
};
/**
 * @const RECONNECT_DELAY
 * @desc The time that Socket waits for connecting again when has found that the connection is broken
 */
const RECONNECT_DELAY: number = 8000;
/**
 * @const PINGPONG_MAX
 * @desc The number of times that Socket ignores sending a PING message without receiving any PONG.
 * In the case of reaching the limit, the Socket finds that the connection is broken and
 * tries to re-estabilsh a new connection after a certain amount of time (RECONNECT_DELAY).
 */
const PINGPONG_MAX: number = 3;
/**
 * @const PING_MESSAGE
 * @desc A message that means ping to Cyrus
 */
const PING_MESSAGE: string = 'PING!';
/**
 * @const PONG_MESSAGE
 * @desc A message that Cyrus sends in response of a ping message
 * @see PING_MESSAGE
 */
const PONG_MESSAGE: string = 'PONG!';

/**
 * @class Socket
 * @desc A lightweight web-socket service built on top of browser WebSocket
 */
class Socket {
  /**
   * @property currentState
   * @desc The current state of initialized web-socket
   * @private
   * @type {SocketState}
   * @memberof Socket
   */
  private currentState: SocketState;
  /**
   * @property config
   * @desc The configuration which the class uses to establish a socket connection
   * @private
   * @type {ISocketConfig}
   * @memberof Socket
   */
  private config: ISocketConfig;
  /**
   * @property socket
   * @desc An instance of browser WebSocket
   * @private
   * @type {(any | null)}
   * @memberof Socket
   */
  private socket: any | null;
  /**
   * @property pingPongInterval
   * @desc Ping pong interval canceler
   * @private
   * @type {*}
   * @memberof Socket
   */
  private pingPongInterval: any = null;
  /**
   * @prop pingPongCounter
   * @desc The number of sending ping without receiving a pong
   * @private
   * @type {number}
   * @memberof Socket
   */
  private pingPongCounter: number = 0;
  /**
   * @prop reconnectTimeout
   * @desc The reconnect timeout canceler
   * @private
   * @type {*}
   * @memberof Socket
   */
  private reconnectTimeout: any = null;
  /**
   * @prop onStateChanged
   * @desc Use this listerner to get notified on state change
   * @private
   * @memberof Socket
   */
  private onStateChanged: (state: SocketState) => void;

  /**
   * Creates an instance of Socket.
   * @param {ISocketConfig} [config=defaultConfig]
   * @memberof Socket
   */
  constructor(config: ISocketConfig = defaultConfig) {
    if (config.server === '') {
      throw Error('WebSocket Server isn\'t declared!');
    }
    this.config = config;
    // we have to define a new state because websocket is dummy
    // and cannot rely on socket.readyState!
    this.currentState = null;
  }

  /**
   * @func send
   * @desc Sends the message if the WebSocket state is ready
   * @param {*} msg
   * @memberof Socket
   */
  public send(msg: any) {
    // TODO: Use isReady function
    if (this.socket && this.socket.readyState === SocketState.OPEN) {
      this.socket.send(msg);
      log.debug(`SOCKET | >>>`, msg);
    }
  }

  /**
   * @func isReady
   * @desc Returns true if the WebSocket state is OPEN
   * @returns  {boolean}
   * @memberof Socket
   */
  public isReady() {
    return this.socket.readyState === SocketState.OPEN;
  }

  /**
   * @func connect
   * @desc Creates a new instance of browser WebSocket and listen to all events
   * @memberof Socket
   */
  public connect() {
    log.debug(`SOCKET | Setting to connect`);
    this.socket = new WebSocket(this.config.server);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  /**
   * @func close
   * @desc Sets state to closed, interupts the socket connection with code `1000` and stops ping-pong
   * @memberof Socket
   */
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

  /**
   * @func setStateClosed
   * @desc Sets state to CLOSED and notify the state change
   * @private
   * @memberof Socket
   */
  private setStateClosed() {
    this.notifyStateChange(SocketState.CLOSED);
    this.currentState = SocketState.CLOSED;
  }

  /**
   * @func setStateOpen
   * @desc Sets state to OPEN and notify the state change
   * @private
   * @memberof Socket
   */
  private setStateOpen() {
    this.notifyStateChange(SocketState.OPEN);
    this.currentState = SocketState.OPEN;
  }

  /**
   * @func notifyStateChange
   * @desc Triggers this.onStateChanged with the new state
   * @private
   * @param {SocketState} state
   * @memberof Socket
   */
  private notifyStateChange(state: SocketState) {
    if (this.onStateChanged && _.isFunction(this.onStateChanged) && this.currentState !== state) {
      log.debug(`SOCKET | Notifying socket state has just changed to ${SocketState[state]}`);
      this.onStateChanged(state);
    }
  }

  /**
   * @func onOpen
   * @desc Performs this actions on openning a new connection:
   *    1. Stops reconnecting
   *    2. Triggers onReady callback that was received on instantiation of the class
   *    3. Start ping-pong
   *    4. Set state to OPEN and totify the state change
   * @private
   * @memberof Socket
   */
  private onOpen() {
    log.info(`SOCKET | Connection stabilised to ${this.config.server}`);
    this.stopReconnect();
    setTimeout(() => {
      if (this.config.onReady) {
        this.config.onReady();
      }

      this.startPingPong();
      this.setStateOpen();
    }, 100);
  }

  /**
   * @func onClose
   * @desc Reconnects on connecting close
   * @private
   * @memberof Socket
   */
  private onClose() {
    log.info(`SOCKET | Connection closed!`);
    this.reconnect();
  }

  /**
   * @func onError
   * @desc Logs the reason when the socket encounters an error
   * @private
   * @param {*} error
   * @memberof Socket
   */
  private onError(error: any) {
    log.error(`SOCKET | Error`, error);
  }

  /**
   * @func onMessage
   * @desc Receives the message and reads the content to find out that is a JSON message or a PONG.
   * If the message is PONG, then rests pingPongCounter, else if is rgular message, then call onMessage callback
   * In both cases, This sets state to OPEN and stops reconnecting
   * @private
   * @param {*} msg
   * @memberof Socket
   */
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

  /**
   * @func startPingPong
   * @desc Clears the previous ping-pong interval and starts ping-pong
   * @private
   * @memberof Socket
   */
  private startPingPong() {
    this.pingPongCounter = 0;

    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
    }

    this.pingPongInterval = setInterval(() => {
      this.send(PING_MESSAGE);
      this.pingPongCounter++;

      // Try to reconnect if did not received any PONG response more than `PINGPONG_MAX` times.
      if (this.pingPongCounter >= PINGPONG_MAX) {
        this.reconnect();
      }

    }, this.config.pingPongTime);
    log.debug('SOCKET | Ping pong has been started');
  }

  /**
   * @func stopPingPong
   * @desc Stops the current ping-pong interval
   * @private
   * @memberof Socket
   */
  private stopPingPong() {
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval);
    }

    log.debug('SOCKET | Ping pong has been stopped!');
  }

  /**
   * @func reconnect
   * @desc Stops reconnecting, closes the previous connection and triggers a reconnect timeout with `RECONNECT_DELAY`
   * @private
   * @memberof Socket
   */
  private reconnect() {
    log.debug('SOCKET | Setting to reconnect');
    this.stopReconnect();
    this.close();
    this.reconnectTimeout = setTimeout(this.connect.bind(this), RECONNECT_DELAY);
  }

  /**
   * @func stopReconnect
   * @desc Clears reconnect timeout
   * @private
   * @memberof Socket
   */
  private stopReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }

}

export {Socket, SocketState};
