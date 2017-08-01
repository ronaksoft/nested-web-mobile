/**
 * @file component/scenes/private/files/index.tsx
 * @author naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders all file item types.
 * Document By : naamesteh
 * Date of documentation : 07/24/2017
 * Review by : robzizo
 * Date of review : 08/01/2017
 */
import * as React from 'react';
import {FileItem} from 'components/FileItem';
import IFile from '../../../components/FileItem/IFile';

interface IState {
  /**
   * @property items
   * @desc Includes arrays of data
   * @type {array}
   * @memberof IState
   */
  items: any[];
}

/**
 * renders the Files element
 * @class Files
 * @extends {React.Component<any, IState>}
 */
class Files extends React.Component<{}, IState> {

  /**
   * @constructor
   * Creates an instance of Files.
   * @param {IProps} props
   * @memberof Files
   */
    constructor(props: {}) {
    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     * @property {string}
     */
    this.state = {
      items: [],
    };
  }
  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Files
   * @generator
   */
  public render() {
    // setting static data for fileTypes
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
