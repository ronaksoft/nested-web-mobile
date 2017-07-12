import * as React from 'react';
import Item from './Item';
import {IAttachment} from 'api/attachment/interfaces';

interface IProps {
  file?: File;
}

interface IState {
  items: Array<File | IAttachment>;
  progress: IProgress;
}

interface IProgress {
  count: number;
  value: number;
}

class AttachmentList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      items: [],
      progress: {
        count: 0,
        value: 0,
      },
    };
  }

  private upload = (e: any) => {
    this.setState({
      items: this.state.items.concat(e.target.files[0]),
    });
  }

  private handleUploadError = (error: any) => {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }

  private handleUploadProgress = (file: File, total: number, loaded: number) => {
    const index = this.state.items.findIndex((item) => item === file);
    const progressValue = Math.round((loaded / total) * 100) + this.state.progress.value;
    const progressCount = index === -1 ? this.state.progress.count + 1 : this.state.progress.count;
    console.log('====================================');
    console.log({
        value: progressValue,
        count: progressCount,
    });
    console.log('====================================');
    // this.setState({
    //   progress: {
    //     value: progressValue,
    //     count: progressCount,
    //   },
    // });
  }

  private handleUploadFinished = (file: File, attachment: IAttachment) => {
    console.log('====================================');
    console.log('finished', file, attachment);
    console.log('====================================');
    // const index = this.state.items.findIndex((item) => item === file);
    // if (index >= 0) {
    //   this.setState({
    //     items: this.state.items.slice().splice(index, 1, attachment),
    //   });
    // }
  }

  private handleRemoveFile = (file: File) => {
    const index = this.state.items.findIndex((item) => item === file);
    if (index >= 0) {
      this.setState({
        items: this.state.items.slice().splice(index, 1),
      });
    }
  }

  private handleRemoveAttachment = (attachment: IAttachment) => {
    const index = this.state.items.findIndex((item) => item === attachment);
    if (index >= 0) {
      this.setState({
        items: this.state.items.slice().splice(index, 1),
      });
    }
  }

  public render() {
    const renderItem = (item: File | IAttachment) => {
      return (
        item instanceof File ?
        (
          <Item
              file={item}
              key={Date.now().toString()}
              onUploadError={this.handleUploadError}
              onUploadProgress={this.handleUploadProgress}
              onUploadFinished={this.handleUploadFinished}
              onRemoveAttachment={this.handleRemoveAttachment}
              onRemoveFile={this.handleRemoveFile}
          />
        ) :
        (
          <Item
              attachment={item}
              key={Date.now().toString()}
              onUploadError={this.handleUploadError}
              onUploadProgress={this.handleUploadProgress}
              onUploadFinished={this.handleUploadFinished}
              onRemoveAttachment={this.handleRemoveAttachment}
              onRemoveFile={this.handleRemoveFile}
          />
        )
      );
    };

    const showProgress = this.state.progress.count > 0;
    const allProgress = Math.floor(this.state.progress.value / this.state.progress.count);

    return (
      <div>
        {
          showProgress && (
            <span>{allProgress}%</span>
          )
        }
        <div>
          <input id="myFile" type="file" onChange={this.upload} />
        </div>
        <div>
          {
            this.state.items.map((item) => {
              return renderItem(item);
            })
          }
        </div>
      </div>
    );
  }
}

export default AttachmentList;
