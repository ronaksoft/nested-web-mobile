interface IGetTaskCustomFilterRequest {
    assignee_id?: string;
    assignor_id?: string;
    'label.logic'?: string;
    label_id?: string;
    label_title?: string;
    status_filter?: string;
    keyword?: string;
    due_date?: string;
    limit?: number;
    skip?: number;
    before?: number;
    after?: number;
    due_data_until?: number;
}
export default IGetTaskCustomFilterRequest;
