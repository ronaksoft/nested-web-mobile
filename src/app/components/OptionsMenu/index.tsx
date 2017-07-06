import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {IcoN} from 'components';
const style = require('./OptionsMenu.css');

interface IOptionsMenuProps {
  item?: IPlace | null;
  filter?: string;
}

class OptionsMenu extends React.Component<IOptionsMenuProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
    <div className={style.visible}>
        <a className={style.title}>
          adwdwdds
          <IcoN size={24} name="arrowSense24"/>
        </a>
        <div className={style.filler}/>
        <div className={style.icons}>
          <div className={style.icon}>
            <IcoN size={24} name="sort24"/>
          </div>
          <div className={style.icon}>
            <IcoN size={24} name="sort24"/>
          </div>
        </div>
    </div>
    );
  }
}

export {OptionsMenu}
