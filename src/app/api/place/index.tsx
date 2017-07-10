import Api from './../index';
import IPlaceSuggestComposeRequest from './interfaces/IPlaceSuggestComposeRequest';
import IAccountPlacesRequest from './interfaces/IAccountPlacesRequest';

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

    public getAllPlaces(getAllPlacesRequest: IAccountPlacesRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'account/get_all_places',
            data: getAllPlacesRequest,
        });
    }

};
