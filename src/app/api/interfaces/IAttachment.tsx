import {IPicture} from 'api/interfaces';

interface IAttachment {
  expiration_timestamp: number;
  name: string;
  size: number;
  thumbs: IPicture;
  type: string;
  universal_id: string;
}

export default IAttachment;
