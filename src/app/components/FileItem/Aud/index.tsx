/**
 * @file component/FileItem/Aud/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders Audio file types.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : robzizo
 * Date of review : 07/31/2017
 */
import * as React from 'react';
import IFile from '../IFile';
import FileUtiles from '../../../services/utils/file';

const style = require('../FileItem.css');

interface IProps {
  /**
   * @property file
   * @desc Includes file as an object of files data
   * @type {object} ( not defined properly )
   * @memberof IProps
   */
  file: IFile;
}

/**
 * renders the Aud element
 * @class Aud
 * @extends {React.Component<IProps, any>}
 */
class Aud extends React.Component <IProps, any> {
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Aud
   * @generator
   */
  public render() {
    return (
      <div className={style.fileContainer}>
        <div className={style.imageContainer}>
          <div className={style.filesTypesImages}>
            <div className={style.fileBadge + ' ' + style.audio}>
              {FileUtiles.getSuffix(this.props.file.filename).toUpperCase()}
            </div>
          </div>
        </div>
        <div className={style.fileData}>
          <div>
            <span className={style.fileName}>{this.props.file.filename}</span>
          </div>
          <div>
            <span className={style.sizeText}>{FileUtiles.parseSize(this.props.file.size)}</span>
          </div>
        </div>
      </div>
    );
  }
}

export {Aud}
