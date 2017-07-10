import Api from './../index';
import IPlaceSuggestComposeRequest from './interfaces/IPlaceSuggestComposeRequest';

export default class PlaceApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }

    public placeSuggestCompose(placeSuggestRequest: IPlaceSuggestComposeRequest): Promise<any> {
        return this.api.request({
            cmd: 'search/places_for_compose',
            data: placeSuggestRequest,
        });
    }

};
