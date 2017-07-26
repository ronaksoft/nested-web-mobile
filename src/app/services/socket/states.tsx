/**
 * @enum SocketState
 * @desc Describes a socket connection state
 */
enum SocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export default SocketState;
