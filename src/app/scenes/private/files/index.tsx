import * as React from 'react';
import { FileItem } from 'components/FileItem';
import 'antd/dist/antd.css';

class Files extends React.Component<any, any> {
  public render() {
    return (
      <div>
        Files
        <FileItem/>
      </div>
    );
  }
}

export { Files }
