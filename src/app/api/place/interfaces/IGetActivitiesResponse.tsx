import {IActivity} from 'api/interfaces/';

interface IGetActivitiesResponse {
  activities: IActivity[];
  limit: number;
  skip: number;
}

export default IGetActivitiesResponse;
