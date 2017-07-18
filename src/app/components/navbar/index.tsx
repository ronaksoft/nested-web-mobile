import * as React from 'react';

const style = require('./navbar.css');
import {IcoN} from 'components';
import {browserHistory, Link} from 'react-router';

interface INavbarProps {
  sidebarOpen: () => void;
  composeOpen: () => void;
  notifCount: number;
}

interface INavbarState {
  notificationOpen: boolean;
  notifCount: number;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: any) {
    super(props);
    this.state = {
      notifCount: this.props.notifCount,
      notificationOpen: false,
    };
  }

  public componentWillRecieveProps(newProps: INavbarProps) {

    this.setState({
      notifCount: newProps.notifCount,
    });
  }

  private goToNotification() {
    if (this.state.notificationOpen) {
      browserHistory.push('/feed');
    } else {
      browserHistory.push('/notifications');
    }
    this.setState({
      notificationOpen: !this.state.notificationOpen,
    });
  }

  public render() {
    return (
      <div className={style.navbar}>
        <a onClick={this.props.sidebarOpen}>
          <IcoN size={24} name="menu24"/>
        </a>
        <div className={style.filler}/>
        <a className={this.state.notificationOpen ? style.active : null} onClick={this.goToNotification.bind(this, '')}>
          <IcoN size={24} name="bell24"/>
          {this.state.notifCount > 0 && <span>{this.state.notifCount}</span>}
        </a>
        <Link to="/compose">
          <IcoN size={24} name="compose24"/>
        </Link>
      </div>
    );
  }
}

export {Navbar}
