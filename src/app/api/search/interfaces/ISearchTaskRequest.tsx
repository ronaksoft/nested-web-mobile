interface ISearchTaskRequest {
  assigner_id?: string;
  assignee_id?: string;
  label_title?: string;
  keyword?: string;
  has_attachment?: boolean;
  limit?: number;
  skip?: number;
}

export default ISearchTaskRequest;
