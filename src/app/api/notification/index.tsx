/**
 * @file api/notification/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description APIs are related to the notification
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-31
 *              Reviewed by:            -
 *              Date of review:         -
 * @export NotificationApi
 */
import Api from 'api';
import INotificationRequest from './interfaces/INotificationRequest';
import INotificationRemoveRequest from './interfaces/INotificationRemoveRequest';

/**
 * @class NotificationApi
 * @desc APIs are related to notification
 */
export default class NotificationApi {

  /**
   * @prop api
   * @desc An instance of base Api
   * @private
   * @memberof NotificationApi
   */
  private api;

  /**
   * Creates an instance of InvitationApi.
   * @memberof NotificationApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func get
   * @desc Gets notifications from server
   * @param {INotificationRequest} data contains limit, skip and etc.
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public get(params: INotificationRequest = {
    details: true,
    skip: 0,
    limit: 10,
    after: null,
    before: null,
    subject: 'post',
  }) {
    return this.api.request({
      cmd: 'notification/get_all',
      data: params,
    });
  }

  /**
   * @func remove
   * @desc remove notification
   * @param {INotificationRemoveRequest} params
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public remove(params: INotificationRemoveRequest) {
    return this.api.request({
      cmd: 'notification/remove',
      data: params,
    });
  }

  /**
   * @func markAsRead
   * @desc mark notification as read
   * @param {INotificationRemoveRequest} params
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public markAsRead(params: INotificationRemoveRequest) {
    return this.api.request({
      cmd: 'notification/mark_as_read',
      data: params,
    });
  }

  /**
   * @func markAllRead
   * @desc mark all notification of user as read
   * @param {object} notification_id this property should be equal to the 'all'
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public markAllRead() {
    return this.api.request({
      cmd: 'notification/mark_as_read',
      data: {notification_id: 'all'},
    });
  }

  /**
   * @func getCount
   * @desc get number notifications per place
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public getCount() {
    return this.api.request({
      cmd: 'notification/get_counter',
    });
  }

  /**
   * @func resetCounter
   * @desc reset counter of notifications ( need more documentation )
   * @returns {Promise<any>}
   * @memberof NotificationApi
   */
  public resetCounter() {
    return this.api.request({
      cmd: 'notification/reset_counter',
    });
  }

}
