interface IPostsListRequest {
  skip?: number | null;
  limit?: number;
  before?: number | null;
  after?: number | null;
}

export default IPostsListRequest;
