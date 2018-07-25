import * as React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {OptionsMenu} from 'components';

import {IUser} from 'api/interfaces';
// const style = require('./style.css');

interface IState {
  user: IUser;
  location: any;
};

interface IProps {
  user: IUser;
  location: any;
};

/**
 * @class Private
 * @classdesc wrapper for all private scenses also
 * checks the user authentication state
 * @extends {React.Component<IProps, IState>}
 * @requires [<IcoN>,<sortBy>,<PlaceApi>,<SidebarItem>]
 */
class Settings extends React.Component<IProps, IState> {
  private optionMenu: any;
  private optionMenuHandler = (dom) => this.optionMenu = dom;
  public constructor(props: IProps) {
    super(props);
    /**
     * @default this.state
     * @type {IState}
     */
    this.state = {
      user: props.user,
      location: props.location.pathname,
    };
  }

  private changePath(path: string) {
    hashHistory.push(`/settings/${path}`);
    this.optionMenu.closeAll();
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
        location: newProps.location.pathname,
        user: newProps.user,
    });
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    const thisPath = this.state.location.split('/').splice(-1, 1)[0];
    const menu: any = {
      leftItem: {
        name: 'Profile Settings',
        type: 'title',
        menu: [
          {
            onClick: this.changePath.bind(this, 'profile'),
            name: 'Profile Settings',
            isChecked: false,
            icon: {
              name: 'person16',
              size: 16,
            },
          },
          {
            onClick: this.changePath.bind(this, 'general'),
            name: 'General',
            isChecked: false,
            icon: {
              name: 'gear16',
              size: 16,
            },
          },
          {
            onClick: this.changePath.bind(this, 'password'),
            name: 'Password',
            isChecked: false,
            icon: {
              name: 'lock16',
              size: 16,
            },
          },
          {
            onClick: this.changePath.bind(this, 'session'),
            name: 'Active Sessions',
            isChecked: false,
            icon: {
              name: 'devicePhone16',
              size: 16,
            },
          },
        ],
      },
      rightMenu:  [],
    };
    switch (thisPath) {
      case 'profile':
        menu.leftItem.menu[0].isChecked = true;
        break;
      case 'general':
        menu.leftItem.name = 'General Settings';
        menu.leftItem.menu[1].isChecked = true;
        break;
      case 'password':
        menu.leftItem.name = 'Password';
        menu.leftItem.menu[2].isChecked = true;
        break;
      case 'session':
        menu.leftItem.name = 'Active Sessions';
        menu.leftItem.menu[3].isChecked = true;
        break;
      default:
        break;
    }
    return (
      <div>
        <OptionsMenu leftItem={menu.leftItem} rightItems={menu.rightMenu}
          ref={this.optionMenuHandler}/>
        {this.props.children}
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  user: store.app.user,
});

export default connect(mapStateToProps, {})(Settings);
