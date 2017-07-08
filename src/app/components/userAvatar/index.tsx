import * as React from 'react';
import IUser from '../../api/account/interfaces/IUser';
import AAA from '../../services/aaa/index';
import CONFIG from '../../../app/config';

declare function unescape(s: string): string;

const style = require('./userItem.css');
const settings = {
  textColor: '#ffffff',
  height: 24,
  width: 24,
  fontSize: 11,
  fontWeight: 400,
  fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  radius: 0,
};
const defaultColors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FF9800',
  '#FF5722',
  '#607D8B',
];
const textAtts = {
  'y': '50%',
  'x': '50%',
  'dy': '0.35em',
  'pointer-events': 'auto',
  'fill': settings.textColor,
  'font-family': settings.fontFamily,
  'text-anchor': 'middle',
};
const svgAtts = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'pointer-events': 'none',
  'width': settings.width,
  'height': settings.height,
};

interface IUserItemProps {
  user?: IUser;
  borderRadius: string;
  size: any;
}

class UserAvatar extends React.Component<IUserItemProps, any> {
  constructor(props: any) {
    super(props);
  }

  private getIndexStr(username: string) {
    let value = 0;

    for (let i = 0; i < username.length; i++) {
      value += username.charCodeAt(i);
    }
    return this.getInitialValue(value);

  }

  private getInitialValue(value: number) {
    let sum = 0;

    while (value > 0) {
      sum = sum + value % 10;
      value = value / 10;
    }

    if (sum < 16) {
      return Math.floor(sum);
    } else {
      return this.getInitialValue(sum);
    }
  }

  public render() {
    const {
      borderRadius = '100%',
      user,
      size,
    } = this.props;

    let imageClass;
    switch (size) {
      case 20:
        imageClass = 'ImageHolder-avatar-20';
        break;
      case 24:
        imageClass = 'ImageHolder-avatar-24';
        break;
      case 64:
        imageClass = 'ImageHolder-avatar-64';
        break;
      default:
        imageClass = 'ImageHolder-avatar';
    }

    const sizePx = size.toString(10) + 'px';

    const imageStyle = {
      display: 'flex',
      borderRadius,
      margin: '0!important',
      width: sizePx,
      height: sizePx,
    };

    const innerStyle = {
      lineHeight: sizePx,
      display: 'flex',
      textAlign: 'center',
      borderRadius,
    };

    const ImageHolder = {
      width: sizePx,
      height: sizePx,
      display: 'flex',
      // justifyContent: 'center',
      // position: 'relative',
      flex: 'none',
      borderRadius,
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    let imgDOM;
    const classes = [style.UserAvatar];
    const nameOfUser = `${user.name} ${user.family}`;

    let pictureId = null;

    if (this.props.size <= 32) {
      pictureId = user.picture.x32;
    } else if (this.props.size <= 64) {
      pictureId = user.picture.x64;
    } else {
      pictureId = user.picture.x128;
    }

    if (pictureId) {
      imgDOM = <img className={style.UserAvatarImp} style={imageStyle}
                    src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${pictureId}`}/>;
    } else {
      // iTODO Initails
      let abbr;
      let finalColor;
      if (nameOfUser) {
        abbr = nameOfUser.split(' ').slice(0, 2).map((item: any) => item[0]).join('');
      } else {
        abbr = 'U';
      }

      const c = abbr.toUpperCase();

      const colorIndex = this.getIndexStr(user._id);
      finalColor = defaultColors[colorIndex];

      const cobj = document.createElement('text');
      for (const k in textAtts) {
        if (k) {
          cobj.setAttribute(k, textAtts[k]);
        }
      }
      cobj.style.fontWeight = '400';
      cobj.style.fontSize = settings.fontSize + 'px';

      cobj.innerHTML = c;

      const svg = document.createElement('svg');
      for (const key in svgAtts) {
        if (key) {
          svg.setAttribute(key, svgAtts[key]);
        }

      }

      svg.style.backgroundColor = finalColor;
      svg.style.width = settings.width + 'px';
      svg.style.height = settings.height + 'px';
      svg.style.borderRadius = settings.radius + 'px';

      svg.appendChild(cobj);

      const div = document.createElement('div');
      div.appendChild(svg);

      const svgHtml = window.btoa(unescape(encodeURIComponent(div.innerHTML)));

      const src = 'data:image/svg+xml;base64,' + svgHtml;

      imgDOM = <img className={'UserAvatar--img'} style={imageStyle} src={src}/>;

    }

    return (
      <div aria-label={name} className={classes.join(' ')} style={style}>
        <div className={style.UserAvatarInner} style={innerStyle}>
          <div className={imageClass} style={ImageHolder}>
            {this.props.user.picture && imgDOM}
          </div>
        </div>
      </div>
    );
  }
}

export {UserAvatar}
