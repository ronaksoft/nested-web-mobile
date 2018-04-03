/**
 * @file scenes/private/posts/feed/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import PlaceApi from '../../../../api/place';
import IGetWithSkipRequest from '../../../../api/place/interfaces/IGetWithSkipRequest';
import IUser from '../../../../api/account/interfaces/IUser';
import {IcoN, UserAvatar, FullName, Loading} from 'components';
import * as _ from 'lodash';

const style = require('./members.css');

interface IMUser extends IUser {
  tmpManger: boolean;
  tmpEditing: boolean;
}

/**
 * @interface IProps
 */
interface IProps {
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params?: any;
  /**
   * @property location
   * @desc location object that received from react-router
   * @type {any}
   * @memberof IProps
   */
  location: any;
}

/**
 * @interface IState
 */
interface IState {
  /**
   * @property reachedTheEnd
   * @desc hide loading  if `reachedTheEnd` is true
   * @type {boolean}
   * @memberof IState
   */
  reachedTheEnd: boolean;

  placeId: string;

  members: IMUser[];

  editMode: boolean;
}

/**
 * @class Members
 * @classdesc Component renders the Members posts page
 * @extends {React.Component<IProps, IState>}
 */
class Members extends React.Component<IProps, IState> {

  private placeApi: PlaceApi;

  /**
   * Creates an instance of Members.
   * @constructor
   * @param {*} props
   * @memberof Members
   */
  constructor(props: IProps) {

    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      // if postsRoute is equal to current path, stored posts in redux set as component state posts
      reachedTheEnd: false,
      placeId: props.params.placeId,
      members: [],
      editMode: false,
    };
  }

  /**
   * @desc updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Members
   */
  public componentWillReceiveProps(newProps: IProps) {
    console.log(newProps);
    // this.setState({posts: newProps.posts});
  }

  /**
   * Component Did Mount ( what ?!)
   * @desc Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof Members
   * @override
   */
  public componentDidMount() {
    /**
     * define the Post Api
     */
    this.placeApi = new PlaceApi();

    const params: IGetWithSkipRequest = {
      place_id: this.state.placeId,
      skip: 0,
      limit: 16,
    };

    this.placeApi.getMangers(params).then((users) => {
      this.addToMembers(users, true);
    });

    this.placeApi.getMembers(params).then((users) => {
      this.addToMembers(users, false);
    });
  }

  private addToMembers(users: IUser[], manager: boolean) {
    const temp = this.state.members;
    users.forEach((user) => {
      const tmp = user as IMUser;
      tmp.tmpEditing = false;
      tmp.tmpManger = manager;
      temp.push(tmp);
    });
    this.setState({
      members: temp,
    });
  }

  private toggleMoreOpts = (id: string) => {
    const index = _.findIndex(this.state.members, {_id: id});
    const tempList = this.state.members;
    if (index > -1) {
      tempList[index].tmpEditing = !tempList[index].tmpEditing;
    }
    this.setState({
      members: tempList,
      editMode: tempList[index].tmpEditing,
    });
  }

  private closeAll = () => {
    const tempList = this.state.members;
    tempList.map((member) => {
      member.tmpEditing = false;
    });
    this.setState({
      members: tempList,
      editMode: false,
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Members
   * @generator
   */
  public render() {
    return (
      <div>
        {this.state.editMode &&
        <div className={style.editModeOverlay} onClick={this.closeAll}/>
        }
        {this.state.members.map((member) => (
          <div key={'member_wrapper_' + member._id}>
            <div key={'member_' + member._id} className={style.item + ' ' + (member.tmpEditing ? style.editMode : '')}>
              <div className={style.userAvatar}>
                <UserAvatar user_id={member} size={32} borderRadius={'16px'}/>
                {member.tmpManger && (
                <div className={style.managerBadge}>
                  <IcoN size={16} name="crown16"/>
                </div>
                )}
              </div>
              <div className={style.user}>
              <span className={style.userName}>
                <FullName user_id={member}/>
              </span>
                <span className={style.userId}>{member._id}</span>
              </div>
              <div className={style.moreOption}>
                <a onClick={this.toggleMoreOpts.bind(this, member._id)}>
                  {!member.tmpEditing &&
                  <IcoN size={24} name="more24"/>
                  }
                  {member.tmpEditing &&
                  <IcoN size={24} name="xcross24"/>
                  }
                </a>
              </div>
            </div>
            {member.tmpEditing && (
              <div>
                <div className={style.item + ' ' + style.secondary}>
                  <div className={style.icon}>
                    {member.tmpManger &&
                    <IcoN size={16} name="person16"/>
                    }
                    {!member.tmpManger &&
                    <IcoN size={16} name="crown16"/>
                    }
                  </div>
                  <div className={style.label}>
                    {member.tmpManger ? 'Demote' : 'Promote'}
                  </div>
                </div>
                <div className={style.item + ' ' + style.secondary + ' ' + style.red}>
                  <div className={style.icon}>
                    <IcoN size={16} name="exit16"/>
                  </div>
                  <div className={style.label}>
                    Remove from Place
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default Members;
