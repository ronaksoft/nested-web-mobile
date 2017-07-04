import {IAccountAction, IAccountStore} from '../../accounts/IAccountStore';
import * as ActionTypes from '../actions/types';
import IUser from '../../../../api/account/interfaces/IUser';

/** Initial Places State */
const initialState: IAccountStore = {
  accounts: [],
};

export default function accountsReducer(state = initialState, action?: IAccountAction) {

  // check state for finding place
  const indexOfAccount: number = state.accounts.findIndex((a: IUser) => {
    return a._id === action.payload._id;
  });

  switch (action.type) {
    case ActionTypes.ACCOUNT_ADD:
      /**
       * Account Add Action
       *
       * this part check current application state for finding account and then update accounts state if account exist.
       * Otherwise add account to accounts list
       *
       * NOTICE::if this account is exist in state.accounts, this case will bypass to ACCOUNT_UPDATE
       *
       */
      if (indexOfAccount === -1) {
        return Object.assign({}, state, {
          accounts: state.accounts.concat([action.payload]),
        });
      }

    case ActionTypes.ACCOUNT_UPDATE:
      let currentAccountList;
      currentAccountList = Object.assign({}, state, {});
      currentAccountList.places[indexOfAccount] = action.payload;
      return currentAccountList;

    default :
      return state;

  }
}
