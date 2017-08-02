/**
 * @file scenes/private/compose/AttachmentList/Item/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description Creates an attachment Item view
 * @export AttachmentItem
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-25
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

import * as React from 'react';
// import FileUtil from 'services/utils/file';
const style = require('./style.css');
import IAttachmentItem from './IAttachmentItem';
import OtherThumbnail from './otherThumbnail';
import ArchiveThumbnail from './ArchiveThumbnail';
import VideoThumbnail from './videoThumbnail';
import AudioThumbnail from './AudThumbnail';
import DocThumbnail from './DocThumbnail';
import ImageThumbnail from './ImageThumbnail';
import PdfThumbnail from './PdfThumbnail';
import FileUtil from 'services/utils/file';
import AttachmentType from '../../../../../api/attachment/constants/AttachmentType';
// import IComposeAttachment from '../../../../../api/post/interfaces/IComposeAttachment';
import Mode from './mode';
import {IcoN} from 'components';
import {Progress} from 'antd';
/*
 const EMPTY_PICTURE = require('../default.gif');
 */

/**
 * @interface IProps
 * @desc A contract for the component properties
 * @interface IProps
 */
interface IProps {
  /**
   * @prop item
   * @desc The attachment model
   * @type {IAttachmentItem}
   * @memberof IProps
   */
  item: IAttachmentItem;
  /**
   * @property {Array<IPostAttachment>} attachments - list of attachments
   * @desc routing state receive from react-router-redux
   * @type {array<IPostAttachment>}
   * @memberof IProps
   */
  /**
   * @prop picture
   * @desc Picture of the selected File. A thumbnail image will be created on selecting an image
   * @type {string}
   * @memberof IProps
   */
  picture?: string;
  /**
   * @prop onRemove
   * @desc An event that will be triggered on the component remove button click
   * @memberof IProps
   */
  onRemove?: (item: IAttachmentItem) => void;
  /**
   * @prop id
   * @desc A unique id for the component
   * @type {number}
   * @memberof IProps
   */
  id: number;
}

interface IState {
  /**
   * @prop progress
   * @desc upload progress ratio
   * @type {number}
   * @memberof IState
   */
  progress: number;
}

/**
 * a component that shows an attachment item
 *
 * @class AttachmentItem
 * @extends {React.Component<IProps, IState>}
 */
class AttachmentItem extends React.Component<IProps, IState> {
  /**
   * Creates an instance of AttachmentItem.
   * @param {IProps} props
   * @memberof AttachmentItem
   */
  constructor(props: IProps) {
    super(props);

    // Sets default value for the component state
    this.state = {
      progress: 0,
    };
  }

  /**
   * receive progress and updates the state
   *
   * @param {IProps} nextProps
   * @memberof AttachmentItem
   */
  public componentWillReceiveProps(nextProps: IProps) {
    const progressValue = Math.floor((nextProps.item.progress.loaded / nextProps.item.progress.total) * 100);
    this.setState({
      progress: progressValue,
    });
  }

  /**
   * @function renderThumbnail
   * @desc this function render each upload attachment view in compose page
   * @returns {JSXElement}
   * @private
   */
  private renderThumbnail() {
    const item = this.props.item;
    const fileType = item.model ? item.model.type : FileUtil.getType(item.type);
    switch (fileType) {
      case AttachmentType.GIF:
      case AttachmentType.IMAGE:
        return (
          <ImageThumbnail item={item} thumb={this.props.picture}/>
        );
      case AttachmentType.VIDEO:
        return (
          <VideoThumbnail item={item}/>
        );
      case AttachmentType.AUDIO:
        return (
          <AudioThumbnail item={item}/>
        );
      case AttachmentType.PDF:
        return (
          <PdfThumbnail item={item}/>
        );
      case AttachmentType.DOCUMENT:
        return (
          <DocThumbnail item={item}/>
        );
      case AttachmentType.ARCHIVE:
        return (
          <ArchiveThumbnail item={item}/>
        );
      case AttachmentType.OTHER:
        return (
          <OtherThumbnail item={item}/>
      );
      default:
        return null;
    }
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof AttachmentItem
   * @generator
   */
  public render() {
    const handleRemoveClick = () => {
      if (this.props.onRemove) {
        this.props.onRemove(this.props.item);
      }
    };
    return (
      <div className={style.item}>
        <span className={style.thumb}>
               {
            this.renderThumbnail()
               }
        </span>
        <div className={style.atachmentDetail}>
          <span className={style.name}>
            {
              this.props.item.mode === Mode.UPLOAD
                ? this.props.item.name
                : this.props.item.model.name
            }
          </span>
          {
            this.props.item.mode === Mode.UPLOAD &&
            (
              <div className={style.progress}>
                <Progress percent={this.state.progress}
                          strokeWidth={3}
                          showInfo={false}
                          className={style.progressLine}
                          status={this.props.item.failed || this.props.item.aborted ? 'exception' : 'active'}
                />
              </div>
            )
          }
          <div className={style.remove} onClick={handleRemoveClick}>
            <IcoN size={24} name="xcross24"/>
          </div>
        </div>
      </div>
    );
  }
}

export default AttachmentItem;
