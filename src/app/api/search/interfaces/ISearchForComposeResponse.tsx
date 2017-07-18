import IPlace from 'api/place/interfaces/IPlace';

interface ISearchForComposeResponse {
  places: IPlace[];
  recipients: string[];
}

export default ISearchForComposeResponse;