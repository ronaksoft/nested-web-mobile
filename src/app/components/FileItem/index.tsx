import * as React from 'react';
import {Pdf} from './Pdf';
import IFile from './IFile';
import 'antd/dist/antd.css';

interface IProps {
  file: IFile;
}
class FileItem extends React.Component<IProps, any> {
    public render() {
       return (
            <div>
              <Pdf file={this.props.file}/>
            </div>
        );
    }
}

export {FileItem}
