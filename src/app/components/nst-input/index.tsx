import * as React from 'react';
const style = require('./style.css');

interface IProps {
    value: any;
    className?: string;
    description?: string;
    label?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (txt) => void;
    onPressEnter?: (txt) => void;
}

interface IState {
    isSelected?: boolean;
}
class NstInput extends React.Component<IProps, IState> {
  public inputChange = (event) => {
    if (event.which === 13 && typeof this.props.onPressEnter === 'function') {
        this.props.onPressEnter(event.target.value);
    } else {
        this.props.onChange(event.target.value);
    }
  }
  public render() {
    const id = (Math.random() * 100).toFixed() + 'id';
    return (
      <div className={style.nstInput}>
        <label htmlFor={id}>{this.props.label}</label>
        <input id={id} type="text" placeholder={this.props.placeholder}
            disabled={this.props.disabled} className={this.props.className}
            defaultValue={this.props.value} onChange={this.inputChange}/>
        {this.props.description && <p>{this.props.description}</p>}
      </div>
    );
  }
}
export {NstInput};
