"use strict";
/** Action Types */
exports.INCREMENT = 'counter/INCREMENT';
exports.DECREMENT = 'counter/DECREMENT';
/** Counter: Initial State */
var initialState = {
    count: 0
};
/** Reducer: CounterReducer */
function counterReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case exports.INCREMENT:
            return {
                count: state.count + 1
            };
        case exports.DECREMENT:
            return {
                count: ((state.count - 1 > 0) ? state.count - 1 : 0)
            };
        default:
            return state;
    }
}
exports.counterReducer = counterReducer;
/** Action Creator: Increments the Counter */
function increment() {
    return {
        type: exports.INCREMENT
    };
}
exports.increment = increment;
/** Action Creator: Decrements the Counter */
function decrement() {
    return {
        type: exports.DECREMENT
    };
}
exports.decrement = decrement;
//# sourceMappingURL=index.js.map