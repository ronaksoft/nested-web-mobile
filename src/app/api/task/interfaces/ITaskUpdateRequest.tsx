interface ITaskUpdateRequest {
    task_id: string;
    title?: string;
    desc?: string;
    due_date?: string;
    due_data_has_clock?: boolean;
}
export default ITaskUpdateRequest;
