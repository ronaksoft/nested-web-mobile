import * as React from 'react';
import AttachmentApi from 'api/attachment';
import {UploadType} from 'api/attachment';
import {IAttachment, IUploadMission} from 'api/attachment/interfaces';
import {Icon} from 'antd';
import Configurations from 'config';
import AAA from 'services/aaa';
const style = require('./style.css');

const EMPTY_PICTURE = require('./default.gif');
let sessionKey = null;

interface IProps {
  attachment?: IAttachment;
  file?: File;
  uploadType?: string;
  onUploadProgress?: (file: File, total: number, loaded: number) => void;
  onUploadFinished?: (file: File, attachment: IAttachment) => void;
  onUploadError?: (error: any) => void;
  onRemoveFile?: (file: File) => void;
  onRemoveAttachment?: (attachment: IAttachment) => void;
}

enum Mode {
  UPLOAD = 0,
  VIEW = 1,
}

interface IState {
  mode: Mode;
  progress: number;
  uploading: boolean;
  fileUrl: string;
  attachment: IAttachment;
}

/**
 * A component for upload and preview an attachment item
 *
 * @class AttachmentItem
 * @extends {React.Component<IProps, IState>}
 */
class AttachmentItem extends React.Component<IProps, IState> {
  private abort: () => void;
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: props.file ? Mode.UPLOAD : Mode.VIEW,
      uploading: false,
      progress: 0,
      fileUrl: EMPTY_PICTURE,
      attachment: this.props.attachment,
    };
  }

  public componentDidMount() {
    // the given file will be uploaded,
    // if the component mode is UPLOAD
    if (this.state.mode === Mode.UPLOAD) {
      // first of all, look for a picture
      this.getFileDataUrl().then(
        (url) => {
          this.setState({
            fileUrl : url,
          });
        },
        () => {
          this.setState({
            fileUrl: EMPTY_PICTURE,
          });
        });

      this.setState({
        uploading: true,
      });

      const type = this.props.uploadType || UploadType.FILE;
      // upload the given file with the specified type
      AttachmentApi.upload(this.props.file, type, this.handleProgress).then((mission: IUploadMission) => {
        this.abort = mission.abort;

        mission.onError = (error: any) => {
          this.setState({
            uploading: false,
          });

          if (this.props.onUploadError) {
            this.props.onUploadError(error);
          }
        };

        mission.onFinish = (attachment: IAttachment) => {
          this.setState({
            uploading: false,
            progress: 0,
          });

          if (this.props.onUploadFinished) {
            this.props.onUploadFinished(this.props.file, attachment);
          }
        };

        mission.onProgress = this.handleProgress;
      });
    }
  }

  /**
   * Calculate and set the file upload progress
   *
   * @private
   * @memberof AttachmentItem
   */
  private handleProgress = (total: number, loaded: number) => {
    // calculate upload progress
    const progress: number = Math.floor((loaded / total) * 100);

    this.setState({
      progress,
    });

    if (this.props.onUploadProgress) {
      this.props.onUploadProgress(this.props.file, total, loaded);
    }
  }

  private getUrl = (id: string) => {
    if (!sessionKey) {
      sessionKey = AAA.getInstance().getCredentials().sk;
    }

    return `${Configurations.STORE.URL}/view/${sessionKey}/${id}/`;
  }

  private getFileDataUrl = () => {
    if (!this.props.file) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    if (!this.props.file.type.startsWith('image')) {
      return Promise.resolve(EMPTY_PICTURE);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(this.props.file);
    });
  }

  private remove = () => {
    if (this.state.mode === Mode.UPLOAD && this.abort) {
      this.abort();
      if (this.props.onRemoveFile) {
        this.props.onRemoveFile(this.props.file);
      }
    } else if (this.state.mode === Mode.VIEW && this.props.onRemoveAttachment) {
      this.props.onRemoveAttachment(this.state.attachment);
    }
  }

  public render() {
    const pictureUrl = this.state.mode === Mode.VIEW
              ? this.getUrl(this.state.attachment.thumbs.x64)
              : this.state.fileUrl;

    const name = this.state.mode === Mode.VIEW ?
              this.state.attachment.name :
              this.props.file.name;

    return (
      <div className={style.item}>
        <span className={style.picture}>
          <img src={pictureUrl} alt={name} />
        </span>
        <span className={style.name}>
          {name}
        </span>
        {
          this.state.uploading &&
          (
            <span className={style.progress}>
              {this.state.progress}
            </span>
          )
        }
        <span className={style.remove}>
          <Icon type="close" onClick={this.remove}/>
        </span>
      </div>
    );
  }
}

export default AttachmentItem;
