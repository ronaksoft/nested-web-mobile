import Api from './../index';
import IPlaceListResponse from './interfaces/IPlaceListResponse';
import IPlaceSuggestComposeRequest from './interfaces/IPlaceSuggestComposeRequest';

export default class PlaceApi {
    private api;

    constructor() {
        this.api = Api.getInstance();
    }

    public placeSuggestCompose(placeSuggestRequest: IPlaceSuggestComposeRequest): Promise<any> {
        return this.api.server.request({
            cmd: 'search/places_for_compose',
            data: placeSuggestRequest,
        }).then((res: IPlaceListResponse) => {
            return res.places;
        }).catch((err) => {
            console.log(err);
        });
    }

};
