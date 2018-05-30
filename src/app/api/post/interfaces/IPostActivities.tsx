import {IActivity} from '../../interfaces';

interface IGetActivitiesRequest {
  limit?: number;
  skip?: number;
  before?: number;
  after?: number;
  details?: boolean;
  post_id: string;
}

interface IGetActivitiesResponse {
  activities: IActivity[];
  limit: number;
  skip: number;
}

export {
  IGetActivitiesRequest,
  IGetActivitiesResponse,
};
