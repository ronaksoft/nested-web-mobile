interface IGetFileResponse {
    _id: string;
    filename: string;
    width: number;
    height: number;
    meta: any;
    mimetype: string;
    size: number;
    type: string;
    upload_time: number;
    upload_type: string;
}

export default IGetFileResponse;