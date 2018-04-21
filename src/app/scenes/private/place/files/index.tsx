/**
 * @file scenes/private/posts/feed/index.tsx
 * @author sina hosseini <ehosseiniir@gmail.com>
 * @description This component is designed for rendering posts which are bookmarked.
 * Documented by:          Shayesteh Naeimabadi <naamesteh@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import {connect} from 'react-redux';
import PlaceApi from '../../../../api/place';
import {hashHistory} from 'react-router';
import IGetFilesRequest from '../../../../api/place/interfaces/IGetFilesRequest';
import {InfiniteScroll, Loading, IcoN} from 'components';
import * as _ from 'lodash';
import IFile from '../../../../components/FileItem/IFile';
import {FileItem} from '../../../../components/FileItem/';
import C_PLACE_FILES_FILTER from './C_PLACE_FILES_FILTER';
import {setCurrentAttachment, setCurrentAttachmentList,
  setCurrentPlace} from '../../../../redux/attachment/actions/index';
// import {Modal, message} from 'antd';

const style = require('./files.css');
const privateStyle = require('../../private.css');

interface IOwnProps {
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params?: any;
  /**
   * @property location
   * @desc location object that received from react-router
   * @type {any}
   * @memberof IProps
   */
  location: any;

}
/**
 * @interface IProps
 */
interface IProps {
  /**
   * @property params
   * @desc parameters that received from route (react-router)
   * @type {any}
   * @memberof IProps
   */
  params: any;
  /**
   * @property location
   * @desc location object that received from react-router
   * @type {any}
   * @memberof IProps
   */
  location: any;
  currentAttachment: IFile;
  setCurrentPlace: (placeId: string) => void;
  setCurrentAttachment: (attachment: IFile) => void;
  setCurrentAttachmentList: (attachments: IFile[]) => void;
}

/**
 * @interface IState
 */
interface IState {
  /**
   * @property reachedTheEnd
   * @desc hide loading  if `reachedTheEnd` is true
   * @type {boolean}
   * @memberof IState
   */
  reachedTheEnd: boolean;
  placeId: string;
  files: IFile[];
  selectedFiles: string[];
  skip: number;
  limit: number;
  filter: string;
  initialLoad: boolean;
}

/**
 * @class Members
 * @classdesc Component renders the Members posts page
 * @extends {React.Component<IProps, IState>}
 */
class Files extends React.Component<IProps, IState> {

  private placeApi: PlaceApi;
  private loading: boolean;

  /**
   * Creates an instance of Members.
   * @constructor
   * @param {*} props
   * @memberof Members
   */
  constructor(props: IProps) {

    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      // if postsRoute is equal to current path, stored posts in redux set as component state posts
      reachedTheEnd: false,
      placeId: props.params.placeId,
      files: [],
      selectedFiles: [],
      skip: 0,
      limit: 16,
      initialLoad: false,
      filter: this.getFilter(props.location.pathname),
    };

    this.loading = false;
  }

  private setFilter(filter: string) {
    this.setState({
      filter,
      files: [],
      selectedFiles: [],
      initialLoad: false,
    }, () => {
      this.initialLoad();
    });
  }

  /**
   * Component Did Mount ( what ?!)
   * @desc Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof Members
   * @override
   */
  public componentDidMount() {
    /**
     * define the Post Api
     */
    this.placeApi = new PlaceApi();
    this.initialLoad();
  }

  public componentWillReceiveProps(newProps: IProps) {
    const newFilter = this.getFilter(newProps.location.pathname);
    if (this.state.filter !== newFilter) {
      this.setFilter(newFilter);
    }
  }

  public getFilter(path: string): string {
    let retVal: string = 'all';
    const pathArr = path.split('/');
    if (pathArr.length > 3) {
      Object.keys(C_PLACE_FILES_FILTER).forEach((key) => {
        if (C_PLACE_FILES_FILTER[key] === pathArr[4]) {
          retVal = key;
        }
      });
    }
    return retVal;
  }

  private initialLoad() {
    const params: IGetFilesRequest = {
      place_id: this.state.placeId,
      skip: 0,
      filter: this.state.filter,
      limit: this.state.limit,
    };

    this.loading = true;
    this.placeApi.getFiles(params).then((files) => {
      this.addToFiles(files);
      if (files.length < this.state.limit) {
        this.setState({
          reachedTheEnd: true,
          initialLoad: true,
        });
      } else {
        this.setState({
          skip: this.state.skip + this.state.limit,
          initialLoad: true,
        });
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });

  }

  private addToFiles(files: IFile[]) {
    const temp = this.state.files;
    files.forEach((file) => {
      const tmp = file as IFile;
      tmp.tmpEditing = false;
      temp.push(tmp);
    });
    this.setState({
      files: temp,
    });
  }

  private toggleSelect = (id: string, index: number) => {
    const indexSelected = _.findIndex(this.state.selectedFiles, (file) => file === id + ',' + index);
    const files = this.state.files;
    let selectedFiles = this.state.selectedFiles;
    if (index > -1) {
      files[index].tmpEditing = !files[index].tmpEditing;
    }
    if (indexSelected > -1) {
      selectedFiles.splice(indexSelected, 1);
    } else {
      selectedFiles = [...this.state.selectedFiles, id + ',' + index];
    }
    this.setState({
      files,
      selectedFiles,
    });
  }

  private closeAll = () => {
    const tempList = this.state.files;
    tempList.map((member) => {
      member.tmpEditing = false;
    });
    this.setState({
      files: tempList,
      selectedFiles: [],
    });
  }

  private refresh = () => {
    this.setState({
      reachedTheEnd: false,
      files: [],
      selectedFiles: [],
      skip: 0,
      initialLoad: false,
    }, () => {
      this.initialLoad();
    });
  }

  private loadMore = () => {
    if (!this.state.reachedTheEnd && !this.loading) {
      const params: IGetFilesRequest = {
        place_id: this.state.placeId,
        skip: this.state.skip,
        filter: this.state.filter,
        limit: this.state.limit,
      };
      this.loading = true;
      this.placeApi.getFiles(params).then((users) => {
        this.addToFiles(users);
        if (users.length < this.state.limit) {
          this.setState({
            reachedTheEnd: true,
          });
        } else {
          this.setState({
            skip: this.state.skip + this.state.limit,
          });
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }

  private openAttachment(file: IFile) {
    this.props.setCurrentAttachment(file);
    this.props.setCurrentAttachmentList(_.uniqBy(this.state.files, '_id'));
    this.props.setCurrentPlace(this.props.params.placeId);
  }

  private forwardFiles = () => {
    const attachments = this.state.selectedFiles.map((file) => file.split(',')[0]).join(',');
    return hashHistory.push(`/compose/${attachments}`);
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Members
   * @generator
   */
  public render() {
    return (
      <div style={{height: '100%'}}>
        {this.state.selectedFiles.length !== 0 && (
          <div className={style.selectedsMenu}>
            <div onClick={this.closeAll}>
              <IcoN name="negativeXCross16" size={16}/>
            </div>
            <span>
              <b>{this.state.selectedFiles.length}</b>&nbsp;&nbsp;&nbsp;files selected
            </span>
            <div onClick={this.forwardFiles}>
              <IcoN name="forwardWhite24" size={24}/>
            </div>
          </div>
        )}
        {this.state.files.length > 0 && (
          <InfiniteScroll
            pullDownToRefresh={true}
            refreshFunction={this.refresh}
            next={this.loadMore}
            route={'files_' + this.state.placeId}
            hasMore={true}
            loader={<Loading active={!this.state.reachedTheEnd} position="fixed"/>}>
            {this.state.files.map((file, index) => (
              <div key={file._id + index} onClick={this.openAttachment.bind(this, file)}>
                <FileItem file={file} onSelect={this.toggleSelect} index={index}/>
              </div>
            ))}
            {this.state.reachedTheEnd &&
              <div className={privateStyle.emptyMessage}>No more files here!</div>
            }
            <div className={privateStyle.bottomSpace}/>
          </InfiniteScroll>
        )}
        {this.state.files.length === 0 && this.state.initialLoad && (
          <div className={privateStyle.emptyMessage}>
            {this.state.filter === 'all' && <span>There are no files here yet...</span>}
            {this.state.filter !== 'all' && <span>There are no files with this filter</span>}
          </div>
        )}
        <Loading position="absolute" active={!this.state.initialLoad && this.state.files.length === 0}/>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  currentAttachment: store.attachments.currentAttachment,
  params: ownProps.params,
  location: ownProps.location,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentAttachment: (file: IFile) => {
      dispatch(setCurrentAttachment(file));
    },
    setCurrentAttachmentList: (files: IFile[]) => {
      dispatch(setCurrentAttachmentList(files));
    },
    setCurrentPlace: (placeId: string) => {
      dispatch(setCurrentPlace(placeId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
