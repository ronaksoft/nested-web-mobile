/**
 * @file component/Icons/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Icons component. Component gets the
 *              requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
const style = require('./icons.css');
const Icons = require('./nst-icons.json');

interface IOptionsMenuProps {
  name?: string;
  size?: number;
}

/**
 * Components icon for render in different components.
 * @class IcoN
 * @extends {React.Component<IOptionsMenuProps, any>}
 */
class IcoN extends React.Component<IOptionsMenuProps, any> {

  constructor(props: any) {
    super(props);
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof IcoN
   */
  public render() {

    /**
     * @namespace
     * className - css classname related to the size of icon
     */
    let width;
    let height;
    const size = this.props.size.toString() || this.props.name.replace( /^\D+/g, '').toString();
    if (size.length === 4) {
      width = size.slice(0, 2);
      height = size.slice(2, 4);
    } else {
      width = height = size;
    }
    const headSvgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
      version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
    return (
      <i dangerouslySetInnerHTML={{__html: headSvgContent + Icons[this.props.name] + '</svg>'}}
        className={style.nstIcon} />
    );
  }
}

export {IcoN}
