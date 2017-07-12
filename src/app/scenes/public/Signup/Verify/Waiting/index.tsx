import * as React from 'react';
import Timer from './Timer';

interface IProps {
  time: number;
  trigger: boolean;
  onFinish: () => void;
  message?: string;
}

interface IState {
  running: boolean;
  timeLeft: number;
}

class Waiting extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super();

    this.state = {
      running: false,
      timeLeft: props.time,
    };
  }

  private handleEnd = () => {
    this.setState({
      running: false,
    });
    if (this.props.onFinish) {
      this.props.onFinish();
    }
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.trigger) {
      this.setState({
        running: true,
      });
    }
  }

  public render() {
    return (
      <div>
        {this.props.children}
        {this.state.running &&
          (
            <span>
              <span>{this.props.message}</span>
              <Timer time={this.props.time} onEnd={this.handleEnd} />
            </span>
          )
        }
      </div>
    );
  }
}

export default Waiting;