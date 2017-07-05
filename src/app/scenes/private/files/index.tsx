import * as React from 'react';
import {FileItem} from 'components/FileItem';
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
        id: 'PDF',
        name: 'z.pdf',
        type: 'Pdf',
        size: '133KB',
      },
      {
        id: 'DOC',
        name: 't.docx',
        type: 'Document',
        size: '156KB',
      },
      {
        id: 'IMG',
        name: 'v.jpg',
        type: 'Image',
        size: '176KB',
      },
      {
        id: 'AUD',
        name: 's.mp3',
        type: 'Audio',
        size: '196KB',
      },
      {
        id: 'VID',
        name: 'h.mp4',
        type: 'Video',
        size: '425KB',
      },
      {
        id: 'OTH',
        name: 'a.apk',
        type: 'Other',
        size: '564KB',
      },
    ];
    return (
      <div>
        {fileTypes.map((file) => (<FileItem key={file.id} file={file}/>))}
      </div>
    );
  }
}

export {Files}
