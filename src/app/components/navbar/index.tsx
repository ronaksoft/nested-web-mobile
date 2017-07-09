import * as React from 'react';
const style = require('./navbar.css');
import {IcoN} from 'components';

interface INavbarProps {
  sidebarOpen: () => void;
  notificationOpen: () => void;
  composeOpen: () => void;
}
interface INavbarState {
  sidebarPopup?: boolean;
  notificationPopup?: boolean;
  composePopup?: boolean;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
        <div className={style.navbar}>
            <a onClick={this.props.sidebarOpen}>
                <IcoN size={24} name="menu24"/>
            </a>
            <div className={style.filler}/>
            <a onClick={this.props.notificationOpen}>
                <IcoN size={24} name="bell24"/>
            </a>
            <a onClick={this.props.composeOpen}>
                <IcoN size={24} name="compose24"/>
            </a>
        </div>
    );
  }
}

export {Navbar}
