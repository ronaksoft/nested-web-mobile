import * as React from 'react';
import {throttle} from 'lodash';
interface IState {
    showLoader: boolean;
    lastScrollTop: number;
    actionTriggered: boolean;
    pullToRefreshThresholdBreached: boolean;
    pullDownToRefreshContent: any;
    releaseToRefreshContent: any;
    pullDownToRefreshThreshold: number;
    disableBrowserPullToRefresh: boolean;
};
interface IProps {
    next?: () => void;
    hasMore?: boolean;
    children?: any;
    loader: any;
    scrollThreshold?: number;
    initialScrollY?: number;
    endMessage?: any;
    style?: any;
    height?: number;
    scrollableTarget?: any;
    hasChildren?: boolean;
    pullDownToRefresh?: boolean;
    pullDownToRefreshContent?: any;
    releaseToRefreshContent?: any;
    pullDownToRefreshThreshold?: number;
    refreshFunction?: () => void;
    onScroll?: (evt: Event) => void;
};

export default class InfiniteScroll extends React.Component<IProps, IState> {
    public startY: number;
    public currentY: number;
    public dragging: boolean;
    public maxPullDownDistance: number;
    public el: HTMLElement;
    public isSafari = navigator.userAgent.toLowerCase().match(/(ipad|iphone)/);
    public throttledOnScrollListener: () => void;
    public infScroll: any;
    public pullDown: any;
    constructor(props) {
        super();
        this.state = {
        showLoader: false,
        lastScrollTop: 0,
        actionTriggered: false,
        pullToRefreshThresholdBreached: false,
        pullDownToRefreshContent: props.pullDownToRefreshContent || <h3>Pull down to refresh</h3>,
        releaseToRefreshContent: props.releaseToRefreshContent || <h3>Release to refresh</h3>,
        pullDownToRefreshThreshold: props.pullDownToRefreshThreshold || 100,
        disableBrowserPullToRefresh: props.disableBrowserPullToRefresh || true,
        };
        // variables to keep track of pull down behaviour
        this.startY = 0;
        this.currentY = 0;
        this.dragging = false;
        // will be populated in componentDidMount
        // based on the height of the pull down element
        this.maxPullDownDistance = 0;

        this.onScrollListener = this.onScrollListener.bind(this);
        this.throttledOnScrollListener = throttle(this.onScrollListener, 150).bind(this);
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    public componentDidMount() {
    this.el = this.props.height ? this.infScroll : this.props.scrollableTarget || window;
    this.el.addEventListener('scroll', this.throttledOnScrollListener);

    if (
      typeof this.props.initialScrollY === 'number' &&
      this.el.scrollHeight > this.props.initialScrollY
    ) {
      this.el.scrollTo(0, this.props.initialScrollY);
    }

    if (this.props.pullDownToRefresh) {
      this.el.addEventListener('touchstart', this.onStart);
      this.el.addEventListener('touchmove', this.onMove);
      this.el.addEventListener('touchend', this.onEnd);

      this.el.addEventListener('mousedown', this.onStart);
      this.el.addEventListener('mousemove', this.onMove);
      this.el.addEventListener('mouseup', this.onEnd);

      // get BCR of pullDown element to position it above
      this.maxPullDownDistance = this.pullDown.firstChild.getBoundingClientRect().height;
      this.forceUpdate();

      if (typeof this.props.refreshFunction !== 'function') {
        throw new Error(
          `Mandatory prop "refreshFunction" missing.
          Pull Down To Refresh functionality will not work
          as expected. Check README.md for usage'`,
        );
      }
    }
  }

  public componentWillUnmount() {
    this.el.removeEventListener('scroll', this.throttledOnScrollListener);

    if (this.props.pullDownToRefresh) {
      this.el.removeEventListener('touchstart', this.onStart);
      this.el.removeEventListener('touchmove', this.onMove);
      this.el.removeEventListener('touchend', this.onEnd);

      this.el.removeEventListener('mousedown', this.onStart);
      this.el.removeEventListener('mousemove', this.onMove);
      this.el.removeEventListener('mouseup', this.onEnd);
    }
  }

  public componentWillReceiveProps() {
    // new data was sent in
    this.setState({
      showLoader: false,
      actionTriggered: false,
      pullToRefreshThresholdBreached: false,
    });
  }

  public onStart(evt: any) {
    if (this.infScroll.scrollTop === 0) {
        this.infScroll.scrollTop = 1;
    } else if (this.infScroll.scrollHeight === this.infScroll.clientHeight + this.infScroll.scrollTop) {
        this.infScroll.scrollTop -= 1;
    }
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    if (this.state.lastScrollTop > 1) {
        return;
    };

    this.dragging = true;
    this.startY = evt.pageY || evt.touches[0].pageY;
    this.currentY = this.startY;

    this.infScroll.style.willChange = 'transform';
    this.infScroll.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
    return true;
  }

  public onMove(evt: any) {
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    if (!this.dragging) {
        return;
    }
    this.currentY = evt.pageY || evt.touches[0].pageY;

    // user is scrolling down to up
    if (this.currentY < this.startY) {
        return;
    }
    if ((this.currentY - this.startY) >= this.state.pullDownToRefreshThreshold) {
      this.setState({
        pullToRefreshThresholdBreached: true,
      });
    }

    // so you can drag upto 1.5 times of the maxPullDownDistance
    if (this.currentY - this.startY > this.maxPullDownDistance * 1.5) {
        return;
    }

    this.infScroll.style.overflow = 'visible';
    this.infScroll.style.transform = `translate3d(0px, ${this.currentY - this.startY}px, 0px)`;
    return true;
  }

  public onEnd(evt: any) {
    if (this.infScroll.scrollTop === 0) {
        this.infScroll.scrollTop = 1;
    } else if (this.infScroll.scrollHeight === this.infScroll.clientHeight + this.infScroll.scrollTop) {
        this.infScroll.scrollTop -= 1;
    }
    evt.stopImmediatePropagation();
    evt.cancelBubble = true;
    evt.stopPropagation();
    // e.returnValue = true;
    this.startY = 0;
    this.currentY = 0;

    this.dragging = false;

    if (this.state.pullToRefreshThresholdBreached && this.props.refreshFunction) {
      this.props.refreshFunction();
    }

    requestAnimationFrame(() => {
      this.infScroll.style.overflow = 'auto';
      this.infScroll.style.transform = 'none';
      this.infScroll.style.willChange = 'none';
    });
    return true;
  }

  public isElementAtBottom(target, scrollThreshold = 0.8) {
    const clientHeight = (target === document.body || target === document.documentElement)
    ? window.screen.availHeight : target.clientHeight;

    const scrolled = scrollThreshold * (target.scrollHeight - target.scrollTop);
    return scrolled <= clientHeight;
  }

  public onScrollListener(event) {
    if (typeof this.props.onScroll === 'function') {
      // Execute this callback in next tick so that it does not affect the
      // functionality of the library.
      setTimeout(() => this.props.onScroll(event), 0);
    }

    const target = this.props.height || this.props.scrollableTarget
      ? event.target
      : (document.documentElement.scrollTop ? document.documentElement : document.body);
    event.stopImmediatePropagation();
    event.cancelBubble = true;
    event.stopPropagation();
    if (target.scrollTop === 0) {
        target.scrollTop = 1;
    } else if (target.scrollHeight === target.clientHeight + target.scrollTop) {
        target.scrollTop -= 1;
    }
    event.returnValue = true;
    // if user scrolls up, remove action trigger lock
    if (target.scrollTop < this.state.lastScrollTop) {
      this.setState({
        actionTriggered: false,
        lastScrollTop: target.scrollTop,
      });
      return; // user's going up, we don't care
    }

    // return immediately if the action has already been triggered,
    // prevents multiple triggers.
    if (this.state.actionTriggered) {
        return;
    }

    const atBottom = this.isElementAtBottom(target, this.props.scrollThreshold);

    // call the `next` function in the props to trigger the next data fetch
    if (atBottom && this.props.hasMore) {
      this.props.next();
      this.setState({actionTriggered: true, showLoader: true});
    }
    this.setState({lastScrollTop: target.scrollTop});
    return true;
  }

  private infScrollHandler = (value) => {
    this.infScroll = value;
  }
  private pullDownHandler = (value) => {
    this.pullDown = value;
  }

  public render() {

    if (this.infScroll && this.infScroll.scrollTop === 0) {
        this.infScroll.scrollTop += 1;
      }
    const style = {
      height: this.props.height || 'auto',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      ...this.props.style,
    };
    const hasChildren = this.props.hasChildren || !!(this.props.children && this.props.children.length);

    // because heighted infiniteScroll visualy breaks
    // on drag down as overflow becomes visible
    return (
      <div style={{overflow: 'auto', height: '100%'}}>
        <div
          className="infinite-scroll-component"
          ref={this.infScrollHandler}
          style={style}
        >
          {this.props.pullDownToRefresh && (
            <div
              style={{ position: 'relative' }}
              ref={this.pullDownHandler}
            >
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: (-1 * this.maxPullDownDistance),
              }}>
                {!this.state.pullToRefreshThresholdBreached &&
                  this.props.pullDownToRefreshContent}
                {this.state.pullToRefreshThresholdBreached &&
                  this.props.releaseToRefreshContent}
              </div>
            </div>
          )}
          {this.props.children}
          {!this.state.showLoader && !hasChildren && this.props.hasMore &&
            this.props.loader}
          {this.state.showLoader && this.props.loader}
          {!this.props.hasMore && this.props.endMessage}
        </div>
      </div>
    );
  }
}
