import Api from 'api';
import INotificationRequest from './interfaces/INotificationRequest';
import INotificationRemoveRequest from './interfaces/INotificationRemoveRequest';

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
    return this.api.request({
      cmd: 'notification/get_all',
      data: params,
    });
  }

  public remove(params: INotificationRemoveRequest) {
    return this.api.request({
      cmd: 'notification/remove',
      data: params,
    });
  }

  public markAsRead(params: INotificationRemoveRequest) {
    return this.api.request({
      cmd: 'notification/mark_as_read',
      data: params,
    });
  }

  public markAllRead() {
    return this.api.request({
      cmd: 'notification/mark_as_read',
      data: {notification_id: 'all'},
    });
  }

  public getCount() {
    return this.api.request({
      cmd: 'notification/get_counter',
    });
  }

  public resetCounter() {
    return this.api.request({
      cmd: 'notification/reset_counter',
    });
  }

}
