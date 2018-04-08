interface IGetActivitiesRequest {
  limit?: number;
  skip?: number;
  before?: number;
  after?: number;
  details?: boolean;
  place_id: string;
}

export default IGetActivitiesRequest;
