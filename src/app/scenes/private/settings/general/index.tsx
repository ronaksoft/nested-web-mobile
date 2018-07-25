import * as React from 'react';
import ClientApi from 'api/client/index';
import {connect} from 'react-redux';
import {IUser} from 'api/interfaces';
// import TimeUtiles from 'services/utils/time';
import {Scrollable} from 'components';
import {userUpdate} from 'redux/app/actions';
import {Switch, Button, message} from 'antd';
// import * as _ from 'lodash';

const style = require('./profile.css');

/**
 * @interface IState
 */
interface IState {
  user: IUser;
  savedModel: any;
  model: any;
  signatureActive: boolean;
}

/**
 * @interface IProps
 */
interface IProps {
  location: any;
  user: any;
  userUpdate: (user: IUser) => {};
}

class General extends React.Component<IProps, IState> {

  private clientApi: ClientApi;
  private contenteditable: HTMLElement;

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      savedModel: '',
      model: '',
      signatureActive: true,
    };
    this.clientApi = new ClientApi();
  }

  public componentDidMount() {
    this.clientApi.read('general.setting.signature').then((v: string) => {
      if (v.length > 0) {
        const res = JSON.parse(v);
        this.setState({
          signatureActive: res.active,
          savedModel: res.data,
          model: res.data,
        });
      }
    });
  }
  public save = () => {
    const data = this.contenteditable.innerHTML;
    this.clientApi.save('general.setting.signature', JSON.stringify({
      active: this.state.signatureActive,
      data,
    })).then(() => {
      this.setState({
        model: data,
        savedModel: data,
      });
      message.success('Your signature is saved');
    }).catch((e) => message.error('An error occoured ' + e.code));
  }

  private signatureActiveChange = (signatureActive) => {
    this.setState({
      signatureActive,
    });
  }

  private refHandler = (el) => {
    this.contenteditable = el;
  }

  public render() {
    return (
      <Scrollable active={true}>
        <div className={style.profile}>
          <div className={style.signature}>
            <label htmlFor="searchable">
              <span>Signature:</span>
              <Switch checked={this.state.signatureActive}
                      onChange={this.signatureActiveChange}/>
            </label>
            <div contentEditable={true} dangerouslySetInnerHTML={{__html: this.state.model}}
              ref={this.refHandler}/>
            <Button
              type="primary"
              onClick={this.save}>Done</Button>
          </div>
        </div>
      </Scrollable>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store) => ({
  user: store.app.user,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    userUpdate: (user: IUser) => {
      dispatch(userUpdate(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
