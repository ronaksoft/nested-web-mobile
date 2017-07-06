import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {Icon} from 'antd';
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
        <a>
          adwdwd
          <IcoN size={24} name="arrow24"/>
        </a>
        <div className={style.filler}/>
        <div className={style.icons}>
          <Icon type="link"  />
          <Icon type="link"  />
        </div>
    </div>
    );
  }
}

export {OptionsMenu}
