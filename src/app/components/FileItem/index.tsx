/**
 * @file component/FileItem/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders File Items by their types.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : robzizo
 * Date of review : 07/31/2017
 */
import * as React from 'react';
import {Pdf} from './Pdf';
import {Doc} from './Doc';
import {Img} from './Img';
import {Aud} from './Aud';
import {Vid} from './Vid';
import {Oth} from './Oth';
import {Arc} from './Arc';
import IFile from './IFile';
import {Checkbox} from 'antd';
import {findKey, includes} from 'lodash';
const style = require('./FileItem.css');

interface IProps {
  /**
   * @property file
   * @desc Includes file as an object of files data
   * @type {object} ( not defined properly )
   * @memberof IProps
   */
  file: IFile;
  index: number;
  onSelect: (id: string, index: number) => void;
}

/**
 * renders the FileItem element
 * @class FileItem
 * @extends {React.Component<IProps, any>}
 */
class FileItem extends React.Component<IProps, any> {
  public fileGroups: any;
  public type: string;
  public constructor() {
    super();
    this.fileGroups = {
      archive: [
        'application/zip',
        'application/x-rar-compressed',
      ],
      document: [
        'text/plain',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      ],
      image: [
        'image/bmp',
        'image/jpeg',
        'image/ief',
        'image/png',
        'image/vnd.dwg',
        'image/svg+xml',
      ],
      gif: [
        'image/gif',
      ],
      audio: [
        'audio/mpeg',
        'audio/aac',
        'audio/mp3',
        'audio/wma',
        'audio/wav',
        'audio/webm',
        'audio/ogg',
      ],
      video: [
        'video/x-matroska',
        'video/mp4',
        'video/3gp',
        'video/ogg',
        'video/quicktime',
        'video/webm',
      ],
      pdf: [
        'application/pdf',
      ],
    };
  }

  public componentDidMount() {
    this.type = this.getType(this.props.file.mimetype);
  }
  public toggleSelect = (event) => {
    console.log(event.nativeEvent);
    event.nativeEvent.cancelBubble = true;
    event.nativeEvent.preventDefault();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.props.onSelect(this.props.file._id, this.props.index);
  }

  private getType = (mimetype: string): string => {
    if (!mimetype) {
      return '';
    }

    return findKey(this.fileGroups, (mimetypeList) => includes(mimetypeList, mimetype)) || 'other';
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof FileItem
   * @generator
   */
  public render() {
    return (
      <div className={style.fileContainer}>
        <div onClick={this.toggleSelect} className={style.checkbox}>
          <Checkbox checked={this.props.file.tmpEditing}/>
        </div>
        {this.type === 'pdf' && <Pdf file={this.props.file}/>}
        {this.type === 'audio' && <Aud file={this.props.file}/>}
        {this.type === 'image' && <Img file={this.props.file}/>}
        {this.type === 'video' && <Vid file={this.props.file}/>}
        {this.type === 'document' && <Doc file={this.props.file}/>}
        {this.type === 'archive' && <Arc file={this.props.file}/>}
        {this.type === 'other' && <Oth file={this.props.file}/>}
      </div>
    );
  }
}

export {FileItem}
