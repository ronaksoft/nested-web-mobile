import * as firebase from 'firebase';
import INotificationTypes from './../../api/notification/interfaces/INotificationTypes';
import SyncActions from '../syncActivity/syncActions';
import {hashHistory} from 'react-router';

export default class FCM {

  private static instance: FCM;

  /**
   * Device Token that will receive from FCM server
   */
  private deviceToken: string;

  /**
   * declare FCM config
   *
   * @type {{apiKey: string; authDomain: string; databaseURL: string; storageBucket: string; messagingSenderId: string}}
   */
  private config = {
    apiKey: 'AIzaSyCkoYUKPeOpBjpQVLVg7sbRdyb0_Qk_cK4',
    authDomain: 'nested-me.firebaseapp.com',
    databaseURL: 'https://nested-me.firebaseio.com',
    storageBucket: 'nested-me.appspot.com',
    messagingSenderId: '993735378969',
  };

  private constructor() {
    // initialize firebase application
    firebase.initializeApp(this.config);
  }

  /**
   * @func getInstance
   * @desc Creates an instance of Api and keeps it singletone while the app is running
   * @static
   * @returns {FCM}
   * @memberof FCM
   */
  public static getInstance() {
    if (!FCM.instance) {
      FCM.instance = new FCM();
    }
    return FCM.instance;
  }

  public getDeviceToken() {
    return this.deviceToken;
  }

  public configFCM(): firebase.Promise<any> {

    // check browser notification's support
    if (!('Notification' in window)) {
      return;
    }

    // create an FCM messaging object
    const messaging = firebase.messaging();
    // set listener on FCM token refreshed
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((refreshedToken: string) => {
          this.deviceToken = refreshedToken;

        });
    });

    // register on click notification listener
    this.registerBroadcastReceiver();

    // get access from user to show desktop notification
    // if user accept then get fcm device token
    return messaging.requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then((token: string) => {
        this.deviceToken = token;
        return token;
      });
  }

  private registerBroadcastReceiver() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.onmessage = (event: any) => {
      const data = event.data;
      if (data.command === 'broadcastOnNotificationClick') {
        const body = JSON.parse(data.message);
        if (body.payload.type === 'n') {
          const subject = parseInt(body.payload.subject, 0);
          switch (subject) {
            case INotificationTypes.COMMENT:
            case INotificationTypes.MENTION:
              hashHistory.push(`/post/${body.payload.post_id}`);
              break;
            case INotificationTypes.PLACE_SETTINGS_CHANGED:
            case INotificationTypes.DEMOTED:
            case INotificationTypes.PROMOTED:
              hashHistory.push(`/post/${body.payload.place_id}`);
              // service.broadcastOpenPlace(body.payload.place_id, body.payload.notification_id);
              break;
            case INotificationTypes.INVITE:
            default:
              break;
          }
        }

        if (body.payload.type === 'a') {
          const action = parseInt(body.payload.action, 0);
          switch (action) {
            case SyncActions.POST_ADD:
              hashHistory.push(`/post/${body.payload.post_id}`);
              break;
            default :
              break;
          }
        }
      }
    };
  }

}
