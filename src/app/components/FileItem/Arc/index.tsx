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
 * renders the Arc element
 * @class Arc
 * @extends {React.Component<IProps, any>}
 */
class Arc extends React.Component <IProps, any> {
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Oth
   * @generator
   */
  public render() {
    return (
      <div className={style.fileContainer}>
        <div className={style.imageContainer}>
          <div className={style.filesTypesImages}>
            <div className={style.fileBadge + ' ' + style.archive}>
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

export {Arc}
