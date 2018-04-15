import {IPicture} from 'api/interfaces';

interface IPostAttachment {
  filename: string;
  height: number;
  mimetype: string;
  size: number;
  thumbs: IPicture;
  type: string;
  upload_time: number;
  upload_type: string;
  width: number;
  post_id: string;
  _id: string;
}

export default IPostAttachment;
