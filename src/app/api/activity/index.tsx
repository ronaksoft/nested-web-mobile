import Api from './../index';
import IGetActivitiesRequest from './interfaces/IGetActivitiesRequest';
import IGetActivitiesResponse from './interfaces/IGetActivitiesResponse';
import IActivity from './interfaces/IActivitiy';

export default class ActivityApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public getActivities(data: IGetActivitiesRequest): Promise<IActivity[]> {
    if (!data.filter) {
      data.filter = 'all';
    }
    return this.api.request({
      cmd: 'place/get_activities',
      data,
    }).then((res: IGetActivitiesResponse) => {
      return res.activities;
    });
  }

};
