import * as React from 'react';
import AccountApi from 'api/account/index';
import {connect} from 'react-redux';
import {IUser} from 'api/interfaces';
import {Scrollable, IcoN} from 'components';
import {userUpdate} from 'redux/app/actions';
import AAA from 'services/aaa';
import TimeUtiles from 'services/utils/time';
import {message} from 'antd';

const style = require('./style.css');

/**
 * @interface IState
 */
interface IState {
  user: IUser;
  sessions: any[];
}

/**
 * @interface IProps
 */
interface IProps {
  location: any;
  user: any;
  userUpdate: (user: IUser) => {};
}

class Session extends React.Component<IProps, IState> {

  private accountApi: AccountApi;
  private sk: string;

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      sessions: [],
    };
    this.accountApi = new AccountApi();
    this.sk = AAA.getInstance().getCredentials().sk;
  }

  public componentDidMount() {
    this.accountApi.getActiveSessions().then((data) => {
      this.setState({sessions: data.sessions.map(this.parseSession)});
    });
  }

  public parseSession = (session) => {
    const sessionObj: any = {};

    sessionObj.ip = session.creation_ip.split(':')[0];
    sessionObj.platform = session._cid.split('_')[0];
    sessionObj.device = session._cid.split('_')[1];
    sessionObj.browser = session._cid.split('_')[2];
    sessionObj.os = session._cid.split('_')[3];
    sessionObj.sk = session._sk;
    sessionObj.version = session._cver ? session._cver.toString().split('').join('.') : '';
    sessionObj.date = session.last_access;
    sessionObj.isCurrent = session._sk === this.sk;

    return sessionObj;
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      user: newProps.user,
    });
  }

  public closeSession(sk: string) {
    this.accountApi.closeSession(sk).then(() => {
      message.success('Session closed.');
      this.setState({
        sessions: this.state.sessions.filter((session) => session.sk !== sk),
      });
    }).catch((e) => message.error('Some problem happend: ' + e.message));
  }

  public render() {
    return (
      <Scrollable active={true}>
        <ul className={style.sessions}>
          {this.state.sessions.map((session) => (
            <li key={session.sk}>
              <div className={style.head}>
                {(session.device || session.platform) && (
                  <strong>
                    {session.platform} {session.device} {session.version}
                  </strong>
                )}
                {!session.device && !session.platform && <strong>Unknown</strong>}
                <time>{TimeUtiles.dynamic(session.date)}</time>
              </div>
              <p>
                {session.browser && <span>{session.browser}, {session.os}<br/>{session.ip}</span>}
                {!session.browser && <span>key:<br/>{session.sk}</span>}
                {!session.isCurrent && (
                  <span className={style.terminate} onClick={this.closeSession.bind(this, session.sk)}>
                    <IcoN name="xcrossRed24" size={24}/>
                  </span>
                )}
                {session.isCurrent && (
                  <span className={style.terminate}>
                    current session
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(Session);
