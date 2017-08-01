import IThumbnails from '../../attachment/interfaces/IThumbnails';

interface IComposeAttachment {
  filename: string;
  height: number;
  mimetype: string;
  size: number;
  thumbs: IThumbnails;
  type: string;
  upload_time: number;
  upload_type: string;
  width: number;
  _id: string;
}

export default IComposeAttachment;
