import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {IcoN} from 'components';
const style = require('./OptionsMenu.css');

interface IOptionsMenuProps {
  item?: IPlace | null;
  filter?: string;
}
interface IOptionsMenuStat {
  titlePopup?: boolean;
  iconIPopup?: boolean;
  iconIIPopup?: boolean;
}

class OptionsMenu extends React.Component<IOptionsMenuProps, IOptionsMenuStat> {

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    });
  }

  public openPopUp = (wrapper: string) => {
    const key = wrapper + 'Popup';
    this.setState({
      titlePopup: false,
      iconIPopup: false,
      iconIIPopup: false,
    });
    this.setState({
      [key]: !this.state[key],
    });
  }

  public render() {
    return (
    <div className={style.container}>
      <div className={style.visible}>
        <a onClick={this.openPopUp.bind(this, 'title')}
        className={this.state.titlePopup ? style.title + ' ' + style.active : style.title}>
          adwdwdds
          <IcoN size={24} name="arrowSense24"/>
        </a>
        <div className={style.filler}/>
        <div className={style.icons}>
          <div className={this.state.iconIPopup ? style.icon + ' ' + style.active : style.icon}
          onClick={this.openPopUp.bind(this, 'iconI')}>
            <IcoN size={24} name="sort24"/>
          </div>
          <div className={this.state.iconIIPopup ? style.icon + ' ' + style.active : style.icon}
          onClick={this.openPopUp.bind(this, 'iconII')}>
            <IcoN size={24} name="sort24"/>
          </div>
        </div>
      </div>
      { (this.state.titlePopup || this.state.iconIPopup || this.state.iconIIPopup) &&
        <div className={style.invisible}>
        a
        </div>
      }
      { this.state.titlePopup &&
        <div className={style.overlay}/>
      }
    </div>
    );
  }
}

export {OptionsMenu}
