import socket from './../socket/index';
import IRequest from './interfaces/IRequest';
import AAA from './../aaa/index';
import CONFIG from 'config';
import SocketState from '../socket/states';

export default class Server {
    private static instance: Server;
    private socket: any = null;
    private queue: Array<any>;
    private reqId: number = Date.now();
    private cid: string;


    static getInstance() {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }


    request(req: IRequest): Promise<{}> {

        let aaa = AAA.getInstance();
        const credential = aaa.getCredentials();
        if (!req._reqid) {
            req._reqid = this.getRequestId();
        }

        let socketRequest: any = {
            ...req,
            _cver: CONFIG.APP_VERSION,
            _cid: this.cid
        };


        if (credential.sk && credential.sk !== 'null') {
            socketRequest._sk = credential.sk;
        }

        if (credential.ss && credential.ss !== 'null') {
            socketRequest._ss = credential.ss;
        }


        let internalResolve,
            internalReject;

        let promise = new Promise((res, rej) => {
            internalResolve = res;
            internalReject = rej;

            if (this.socket.isReady()) {
                this.socket.send(JSON.stringify(socketRequest));
            }
        });

        this.queue.push({
            state: 0,
            reqId: req._reqid,
            resolve: internalResolve,
            reject: internalReject,
            request: socketRequest,
        });

        return promise;
    }

    getRequestId(): string {
        this.reqId++;
        return 'REQ' + this.reqId;
    }

    onConnectionStateChange(callback: (state: SocketState) => void) {
        this.socket.onStateChanged = callback;
    }

    private constructor() {
        console.log('Start Server instance');
        this.socket = new socket({
            server: CONFIG.WEBSOCKET.URL,
            pingPongTime: 10000,
            onReady: this.startQueue.bind(this),
            onMessage: this.response.bind(this),
        });
        this.queue = [];
        this.socket.connect();
        this.cid = this.getClientId();
    }

    private response(res: string): void {
        let response = JSON.parse(res);

        // try to find queued request
        let queueItem = this.queue.findIndex((q) => {
            return q.reqId === response._reqid;
        });

        // check for has request in queue
        // return if has any request with this
        if (queueItem === -1) {
            return;
        }


        // resole request
        this.queue[queueItem].resolve(response.data);

        // remove request from queue
        this.queue.splice(queueItem, 1);


    }

    private sendRequest(request: any) {
        this.socket.send(JSON.stringify(request.request));
    }

    private startQueue() {
        this.queue.map((request) => {
            if (request.state === 0) {
                this.sendRequest(request);
            }
        });
    }

    private getClientId(): string {

        function getId() {

            let device = getDeviceName() ? 'mobile' : 'desktop';
            let os = getDeviceName() ? getDeviceName() : getOs();
            let browser = getBrowser();

            return ['web', device, browser, os].join('_');
        }

        function getBrowser() {
            let ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem !== null) {
                    return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

            if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
                M.splice(1, 1, tem[1]);
            }

            return M[0].toLowerCase();
        }

        function getDeviceName() {
            let deviceName = '';

            let isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i);
                },
                Datalogic: function () {
                    return navigator.userAgent.match(/DL-AXIS/i);
                },
                Bluebird: function () {
                    return navigator.userAgent.match(/EF500/i);
                },
                Honeywell: function () {
                    return navigator.userAgent.match(/CT50/i);
                },
                Zebra: function () {
                    return navigator.userAgent.match(/TC70|TC55/i);
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function () {
                    return (isMobile.Datalogic() || isMobile.Bluebird() || isMobile.Honeywell() || isMobile.Zebra() || isMobile.BlackBerry() || isMobile.Android() || isMobile.iOS() || isMobile.Windows());
                }
            };

            if (isMobile.Datalogic()) {
                deviceName = 'Datalogic';
            } else if (isMobile.Bluebird()) {
                deviceName = 'Bluebird';
            } else if (isMobile.Honeywell()) {
                deviceName = 'Honeywell';
            } else if (isMobile.Zebra()) {
                deviceName = 'Zebra';
            } else if (isMobile.BlackBerry()) {
                deviceName = 'BlackBerry';
            } else if (isMobile.iOS()) {
                deviceName = 'iOS';
            } else if ((deviceName === '') && (isMobile.Android())) {
                deviceName = 'Android';
            } else if ((deviceName === '') && (isMobile.Windows())) {
                deviceName = 'Windows';
            }
            return deviceName;
        }

        function getOs() {
            return navigator.platform.split(' ')[0];
        }

        return getId();
    }
}
