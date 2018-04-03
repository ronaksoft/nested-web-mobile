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

  members: IUser[];
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
      this.addToMembers(users);
    });

    this.placeApi.getMembers(params).then((users) => {
      this.addToMembers(users);
    });
    console.log('componentDidMount');
  }

  private addToMembers(users: IUser[]) {
    const temp = this.state.members;
    temp.push.apply(temp, users);
    this.setState({
      members: temp,
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
        {this.state.members.map((member) => (
          <div key={'member_' + member._id}>
            <UserAvatar user_id={member} size={32} borderRadius={'16px'}/>
            <FullName user_id={member}/>
            <span>{member._id}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default Members;
