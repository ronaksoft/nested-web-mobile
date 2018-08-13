
import * as React from 'react';
import {IcoN, UserAvatar, InfiniteScroll, Loading} from 'components';
import PostApi from '../../api/post/';
import TimeUtiles from 'services/utils/time';

const style = require('./seenby.css');

interface IProps {
  postId: string;
  onClose: () => void;
}

interface IState {
    haveMore: boolean;
    reads: any[];
    loading: boolean;
}

/**
 * Adds label to given array with suggesting user labels
 * @class AddLabel
 * @extends {React.Component<IProps, IState>}
 */
class SeenBy extends React.Component<IProps, IState> {

  private PostApi: PostApi;
  private skip: number = 0;
  /**
   * Creates an instance of AddLabel.
   * @constructor
   * @param {object} props
   * @memberof AddLabel
   */
  constructor(props: any) {
    super(props);

    /**
     * initial data set to prevent errors
     * @type {object}
     * @property {any} labels
     */
    this.state = {
      haveMore: true,
      reads: [],
      loading: false,
    };
  }

  public componentDidMount() {
    this.PostApi = new PostApi();
    this.getviews();
  }

  private close = () => {
    this.props.onClose();
  }

  private getviews = () => {
    this.setState({
        loading: true,
    });
    this.PostApi.whoRead(this.props.postId, 0, 24).then((response) => {
        console.log(response);
        this.skip += response.post_reads.length;
        this.setState({
            reads: response.post_reads,
            loading: false,
        });
    });
  }

  private loadMoreviews = () => {
    if (this.state.reads.length < 24) {
        return;
    }
    this.setState({
        loading: true,
    });
    this.PostApi.whoRead(this.props.postId, this.skip, 24).then((reads) => {
        this.skip += reads.length;
        this.setState({
            reads,
            loading: false,
        });
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof AddLabel
   * @lends AddLabel
   */
  public render() {
    return (
      <div className={style.AddLabel}>
          <div className={style.main}>
            <div className={style.AddLabelHead}>
                <div onClick={this.close}>
                    <IcoN size={24} name="xcross24"/>
                </div>
                <h3>Seen by...</h3>
            </div>
            <InfiniteScroll
                pullDownToRefresh={true}
                pullLoading={false}
                refreshFunction={this.getviews}
                next={this.loadMoreviews}
                route={'taskNotifications'}
                hasMore={true}
                loader={<Loading active={this.state.loading} position="fixed"/>}>
                    <ul>
                        {this.state.reads.map((read, index) => (
                            <li key={index}>
                                <div className={style.icon}>
                                    <UserAvatar user_id={read.account} size={32} borderRadius="16px"/>
                                </div>
                                <div className={style.detail}>
                                    <span>
                                        {read.account.fname}&nbsp;{read.account.lname}<br/>
                                        <span>{read.account._id}</span>
                                    </span>
                                    <div>
                                        {TimeUtiles.DateParse(read.read_on)}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {this.state.reads.length === 0 &&
                            <li className={style.placeholder}>Nobody else seen this Post yet.</li>
                        }
                    </ul>
            </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export {SeenBy}
