interface ITaskGetByFilterRequest {
    filter: string;
    status_filter?: string;
    skip?: number;
    limit?: number;
    before?: number;
    after?: number;
}
export default ITaskGetByFilterRequest 
