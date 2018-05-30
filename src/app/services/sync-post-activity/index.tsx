/**
 * @file services/syncActivity/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Cyrus broadcasts messages of `sync-a` type to the clients. These activities
 * are just sent to the authenticated users based on their teammates' actions. This
 * service listens to these messages and filters by `post_id` and activity type for
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
import ActivityApi from '../../api/post/index';
import {IActivity} from 'api/interfaces/';

/**
 * @interface IChanel
 * @desc Interface of channel
 */
interface IChanel {
  /**
   * @property postId
   * @desc A postId for filtering activities
   * @type {string}
   * @memberof IChanel
   */
  postId: string;
  action: SyncActions;
  cb: (activity: IActivity) => void;
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
   * Open a channel with post Id
   *
   * Service filter activity by post Ids that it's has open
   * chanel
   *
   * @param {string} postId
   * @returns {function} canceller function
   */
  public openChannel(postId: string, action: SyncActions, callback: (activity?: IActivity) => void): any {
    if (this.listenerCanceler === null) {
      this.listenerCanceler = this.API.addPlaceSyncActivityListener(this.dispatchActivityPushEvents.bind(this));
    }
    const uid = postId + '_' + this.guid();
    this.openChannelsStack[uid] = {
      postId,
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
   * Service doesn't filter activity by post Ids
   * @returns {string} chanel ID
   * @memberOf SyncActivity
   */
  public openAllChannel(cb: (activity: IActivity) => void) {
    return this.openChannel(this.OPEN_ALL_CHANNEL, SyncActions.ALL_ACTIONS, cb);
  };

  /**
   * @function dispatchActivityPushEvents
   * Dispatch sync event after received new sync-a
   *
   * 1. Check this sync-a push's postId exist in open channel posts
   * 2. Fetch activities after this.latestActivityTimestamp recursively
   * 3. Dispatch Sync Activity event with action_Id
   *
   * @public
   * @param event           sync-a payload data
   * @memberOf SyncActivity
   */
  public dispatchActivityPushEvents(syncObj: any): void {
    const filteredChannelsWithPostId = Object.keys(this.openChannelsStack).filter((channelUid: string): boolean => {
      return this.openChannelsStack[channelUid].postId === syncObj.postId ||
        this.openChannelsStack[channelUid].action === SyncActions.ALL_ACTIONS;
    });

    if (filteredChannelsWithPostId.length === 0) {
      return;
    }

    this.activityApi.getActivities({
      // fixme:: fix time
      after: this.latestActivityTimestamp - 10000,
      post_id: syncObj.postId,
      details: true,
    }).then((activities: IActivity[]) => {
      this.latestActivityTimestamp = Date.now();

      let calledChannelCallbacks;
      calledChannelCallbacks = [];

      activities.forEach((activity: IActivity) => {

        filteredChannelsWithPostId.forEach((channelUid: string) => {
          const channel: IChanel = this.openChannelsStack[channelUid];
          if ((channel.action === activity.action || channel.action === SyncActions.ALL_ACTIONS)) {
            calledChannelCallbacks.push(channelUid);
            channel.cb(activity);
          }
        });
      });
    });
  }

  /**
   * @function guid
   * generate GUID
   * ( needs docs )
   * @returns {string}
   * @private
   * @memberOf SyncActivity
   */
  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}
