import * as React from 'react';
import Item from './Item';
import {Progress, Button} from 'antd';
import {IAttachment, IUploadMission} from 'api/attachment/interfaces';
import IAttachmentItem from './Item/IAttachmentItem';
import AttachmentApi from 'api/attachment';
import Unique from 'services/utils/unique';
import Mode from './Item/mode';
const EMPTY_PICTURE = require('./default.gif');
import {UploadType} from 'api/attachment';
import Picture from 'services/utils/picture';
import IProgress from './IProgress';
const style = require('./attachmentList.css');

interface IProps {
  file?: File;
  items: IAttachment[];
  onItemsChanged: (items: IAttachment[]) => void;
}

interface IState {
  items: IAttachmentItem[];
  isExpanded: boolean;
}

interface IUploadItem {
  id: number;
  file: File;
  abort: () => void;
  thumb: string;
}

/**
 * manage the Items list and file upload
 *
 * @class AttachmentList
 * @extends {React.Component<IProps, IState>}
 */
class AttachmentList extends React.Component<IProps, IState> {
  private uploads: IUploadItem[];
  constructor(props: IProps) {
    super(props);

    this.state = {
      items: props.items.map(this.createItem),
      isExpanded: true,
    };

    this.uploads = [];
    this.handleRemove = this.handleRemove.bind(this);
  }

  /**
   * Create an AttachmentItem using the provided Attachment model
   *
   * @private
   * @memberof AttachmentList
   */
  private createItem = (attachment: IAttachment): IAttachmentItem => {
    return {
      id: Unique.get(),
      mode: Mode.VIEW,
      model: attachment,
    };
  }

  /**
   * create an Item and upload the file
   *
   * @public
   * @memberof AttachmentList
   */
  public upload = (e: any) => {
    const file: File = e.target.files[0];
    const items: IAttachmentItem[] = [];
    // generate a unique id for every file that helps for tracking the file later
    const id: number = Unique.get();

    // push to items
    const item: IAttachmentItem = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      mode: Mode.UPLOAD,
      progress: {
        loaded: 0,
        total: -1,
      },
      uploading: true,
      model: null,
    };

    items.push(item);
    // upload the file
    this.send(item, file, UploadType.FILE);

    this.setState({
      items: this.state.items.slice().concat(items),
    });

  }

  /**
   * send the file to Store service
   *
   * @private
   * @param {IAttachmentItem} item
   * @param {File} file
   * @param {string} type
   * @memberof AttachmentList
   */
  private send(item: IAttachmentItem, file: File, type: string) {
    // upload the given file with the specified type
    AttachmentApi.upload(file, type || UploadType.FILE).then((mission: IUploadMission) => {

      mission.onError = () => this.onUploadError(item);
      mission.onFinish = (attachment: IAttachment) => this.onUploadFinish(item, attachment);
      mission.onProgress = (total: number, loaded: number) => this.onUploadProgress(item, {
        total,
        loaded,
      });
      mission.onAbort = () => this.onUploadAbort(item);

      this.getFileThumbnail(file).then((thumb) => {
        const uploadItem: IUploadItem = {
          abort: mission.abort,
          id: item.id,
          file,
          thumb,
        };

        this.uploads.push(uploadItem);
      });

    });
  }

  /**
   * set the Item status to failed
   *
   * @private
   * @memberof AttachmentList
   */
  private onUploadError = (item: IAttachmentItem) => {
    item.uploading = false;
    item.failed = true;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * set the Item status to aborted
   *
   * @private
   * @memberof AttachmentList
   */
  private onUploadAbort = (item: IAttachmentItem) => {
    item.uploading = false;
    item.aborted = true;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * set the Item status to finished and set the Attachment model
   * that Store service returns in response
   *
   * @private
   * @memberof AttachmentList
   */
  private onUploadFinish = (item: IAttachmentItem, attachment: IAttachment) => {
    const index = this.uploads.findIndex((upload) => upload.id === item.id);
    if (index >= 0) {
      this.uploads.splice(index, 1);
    }

    item.uploading = false;
    item.finished = true;
    item.model = attachment;
    item.mode = Mode.VIEW;

    this.props.onItemsChanged(this.state.items.map((i) => i.model));

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * set the item progress
   *
   * @private
   * @memberof AttachmentList
   */
  private onUploadProgress = (item: IAttachmentItem, progress: IProgress) => {
    item.progress = progress;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * create a thumbnail picture if the provided file is an image.
   * otherwise, returns a default image
   *
   * @private
   * @memberof AttachmentList
   */
  private getFileThumbnail = (file: File) => {
    if (!file) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    if (!Picture.isImage(file)) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    return Picture.resize(file);
  }

  /**
   * remove the file and abort the action if the file upload is in progress
   *
   * @private
   * @param {IAttachmentItem} item
   * @memberof AttachmentList
   */
  private handleRemove(item: IAttachmentItem) {
    const index = this.state.items.findIndex((i) => i.id === item.id);
    if (index > -1) {
      const uploadIndex = this.uploads.findIndex((u) => u.id === item.id);
      if (uploadIndex > -1) {
        this.uploads[uploadIndex].abort();
        this.uploads.splice(uploadIndex, 1);
      }
      this.state.items.splice(index, 1);

      this.props.onItemsChanged(this.state.items.map((i) => i.model));

      this.setState({
        items: this.state.items,
      });
    }
  }

  /**
   * switch between expanded and collapsed mode
   *
   * @private
   * @memberof AttachmentList
   */
  private toggleView = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  public get = () => {
    return this.state.items;
  }

  public isUploading = () => {
    return this.state.items.some((i) => i.uploading);
  }

  public render() {
    const renderItem = (item: IAttachmentItem) => {
      const upload = this.uploads.find((u) => u.id === item.id);
      return (
          <Item
                id={item.id}
                item={item}
                key={item.id}
                onRemove={this.handleRemove}
                picture={upload ? upload.thumb : null}
          />
      );
    };
    // calculate total progress by size
    let totalSize: number = 1;
    let totalLoaded: number = 0;
    let isUploading: boolean = false;
    let inProgressCount: number = 0;
    const items = [];

    this.state.items.forEach((i) => {

      // render Items if is in expanded mode
      if (this.state.isExpanded) {
        items.push(renderItem(i));
      }

      if (i.mode === Mode.UPLOAD) {
        totalLoaded += i.progress.loaded;
        totalSize += i.progress.total;
        inProgressCount++;
      }

      isUploading = isUploading || i.uploading;

    });
    const totalProgress = Math.floor((totalLoaded / totalSize) * 100) || 0;
    return (
      <div className={style.AttachmentList}>
        <div className={style.AttachmentListTop}>
          <div>
            <Button onClick={this.toggleView}>{this.state.isExpanded ? 'Collapse' : 'Expand'}</Button>
          </div>
          <div>
            <Progress percent={totalProgress} strokeWidth={5} showInfo={false} />
          </div>
          {
            isUploading && (
              <div>
                {
                  inProgressCount === 1
                    ? `One item is uploading ${totalProgress}%`
                    : `${inProgressCount} attachments are uploading ${totalProgress}%`
                }
              </div>
            )
          }
        </div>
        <div>
          <input id="myFile" type="file" onChange={this.upload} />
        </div>
        <div>
          {this.state.isExpanded && items}
        </div>
      </div>
    );
  }
}

export default AttachmentList;
