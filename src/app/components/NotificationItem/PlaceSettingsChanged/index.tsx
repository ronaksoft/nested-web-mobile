import * as React from 'react';
import INotification from '../INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class PlaceSettingsChanged extends React.Component <IProps, any> {
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
              {/*<b></b> changed the settings of <b></b>.*/}
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

export {PlaceSettingsChanged}
