/**
 * @file component/FileItem/Doc/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders Documents file types.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : robzizo
 * Date of review : 07/31/2017
 */
import * as React from 'react';
import {Checkbox} from 'antd';
import IFile from '../IFile';

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
 * renders the Doc element
 * @class Doc
 * @extends {React.Component<IProps, any>}
 */
class Doc extends React.Component <IProps, any> {
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Doc
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

export {Doc}
