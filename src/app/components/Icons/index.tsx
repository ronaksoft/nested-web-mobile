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
    const className = 's' + this.props.size;
    return (
    <i dangerouslySetInnerHTML={{__html: Icons[this.props.name]}} className={style[className]} />
    );
  }
}

export {IcoN}
