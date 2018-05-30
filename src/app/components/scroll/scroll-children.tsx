
import * as React from 'react';
const style = require('./scrollable.css');
interface IState {
  lastScrollTop: number;
  actionTriggered: boolean;
};

interface IProps {
  active: boolean;
  shrinkHeight?: number;
};
export default class Scrollable extends React.Component<IProps, IState> {

    public startY: number;
    public currentY: number;
    public dragging: boolean;
  /**
   * @prop privatePagesWrapper
   * @desc Reference of privatePages Wrapper element
   * @private
   * @type {HTMLDivElement}
   * @memberof Private
   */
  private scrollWrapper: HTMLDivElement;

  public constructor(props: any) {
    super(props);
    this.state = {
        lastScrollTop: 0,
        actionTriggered: false,
    };
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  public isiOS() {
    if (typeof window !== 'undefined' && window.document) {
      return navigator && navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    }
  }

  public scrollDown() {
    this.scrollWrapper.scrollTop = this.scrollWrapper.scrollHeight - this.scrollWrapper.clientHeight;
  }

  public scrollTo(id: string) {
    const el: any = document.querySelector(`#${id}`);
    if (el) {
      this.scrollWrapper.scrollTop = el.offsetTop - 10;
    }
  }

  public componentDidMount() {
    if (!this.props.active) {
        return;
    }
    this.scrollWrapper.addEventListener('touchstart', this.onStart, false);
    this.scrollWrapper.addEventListener('touchmove', this.onMove, false);
    this.scrollWrapper.addEventListener('touchend', this.onEnd, false);
    this.scrollWrapper.addEventListener('mousedown', this.onStart, false);
    this.scrollWrapper.addEventListener('mousemove', this.onMove, false);
    this.scrollWrapper.addEventListener('mouseup', this.onEnd, false);
    this.forceUpdate();

  }

  public componentWillUnmount() {
    if (!this.props.active) {
        return;
    }
    this.scrollWrapper.removeEventListener('touchstart', this.onStart);
    this.scrollWrapper.removeEventListener('touchmove', this.onMove);
    this.scrollWrapper.removeEventListener('touchend', this.onEnd);
    this.scrollWrapper.removeEventListener('mousedown', this.onStart);
    this.scrollWrapper.removeEventListener('mousemove', this.onMove);
    this.scrollWrapper.removeEventListener('mouseup', this.onEnd);
  }

  private preventZeroScroll(target) {
    if (this.isiOS()) {
      if (target.scrollTop === 0) {
        target.scrollTop = 1;
      } else if (target.scrollHeight === target.clientHeight + target.scrollTop) {
        target.scrollTop -= 1;
      }
    }
  }

  public onStart(evt: any) {
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    this.preventZeroScroll(this.scrollWrapper);

    if (this.state.lastScrollTop > 1) {
      return;
    };

    this.dragging = true;
    this.startY = evt.pageY || evt.touches[0].pageY;
    this.currentY = this.startY;

    this.scrollWrapper.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
    return true;
  }

  public onMove(evt: any) {
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    if (this.isiOS()) {
      if (this.scrollWrapper.scrollTop === 0) {
        evt.preventDefault();
      }
    }
    if (!this.dragging) {
        return;
    }
    this.currentY = evt.pageY || evt.touches[0].pageY;

    // user is scrolling down to up
    if (this.currentY < this.startY) {
        return;
    }
    return;
  }

  public onEnd(evt: any) {
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    this.preventZeroScroll(this.scrollWrapper);
    this.startY = 0;
    this.currentY = 0;

    this.dragging = false;

    requestAnimationFrame(() => {
      this.scrollWrapper.style.overflow = 'auto';
      this.scrollWrapper.style.transform = 'none';
    });
    return true;
  }

  /**
   * @func refHandler
   * @private
   * @memberof Private
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.scrollWrapper = value;
  }

  /**
   * renders the component if the credentials are valid
   * @returns {ReactElement} markup
   * @memberof Private
   * @override
   * @generator
   */
  public render() {
    let styleContainer = {};
    if (this.props.shrinkHeight) {
      styleContainer = {
        maxHeight: `calc(100vh - ${56 + this.props.shrinkHeight}px)`,
      };
    }
    return (
      <div ref={this.refHandler} className={this.props.active ? style.container : ''} style={styleContainer}>
          {this.props.children}
      </div>
    );
  }
}
