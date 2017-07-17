import IThumbnails from './IThumbnails';

interface IAttachment {
  expiration_timestamp: number;
  name: string;
  size: number;
  thumbs: IThumbnails;
  type: string;
  universal_id: string;
}

export default IAttachment;
