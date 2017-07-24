/**
 * @file scenes/private/notifications/NotificationItem/NewSession/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Mention.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each NewSession notification item which is occuring when
 * an account log in any time with any device.
 */
import * as React from 'react';
import {IcoN, UserAvatar} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/untils/time';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  notification: INotification;
}
/**
 * @class NewSession
 * @desc Creates NewSession component
 * @extends {React.Component<IProps, any>}
 */
class NewSession extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Mention
   */
  public render() {
    return (
      <div className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={this.props.notification.account_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              <span><b>New login</b> from:</span>
              {/* setting _cid of notification for rendering log in devices */}
              <span> {this.props.notification._cid.replace(/_/g, ' ')}.</span>
              {/* using untils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'devicePhone16'}/>
        </div>
      </div>
    );
  }
}

export default NewSession;
