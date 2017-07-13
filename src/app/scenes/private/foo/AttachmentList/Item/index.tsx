import * as React from 'react';
import {Icon} from 'antd';
import Configurations from 'config';
import AAA from 'services/aaa';
const style = require('./style.css');
import IAttachmentItem from './IAttachmentItem';
import Mode from './mode';
import {Progress} from 'antd';

let sessionKey = null;

interface IProps {
  item: IAttachmentItem;
  picture?: string;
  onRemove?: (item: IAttachmentItem) => void;
  id: number;
}

interface IState {
  progress: number;
}

function getUrl(id: string) {
  if (!sessionKey) {
    sessionKey = AAA.getInstance().getCredentials().sk;
  }

  return `${Configurations.STORE.URL}/view/${sessionKey}/${id}/`;
}

class AttachmentItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      progress: 0,
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const progressValue = Math.floor((nextProps.item.progress.loaded / nextProps.item.progress.total) * 100);
    this.setState({
      progress: progressValue,
    });
  }

  public render() {
    const handleRemoveClick = () => {
      if (this.props.onRemove) {
        this.props.onRemove(this.props.item);
      }
    };

    return (
      <div className={style.item}>
        <span className={style.picture}>
          {
            this.props.item.mode === Mode.UPLOAD
              ? (
                  <img
                      src={this.props.picture}
                      alt={this.props.item.name}
                      style={{width: 64, height: 64}}
                  />
                )
              : (
                  <img
                      src={getUrl(this.props.item.model.thumbs.x64)}
                      alt={this.props.item.model.name}
                      style={{width: 64, height: 64}}
                  />
                )
          }
        </span>
        <span className={style.name}>
          {
            this.props.item.mode === Mode.UPLOAD
              ? this.props.item.name
              : this.props.item.model.name
          }
        </span>
        {
          this.props.item.mode === Mode.UPLOAD &&
          (
            <div className={style.progress}>
              <Progress percent={this.state.progress}
                        strokeWidth={5}
                        showInfo={false}
                        status={this.props.item.failed || this.props.item.aborted ? 'exception' : 'active'}
                        width={300}
              />
            </div>
          )
        }
        <span className={style.remove}>
          <Icon type="close" onClick={handleRemoveClick}/>
        </span>
      </div>
    );
  }
}

export default AttachmentItem;
