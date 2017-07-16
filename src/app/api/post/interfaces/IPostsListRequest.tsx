interface IPostsListRequest {
  skip?: number | null;
  limit?: number;
  before?: number | null;
  after?: number | null;
  place_id?: string;
  by_update?: boolean;
}

export default IPostsListRequest;
