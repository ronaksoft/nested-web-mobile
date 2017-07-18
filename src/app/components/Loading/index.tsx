import * as React from 'react';

const style = require('./loading.css');

interface IProps {
  active: boolean;
}

interface IState {
  active: boolean;
}

class Loading extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {

    // FIXME : maybe its nor false ! on go straight to the notif
    this.setState({
      active: this.props.active,
    });
  }

  public componentWillRecieveProps(newProps: IProps) {
    this.setState({
      active: newProps.active,
    });
  }

  public render() {
    return (
      <div>
        { this.state.active && (
          <div className={style.loading}>
            <div className={style.animation}><div className={style.one}/></div>
            <div className={style.animation}><div className={style.two}/></div>
            <div className={style.animation}><div className={style.three}/></div>
            <div className={style.animation}><div className={style.four}/></div>
            <div className={style.animation}><div className={style.five}/></div>
          </div>
        )}
      </div>
    );
  }
}

export {Loading}
