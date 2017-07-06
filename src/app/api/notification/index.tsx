import Api from 'api';
import INotificationResponse from './interfaces/INotificationResponse';
import INotificationRequest from './interfaces/INotificationRequest';
import INotificationRemoveRequest from './interfaces/INotificationRemoveRequest';
import INotificationCountRequest from './interfaces/INotificationCountResponse';

export default class NotificationApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public get(params: INotificationRequest = {
    skip: 0,
    limit: 10,
    after: null,
    before: null,
  }) {
    return this.api.server.request({
      cmd: 'notification/get_all',
      data: params,
    }).then((res: INotificationResponse) => {
      return res.data;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  public remove(params: INotificationRemoveRequest) {
    return this.api.server.request({
      cmd: 'notification/remove',
      data: params,
    }).then((res: any) => {
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  public markAsRead(params: INotificationRemoveRequest) {
    return this.api.server.request({
      cmd: 'notification/mark_as_read',
      data: params,
    }).then((res: any) => {
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  public markAllRead() {
    return this.api.server.request({
      cmd: 'notification/mark_as_read',
      data: {notification_id: 'all'}
      ,
    }).then((res: any) => {
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  public getCount() {
    return this.api.server.request({
      cmd: 'notification/get_counter',
    }).then((res: INotificationCountRequest) => {
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  public resetCounter() {
    return this.api.server.request({
      cmd: 'notification/reset_counter',
    }).then((res: any) => {
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

}
