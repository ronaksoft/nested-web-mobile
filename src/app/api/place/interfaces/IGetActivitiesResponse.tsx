import {IPlaceActivity} from 'api/interfaces/';

interface IGetActivitiesResponse {
  activities: IPlaceActivity[];
  limit: number;
  skip: number;
}

export default IGetActivitiesResponse;
