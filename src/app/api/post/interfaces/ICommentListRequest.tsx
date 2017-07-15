interface ICommentListRequest {
  post_id: string;
  skip?: number | null;
  limit?: number;
  before?: number | null;
  after?: number | null;
}

export default ICommentListRequest;
