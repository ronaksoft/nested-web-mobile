import * as React from 'react';
import { Suggestion } from 'components';

class Compose extends React.Component<any, any> {
  public render() {
    let unselectItem = 0;
    if ( true ) {
      unselectItem++;
    }
    return (
      <div>
        <Suggestion selectedItems={[]} activeItem={unselectItem}/>
      </div>
    );
  }
}

export { Compose }
