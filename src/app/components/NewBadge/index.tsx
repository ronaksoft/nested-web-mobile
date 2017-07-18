import * as React from 'react';

const style = require('./newbadge.css');

interface IProps {
  text: string;
  onClick: () => void;
  visibility: boolean;
  count: number;
}

interface IState {
  text: string;
  onClick: () => void;
  visibility: boolean;
  count: number;
}

class Newbadge extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      text: this.props.text,
      onClick: this.props.onClick,
      visibility: this.props.visibility,
      count: this.props.count,
    };
  }

  public componentWillRecieveProps(newProps: IProps) {

    this.setState({
      text: newProps.text,
      onClick: newProps.onClick,
      visibility: newProps.visibility,
      count: newProps.count,
    });
  }

  public render() {
    return (
      <div>
        { this.state.visibility && (
          <div className={style.badge} onClick={this.state.onClick}>
            <span>{this.state.text}</span>
            <div className={style.count}>{this.state.count}</div>
          </div>
        )}
      </div>
    );
  }
}

export {Newbadge}
