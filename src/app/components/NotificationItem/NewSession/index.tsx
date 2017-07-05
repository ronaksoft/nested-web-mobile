import * as React from 'react';
import INotification from '../INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class NewSession extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        {/*<div>*/}
          {/*<div>*/}
            {/*<img/>*/}
          {/*</div>*/}
        {/*</div>*/}
        {/*<div>*/}
          {/*<div>*/}
            {/*<p>*/}
              {/*<b><small>You logged in from:</small></b>*/}
            {/*</p>*/}
            {/*<p>*/}
            {/*</p>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*</div>*/}
          {/*<svg>*/}
            {/*<use></use>*/}
          {/*</svg>*/}
        {/*</div>*/}
      </div>

    );
  }
}

export {NewSession}
