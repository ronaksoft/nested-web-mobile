interface ITaskUpdateTodoRequest {
    task_id: string;
    todo_id: string;
    txt?: string;
    weight?: string;
    done?: boolean;
}
export default ITaskUpdateTodoRequest;
