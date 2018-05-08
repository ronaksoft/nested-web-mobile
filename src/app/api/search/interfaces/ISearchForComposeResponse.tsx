import {IPlace} from 'api/interfaces';

interface ISearchForComposeResponse {
  places: IPlace[];
  recipients: string[];
}

export default ISearchForComposeResponse;