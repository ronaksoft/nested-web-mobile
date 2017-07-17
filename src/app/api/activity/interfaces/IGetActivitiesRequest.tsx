interface IGetActivitiesRequest {
  limit?: number;
  before?: number;
  after?: number;
  filter?: string;
  place_id?: string;
}

export default IGetActivitiesRequest;
