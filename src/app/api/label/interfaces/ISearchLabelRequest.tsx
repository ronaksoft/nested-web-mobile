interface ISearchLabelRequest {
  skip?: number | null;
  limit?: number;
  filter: string;
  keyword?: string;
  details?: boolean;
}

export default ISearchLabelRequest;
