interface IGetFilesRequest {
    place_id: string;
    filter: string;
    filename?: string;
    skip?: number;
    limit?: number;
}

export default IGetFilesRequest;
