"use strict";
/** Action Types */
exports.GET_REQUEST = 'stars/GET_REQUEST';
exports.GET_SUCCESS = 'stars/GET_SUCCESS';
exports.GET_FAILURE = 'stars/GET_FAILURE';
/** Initial State */
var initialState = {
    isFetching: false
};
/** Reducer */
function starsReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case exports.GET_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            });
        case exports.GET_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                count: action.payload.count
            });
        case exports.GET_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                message: action.payload.message,
                error: true
            });
        default:
            return state;
    }
}
exports.starsReducer = starsReducer;
/** Async Action Creator */
function getStars() {
    return function (dispatch) {
        dispatch(starsRequest());
        return fetch('https://api.github.com/repos/barbar/vortigern')
            .then(function (res) {
            if (res.ok) {
                return res.json()
                    .then(function (res) { return dispatch(starsSuccess(res.stargazers_count)); });
            }
            else {
                return res.json()
                    .then(function (res) { return dispatch(starsFailure(res)); });
            }
        })
            .catch(function (err) { return dispatch(starsFailure(err)); });
    };
}
exports.getStars = getStars;
/** Action Creator */
function starsRequest() {
    return {
        type: exports.GET_REQUEST
    };
}
exports.starsRequest = starsRequest;
/** Action Creator */
function starsSuccess(count) {
    return {
        type: exports.GET_SUCCESS,
        payload: {
            count: count
        }
    };
}
exports.starsSuccess = starsSuccess;
/** Action Creator */
function starsFailure(message) {
    return {
        type: exports.GET_FAILURE,
        payload: {
            message: message
        }
    };
}
exports.starsFailure = starsFailure;
//# sourceMappingURL=index.js.map