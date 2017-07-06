import * as React from 'react';
const style = require('./icons.css');
const Icons = require('./nst-icons.json');

interface IOptionsMenuProps {
  name?: string;
  size?: number;
}

class IcoN extends React.Component<IOptionsMenuProps, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    const className = 's' + this.props.size;
    return (
    <i dangerouslySetInnerHTML={{__html: Icons[this.props.name]}} className={style[className]} />
    );
  }
}

export {IcoN}
