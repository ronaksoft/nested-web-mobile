import {IAccountAction} from '../IAccountStore';
import * as Immutable from 'seamless-immutable';
import * as ActionTypes from '../actions/types';
import IUser from '../../../api/account/interfaces/IUser';

/** Initial Places State */
const initialState = Immutable.from<IAccountStore>({
  accounts: [],
});

export default function accountsReducer(state = initialState, action?: IAccountAction) {

  switch (action.type) {
    case ActionTypes.ACCOUNT_ADD:
      // check state for finding place
      if (action.payload === undefined) {
        return state;
      }
      const accounts = Immutable.getIn(state, ['accounts']);
      const indexOfAccount: number = accounts.findIndex((a: IUser) => {
        return a._id === action.payload._id;
      });

      /**
       * Account Add Action
       *
       * this part check current application state for
       * finding account and then update accounts state if account exist.
       * Otherwise add account to accounts list
       *
       * NOTICE::if this account is exist in state.accounts, this case will bypass to ACCOUNT_UPDATE
       *
       */
      if (indexOfAccount === -1) {
        const newState = [action.payload].concat(Immutable(state.accounts));
        return Immutable({accounts: newState});
      } else {
        return state;
      }

    case ActionTypes.ACCOUNT_UPDATE:
      let currentAccountList;
      currentAccountList = Immutable.asMutable(state, ['accounts']);
      console.log(currentAccountList);
      currentAccountList.accounts[indexOfAccount] = action.payload;
      return currentAccountList;

    default :
      return state;

  }
}
