/**
 * @file services/syncActivity/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Cyrus broadcasts messages of `sync-a` type to the clients. These activities
 * are just sent to the authenticated users based on their teammates' actions. This
 * service listens to these messages and filters by `task_id` and activity type for
 * the registered channels. But wait a moment! What's a channel? A channel is how the
 * app components talk to this service. They tell the service what kind of activities
 * they look for and the service feeds them on receiving new activities.
 * @export {SyncActivity}
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-31
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

import Api from '../../api/index';
import SyncActions from './actions';
import ActivityApi from '../../api/task/index';
import {ITaskActivity} from 'api/interfaces/';
import * as _ from 'lodash';

/**
 * @interface IChanel
 * @desc Interface of channel
 */
interface IChanel {
  /**
   * @property taskId
   * @desc A taskId for filtering activities
   * @type {string}
   * @memberof IChanel
   */
  taskId: string;
  action: SyncActions;
  cb: (activity: ITaskActivity) => void;
}

/**
 * ( needs docs )
 * @export
 * @class SyncActivity
 */
export default class SyncActivity {
  // ( needs docs )
  private static instance;
  private OPEN_ALL_CHANNEL: string = '_all_';
  private openChannelsStack: object = {};
  private latestActivityTimestamp: number = Date.now();
  private API: Api = Api.getInstance();
  private activityApi = new ActivityApi();
  private listenerCanceler = null;

  private constructor() {
    // start Sync Activities
  }

  /**
   * @function getInstance
   * @desc Creates or returns the instance of the class.
   * @static
   * @returns SyncActivity
   * @public
   * @memberof SyncActivity
   */
  public static getInstance(): SyncActivity {
    if (!SyncActivity.instance) {
      SyncActivity.instance = new SyncActivity();
    }

    return SyncActivity.instance;
  }

  /**
   * Open a channel with task Id
   *
   * Service filter activity by task Ids that it's has open
   * chanel
   *
   * @param {string} taskId
   * @returns {function} canceller function
   */
  public openChannel(taskId: string, action: SyncActions, callback: (activity?: ITaskActivity) => void): any {
    if (this.listenerCanceler === null) {
      this.listenerCanceler = this.API.addTaskSyncActivityListener(this.dispatchActivityPushEvents.bind(this));
    }
    const uid = taskId + '_' + _.uniqueId('sync-t');
    this.openChannelsStack[uid] = {
      taskId,
      action,
      cb: callback,
    };
    const canceller = () => {
      delete this.openChannelsStack[uid];
    };
    return canceller;
  }

  /**
   * @function closeAllChannel
   * @desc close all open channels
   * Sync service will not dispatch any sync event
   * @public
   * @memberOf SyncActivity
   */
  public closeAllChannel() {
    this.openChannelsStack = {};
  };

  /**
   * @function openAllChannel
   * Service doesn't filter activity by task Ids
   * @returns {string} chanel ID
   * @memberOf SyncActivity
   */
  public openAllChannel(cb: (activity: ITaskActivity) => void) {
    return this.openChannel(this.OPEN_ALL_CHANNEL, SyncActions.ALL_ACTIONS, cb);
  };

  /**
   * @function dispatchActivityPushEvents
   * Dispatch sync event after received new sync-a
   *
   * 1. Check this sync-a push's taskId exist in open channel tasks
   * 2. Fetch activities after this.latestActivityTimestamp recursively
   * 3. Dispatch Sync Activity event with action_Id
   *
   * @public
   * @param event           sync-a payload data
   * @memberOf SyncActivity
   */
  public dispatchActivityPushEvents(syncObj: any): void {
    const filteredChannelsWithTaskId = Object.keys(this.openChannelsStack).filter((channelUid: string): boolean => {
      return this.openChannelsStack[channelUid].taskId === syncObj.task_id ||
        this.openChannelsStack[channelUid].action === SyncActions.ALL_ACTIONS;
    });

    if (filteredChannelsWithTaskId.length === 0) {
      return;
    }

    this.activityApi.getActivities({
      // fixme:: fix time
      after: this.latestActivityTimestamp - 10000,
      task_id: syncObj.task_id,
      details: true,
    }).then((activities: ITaskActivity[]) => {
      this.latestActivityTimestamp = _.maxBy(activities, 'timestamp');

      let calledChannelCallbacks;
      calledChannelCallbacks = [];

      activities.forEach((activity: ITaskActivity) => {

        filteredChannelsWithTaskId.forEach((channelUid: string) => {
          const channel: IChanel = this.openChannelsStack[channelUid];
          if ((channel.action === activity.action || channel.action === SyncActions.ALL_ACTIONS)) {
            calledChannelCallbacks.push(channelUid);
            channel.cb(activity);
          }
        });
      });
    });
  }
}
