import * as React from 'react';
import {IcoN} from 'components';
import C_FILE_TYPE from 'api/consts/CFileType';
import FileUtiles from 'services/utils/file';
const style = require('./style.css');

interface IProps {
  attachments: any[];
}

interface IState {
  attachments: any[];
}
class TaskAttachment extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      attachments: props.attachments,
    };
  }
  public componentWillReceiveProps(nProps: IProps) {
    this.setState({
      attachments: nProps.attachments,
    });
  }
  private getThumbnail = (item, size?) => {
    if (item.thumbs && item.thumbs.x32 && item.thumbs.x64) {
      return FileUtiles.getViewUrl(size ? item.thumbs.x64 : item.thumbs.x32);
    } else {
      if (item.type === C_FILE_TYPE.AUDIO || item.type === C_FILE_TYPE.VIDEO) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_media@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_media.png';
        }
      } else if (item.type === C_FILE_TYPE.ARCHIVE) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_zip@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_zip.png';
        }
      } else if (item.type === C_FILE_TYPE.DOCUMENT) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_document@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_document.png';
        }
      } else if (item.type === C_FILE_TYPE.PDF) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_pdf@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_pdf.png';
        }
      } else {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_other@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_other.png';
        }
      }
    }
  }
  public render() {
    const {attachments} = this.state;

    attachments.forEach((attach) => {
      attach.thumb = this.getThumbnail(attach);
      attach.thumb2x = this.getThumbnail(attach, '@2x');
    });
    console.log(attachments);

    return (
      <ul className={style.attachmentList}>
        {attachments.map((item) => (
          <li key={item._id}>
            <div className={style.icon}>
              <img width="32" src={item.thumb}
                srcSet={item.thumb2x} height="32"/>
                <div className={style.delete}>
                  <IcoN name="xcrossWhite24" size={24}/>
                </div>
              {item.isFailed && <IcoN name="bin16" size={16}/>}
            </div>
            <div>
              <span>{(item.filename).toLowerCase()}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}
export {TaskAttachment};
