import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Demoted extends React.Component <IProps, any> {
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
              {/*<b></b> demoted you in <b></b>.*/}
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

export default Demoted;
