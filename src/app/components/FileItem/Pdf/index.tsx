import * as React from 'react';

class Pdf extends React.Component {
  render() {
   let {id,label} = this.props;
    return (
      <div>
        {id}.{label}
      </div>
    );
  }
}

export default Pdf;
