import IActivity from './IActivitiy';

interface IGetActivitiesResponse {
  activities: IActivity;
  limit: number;
  skip: number;
}

export default IGetActivitiesResponse;
