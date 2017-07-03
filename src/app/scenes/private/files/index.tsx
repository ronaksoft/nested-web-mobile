import * as React from 'react';
import {FileItem} from 'components/FileItem';
import 'antd/dist/antd.css';
import IFile from '../../../components/FileItem/IFile';

interface IState {
  items: any[];
}

class Files extends React.Component<{}, IState> {
// setting initial states
  constructor(props: {}) {
      super(props);
      this.state = {
        items: [],
      };
  }
    public render() {
      const fileTypes: IFile[] = [
        {
          id: 'DOC',
          name: 't.docx',
        },
        {
          id: 'IMG',
          name: 'v.jpg',
        },
        {
          id: 'AUD',
          name: 's.mp3',
        },
        {
          id: 'VID',
          name: 'h.mp4',
        },
      ];
      return (
            <div>
              {fileTypes.map((file) => (<FileItem key={file.id} file={file}/>))}
            </div>
        );
    }
}

export { Files }
