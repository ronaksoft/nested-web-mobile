import * as React from 'react';
import AttachmentList from './AttachmentList';

class Foo extends React.Component<any, any> {
  constructor(props: {}) {
    super(props);

    this.state = {
      files: [],
    };
  }

  public render() {
    return (
      <div>
        <div>
          Foo
        </div>
        <div>
          Foo
        </div>
        <div>
          Foo
        </div>
        <div>
          Foo
        </div>
        <div>
          <AttachmentList />
        </div>
      </div>
    );
  }
}

export default Foo;
