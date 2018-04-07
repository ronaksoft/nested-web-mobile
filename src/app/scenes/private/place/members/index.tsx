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
import {IcoN, UserAvatar, FullName, OptionsMenu, PlaceName, InfiniteScroll, Loading} from 'components';
import * as _ from 'lodash';
import {hashHistory} from 'react-router';
import IPlaceMemberRequest from '../../../../api/place/interfaces/IPlaceMemberRequest';
import {Modal, message} from 'antd';

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

  skip: number;

  limit: number;
}

/**
 * @class Members
 * @classdesc Component renders the Members posts page
 * @extends {React.Component<IProps, IState>}
 */
class Members extends React.Component<IProps, IState> {

  private placeApi: PlaceApi;
  private topMenu: any;
  private loading: boolean;

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
      skip: 0,
      limit: 16,
    };

    this.loading = false;
    this.topMenu = {
      left: {
        name: <PlaceName place_id={this.state.placeId}/>,
        type: 'title',
        menu: [
          {
            onClick: this.gotoPlacePosts.bind(this, ''),
            name: 'Posts',
            isChecked: false,
            icon: {
              name: 'messages16',
              size: 16,
            },
          },
          {
            onClick: this.gotoPlaceFilses.bind(this, ''),
            name: 'Files',
            isChecked: false,
            icon: {
              name: 'file16',
              size: 16,
            },
          },
          {
            onClick: null,
            name: 'Members',
            isChecked: true,
            icon: {
              name: 'placeMember16',
              size: 16,
            },
          },
        ],
      },
      right: [
        {
          name: 'cross24',
          type: 'iconII',
          menu: [
            {
              onClick: this.gotoPlacePosts.bind(this, ''),
              name: 'Add Member',
              isChecked: true,
              icon: {
                name: 'person16',
                size: 16,
              },
            },
          ],
        }],
    };
  }

  private gotoPlacePosts() {
    hashHistory.push(`/places/${this.state.placeId}/messages`);
  }

  private gotoPlaceFilses() {
    hashHistory.push(`/places/${this.state.placeId}/files`);
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
    this.initialLoad();
  }

  private initialLoad() {
    const params: IGetWithSkipRequest = {
      place_id: this.state.placeId,
      skip: 0,
      limit: this.state.limit,
    };

    this.loading = true;
    this.placeApi.getMangers(params).then((users) => {
      this.addToMembers(users, true);
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });

    this.placeApi.getMembers(params).then((users) => {
      this.addToMembers(users, false);
      if (users.length < this.state.limit) {
        this.setState({
          reachedTheEnd: true,
        });
      } else {
        this.setState({
          skip: this.state.skip + this.state.limit,
        });
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
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

  private refresh = () => {
    this.setState({
      reachedTheEnd: false,
      members: [],
      skip: 0,
    }, () => {
      this.initialLoad();
    });
  }

  private loadMore = () => {
    if (!this.state.reachedTheEnd && !this.loading) {
      const params: IGetWithSkipRequest = {
        place_id: this.state.placeId,
        skip: this.state.skip,
        limit: this.state.limit,
      };
      this.loading = true;
      this.placeApi.getMembers(params).then((users) => {
        this.addToMembers(users, false);
        if (users.length < this.state.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        } else {
          this.setState({
            skip: this.state.skip + this.state.limit,
          });
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }

  private setManager = (id: string, admin: boolean) => {
    let promise;
    const param: IPlaceMemberRequest = {
      place_id: this.state.placeId,
      member_id: id,
    };
    if (admin) {
      promise = this.placeApi.demoteMember(param);
    } else {
      promise = this.placeApi.promoteMember(param);
    }
    promise.then(() => {
      const index = _.findIndex(this.state.members, {_id: id});
      const tempList = this.state.members;
      if (index > -1) {
        tempList[index].tmpManger = !tempList[index].tmpManger;
      }
      this.setState({
        members: tempList,
      });
    }).catch(() => {
      message.error('An error has occurred.', 10);
    });
  }

  private removeMember = (id: string) => {
    const param: IPlaceMemberRequest = {
      place_id: this.state.placeId,
      member_id: id,
    };
    Modal.confirm({
      title: 'Remove Member',
      content: 'are you sure for removing this member?',
      cancelText: 'No',
      okText: 'Yes',
      onOk: () => {
        this.placeApi.removeMember(param).then(() => {
          const index = _.findIndex(this.state.members, {_id: id});
          const tempList = this.state.members;
          if (index > -1) {
            tempList.splice(index, 1);
          }
          this.setState({
            members: tempList,
            editMode: false,
          });
        }).catch(() => {
          message.error('An error has occurred.', 10);
        });
      },
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
        <OptionsMenu leftItem={this.topMenu.left} rightItems={this.topMenu.right}/>
        {this.state.members.length > 0 && (
          <InfiniteScroll
            pullDownToRefresh={true}
            refreshFunction={this.refresh}
            next={this.loadMore}
            route={'members_' + this.state.placeId}
            hasMore={true}
            loader={<Loading active={!this.state.reachedTheEnd} position="fixed"/>}>
            {this.state.editMode &&
            <div className={style.editModeOverlay} onClick={this.closeAll}/>
            }
            {this.state.members.map((member) => (
              <div key={'member_wrapper_' + member._id}>
                <div key={'member_' + member._id}
                     className={style.item + ' ' + (member.tmpEditing ? style.editMode : '')}>
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
                    <div className={style.item + ' ' + style.secondary}
                         onClick={this.setManager.bind(this, member._id, member.tmpManger)}>
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
                    <div className={style.item + ' ' + style.secondary + ' ' + style.red}
                         onClick={this.removeMember.bind(this, member._id)}>
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
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default Members;
