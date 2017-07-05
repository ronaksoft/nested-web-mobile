import * as React from 'react';
import {Form, Input, Button} from 'antd';
import {Link} from 'react-router';
const style = require('./style.css');
import {signin} from './actions';
import {connect} from 'react-redux';

class Signin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      isAuthenticated: props.isAuthenticated,
    };

    console.log('====================================');
    console.log('props', props);
    console.log('====================================');

    this.submit = this.submit.bind(this);
  }
  private submit() {
    this.props.onSignin();
    console.log('====================================');
    console.log('hahah', this.props, this.state);
    console.log('====================================');

  }

  public render() {
    console.log('====================================');
    console.log(this.state, this.props);
    console.log('====================================');
    // const { getFieldDecorator } = this.props.form;
    return (
      <div style={this.props.style}>
        <div>
          <img src={require('./logo.svg')} className={style.logo} alt="Nested"/>
        </div>
        <h2>Sign in to Nested</h2>
        <div>
         <Form onSubmit={this.submit}>
          <Form.Item>
              <Input placeholder="Username" />,
          </Form.Item>
          <Form.Item>
              <Input type="password" placeholder="Password" />,
          </Form.Item>
          <Button type="primary" className={style.submit} onClick={this.submit}>
            Sign in
          </Button>
         </Form>
         <p>Don't have an account? <Link to="/signup">Create a new account</Link></p>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onSignin: () => {
      dispatch(signin());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
