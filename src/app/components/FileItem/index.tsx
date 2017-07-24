/**
 * @file component/FileItem/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders File Items by their types.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : -
 * Date of review : -
 */
import * as React from 'react';
import {Pdf} from './Pdf';
import {Doc} from './Doc';
import {Img} from './Img';
import {Aud} from './Aud';
import {Vid} from './Vid';
import {Oth} from './Oth';
import IFile from './IFile';

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  file: IFile;
}

/**
 * renders the FileItem element
 * @class FileItem
 * @extends {React.Component<IProps, any>}
 */
class FileItem extends React.Component<IProps, any> {
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof FileItem
   * @generator
   */
  public render() {
    if (this.props.file.type === 'Pdf') {
      return (
        <div>
          <Pdf file={this.props.file}/>
        </div>
      );
    } else if (this.props.file.type === 'Audio') {
      return (
        <div>
          <Aud file={this.props.file}/>
        </div>
      );
    } else if (this.props.file.type === 'Image') {
      return (
        <div>
          <Img file={this.props.file}/>
        </div>
      );
    } else if (this.props.file.type === 'Video') {
      return (
        <div>
          <Vid file={this.props.file}/>
        </div>
      );
    } else if (this.props.file.type === 'Document') {
      return (
        <div>
          <Doc file={this.props.file}/>
        </div>
      );
    } else if (this.props.file.type === 'Other') {
      return (
        <div>
          <Oth file={this.props.file}/>
        </div>
      );
    }

  }
}

export {FileItem}
