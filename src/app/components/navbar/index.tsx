import * as React from 'react';

const style = require('./navbar.css');
import {IcoN} from 'components';
import {browserHistory} from 'react-router';

interface INavbarProps {
  sidebarOpen: () => void;
  composeOpen: () => void;
}

interface INavbarState {
  notificationOpen?: boolean;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: any) {
    super(props);
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

  public componentWillMount() {

    // FIXME : maybe its nor false ! on go straight to the notif
    this.setState({
      notificationOpen: false,
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
          <IcoN size={32} name="bell24"/>
        </a>
        <a onClick={this.props.composeOpen}>
          <IcoN size={24} name="compose24"/>
        </a>
      </div>
    );
  }
}

export {Navbar}
