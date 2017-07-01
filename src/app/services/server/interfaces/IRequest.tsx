interface IRequest {
    _reqid?: string;
    cmd: string;
    data: {};
    withoutQueue: boolean;
    _ver: number;
    _cid: string;
}

export default IRequest;

