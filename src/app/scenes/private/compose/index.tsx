import * as React from 'react';
import {Input} from 'antd';
import { Suggestion } from 'components';
const style = require('./compose.css');

class Compose extends React.Component<any, any> {
  private attachModal = (val) => {
    return val;
  }

  private attachTypeSelect = () => {
    this.attachModal(true);
  }

  public render() {
    const unselectItem = 0;
    // if ( true ) {
    //   unselectItem++;
    // }
    return (
      <div className={style.compose}>
        <Suggestion selectedItems={[]} activeItem={unselectItem}/>
        <div className={style.subject}>
          <Input placeholder="Add a Title…"/>
          <div onClick={this.attachTypeSelect} className={this.attachModal ? 'aa' : 'bbb'}>
            aaaaali
          </div>
        </div>
        <textarea placeholder="Write something…"/>
      </div>
    );
  }
}

export { Compose }
