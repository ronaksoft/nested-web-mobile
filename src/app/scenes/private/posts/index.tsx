import * as React from 'react';
import { OptionsMenu } from 'components';
import {Input} from 'antd';

class Posts extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <OptionsMenu />
        <Input/>
      </div>
    );
  }
}

export { Posts }
