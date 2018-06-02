interface ITaskRequest {
    title: string;
    desc?: string;
    assignee_id?: string;
    candidate_id?: string;
    attachment_id?: string;
    related_to?: string;
    related_post?: string;
    watcher_id?: string;
    label_id?: string;
    todos?: string;
    due_date?: string;
    due_data_has_clock?: boolean;
}
export default ITaskRequest;
