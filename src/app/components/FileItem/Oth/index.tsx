import * as React from 'react';
import {Checkbox} from 'antd';
import IFile from '../IFile';
import 'antd/dist/antd.css';

const style = require('../FileItem.css');

interface IProps {
  file: IFile;
}

class Oth extends React.Component <IProps, any> {
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

export {Oth}
