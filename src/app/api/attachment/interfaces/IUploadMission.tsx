import {IAttachment} from 'api/interfaces';
interface IUploadMission {
  abort: () => void;
  onFinish: (attachment: IAttachment) => void;
  onError: (e: any) => any;
  onAbort: (e: any) => void;
  onProgress: (total: number, loaded: number) => void;
}

export default IUploadMission;