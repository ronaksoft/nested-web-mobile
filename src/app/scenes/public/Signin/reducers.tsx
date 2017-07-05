import actionTypes from './actionTypes';

const authentication = (state: {}, action: any) => {
  console.log('====================================');
  console.log('state', state);
  console.log('action', action);
  console.log('====================================');
  switch(action.type) {
    case actionTypes.SIGNIN:
      return true;
    case actionTypes.SIGNOUT:
      return false;
    default:
      return state;
  }
};

export { authentication };