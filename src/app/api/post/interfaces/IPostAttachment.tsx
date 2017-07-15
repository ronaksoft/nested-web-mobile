import IThumbnails from '../../attachment/interfaces/IThumbnails';

interface IPostAttachment {
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

export default IPostAttachment;
