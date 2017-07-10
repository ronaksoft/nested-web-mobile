import * as React from 'react';

const style = require('./sidebar.css');
// import {IcoN} from 'components';
// import {browserHistory} from 'react-router';

interface INavbarProps {
  sidebarOpen: () => void;
  composeOpen: () => void;
}

interface INavbarState {
  notificationOpen?: boolean;
}

class Sidebar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      notificationOpen: false,
    });
  }

  public render() {
    return (
      <div className={style.sidebar}>
      </div>
    );
  }
}

export {Sidebar}
