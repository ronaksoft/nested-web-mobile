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
import AttachmentType from 'api/attachment/constants/AttachmentType';
// import IComposeAttachment from '../../../../../api/post/interfaces/IComposeAttachment';
import Mode from './mode';
import {IcoN} from 'components';
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
  mode?: string;
  editable: boolean;
}

interface IState {
  /**
   * @prop progress
   * @desc upload progress ratio
   * @type {number}
   * @memberof IState
   */
  progress: number;
  editable: boolean;
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
      editable: props.editable,
    };
  }

  /**
   * receive progress and updates the state
   *
   * @param {IProps} nextProps
   * @memberof AttachmentItem
   */
  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.item.progress) {
      const progressValue = Math.floor((nextProps.item.progress.loaded / nextProps.item.progress.total) * 100);
      this.setState({
        progress: progressValue,
      });
    }
    this.setState({
      editable: nextProps.editable,
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

  private handleRemoveClick = () => {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.item);
    }
  }

  private getThumbnail = (item, size?) => {
    if (!item) {
      if (size) {
        return '/public/assets/icons/ph_small_attachment_other@2x.png';
      } else {
        return '/public/assets/icons/ph_small_attachment_other.png';
      }
    }
    if (item.thumbs && item.thumbs.x32 && item.thumbs.x64) {
      return FileUtil.getViewUrl(size ? item.thumbs.x64 : item.thumbs.x32);
    } else {
      if (item.type === AttachmentType.AUDIO || item.type === AttachmentType.VIDEO) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_media@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_media.png';
        }
      } else if (item.type === AttachmentType.ARCHIVE) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_zip@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_zip.png';
        }
      } else if (item.type === AttachmentType.DOCUMENT) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_document@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_document.png';
        }
      } else if (item.type === AttachmentType.PDF) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_pdf@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_pdf.png';
        }
      } else {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_other@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_other.png';
        }
      }
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
      const thumb = this.getThumbnail(this.props.item.model);
      const thumb2x = this.getThumbnail(this.props.item.model, '@2x');
      return (
        <a className={[style.item, this.props.mode === 'task' ? style.task : ''].join(' ')}>
          <span className={style.thumb}>
            {this.props.mode === 'task' && (
              <img width="32" src={thumb}
                srcSet={thumb2x} height="32"/>
            )}
            {this.props.mode !== 'task' && this.renderThumbnail()}
          </span>
          <div className={style.atachmentDetail}>
            <span className={style.name}>
              {
                this.props.item.mode === Mode.UPLOAD
                  ? this.props.item.name
                  : this.props.item.model.filename
              }
            </span>
            {!(this.props.item.failed || this.props.item.aborted) && this.props.mode !== 'task' && (
              <span className={style.size}>
                {
                  this.props.item.mode === Mode.UPLOAD
                    ? FileUtil.parseSize(this.props.item.size, 1)
                    : FileUtil.parseSize(this.props.item.model.size, 1)
                }
              </span>
            )}
            {(this.props.item.failed || this.props.item.aborted) && this.props.mode !== 'task' && (
              <span className={style.size}>
                Upload faild!
              </span>
            )}
          </div>
          {this.props.item.mode === Mode.UPLOAD && (
            <div className={style.cancelUp} onClick={this.handleRemoveClick}>
              <IcoN size={24} name="xcross24"/>
            </div>
          )}
          {this.props.item.mode !== Mode.UPLOAD && this.state.editable && (
            <div className={style.removeForce} onClick={this.handleRemoveClick}>
              <IcoN size={24} name="bin24"/>
            </div>
          )}
          {
            (this.props.item.mode === Mode.UPLOAD && !(this.props.item.failed || this.props.item.aborted)) &&
            (
              <div className={style.uploadprogress} style={{width: 100 - this.state.progress + '%'}}>
                <div/>
              </div>
            )
          }
          {
            (this.props.item.failed || this.props.item.aborted) &&
            (
              <div className={style.failedprogress}>
                <div/>
              </div>
            )
          }
        </a>
      );
  }
}

export default AttachmentItem;
