interface ISearchPostRequest {
  advanced?: boolean;
  place_id?: string;
  sender_id?: string;
  label_title?: string;
  keyword?: string;
  subject?: string;
  has_attachment?: boolean;
  limit?: number;
  skip?: number;
  before?: number;
  after?: number;
}

export default ISearchPostRequest;
