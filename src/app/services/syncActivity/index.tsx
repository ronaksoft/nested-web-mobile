import Api from '../../api/index';
import SyncActions from './syncActions';
import ActivityApi from '../../api/activity/index';
import IActivity from '../../api/activity/interfaces/IActivitiy';

interface IChanel {
  placeId: string;
  action: SyncActions;
  cb: (activity: IActivity) => void;
}

export default class SyncActivity {
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
  public openChannel(placeId: string, action: SyncActions, callback: (activity?: IActivity) => void): any {
    if (this.listenerCanceler === null) {
      this.listenerCanceler = this.API.addSyncActivityListener(this.dispatchActivityPushEvents.bind(this));
    }
    const uid = placeId + '_' + this.guid();
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
   * close all open channels
   *
   * Sync service will not dispatch any sync event
   *
   */
  public closeAllChannel() {
    this.openChannelsStack = {};
  };

  /**
   * Open all channel
   *
   * Service doesn't filter activity by place Ids
   *
   * @returns {string} chanel ID
   */
  public openAllChannel(cb: (activity: IActivity) => void) {
    return this.openChannel(this.OPEN_ALL_CHANNEL, SyncActions.ALL_ACTIONS, cb);
  };

  /**
   * Dispatch sync event after received new sync-a
   *
   * 1. Check this sync-a push's placeId exist in open channel places
   * 2. Fetch activities after this.latestActivityTimestamp recursively
   * 3. Dispatch Sync Activity event with action_Id
   *
   *
   * @param event           sync-a payload data
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
      after: this.latestActivityTimestamp - 100000,
      place_id: syncObj.place_id,
    }).then((activities: IActivity[]) => {
      this.latestActivityTimestamp = Date.now();

      let calledChannelCallbacks;
      calledChannelCallbacks = [];

      activities.forEach((activity: IActivity) => {

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

  /**
   * generate GUID
   *
   * @returns {string}
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
