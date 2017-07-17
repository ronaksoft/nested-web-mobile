import * as React from 'react';
import FileUtil from 'services/utils/file';
const style = require('./style.css');
import IAttachmentItem from './IAttachmentItem';
import Mode from './mode';
import {IcoN} from 'components';
import {Progress} from 'antd';

interface IProps {
  item: IAttachmentItem;
  picture?: string;
  onRemove?: (item: IAttachmentItem) => void;
  id: number;
}

interface IState {
  progress: number;
}

/**
 * a component that shows an attachment item
 *
 * @class AttachmentItem
 * @extends {React.Component<IProps, IState>}
 */
class AttachmentItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      progress: 0,
    };
  }

  /**
   * receive progress and updates the state
   *
   * @param {IProps} nextProps
   * @memberof AttachmentItem
   */
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
        <span className={style.thumb}>
          {
            this.props.item.mode === Mode.UPLOAD
              ? (
                  <img
                      src={this.props.picture}
                      alt={this.props.item.name}
                      style={{width: 40, height: 40}}
                  />
                )
              : (
                  <img
                      src={FileUtil.getViewUrl(this.props.item.model.thumbs.x64)}
                      alt={this.props.item.model.name}
                      style={{width: 40, height: 40}}
                  />
                )
          }
        </span>
        <div className={style.atachmentDetail}>
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
                          strokeWidth={3}
                          showInfo={false}
                          className={style.progressLine}
                          status={this.props.item.failed || this.props.item.aborted ? 'exception' : 'active'}
                />
              </div>
            )
          }
          <div className={style.remove} onClick={handleRemoveClick}>
            <IcoN size={24} name="xcross24"/>
          </div>
        </div>
      </div>
    );
  }
}

export default AttachmentItem;
