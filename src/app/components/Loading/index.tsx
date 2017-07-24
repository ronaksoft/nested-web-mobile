/**
 * @file component/Loading/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Loading element for show in async methods.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';

const style = require('./loading.css');

interface IProps {
  active: boolean;
}

interface IState {
  active: boolean;
}

/**
 * renders the Loading element
 * @class Loading
 * @extends {React.Component<IProps, IState>}
 */
class Loading extends React.Component<IProps, IState> {

  /**
   * Constructor
   * Creates an instance of Loading.
   * @param {IProps} props
   * @memberof Loading
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} active show condition for element
     */
    this.state = {
      active : this.props.active,
    };
  }

  /**
   * updats the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Loading
   */
  public componentWillReceiveProps(newProps: IProps) {

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} active show condition for element
     */
    this.setState({
      active: newProps.active,
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Loading
   */
  public render() {
    return (
      <div>
        {/* chck the visibility condition for rendering */}
        { this.state.active && (
          <div className={style.loading}>
            {/* animated cicles in circular path */}
            <div className={style.animation}><div className={style.one}/></div>
            <div className={style.animation}><div className={style.two}/></div>
            <div className={style.animation}><div className={style.three}/></div>
            <div className={style.animation}><div className={style.four}/></div>
            <div className={style.animation}><div className={style.five}/></div>
          </div>
        )}
      </div>
    );
  }
}

export {Loading}
