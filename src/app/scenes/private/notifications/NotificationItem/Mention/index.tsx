/**
 * @file scenes/private/notifications/NotificationItem/Mention/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the notification Item of Mention.
 * Document By : naamesteh
 * Date of documantion : 22/07/2017
 * Review by : -
 * Date of review : -
 * Component renders each Mention notification item which is occuring when
 * an account mention another account on a post.
 */
import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import INotification from '../../../../../api/notification/interfaces/INotification';
import TimeUntiles from '../../../../../services/utils/time';
import {Link} from 'react-router';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  /**
   * @property notification
   * @desc Includes notification as an object of notification data
   * @type {object}
   * @memberof IProps
   */
  notification: INotification;
}

/**
 * @class Mention
 * @desc Creates Mention component:
 * @extends {React.Component<IProps, any>}
 */
class Mention extends React.Component <IProps, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Mention
   */
  public render() {
    const notification = this.props.notification;
    return (
      <Link to={`#/m/message/${notification.post_id}`}
            className={[style.notifWrapper, this.props.notification.read ? style.read : null].join(' ')}>
        {/* using UserAvatar component for rendering user avatar */}
        <UserAvatar user_id={this.props.notification.actor_id} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <p>
              <b>
                {/* using FullName component for rendering user full name */}
                <FullName user_id={this.props.notification.account_id}/>
              </b>:
              {/* rendering account id of notification */}
              <span><b> @{this.props.notification.account_id}.</b></span>
              {/* using utils service component for rendering correct time */}
              <span className={style.time}> •{TimeUntiles.dynamic(this.props.notification.timestamp)}</span>
            </p>
          </div>
          <IcoN size={16} name={'atsign16'}/>
        </div>
      </Link>
    );
  }
}

export default Mention;
