import * as React from 'react';
import {Pdf} from './Pdf';
import {Doc} from './Doc';
import {Img} from './Img';
import {Aud} from './Aud';
import {Vid} from './Vid';
import {Oth} from './Oth';
import IFile from './IFile';

interface IProps {
  file: IFile;
}
class FileItem extends React.Component<IProps, any> {
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
