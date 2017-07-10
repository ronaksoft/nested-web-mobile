import IErrorResponseData from './IErrorResponseData';
interface IResponse {
    _reqid ?: string | number;
    data : IErrorResponseData | {};
    status: string;
}

export default IResponse;

