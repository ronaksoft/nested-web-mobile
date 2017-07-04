import * as React from 'react';
import {Form, Input, Button} from 'antd';
import {Link} from 'react-router';
const style = require('./style.css');

class Signin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.submit = this.submit.bind(this);
  }
  private submit() {
    console.log('====================================');
    console.log('hahah');
    console.log('====================================');
  }

  public render() {
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

export default Form.create()(Signin);
