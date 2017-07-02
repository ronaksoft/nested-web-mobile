import * as React from 'react';
import Pdf from 'Pdf';


interface IFileItemProps {
  id: string;
  label: string;
  name: string;
}
interface IFileItemState {

}
class FileItem extends React.Component <IFileItemProps, IFileItemState> {
  constructor(props) {
    super(props);
    var fileTypes = [
          {
            id: 'PDF',
            label: 'pdf',
            name: 'aaa.pdf'
          },
          {
            id: 'DOC',
            label: 'documents',
            name: 'bbb.docx'
          },
          {
            id: 'IMG',
            label: 'images',
            name: 'ccc.jpg'
          },
          {
            id: 'AUD',
            label: 'audios',
            name: 'ddd.mp3'
          },
          {
            id: 'VID',
            label: 'videos',
            name: 'eee.mp4'
          },
          {
            id: 'OTH',
            label: 'others',
            name: 'fff.apk'
          }
    ];
    var {fileTypes} = this.props;

    var renderFiletypes = () => {
      return fileTypes.map((filetype) => {
        return (
          <Pdf key={filetype.id} />
        );
      });
    }
    render()
    {
      return (
        <div>
          {renderFiletypes()}
        </div>
      );
    }
  }

export default FileItem;
