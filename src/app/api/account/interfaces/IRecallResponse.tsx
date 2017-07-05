import IUser from './IUser';

interface IRecallResponse {
  account: IUser;
  server_timestamp: number;
  _sk: string;
  _ss: string;
}

export default IRecallResponse ;
