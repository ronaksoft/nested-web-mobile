import * as React from 'react';

interface IProps {
  time: number;
  onEnd: () => void;
}

interface IState {
  left: number;
}

class Timer extends React.Component<IProps, IState> {
  private interval: any;
  constructor(props: IProps) {
    super();

    this.state = {
      left: props.time || 60,
    };
  }

  private getMinutes = (): number => {
    return Math.floor(this.state.left / 60);
  }

  private getSeconds = (): number => {
    return Math.floor(this.state.left % 60);
  }

  public componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.left > 1) {
        this.setState({
          left: this.state.left - 1,
        });
      } else {
        clearInterval(this.interval);
        if (this.props.onEnd) {
          this.props.onEnd();
        }
      }
    }, 1000);
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public render() {
    return (
      <span>{`${this.getMinutes()}:${this.getSeconds()}`}</span>
    );
  }
}

export default Timer;
