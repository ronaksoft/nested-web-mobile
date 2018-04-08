import IActivity from './IActivity';

interface IGetActivitiesResponse {
  activities: IActivity[];
  limit: number;
  skip: number;
}

export default IGetActivitiesResponse;
