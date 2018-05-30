/**
 * @file services/syncActivity/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Cyrus broadcasts messages of `sync-a` type to the clients. These activities
 * are just sent to the authenticated users based on their teammates' actions. This
 * service listens to these messages and filters by `place_id` and activity type for
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
import ActivityApi from '../../api/place/index';
import * as _ from 'lodash';
import {IPlaceActivity} from 'api/interfaces/';

/**
 * @interface IChanel
 * @desc Interface of channel
 */
interface IChanel {
  /**
   * @property placeId
   * @desc A placeId for filtering activities
   * @type {string}
   * @memberof IChanel
   */
  placeId: string;
  action: SyncActions;
  cb: (activity: IPlaceActivity) => void;
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
   * Open a channel with place Id
   *
   * Service filter activity by place Ids that it's has open
   * chanel
   *
   * @param {string} placeId
   * @returns {function} canceller function
   */
  public openChannel(placeId: string, action: SyncActions, callback: (activity?: IPlaceActivity) => void): any {
    if (this.listenerCanceler === null) {
      this.listenerCanceler = this.API.addPlaceSyncActivityListener(this.dispatchActivityPushEvents.bind(this));
    }
    const uid = placeId + '_' + _.uniqueId('sync-a');
    this.openChannelsStack[uid] = {
      placeId,
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
   * Service doesn't filter activity by place Ids
   * @returns {string} chanel ID
   * @memberOf SyncActivity
   */
  public openAllChannel(cb: (activity: IPlaceActivity) => void) {
    return this.openChannel(this.OPEN_ALL_CHANNEL, SyncActions.ALL_ACTIONS, cb);
  };

  /**
   * @function dispatchActivityPushEvents
   * Dispatch sync event after received new sync-a
   *
   * 1. Check this sync-a push's placeId exist in open channel places
   * 2. Fetch activities after this.latestActivityTimestamp recursively
   * 3. Dispatch Sync Activity event with action_Id
   *
   * @public
   * @param event           sync-a payload data
   * @memberOf SyncActivity
   */
  public dispatchActivityPushEvents(syncObj: any): void {
    const filteredChannelsWithPlaceId = Object.keys(this.openChannelsStack).filter((channelUid: string): boolean => {
      return this.openChannelsStack[channelUid].placeId === syncObj.place_id ||
        this.openChannelsStack[channelUid].action === SyncActions.ALL_ACTIONS;
    });

    if (filteredChannelsWithPlaceId.length === 0) {
      return;
    }

    this.activityApi.getActivities({
      // fixme:: fix time
      after: this.latestActivityTimestamp - 10000,
      place_id: syncObj.place_id,
      details: true,
    }).then((activities: IPlaceActivity[]) => {
      this.latestActivityTimestamp = _.maxBy(activities, 'timestamp');

      let calledChannelCallbacks;
      calledChannelCallbacks = [];

      activities.forEach((activity: IPlaceActivity) => {

        filteredChannelsWithPlaceId.forEach((channelUid: string) => {
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
