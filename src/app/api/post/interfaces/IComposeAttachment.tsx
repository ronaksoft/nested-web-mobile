import {IPicture} from 'api/interfaces';

interface IComposeAttachment {
  filename: string;
  height: number;
  mimetype: string;
  size: number;
  thumbs: IPicture;
  type: string;
  upload_time: number;
  upload_type: string;
  width: number;
  _id: string;
}

export default IComposeAttachment;
