import {IUser} from 'api/interfaces';

interface IRecallResponse {
  account: IUser;
  server_timestamp: number;
  _sk: string;
  _ss: string;
}

export default IRecallResponse ;
