/**
 * @file component/user/Avatar/index.tsx
 * @author sina < sinaa@nested.me >
 * @description user Avatars render component.
 *              component use required data from redux store or serverApi
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import AAA from '../../../services/aaa/index';
import CONFIG from '../../../config';
import IUser from '../../../api/account/interfaces/IUser';
import {accountAdd} from '../../../redux/accounts/actions/index';
import AccountApi from '../../../api/account/index';
import {connect} from 'react-redux';

/**
 * its window function and need to be declared to stop tslint undiefiend error
 * @param {string} s - url
 * @returns {string}
 */
declare function unescape(s: string): string;

const style = require('./userItem.css');

/**
 * default style for render element
 * @name settings
 * @const
 * @default
 * @type {css}
 */
const settings = {
  textColor: '#ffffff',
  height: 24,
  width: 24,
  fontSize: 11,
  fontWeight: 400,
  fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  radius: 0,
};

/**
 * coler palette for user initials background oclor
 * @name defaultColors
 * @const
 * @type {String[]}
 */
const defaultColors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FF9800',
  '#FF5722',
  '#607D8B',
];

/**
 * text element inside user initial attribiutes
 * @name textAtts
 * @const
 * @default
 * @type {css}
 */
const textAtts = {
  'y': '50%',
  'x': '50%',
  'dy': '0.35em',
  'pointer-events': 'auto',
  'fill': settings.textColor,
  'font-family': settings.fontFamily,
  'text-anchor': 'middle',
};

/**
 * user initial element attribiutes
 * @name textAtts
 * @const
 * @default
 * @type {css}
 */
const svgAtts = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'pointer-events': 'none',
  'width': settings.width,
  'height': settings.height,
};

interface IOwnProps {
  user_id: string;
  borderRadius: string;
  size: any;
}

/**
 * @name IUserItemProps
 * @interface IUserItemProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {string} user_id - id of user should be rendering
 * @property {string} borderRadius - style for render element
 * @property {any} size - style for render element
 * @property {Array<IUser>} accounts - accounts stored in redux store
 * @property {function} accountAdd - add account in redux store
 */
interface IUserItemProps {
  user_id: string;
  borderRadius: string;
  size: any;
  accounts: IUser[];
  accountAdd: (user: IUser) => {};
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IUser} user
 */
interface IState {
  user: IUser | null;
}

/**
 * @class UserAvatarComponent
 * @classdesc component renders the created user initial or user avatar if exists
 * @extends {React.Component<IUserItemProps, IState>}
 */
class UserAvatarComponent extends React.Component<IUserItemProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {any} props
   * @memberof UserAvatarComponent
   */
  constructor(props: any) {
    super(props);

    /**
     * @default initial state of component to prevent errors
     */
    this.state = {
      user: null,
    };
  }

  /**
   * Try to Get user from redux store if its not stored before
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof PlaceItem
   * @override
   * @borrows accountApi
   */
  public componentDidMount() {
    const user = this.props.accounts.filter((user: IUser) => {
      return user._id === this.props.user_id;
    });

    if (user.length > 0) {
      this.setState({
        user: user[0],
      });
    } else {

    /**
     * Define accountApi
     * @name accountApi
     * @const
     * @type {object}
     */
      const accountApi = new AccountApi();
      accountApi.get({account_id: this.props.user_id})
        .then((account: IUser) => {
          this.setState({
            user: account,
          });
          this.props.accountAdd(account);
        });
    }

  }

  /**
   * Calculate sum of all string character charCode
   * @private
   * @param {string} username
   * @returns {function} UserAvatarComponent.getInitialValue
   * @memberof UserAvatarComponent
   */
  private getIndexStr(username: string): string {
    let value = 0;

    for (let i = 0; i < username.length; i++) {
      value += username.charCodeAt(i);
    }
    return this.getInitialValue(value);

  }

  /**
   * calculate a number between 0 and 16 to select an item from color palette
   * @private
   * @param {number} value sum of all username chars charcode.
   * @returns {number} number between 0 and 16
   * @memberof UserAvatarComponent
   */
  private getInitialValue(value: number) {
    let sum = 0;

    while (value > 0) {
      sum = sum + value % 10;
      value = value / 10;
    }

    if (sum < 16) {
      return Math.floor(sum);
    } else {
      return this.getInitialValue(sum);
    }
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof UserAvatarComponent
   * @override
   * @generator
   */
  public render() {

    /**
     * define borderRadius and size
     */
    const {
      borderRadius = '100%',
      size,
    } = this.props;

    /**
     * @name user
     * @const
     * @type {IUser}
     */
    const {user} = this.state;

    if (!user) {
      return null;
    }

    /**
     * element class name differs to different sizes
     * @name imageClass
     * @const
     * @type {string}
     */
    let imageClass;
    switch (size) {
      case 20:
        imageClass = 'ImageHolder-avatar-20';
        break;
      case 24:
        imageClass = 'ImageHolder-avatar-24';
        break;
      case 64:
        imageClass = 'ImageHolder-avatar-64';
        break;
      default:
        imageClass = 'ImageHolder-avatar';
    }

    /**
     * css size value
     * @name sizePX
     * @const
     * @type {string}
     */
    const sizePx = size.toString(10) + 'px';

    const imageStyle = {
      display: 'flex',
      borderRadius,
      margin: '0!important',
      width: sizePx,
      height: sizePx,
    };

    /**
     * css style for inner element
     * @name innerStyle
     * @const
     * @type {object}
     */
    const innerStyle = {
      lineHeight: sizePx,
      display: 'flex',
      textAlign: 'center',
      borderRadius,
    };

    /**
     * css style for imageholder element
     * @name ImageHolder
     * @const
     * @type {object}
     */
    const ImageHolder = {
      width: sizePx,
      height: sizePx,
      display: 'flex',
      // justifyContent: 'center',
      // position: 'relative',
      flex: 'none',
      borderRadius,
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    /**
     * define image element
     * @name imgDOM
     * @var
     * @type {jsxElement}
     */
    let imgDOM;

    /**
     * image element class attribiute
     * @name classes
     * @const
     * @type {Array<string>}
     */
    const classes = [style.UserAvatar];

    /**
     * user fullname
     * @name nameOfUser
     * @const
     * @type {string}
     */
    const nameOfUser = user.fname ? `${user.fname} ${user.lname}` : user._id;

    /**
     * @name pictureId
     * @var
     * @type {string || null}
     */
    let pictureId = null;

    if (user.picture) {
      if (this.props.size <= 32) {
        pictureId = user.picture.x32;
      } else if (this.props.size <= 64) {
        pictureId = user.picture.x64;
      } else {
        pictureId = user.picture.x128;
      }
    }

    /**
     * assign a jsx element for image element
     * if user avatar images is not exists.
     * if user avatar image not uploaded creates a svg image (user initials)
     */
    if (pictureId) {
      imgDOM = (
        <img className={style.UserAvatarImp} style={imageStyle}
        src={`${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${pictureId}`}/>
      );
    } else {
      // iTODO Initails
      let abbr;
      let finalColor;
      if (nameOfUser) {
        abbr = nameOfUser.split(' ').slice(0, 2).map((item: any) => item[0]).join('');
      } else {
        abbr = 'U';
      }

      const c = abbr.toUpperCase();

      const colorIndex = this.getIndexStr(user._id);
      finalColor = defaultColors[colorIndex];

      const cobj = document.createElement('text');
      for (const k in textAtts) {
        if (k) {
          cobj.setAttribute(k, textAtts[k]);
        }
      }
      cobj.style.fontWeight = '400';
      cobj.style.fontSize = settings.fontSize + 'px';

      cobj.innerHTML = c;

      const svg = document.createElement('svg');
      for (const key in svgAtts) {
        if (key) {
          svg.setAttribute(key, svgAtts[key]);
        }

      }

      svg.style.backgroundColor = finalColor;
      svg.style.width = settings.width + 'px';
      svg.style.height = settings.height + 'px';
      svg.style.borderRadius = settings.radius + 'px';

      svg.appendChild(cobj);

      const div = document.createElement('div');
      div.appendChild(svg);

      const svgHtml = window.btoa(unescape(encodeURIComponent(div.innerHTML)));

      const src = 'data:image/svg+xml;base64,' + svgHtml;

      imgDOM = <img style={imageStyle} src={src}/>;

    }

    return (
      <div aria-label={name} className={classes.join(' ')} style={style}>
        <div className={style.UserAvatarInner} style={innerStyle}>
          <div className={imageClass} style={ImageHolder}>
            {user.picture && imgDOM}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  accounts: store.accounts.accounts,
  user_id: ownProps.user_id,
  borderRadius: ownProps.borderRadius,
  size: ownProps.size,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchAction = (dispatch) => {
  return {
    accountAdd: (account: IUser) => dispatch(accountAdd(account)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(UserAvatarComponent);
