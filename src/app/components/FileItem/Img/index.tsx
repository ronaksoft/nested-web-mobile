/**
 * @file component/FileItem/Img/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders Images file types.
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
 * renders the Img element
 * @class Img
 * @extends {React.Component<IProps, any>}
 */
class Img extends React.Component <IProps, any> {
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Img
   * @generator
   */
  public render() {
    return (
      <div className={style.fileContainer}>
        <div className={style.imageContainer}>
          <div className={style.imgContainer + ' ' + style.filesTypesImages}>
            <img className={style.fileThumbnail} src={FileUtiles.getViewUrl(this.props.file.thumbs.x64)}/>
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

export {Img}
