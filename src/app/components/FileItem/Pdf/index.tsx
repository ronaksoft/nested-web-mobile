/**
 * @file component/FileItem/Pdf/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders Pdf file types.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : -
 * Date of review : -
 */
import * as React from 'react';
import {Checkbox} from 'antd';
import IFile from '../IFile';

const style = require('../FileItem.css');

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  file: IFile;
}

/**
 * renders the Pdf element
 * @class Pdf
 * @extends {React.Component<IProps, any>}
 */
class Pdf extends React.Component<IProps, any> {
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Pdf
   * @generator
   */
  public render() {
    return (
      <div className={style.fileContainer}>
        <div className={style.imageContainer}>
          <div>
            <Checkbox/>
          </div>
          <div className={style.filesTypesImages}>
            <div className={style.fileBadge + ' ' + style[this.props.file.type]}>
              {this.props.file.id}
            </div>
          </div>
        </div>
        <div className={style.fileData}>
          <div>
            <span className={style.fileName}>{this.props.file.name}</span>
          </div>
          <div>
            <span className={style.sizeText}>{this.props.file.size}</span>
          </div>
        </div>
      </div>
    );
  }
}

export {Pdf}
