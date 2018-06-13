import * as React from 'react';
import C_ACTIVITY_ACTION from '../../api/place/interfaces/C_ACTIVITY_ACTION';
import {UserAvatar, IcoN} from 'components';
import {IPlaceActivity} from 'api/interfaces/';
import TimeUntiles from '../../services/utils/time';
import {hashHistory} from 'react-router';
const style = require('./activityItem.css');

interface IProps {
  /**
   * @property file
   * @desc Includes file as an object of files data
   * @type {object} ( not defined properly )
   * @memberof IProps
   */
  act: IPlaceActivity;
  placeId?: string;
}

/**
 * renders the FileItem element
 * @class FileItem
 * @extends {React.Component<IProps, any>}
 */
class ActivityItem extends React.Component<IProps, any> {
  private template: JSX.Element;
  private icon: string;
  private onclick: () => void = () => console.log('register proper on click event to activity');
  public constructor() {
    super();
  }

  public componentWillMount() {
    this.template = this.findItemType();
  }

  public findItemType(): JSX.Element {
    const {act} = this.props;
    switch (act.action) {
      // case C_ACTIVITY_ACTION.COMMENT_ADD:
      //   this.icon = 'commentCrown16';
      //   this.onclick = () => hashHistory.push(`/message/${act.post_id || act.post._id}/`);
      //   return <p><b>{act.actor.fname} {act.actor.lname}: </b>{act.comment_text}</p>;
      case C_ACTIVITY_ACTION.COMMENT_REMOVE:
        this.icon = 'commentForce16';
        return <p><b>{act.actor.fname} {act.actor.lname}: </b>removed a comment</p>;
      case C_ACTIVITY_ACTION.LABEL_ADD:
        this.icon = 'tagSense16';
        this.onclick = () => hashHistory.push(`/message/${act.post_id || act.post._id}/`);
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            {act.label &&
              `added ${act.label.title} label to ${act.post.subject.length > 32 ? act.post.subject : 'a post'}.`
            }
            {!act.label &&
              `added a "removed" label to ${act.post.subject.length > 32 ? act.post.subject : 'a post'}.`
            }
          </p>
        );
      case C_ACTIVITY_ACTION.LABEL_REMOVE:
        this.icon = 'tagForce16';
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            {act.label &&
              `removed ${act.label.title} label from ${act.post.subject.length > 32 ? act.post.subject : 'a post'}.`
            }
            {!act.label &&
              `removed a "removed" label from ${act.post.subject.length > 32 ? act.post.subject : 'a post'}.`
            }
          </p>
        );
      case C_ACTIVITY_ACTION.MEMBER_JOIN:
        this.icon = 'enterSense16';
        return <p><b>{act.actor.fname} {act.actor.lname}: </b>joined here.</p>;
      case C_ACTIVITY_ACTION.MEMBER_REMOVE:
        this.icon = 'exitForce16';
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            {act.member._id !== act.actor._id && (
              <span>
                removed <b>@{act.member._id}</b>.
              </span>
            )}
            {act.member._id === act.actor._id && 'left.'}
          </p>
        );
      case C_ACTIVITY_ACTION.PLACE_ADD:
        this.icon = 'places16';
        return <p><b>{act.actor.fname} {act.actor.lname}: </b>created here.</p>;
      case C_ACTIVITY_ACTION.POST_ADD:
        this.icon = 'messageSense16';
        this.onclick = () => hashHistory.push(`/message/${act.post_id || act.post._id}/`);
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            {act.post && act.post.subject && act.post.subject}
            {act.post && !act.post.subject && act.post.preview &&
              <span dangerouslySetInnerHTML={{__html: act.post.preview}}/>
            }
          </p>
        );
      case C_ACTIVITY_ACTION.POST_ATTACH_PLACE:
        this.icon = 'messageSense16';
        this.onclick = () => hashHistory.push(`/message/${act.post_id || act.post._id}/`);
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            attached {act.new_place ? act.new_place._id : act.place_id}&nbsp;to&nbsp;
            {act.post.subject.length > 0 && act.post.subject}
            {act.post.preview.length > 0 && act.post.subject.length === 0 &&
              <span dangerouslySetInnerHTML={{__html: act.post.preview}}/>
            }
          </p>
        );
      case C_ACTIVITY_ACTION.POST_MOVE:
      this.onclick = () => hashHistory.push(`/message/${act.post_id || act.post._id}/`);
        this.icon = 'messageSense16';
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            moved&nbsp;
            {act.post.subject.length > 0 && act.post.subject}
            {act.post.preview.length > 0 && act.post.subject.length === 0 &&
              <span dangerouslySetInnerHTML={{__html: act.post.preview}}/>
            }&nbsp;
            {act.new_place && (
              <span>
                {this.props.placeId === act.new_place._id && <span>to here</span>}
                {this.props.placeId !== act.new_place._id && <span>to {act.new_place._id}</span>}
              </span>
            )}
            {act.old_place && (
              <span>
                {this.props.placeId === act.old_place._id && <span>from here</span>}
                {this.props.placeId !== act.old_place._id && <span>to here</span>}
              </span>
            )}
          </p>
        );
      case C_ACTIVITY_ACTION.POST_REMOVE_PLACE:
        this.icon = 'messageSense16';
        return (
          <p>
            <b>{act.actor.fname} {act.actor.lname}: </b>
            removed a post:
            {act.post.subject.length > 0 && act.post.subject}
            {act.post.preview.length > 0 && act.post.subject.length === 0 &&
              <span dangerouslySetInnerHTML={{__html: act.post.preview}}/>
            }
          </p>
        );

      default:
        return <p>New Type notification</p>;
    }
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof FileItem
   * @generator
   */
  public render() {
    return (
      <div className={style.actContainer}>
        <div className={style.avatar}>
          <UserAvatar user_id={this.props.act.actor} size={32} borderRadius={'16px'}/>
        </div>
        <div className={style.actData} onClick={this.onclick}>
          <div className={style.actSummory}>
            {this.template}
            <time dateTime={new Date(this.props.act.timestamp) + ''}>
              {TimeUntiles.dynamic(this.props.act.timestamp)}
            </time>
          </div>
          <div className={style.icon}>
            <IcoN name={this.icon} size={16}/>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivityItem;
