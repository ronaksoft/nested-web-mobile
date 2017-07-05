import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
// import {Row, Col} from 'antd';
const style = require('./OptionsMenu.css');

interface IOptionsMenuProps {
  item?: IPlace;
  filter: string;
  size: any;
  avatar: boolean;
  name: boolean;
  id: boolean;
}

class OptionsMenu extends React.Component<IOptionsMenuProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
    <div className={style.visible}>
        ass
    </div>
    );
  }
}

export {OptionsMenu}
