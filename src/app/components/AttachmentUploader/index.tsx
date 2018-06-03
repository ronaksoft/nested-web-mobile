/**
 * @file scenes/private/compose/AttachmentUploader/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description A list of attachment items in bottom of compose page
 * @export AttachmentUploader
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-25
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

import * as React from 'react';
import Item from './Item';
import {Progress} from 'antd';
import {IcoN} from 'components';
import {IUploadMission} from 'api/attachment/interfaces';
import IAttachmentItem from './Item/IAttachmentItem';
// import IComposeAttachment from '../../../../api/post/interfaces/IComposeAttachment';
import AttachmentApi from 'api/attachment';
import Unique from 'services/utils/unique';
import {IAttachment} from 'api/interfaces';
import Mode from './Item/mode';
const EMPTY_PICTURE = require('./default.gif');
import {UploadType} from 'api/attachment';
import Picture from 'services/utils/picture';
import IProgress from './IProgress';
import FileUtil from 'services/utils/file';
const style = require('./attachmentList.css');
/**
 * @interface IProps
 * @desc The component properties contract
 */
interface IProps {
  /**
   * @prop file
   * @desc A javascript file. The component starts uploading, On receiving a new file.
   * @type {File}
   * @memberof IProps
   */
  file?: File;
  /**
   * @prop items
   * @desc The list items
   * @type {IAttachment[]}
   * @memberof IProps
   */
  items: IAttachment[];
  /**
   * @prop onItemsChanged
   * @desc An event that will be triggered on removing/adding an item.
   * The new list of items will be given as `items` in args
   * @memberof IProps
   */
  onItemsChanged: (items: IAttachment[]) => void;
  openAttachment?: (items: IAttachment[]) => void;
  mode: string;
  editable: boolean;
}
/**
 * @desc The component state contract
 * @interface IState
 */
interface IState {
  /**
   * @prop items
   * @desc A local copy of attachment items
   * @type {IAttachmentItem[]}
   * @memberof IState
   */
  items: IAttachmentItem[];
  /**
   * @prop isExpanded
   * @desc The component is collapsed by default. Once you click on expand button,
   * the items list reveals. We use this flag to switch between expanded/collapse views.
   * @type {boolean}
   * @memberof IState
   */
  isExpanded: boolean;
  editable: boolean;
}

/**
 * @interface IUploadItem
 * @desc Interface of an upload item. Once a file upload begins, we push an
 * IUploadItem to `this.uploads` to keep reference of the files while are uploading.
 * The localy generated  thumbnail image, upload abort function and a unique Id are
 * what we keep in adition to the javascript file.
 */
interface IUploadItem {
  /**
   * @prop id
   * @desc A unique Id
   * @type {number}
   * @memberof IUploadItem
   */
  id: number;
  /**
   * @prop file
   * @desc The given javascript file
   * @type {File}
   * @memberof IUploadItem
   */
  file: File;
  /**
   * @prop abort
   * @desc A function that stops the file upload
   * @memberof IUploadItem
   */
  abort: () => void;
  /**
   * @prop thumb
   * @desc A thumbnail image that is generated client-side for image files
   * @type {*}
   * @memberof IUploadItem
   */
  thumb: any;
}

/**
 * manage the Items list and file upload
 *
 * @class AttachmentUploader
 * @extends {React.Component<IProps, IState>}
 */
class AttachmentUploader extends React.Component<IProps, IState> {
  /**
   * @prop uploads
   * @desc A list of uploading items
   * @private
   * @type {IUploadItem[]}
   * @memberof AttachmentUploader
   */
  private uploads: IUploadItem[];
  /**
   * Creates an instance of AttachmentUploader.
   * @param {IProps} props
   * @memberof AttachmentUploader
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      items: props.items.map(this.createItem),
      isExpanded: false,
      editable: props.editable === false ? false : true,
    };

    this.uploads = [];
    this.handleRemove = this.handleRemove.bind(this);
  }

  /**
   * @func load
   * @desc Creates a list of `IAttachmentItem` from a list of `IAttachment`.
   * The method has been used to pass a list of attachments to the component from the outside
   * @param {IAttachment[]} attachments
   * @memberof AttachmentUploader
   */
  public load(attachments: IAttachment[]) {
    this.setState({
      items: attachments.map((attachment) => {
        const item: IAttachmentItem = {
          id: Unique.get(),
          mode: Mode.VIEW,
          model: attachment,
          progress: {
            loaded: 0,
            total: 1,
          },
        };

        return item;
      }),
    });
  }

  /**
   * @func load
   * @desc Creates a list of `IAttachmentItem` from a list of `IAttachment`.
   * The method has been used to pass a list of attachments to the component from the outside
   * @param {IAttachment[]} attachments
   * @memberof AttachmentUploader
   */
  public loadSync(attachment: IAttachment) {
    this.setState({
      items: [...this.state.items, {
        id: Unique.get(),
        mode: Mode.VIEW,
        model: attachment,
        progress: {
          loaded: 0,
          total: 1,
        },
      }],
    });
  };

  public componentWillReceiveProps(nProps: IProps) {
    this.setState({
      editable: nProps.editable,
    });
  }

  /**
   * @func createItem
   * @desc Create an AttachmentItem using the provided Attachment model
   * @private
   * @memberof AttachmentUploader
   */
  private createItem = (attachment: IAttachment): IAttachmentItem => {
    return {
      id: Unique.get(),
      mode: Mode.VIEW,
      model: attachment,
    };
  }

  /**
   * @func upload
   * @desc Creates an IAttachmentItem and upload the file
   * @public
   * @memberof AttachmentUploader
   */
  public upload = (e: any, isMedia: boolean) => {
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
    this.send(item, file, isMedia);

    this.setState({
      items: this.state.items.slice().concat(items),
    });

  }

  /**
   * @function abortAll
   * @desc Aborts all uploads that are in progress
   * @memberof AttachmentUploader
   */
  public abortAll = () => {
    this.uploads.forEach((i) => i.abort);
  }

  /**
   * @func send
   * @desc send the file to Store service
   * @private
   * @param {IAttachmentItem} item
   * @param {File} file
   * @param {string} type
   * @memberof AttachmentUploader
   */
  private send(item: IAttachmentItem, file: File, isMedia: boolean) {
    const type: string = isMedia ? FileUtil.getUploadType(file) : UploadType.FILE;
    // upload the given file with the specified type
    AttachmentApi.upload(file, type).then((mission: IUploadMission) => {

      mission.onError = () => this.onUploadError(item);
      mission.onFinish = (attachment) => this.onUploadFinish(item, attachment);
      mission.onProgress = (total: number, loaded: number) => this.onUploadProgress(item, {
        total,
        loaded,
      });
      mission.onAbort = () => this.onUploadAbort(item);
      // Creates a thumbnail image for the file and adds an `IUploadItem`
      // to the list of uploading files
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
   * @func onUploadError
   * @desc Updates an item state on facing an error in upload
   * @param {IAttachmentItem} item
   * @private
   * @memberof AttachmentUploader
   */
  private onUploadError = (item: IAttachmentItem) => {
    item.uploading = false;
    item.failed = true;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * @func onUploadAbort
   * @desc Updates the item status when a user aborts an upload intentially
   * @private
   * @param {IAttachmentItem} item
   * @memberof AttachmentUploader
   */
  private onUploadAbort = (item: IAttachmentItem) => {
    item.uploading = false;
    item.aborted = true;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * @desc Updates an attachment status and model on finish
   * @private
   * @param {IAttachmentItem} item
   * @param {attachment} attachment
   * @memberof AttachmentUploader
   */
  private onUploadFinish = (item: IAttachmentItem, attachment) => {
    const index = this.uploads.findIndex((upload) => upload.id === item.id);
    if (index >= 0) {
      this.uploads.splice(index, 1);
    }
    attachment._id = attachment.universal_id;
    attachment.filename = attachment.name;

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
   * @func onUploadProgress
   * @desc Updates an item progress
   * @private
   * @param {IAttachmentItem} item
   * @param {IProgress} progress
   * @memberof AttachmentUploader
   */
  private onUploadProgress = (item: IAttachmentItem, progress: IProgress) => {
    item.progress = progress;

    this.setState({
      items: this.state.items,
    });
  }

  /**
   * @func getFileThumbnail
   * @desc Creates a thumbnail picture if the provided file is an image.
   * otherwise, returns a default image
   * @private
   * @param {File} file
   * @memberof AttachmentUploader
   */
  public getFileThumbnail = (file: File) => {
    if (!file) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    if (!Picture.isImage(file)) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    return Picture.resize(file);
  }

  /**
   * @func handleRemove
   * @desc Removes the file and aborts the action if the file upload is in progress
   * @private
   * @param {IAttachmentItem} item
   * @memberof AttachmentUploader
   */
  public handleRemove(item: IAttachmentItem) {
    if (!this.state.editable) {
      return;
    }
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
   * @desc Switches between expanded and collapsed mode
   * @func toggleView
   * @private
   * @memberof AttachmentUploader
   */
  private toggleView = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  /**
   * @func get
   * @desc Returns th list of IAttachmentItem. The function is defined
   * to be accessible from the component outside
   * @memberof AttachmentUploader
   */
  public get = () => {
    return this.state.items;
  }

  public openAttachment = (attachment) => {
    if (!this.state.editable) {
      this.props.openAttachment(attachment.model);
    }
  }

  /**
   * @desc Checks if has an uploading file in the list or not. The function is defined
   * to be accessible from the component outside
   * @func isUploading
   * @memberof AttachmentUploader
   */
  public isUploading = () => {
    return this.state.items.some((i) => i.uploading);
  }
  private renderItem = (item: IAttachmentItem) => {
    const upload = this.uploads.find((u) => u.id === item.id);
    return (
        <Item
              id={item.id}
              item={item}
              key={item.id}
              editable={this.state.editable}
              onRemove={this.handleRemove}
              picture={upload ? upload.thumb : null}
        />
    );
  }
  private renderTaskItem = (item: IAttachmentItem) => {
    const upload = this.uploads.find((u) => u.id === item.id);
    return (
        <li key={item.id} onClick={this.openAttachment.bind(this, item)}>
          <Item
              id={item.id}
              mode="task"
              item={item}
              editable={this.state.editable}
              onRemove={this.handleRemove}
              picture={upload ? upload.thumb : null}
          />
        </li>
    );
  }

  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof AttachmentUploader
   */
  public render() {
    if (this.props.mode !== 'compose') {
      return (
        <ul className={style.taskAttachmentList}>
          {this.state.items.map(this.renderTaskItem)}
      </ul>
      );
    } else {
      // calculate total progress by size
      let totalSize: number = 1;
      let totalSizeByte: number = 0;
      let totalLoaded: number = 0;
      let isUploading: boolean = false;
      let inProgressCount: number = 0;
      const items = [];

      this.state.items.forEach((item) => {
        if (!item) {
          return;
        }
        totalSizeByte += item.size;
        // render Items if is in expanded mode
        if (this.state.isExpanded) {
          items.push(this.renderItem(item));
        }

        if (item.mode === Mode.UPLOAD) {
          totalLoaded += item.progress.loaded;
          totalSize += item.progress.total;
          inProgressCount++;
        }

        isUploading = isUploading || item.uploading;
      });
      const totalProgress = Math.floor((totalLoaded / totalSize) * 100) || 0;

      // The component must be hidden if there is not any item in the list
      if (this.state.items.length === 0) {
        return (
        null
        );
      }

      return (
        <div className={style.AttachmentUploader}>
          <div className={style.AttachmentListTop}>
            <div className={style.totallProgress}>
              <Progress percent={totalProgress} strokeWidth={3} showInfo={false} />
            </div>
            {
              isUploading && (
                <span>
                  <b>Attachments</b> uploading{inProgressCount} files {totalProgress}%
                </span>
              )
            }
            {
              !isUploading && (
                <span>
                  <b>Attachments</b> ({this.state.items.length} Files, {FileUtil.parseSize(totalSizeByte)})
                </span>
              )
            }
            <div className={[style.attachListAnchor, this.state.isExpanded ? style.expanded : null].join(' ')}
                onClick={this.toggleView}>
              <IcoN size={24} name="arrow16" />
            </div>
          </div>
          <div style={{
            maxHeight: '225px',
            overflow: 'auto',
          }}>
            {this.state.isExpanded && items}
          </div>
        </div>
      );
    }
  }
}

export default AttachmentUploader;
