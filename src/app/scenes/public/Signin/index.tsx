import * as React from 'react';
import {Form, Input, Button} from 'antd';
import {Link} from 'react-router';

const style = require('./style.css');
import {connect} from 'react-redux';
import {login, logout} from 'redux/app/actions';

interface IState {
  isLogin: boolean;
}

interface IProps {
  isLogin: boolean;
  setLogin: () => {};
  setLogout: () => {};
}

class Signin extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLogin: false,
    };

    this.submit = this.submit.bind(this);
  }

  public componentWillReceiveProps(newProbs: IProps) {
    if (newProbs.isLogin !== this.state.isLogin) {
      this.setState({isLogin: newProbs.isLogin});
    }
  }

  private submit() {
    if (this.state.isLogin) {
      this.props.setLogout();
    } else {
      this.props.setLogin();
    }
  }

  public render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div>
          <img src={require('./logo.svg')} className={style.logo} alt="Nested"/>
        </div>
        <h2>Sign in to Nested</h2>
        <div>
          <Form onSubmit={this.submit}>
            <Form.Item>
              <Input placeholder="Username"/>
            </Form.Item>
            <Form.Item>
              <Input type="password" placeholder="Password"/>
            </Form.Item>
            <Button type="primary" className={style.submit} onClick={this.submit}>
              {this.state.isLogin && <b>Sign ssasssssdsin</b>}
              {!this.state.isLogin && <b>Sign Out</b>}
            </Button>
          </Form>
          <p>Don't have an account? <Link to="/signup">Create a new account</Link></p>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: () => {
      dispatch(login());
    },
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
