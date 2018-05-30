import {IActivity} from '../../interfaces';

interface IGetActivitiesRequest {
  limit?: number;
  skip?: number;
  before?: number;
  after?: number;
  details?: boolean;
  only_comments?: boolean;
  task_id: string;
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
