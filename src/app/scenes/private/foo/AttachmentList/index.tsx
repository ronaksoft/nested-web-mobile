import * as React from 'react';
import Item from './Item';
import {Progress} from 'antd';
import {IAttachment, IUploadMission} from 'api/attachment/interfaces';
import IAttachmentItem from './Item/IAttachmentItem';
import AttachmentApi from 'api/attachment';
import Unique from 'services/utils/unique';
import Mode from './Item/mode';
const EMPTY_PICTURE = require('./default.gif');
import {UploadType} from 'api/attachment';
import Picture from 'services/utils/picture';

interface IProps {
  file?: File;
}

interface IState {
  items: IAttachmentItem[];
}

interface IProgress {
  total: number;
  loaded: number;
}

interface IUploadItem {
  id: number;
  file: File;
  abort: () => void;
  thumb: string;
}

class AttachmentList extends React.Component<IProps, IState> {
  private uploads: IUploadItem[];
  constructor(props: IProps) {
    super(props);

    this.state = {
      items: [],
    };

    this.uploads = [];
    this.handleRemove = this.handleRemove.bind(this);
  }

  private upload = (e: any) => {
    const file: File = e.target.files[0];
    const items: IAttachmentItem[] = [];
    // generate a unique id for every file that helps for tracking the file later
    const id: number = Unique.get();

    // push to items
    const item: IAttachmentItem = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      mode: Mode.UPLOAD,
      progress: {
        loaded: 0,
        total: -1,
      },
      uploading: true,
      model: null,
    };

    items.push(item);
    this.send(item, file, UploadType.FILE);

    this.setState({
      items: this.state.items.slice().concat(items),
    });

  }

  private send(item: IAttachmentItem, file: File, type: string) {
    // upload the given file with the specified type
    AttachmentApi.upload(file, type || UploadType.FILE).then((mission: IUploadMission) => {

      mission.onError = () => this.onUploadError(item);
      mission.onFinish = (attachment: IAttachment) => this.onUploadFinish(item, attachment);
      mission.onProgress = (total: number, loaded: number) => this.onUploadProgress(item, {
        total,
        loaded,
      });
      mission.onAbort = () => this.onUploadAbort(item);

      this.getFileThumbnail(file).then((thumb) => {
        const uploadItem: IUploadItem = {
          abort: mission.abort,
          id: item.id,
          file,
          thumb,
        };

        this.uploads.push(uploadItem);
      });

    });
  }

  private onUploadError = (item: IAttachmentItem) => {
    item.uploading = false;
    item.failed = true;

    this.setState({
      items: this.state.items,
    });
  }

  private onUploadAbort = (item: IAttachmentItem) => {
    item.uploading = false;
    item.aborted = true;

    this.setState({
      items: this.state.items,
    });
  }

  private onUploadFinish = (item: IAttachmentItem, attachment: IAttachment) => {
    const index = this.uploads.findIndex((upload) => upload.id === item.id);
    if (index >= 0) {
      this.uploads.splice(index, 1);
    }

    item.uploading = false;
    item.finished = true;
    item.model = attachment;
    item.mode = Mode.VIEW;

    this.setState({
      items: this.state.items,
    });
  }

  private onUploadProgress = (item: IAttachmentItem, progress: IProgress) => {
    item.progress = progress;

    this.setState({
      items: this.state.items,
    });
  }

  private getFileThumbnail = (file) => {
    if (!file) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    if (!Picture.isImage(file)) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    return Picture.resize(file);
  }

  private handleRemove(item: IAttachmentItem) {
    const index = this.state.items.findIndex((i) => i.id === item.id);
    if (index > -1) {
      const uploadIndex = this.uploads.findIndex((u) => u.id === item.id);
      if (uploadIndex > -1) {
        this.uploads[uploadIndex].abort();
        this.uploads.splice(uploadIndex, 1);
      }
      this.state.items.splice(index, 1);
      this.setState({
        items: this.state.items,
      });
    }
  }

  public render() {
    const renderItem = (item: IAttachmentItem) => {
      const upload = this.uploads.find((u) => u.id === item.id);
      return (
          <Item
                id={item.id}
                item={item}
                key={item.id}
                onRemove={this.handleRemove}
                picture={upload ? upload.thumb : null}
          />
      );
    };
    let totalSize = 1;
    let totalLoaded = 0;
    const items = [];

    this.state.items.forEach((i) => {
      items.push(renderItem(i));

      if (i.uploading) {
        totalLoaded += i.progress.loaded;
        totalSize += i.progress.total;
      }
    });
    const totalProgress = Math.floor((totalLoaded / totalSize) * 100);
    return (
      <div>
        <div>
          <Progress percent={totalProgress} strokeWidth={5} showInfo={false} />
        </div>
        <div>
          <input id="myFile" type="file" onChange={this.upload} />
        </div>
        <div>
          {items}
        </div>
      </div>
    );
  }
}

export default AttachmentList;
